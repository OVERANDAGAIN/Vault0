我在做 REC-DIAL 项目的代码修复与诊断。请严格基于我提供的代码来分析，不要先大段推测，也不要一上来给大补丁。当前重点是 user feedback 失真问题，尤其是 mock user 对广告的反馈过于频繁拒绝，导致 ad revenue 基本为 0。

## 一、项目与当前问题背景

REC-DIAL 是一个对话式广告推荐/插入仿真项目。基本流程是：

```text
profile + initial query
    -> monitor 构造 state
    -> planner 选择 action，包括 topic / ad / noop
    -> speaker 生成系统回复
    -> mock user / profile simulator 生成用户反馈
    -> reward / log
```

当前发现的问题是：

```text
用户对广告的反馈明显失真，大量广告被 mock user 直接拒绝。
```

之前跑出的日志显示，例如 conservative_ad 和 greedy_ad 都是：

```text
conservative_ad {'rejected': 3}
greedy_ad {'rejected': 3}
```

详细诊断中每次广告曝光的 user_text 基本都是：

```text
I'm not interested in ads.
```

同时 accept_prob 都低于 threshold=0.5，例如：

```text
conservative_ad:
travel_3 rejected prob=0.15225 / 0.182875 / 0.213125

greedy_ad:
travel_3 rejected prob=0.0
travel_3 rejected prob=0.174375
education_9 rejected prob=0.0215353125
```

这说明当前拒绝不是 LLM 自然生成导致的，而是 mock user 的广告反应规则在起作用。

---

## 二、当前已经确认的诊断信息

我已经写了 `scripts/analyze_ad_reaction.py` 来分析每次广告曝光的中间量。现在能打印：

```text
accept_prob
acceptance_threshold
decision_margin
ad_relevance
ad_relevance_source
patience_before_ad
satisfaction_before_ad
topic_depth_before_ad
ad_frequency_before
user_ad_sensitivity
user_text
```

并能复原接受概率计算过程，例如：

```text
base=0.300
topic_adj=0.200
after_topic=0.500
after_sat=0.500
after_pat=0.275
rel_bonus=0.000
sens_mult=0.775
final=0.213125
```

从这个诊断可以确认：

1. 所有 rejected 的直接原因都是 `accept_prob < threshold=0.5`。
2. 当前 `ad_relevance` 之前基本都是 `0.5`。
3. `rel_src=None` 或没有记录，说明广告相关性很可能没有真正从广告 metadata / 当前上下文传到 mock user，而是 fallback 到默认值。
4. `relevance_breakdown` 之前没有被写进 JSON，因此无法看到 `interest_match / topic_match / intent_match`。
5. 当前 user rejection template 很硬，导致用户文本表现为固定拒绝。

---

## 三、当前需要修的是“数据传递”，不是重新设计 relevance

现在不要贸然改 relevance 公式、权重、reward、planner 或 user acceptance threshold。当前目标是：

```text
不改 relevance 计算逻辑；
不改 0.4 / 0.3 / 0.3 权重；
不改 interest_match 二值逻辑；
不改 mock user 接受广告的规则；
先补齐 relevance 计算所需的数据链路。
```

原有或当前希望保留的 relevance 逻辑是：

```python
relevance = 0.4 * interest_match + 0.3 * topic_match + 0.3 * intent_match
```

其中暂定：

```text
interest_match:
    profile.interests
    vs
    ad.target_interests + ad.category
    二值，匹配则 1.0，否则 0.0，不要用 interest_strength 加权。

topic_match:
    current_topic
    vs
    ad.target_interests 

intent_match:
    current_task_intent
    vs
    ad.target_intents
```

现在的核心问题不是公式不好，而是这些输入字段在运行链路里可能缺失或丢失。

---

## 四、process_data.py 生成的 JSON 文件关系

`process_data.py` 最后保存了这些文件：

```python
_save_user_profiles(output_dir, user_profiles)
_save_json(output_dir, "initial_queries.json", initial_queries)
_save_json(output_dir, "topic_pool.json", {"topics": topics})
_save_json(output_dir, "ad_pool.json", ads)
_save_json(output_dir, "mappings.json", {
    "preference_to_intent": IntentMapper.PREFERENCE_TO_INTENT,
    "intent_to_preference": _reverse_mapping(IntentMapper.PREFERENCE_TO_INTENT)
})
```

这些都是 processed data，原则上后续 runtime 应该优先用这些 JSON，而不是重新从 hardcoded 结构推。

需要重点弄清：

```text
user_profiles.json
initial_queries.json
topic_pool.json
ad_pool.json
mappings.json
```

在当前 runtime 里到底哪些被用了，哪些没有用，哪些 metadata 被丢了。

---

## 五、profile.interests、preferences、intent_distribution 的关系

`ProfileBuilder` 里：

```python
interests, interest_strength = self._infer_interests(rp_user)
intent_dist = self.infer_intent_distribution(rp_user)
```

`interests` 主要来自 RealPref preferences 里的 `Topic` 一级类别：

```python
topic = pref.get('Topic', '')
if ':' in topic:
    interest = topic.split(':')[0].strip()
    interests.add(interest)
```

同时也会从 extended_persona 关键词补充兴趣，例如 food/travel/music/movie/sport 等。

所以：

```text
profile.interests 不是完整等于 preferences，
而是 preferences.Topic 的一级类别集合 + persona keyword 补充类别。
```

`intent_distribution` 也是从 preferences.Topic 一级类别通过 `IntentMapper.PREFERENCE_TO_INTENT` 推断出来的：

```text
Food -> Recommendations / Advice & Recommendations
Travel -> Recommendations / Planning and Logistics
Entertainment -> Creative Content Generation / Recommendations
...
```

因此：

```text
interests 是 RealPref 偏好领域空间；
intent_distribution 是 Infinite-Chats 任务意图空间；
二者同源，但不是同一个变量。
```

---

## 六、initial_queries.json 的真实生成逻辑

`initial_queries.json` 中每个 uid 有三类 query：

```python
{
  "profile_based_queries": [...],
  "preference_queries": [...],
  "random_queries": [...]
}
```

严格按 process_data.py 的生成逻辑：

### 1. profile_based_queries

生成逻辑是：

```text
先根据 profile.intent_distribution 采样 intent
再从 Infinite-Chats 中找该 intent 类别下的 query
```

结构类似：

```json
{
  "query": "...",
  "source_category": "Recommendations",
  "related_categories": ["Recommendations"]
}
```

所以对 `profile_based_queries`：

```text
source_category 是直接采样出来的 current_task_intent。
它不是 topic。
```

如果要得到 current_topic，只能通过：

```text
intent_to_preference[source_category] ∩ profile.interests
```

来反推。这个 topic 必须标记为 inferred，而不是直接字段。

---

### 2. preference_queries

生成逻辑是基于用户前两个 RealPref preferences：

```python
for pref in profile.preferences[:2]:
    topic = pref.get('Topic', '')
    pref_text = pref.get('Preference', '')
    query = _generate_scenario_query(topic, pref_text)
```

结构类似：

```json
{
  "query": "...",
  "source_topic": "Food: Diet",
  "preference": "..."
}
```

所以对 `preference_queries`：

```text
source_topic 可以直接得到 current_topic = Food。
```

但它没有直接给 current_task_intent。如果 relevance 需要 intent，可以通过：

```text
preference_to_intent[current_topic]
```

推断一个或多个 candidate_task_intents，并标记为 inferred。

---

### 3. random_queries

结构类似：

```json
{
  "query": "...",
  "categories": ["Creative Content Generation", "Problem Solving"]
}
```

它直接提供 task intent categories，但通常没有 topic。topic 也只能通过：

```text
intent_to_preference[categories] ∩ profile.interests
```

反推。

---

## 七、mappings 的使用边界

不要让 mappings 直接参与 relevance 打分。mappings 只用于补齐缺失字段。

规则：

```text
能从 initial_queries.json 直接读到的字段，直接用；
读不到的，才用 mappings 推断；
推断出来的字段必须标 source；
不要用推断覆盖直接字段。
```

具体：

```text
profile_based_queries:
    direct: current_task_intent = source_category
    inferred: current_topic = intent_to_preference[source_category] ∩ profile.interests

preference_queries:
    direct: current_topic = source_topic 一级类别
    inferred: current_task_intent = preference_to_intent[current_topic]

random_queries:
    direct: current_task_intent = categories
    inferred: current_topic = intent_to_preference[categories] ∩ profile.interests
```

最终 relevance 只读取：

```text
profile.interests
current_topic
current_task_intent
ad.category
ad.target_interests
ad.target_intents
```

而不是在 match 时再次使用 mappings。

---

## 八、current_topic / current_task_intent 是否随对话变化

语义上：

```text
initial_topic / initial_task_intent:
    初始 query 的来源信息，episode 内不变，用来追溯第一句话。

current_topic / current_task_intent:
    当前对话状态，可以随对话变化。
```

但二者变化机制不同。

### current_topic

表示当前聊的领域：

```text
Food / Travel / Entertainment / Work & Living / Social / Lifestyle / Education
```

它应该更容易变化：

```text
reset:
    从 initial query metadata 初始化

topic action:
    更新 current_topic

user switch_topic:
    如果能识别新 topic，则更新

ad action:
    不更新 current_topic

普通 continue:
    不更新
```

注意：广告 action 不能把 current_topic 改成广告 category，否则会形成自证循环。

### current_task_intent

表示当前任务类型：

```text
Recommendations
Planning and Logistics
Advice & Recommendations
Creative Content Generation
Problem Solving
...
```

它应该更保守：

```text
reset:
    从 initial query metadata 初始化

用户提出新任务:
    可以更新

planner 切到带 task intent metadata 的 topic/query:
    可以更新，但是目前不清楚是否支持这种机制，代码中似乎隐含某种自动增加话题的代码，但是标记为DT_1之类的，咱不知道怎么处理

ad action:
    不更新

continue / switch_topic / exit:
    这些是 dialogue intent，不是 task intent，不能拿来匹配 ad.target_intents。
```

---

## 九、当前怀疑的数据断链

当前最可能的问题链路：

```text
processed initial_queries.json 里有 source_topic/source_category/categories
        ↓
runtime 只取了 query 文本
        ↓
history[0].metadata 为空
        ↓
Monitor / PlannerState 没有 current_topic/current_task_intent
        ↓
ad relevance 只能 fallback 到 default 或 profile dominant intent
        ↓
topic_match / intent_match 不准
        ↓
mock user 的 accept_prob 偏低
        ↓
用户反馈大量 rejected
```

另一个断链：

```text
ad_pool.json / ad object 里有 category / target_interests / target_intents
        ↓
run_simulation build topic_pool 时只保存 ad_id / pitch_template / reward_value
        ↓
TopicPool item 丢失 ad metadata
        ↓
relevance 计算拿不到广告属性
        ↓
ProfileSimulator 只能用默认 ad_relevance=0.5
```

需要严格看当前代码确认。

---

## 十、已做过的独立 relevance 测试

我写过一个 `scripts/debug_ad_relevance.py` 独立测试，不跑完整对话，只测试 relevance 计算。

测试结果例子：

```text
PROFILE uid: 00020
interests: ['Entertainment', 'Travel', 'Food', 'Work & Living', 'Social', 'Lifestyle']
intent_distribution: {'Recommendations': 0.3, ...}

AD travel_3
category: Travel
target_interests: ['Travel']
target_intents: ['Recommendations', 'Planning and Logistics']

Case A: no current topic
relevance: 0.7
interest_match=1.0
topic_match=0.0
intent_match=1.0

Case B: current_topic = Travel, task_intent = Recommendations
relevance: 1.0
interest_match=1.0
topic_match=1.0
intent_match=1.0
```

`food_0` 也类似：

```text
Case A no current topic: relevance=0.7
Case B current_topic=Food: relevance=1.0
```

这说明 relevance 公式本身可以变化，问题更可能在 runtime 数据传递，而不是公式无法工作。

但这个 debug 脚本只是独立测试，并不能证明完整 run_simulation 链路已经打通。

---

## 十一、当前代码修复应该遵守的约束

请不要直接重构整个架构。现在只做最小修复和诊断。

不应该改：

```text
1. relevance 权重 0.4 / 0.3 / 0.3
2. interest_match 二值逻辑
3. user acceptance threshold
4. reward 逻辑
5. planner 策略逻辑
6. speaker 的职责
```

尤其不要把 relevance 计算塞到 Speaker。Speaker 的职责应该是根据 planner action 说话，不应负责计算广告相关性。

更合理的位置是：

```text
Planner 选择 action
    ↓
Speaker 生成 utterance
    ↓
Env / 独立 relevance scorer 根据 profile + state + action + ad metadata 计算 ad_relevance
    ↓
ProfileSimulator / mock user 使用 ad_relevance 决定反应
```

但是当前新对话里请先严格查看代码，不要直接开写大模块。

---

## 十二、下一步建议严格按顺序做

请在新对话中先做代码审查，再给增量修改。

优先检查这些文件：

```text
scripts/process_data.py
src/recdiag/data/processors/profile_builder.py
src/recdiag/data/integrated_corpus.py
src/recdiag/data/topic_pool.py
src/recdiag/data/processors/ad_matcher.py
src/recdiag/core/simulators/profile_simulator.py
src/recdiag/env/dialogue_env.py
src/recdiag/core/monitor.py
src/recdiag/core/speaker.py
scripts/run_simulation.py
scripts/analyze_ad_reaction.py
```

需要回答这些问题：

1. runtime 是否直接读取 processed JSON？
2. `initial_queries.json` 是否被保留原始结构，还是只 flatten 成 query 文本？
3. 初始 query 进入 `DialogueEnv.history[0]` 时 metadata 是否为空？
4. `current_topic` 和 `current_task_intent` 运行时有没有字段？在哪个对象里？
5. topic action 是否会更新 current_topic？
6. ad action 是否错误地更新 current_topic？
7. ad metadata 是否在 `TopicPool.add_ad()` 后丢失？
8. mock user 的 `_handle_ad()` 是否读到了 `ad_relevance`？
9. `ad_relevance_source` 和 `relevance_breakdown` 是否写进了 JSON？
10. `analyze_ad_reaction.py` 是否能看到 `interest_match/topic_match/intent_match`？

---

## 十三、最终目标

目标不是重新设计推荐或 mock user，而是让原有 relevance 逻辑真正拿到输入：

```text
profile.interests
current_topic
current_task_intent
ad.category
ad.target_interests
ad.target_intents
```

并且在每次广告曝光时能记录：

```text
ad_relevance
ad_relevance_source
interest_match
topic_match
intent_match
current_topic
current_task_intent
ad_category
ad_target_interests
ad_target_intents
accept_prob
threshold
read_ad
```

这样才能判断 user feedback 失真到底是：

```text
数据没传到；
相关性算错；
规则 threshold 太硬；
还是 planner 插入时机不合理。
```

请新对话优先从“严格阅读代码、确认当前实现”开始，不要直接根据假设写大段修改。
