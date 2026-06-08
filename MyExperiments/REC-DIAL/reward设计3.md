---
创建时间: 2026-六月-8日  星期一, 9:50:31 上午
---

---

# REC-DIAL Reward Design

# 一、问题背景

在传统广告推荐场景中，例如短视频、信息流或新闻流，用户面对的是一个连续内容序列。系统的核心问题通常不是简单地“选一个广告”，而是：

```text
1. 何时插入广告；
2. 插入什么广告；
3. 如何控制广告频率与密度；
4. 如何在短期广告收益和长期用户留存之间平衡。
```

如果系统只优化单次广告点击或单轮广告接受，很容易学到短视策略。例如过度插入高收益广告，可能短期提升广告收益，但长期降低用户满意度和留存。因此，广告推荐中的优化目标应当从单次反馈扩展到序列层面的长期价值。

这一点与序列推荐中的长期优化问题一致。已有工作也指出，仅优化 immediate feedback 可能损害 long-term retention，因此推荐策略需要同时考虑即时反馈和长期留存目标。

在 REC-DIAL 中，这个问题进一步复杂化。系统不是在信息流中插入广告，而是在多轮自然语言对话中插入广告。Planner 不仅决定广告是否出现，还会影响后续对话如何发展。因此，reward 需要评价的不只是某一轮广告是否被接受，还包括：

```text
1. 当前回复是否推进用户任务；
2. 用户是否愿意继续对话；
3. 广告是否带来商业收益；
4. 广告是否造成反感；
5. 广告是否过于频繁；
6. 当前回复是否破坏话题连贯性。
```

参考文献：

[1] Liu Z, Liu S, Zhang Z, et al. Sequential recommendation for optimizing both immediate feedback and long-term retention[C]//Proceedings of the 47th International ACM SIGIR Conference on Research and Development in Information Retrieval. 2024: 1872-1882.

---

# 二、“内容流”到“话题流”：LLM 多轮对话的抽象

在传统流式推荐中，用户消费的是一个由 item 组成的内容流。每个 item 可以是视频、新闻、商品或广告。

在 LLM 多轮对话中，用户消费的对象不再是静态 item，而是随着交互不断演化的语义轨迹。我们可以将其抽象为：

```text
topic flow
```

也就是“话题流”。

一个完整对话 episode 可以表示为：

```text
episode
 ├── turn 1
 ├── turn 2
 ├── turn 3
 ...
 └── turn T
```

虽然对话中会出现局部连续的话题或子任务，但不显式定义 topic segment。当前话题上下文由 Planner state 中的 user belief、rolling summary 和 recent K exchanges 共同表示。


```text
episode
 ├── "topic segment A"
 │    ├── turn 1
 │    └── turn 2
 ├── "topic segment B"
 │    ├── turn 3
 │    ├── turn 4
 │    └── turn 5
 └── "topic segment C"
      └── turn 6
```

| 层级            | 定义                                                      | 作用                            |
| ------------- | ------------------------------------------------------- | ----------------------------- |
| turn          | 一次 agent decision cycle，即用户输入、系统回复、用户反馈形成的一步 transition | 提供局部 reward                   |
| topic segment | 若干语义一致的连续 turn                                          | 提供话题连贯性和广告相关性的语义参照            |
| episode       | 一次完整多轮对话                                                | 定义长期 return 和 terminal reward |

reward 仍然是 turn-level 计算，但部分 reward 项需要结合当前 topic segment 判断。

---

# 三、与传统流式推荐的相似性与差异

REC-DIAL 和传统流式推荐有相似之处：二者都需要在连续交互中平衡用户价值和商业价值。

但二者也有明显差异：

| 维度   | 信息流推荐           | LLM 多轮对话             |
| ---- | --------------- | -------------------- |
| 用户角色 | 相对被动消费内容        | 主动表达需求、反馈和拒绝         |
| 系统动作 | 排序、选择 item、插入广告 | 回复、引导话题、切换话题、插入广告    |
| 状态转移 | 基于点击、停留、跳出等行为   | 基于自然语言反馈和语义交互        |
| 广告位置 | 内容流中的 slot      | 对话语义流中的某一轮回复         |
| 控制能力 | 主要控制 item 排序    | 可以主动影响后续话题走向         |
| 失败形式 | 跳出、停留下降、点击下降    | 用户反感、话题偏移、任务未完成、提前退出 |

因此，在对话场景中，系统不仅决定：

```text
是否插广告；
插哪个广告；
```

还会影响：

```text
用户是否继续当前任务；
用户是否愿意继续对话；
后续话题是否自然发展；
广告是否打断原有语义主线。
```

所以 REC-DIAL 的 reward 不能只等价于广告点击或广告接受，而需要评价整个对话 trajectory 的长期效果。

---

# 四、turn、segment 与 reward 的关系

广告插入发生在某一轮，但其影响可能跨越多个 turn。

例如：

```text
Turn 3: 系统插入一个表面相关的广告
Turn 4: 用户没有立即反感，继续提问
Turn 5: 用户回复变短
Turn 6: 用户提前结束对话
```

如果只看 Turn 3，reward 可能是正的，因为广告相关且用户没有直接拒绝。

但从 segment 或 episode 看，这次广告可能破坏了任务主线，使用户逐渐失去兴趣，最终提前退出。

因此：

> 单轮即时反馈不足以反映广告的长期副作用。Reward 需要同时包含 turn-level 局部信号、segment-level 语义约束和 episode-level 终局结果。

---

## 4.1 Turn-level reward

turn-level reward 评价当前 Planner action 的即时后果。

在第 $t$ 个 agent decision turn，Planner state 为：

$$s_t$$

Planner action 为：

$$a_t=(d_t,j_t,w_t,k_t)$$

Speaker 生成系统回复，用户产生反馈。Monitor 根据更新后的对话历史得到下一状态：

$$s_{t+1}$$

因此，本轮 reward 写作：

$$r_t=R_\phi(s_t,a_t,s_{t+1})$$

这里 $R_\phi$ 是 RewardCalculator 或 reward estimator。它内部可以包含规则、查表和语义模型，但对 RL 来说，最终输出的是一个标量 reward。

---

## 4.2 Segment-level reference

topic segment 在 reward 中主要承担语义参照作用。

它影响三类判断：

| 评价项                 | 作用               |
| ------------------- | ---------------- |
| topic coherence     | 当前回复是否延续当前话题     |
| ad-topic fit        | 广告是否契合当前用户需求和话题  |
| topic drift penalty | 当前回复是否造成不自然的话题偏移 |

例如：

```text
“推荐写论文工具”在“论文写作”segment 中是合理的；
但在“旅游住宿规划”segment 中就是明显偏移。
```

因此：

> reward 虽然在 turn-level 计算，但部分 reward 项以 segment-level 语义为条件。

在实现上，当前 topic segment 可以由 Monitor 从 rolling summary 和最近 $K$ 轮对话中维护或估计。它不需要作为额外 Planner action，也不改变 RL step 的定义。

---

## 4.3 Episode-level objective

episode 层面评价的是整段对话的最终结果，例如：

```text
用户任务是否完成；
用户是否因为广告反感退出；
是否出现过度广告；
整体体验是否平衡；
商业收益是否在不破坏用户体验的前提下获得。
```

因此，最终优化目标不是单轮 reward，而是累计回报：

$$G=\sum_{t=0}^{T-1}\gamma^t r_t+r_{\text{terminal}}$$

其中：

| 符号                    | 含义         |
| --------------------- | ---------- |
| $\gamma$              | 折扣因子       |
| $r_{\text{terminal}}$ | 终局奖励       |
| $T$                   | episode 长度 |

三层关系可以总结为：

| 层级            | reward 作用 |
| ------------- | --------- |
| turn          | 提供局部反馈    |
| topic segment | 提供语义约束    |
| episode       | 定义长期目标    |

---

# 五、奖励函数设计

REC-DIAL 的优化对象不是单轮回复质量，而是完整对话 trajectory 的长期价值。因此 reward 需要同时刻画：

```text
1. 用户任务是否被推进；
2. 用户是否愿意继续对话；
3. 广告是否带来商业价值；
4. 用户是否产生反感；
5. 广告是否过于密集；
6. 回复或广告是否造成话题偏移。
```

---

## 5.1 单轮奖励函数定义

在每一轮 $t$，定义即时奖励：

$$r_t
=

r_t^{\text{user}}
+
r_t^{\text{biz}}
+
r_t^{\text{constraint}}$$

其中：

$$r_t^{\text{user}}
=

\lambda_{\text{task}}\eta_t^{\text{task}}
+
\lambda_{\text{cont}}\kappa_t^{\text{cont}}$$

$$r_t^{\text{biz}}
=

\lambda_{\text{ad}}\alpha_t^{\text{ad}}$$

$$r_t^{\text{constraint}}
=

-\lambda_{\text{annoy}}\chi_t^{\text{annoy}}
-\lambda_{\text{load}}\omega_t^{\text{ad}}
-\lambda_{\text{drift}}\Delta_t^{\text{topic}}$$

合并后：

$$r_t =

\lambda_{\text{task}}\eta_t^{\text{task}}
+
\lambda_{\text{cont}}\kappa_t^{\text{cont}}
+
\lambda_{\text{ad}}\alpha_t^{\text{ad}}

-

 \lambda_{\text{annoy}}\chi_t^{\text{annoy}}
-
 \lambda_{\text{load}}\omega_t^{\text{ad}}
-
\lambda_{\text{drift}}\Delta_t^{\text{topic}}$$

其中：

| 类别   | 符号                        | 含义                | 信号来源                      |
| ---- | ------------------------- | ----------------- | ------------------------- |
| 用户价值 | $\eta_t^{\text{task}}$    | 任务推进 / 任务满足程度     | 语义模型估计                    |
| 用户价值 | $\kappa_t^{\text{cont}}$  | 用户继续交互 / 留存 proxy | 用户反馈与终止信号                 |
| 商业价值 | $\alpha_t^{\text{ad}}$    | 广告接受 / 广告收益       | 广告表查值                     |
| 约束惩罚 | $\chi_t^{\text{annoy}}$   | 用户反感 / 负反馈        | 语义模型或情绪分类                 |
| 约束惩罚 | $\omega_t^{\text{ad}}$    | 广告密度 / 广告过载       | Monitor 维护的广告统计           |
| 约束惩罚 | $\Delta_t^{\text{topic}}$ | 话题偏移              | segment 表示与 embedding 相似度 |


---

# 六、Reward 计算来源与模块边界

RewardCalculator 的最终形式为：

$$r_t=R_\phi(s_t,a_t,s_{t+1})$$

也就是说，reward 主要根据动作前状态、Planner 动作和动作后状态计算。

这样设计的原因是：

```text
s_t 描述动作前的用户需求、对话记忆和广告曝光状态；
a_t 描述 Planner 做了什么；
s_{t+1} 描述用户反馈后的新状态；
reward 评价的是从 s_t 经过 a_t 到 s_{t+1} 的这次转移是否有价值。
```

因此，RewardCalculator 不需要在主公式中直接写完整历史 $H_t$，也不额外引入新的 evidence 变量。历史信息由 Monitor 压缩进 $s_t$ 和 $s_{t+1}$。

---

## 6.1 Monitor 与 RewardCalculator 的边界

Monitor 和 RewardCalculator 会使用同一批底层信号，例如用户回复、广告事件、话题变化和历史统计。但二者职责不同。

| 模块               | 输入                | 输出    | 性质    |
| ---------------- | ----------------- | ----- | ----- |
| Monitor          | $o_t=(p,H_t)$     | $s_t$ | 描述性状态 |
| RewardCalculator | $s_t,a_t,s_{t+1}$ | $r_t$ | 评价性标量 |

Monitor 负责描述事实：

```text
用户当前目标是什么；
用户有哪些正负偏好；
长期 summary 是什么；
最近几轮对话是什么；
当前 episode 展示过多少广告；
最近 K 轮展示过多少广告；
最近广告结果是什么。
```

RewardCalculator 负责评价后果：

```text
这轮动作是否推进任务；
用户是否愿意继续；
广告是否带来收益；
用户是否反感；
广告是否过于密集；
话题是否偏移。
```


# 七、各奖励项的计算方式

---

## 7.1 任务推进 $\eta_t^{\text{task}}$

$$\eta_t^{\text{task}}\in[0,1]$$

任务推进项刻画当前系统回复是否帮助用户完成任务。

它可以由 reward model 或 LLM judge 根据：

$$(s_t,a_t,s_{t+1})$$

估计得到。关键依据包括：

```ad-note
用户目标 $g_t$ 是否被推进；
用户偏好和约束是否被更好满足；
用户是否接受、追问或继续深化当前任务；
下一状态 $b_{t+1}$ 是否显示任务更明确或更接近完成。
```

典型取值逻辑：

| 情况              | $\eta_t^{\text{task}}$ |
| --------------- | ---------------------- |
| 用户表示有帮助，并继续深入任务 | 高                      |
| 用户补充偏好或继续澄清     | 中高                     |
| 用户重新提问或表示不够相关   | 中低                     |
| 用户明确表示无帮助       | 低                      |

---

## 7.2 对话持续性 $\kappa_t^{\text{cont}}$

$$\kappa_t^{\text{cont}}\in[0,1]$$

对话持续性项刻画用户是否愿意继续交互。它是长期留存的 turn-level proxy。

它主要根据 $s_{t+1}$ 中的用户反馈和 done 状态判断：

| 情况             | $\kappa_t^{\text{cont}}$       |
| -------------- | ------------------------------ |
| 用户继续提出相关问题     | 高                              |
| 用户给出有效补充信息     | 高                              |
| 用户只给出简短但未退出的反馈 | 中                              |
| 用户明确结束，但任务已完成  | 不应简单判为低，应交给 terminal reward 处理 |
| 用户因反感或无帮助而退出   | 低                              |

这里需要避免一个误区：

> 用户结束对话不一定是负反馈。任务完成后的自然结束应由 terminal reward 给正向评价，而不是在 continuation 中直接惩罚。

---

## 7.3 广告收益 $\alpha_t^{\text{ad}}$

$$\alpha_t^{\text{ad}}\in[0,1]\ \text{or a non-negative scalar}$$

广告收益项刻画本轮广告是否带来商业价值。

Planner action 中：

$$a_t=(d_t,j_t,w_t,k_t)$$

其中 $d_t$ 表示是否插广告，$j_t$ 表示具体广告。

如果本轮不插广告：

$$d_t=0 \Rightarrow \alpha_t^{\text{ad}}=0$$

如果本轮插广告：

$$d_t=1,\quad j_t\in\mathcal{D}$$

则广告基础价值可以从广告池中查表得到：

$$v_{j_t}=\\reward\_value(j_{t})$$

广告收益定义为：

$$\alpha_t^{\text{ad}}
=

\mathbf{1}[d_t=1]\cdot v_{j_t}$$


---

## 7.4 用户反感 $\chi_t^{\text{annoy}}$

$$\chi_t^{\text{annoy}}\in[0,1]$$

用户反感项刻画本轮动作是否造成负向体验。

它主要由 reward model / classifier 根据动作后状态估计：

$$\chi_t^{\text{annoy}}
=

J_\phi^{\text{annoy}}(s_t,a_t,s_{t+1})$$

典型负向信号包括：

```text
用户明确拒绝广告；
用户表示“不要推荐”；
用户表示“不是这个问题”；
用户对话题切换不满；
用户认为回复生硬或无关；
用户提前退出并表现出负面原因。
```

该项用于约束过度广告和不自然话题切换。

---

## 7.5 广告密度惩罚 $\omega_t^{\text{ad}}$

广告密度是规则型 reward 项，不需要语义模型判断。

为支持该项，Monitor 中的广告曝光状态定义为：

$$e_t^{ad}=(n_t^{ad},m_t^{ad,K},\delta_t^{ad},o_t^{ad})$$

其中：

| 符号              | 含义                                                |
| --------------- | ------------------------------------------------- |
| $n_t^{ad}$      | 当前 episode 已展示广告数量                                |
| $m_t^{ad,K}$    | 最近 $K$ 轮广告展示次数                                    |
| $\delta_t^{ad}$ | 距离上一次广告的轮数                                        |
| $o_t^{ad}$      | 最近广告结果，例如 clicked / accepted / ignored / rejected |

广告密度惩罚定义为：

$$\omega_t^{\text{ad}}
=

\beta_1\mathbf{1}[d_t=1]
+
\beta_2 m_t^{ad,K}$$

其中：

| 符号                  | 含义           |
| ------------------- | ------------ |
| $\mathbf{1}[d_t=1]$ | 本轮是否插入广告     |
| $m_t^{ad,K}$        | 最近 $K$ 轮广告数量 |
| $\beta_1,\beta_2$   | 广告密度惩罚的内部权重  |

该项用于防止连续多轮插入广告，避免 Planner 学到“频繁插广告以获取商业收益”的短视策略。

---

## 7.6 话题偏移 $\Delta_t^{\text{topic}}$


话题偏移项刻画本轮动作是否造成不自然的话题漂移。这里不显式维护 topic segment，而是使用当前 Planner state 中的 topic context 进行判断：

$$\text{topic context}_t = (b_t, \sigma_t, \ell_t^K)$$

其中 $(b_t)$ 表示用户当前目标与偏好，$(\sigma_t)$ 表示长期对话摘要，$(\ell_t^K)$ 表示最近 $(K)$ 轮局部上下文。

因此，话题偏移惩罚定义为：

$$\Delta_t^{\text{topic}}
=
J_\phi^{\text{topic}}(s_t, a_t, s_{t+1})$$

如果 $(w_t = 0)$，即 Planner 没有选择换话题，则该项评价系统回复是否偏离当前用户目标和最近上下文。

如果 $(w_t = 1)$，即 Planner 选择换话题，则该项评价目标话题 $(k_t)$ 是否与用户目标、偏好和对话上下文相关，而不是简单惩罚偏离旧话题。

这样，$(\Delta_t^{\text{topic}})$ 不依赖显式 topic segment，而是直接基于状态转移进行评价。

---

# 八、Episode-level 优化目标

系统最终优化的是整段对话的累计回报：

$$G=\sum_{t=0}^{T-1}\gamma^t r_t+r_{\text{terminal}}$$

其中：

| 符号                    | 含义                |
| --------------------- | ----------------- |
| $G$                   | episode return    |
| $\gamma$              | 折扣因子              |
| $r_t$                 | turn-level reward |
| $r_{\text{terminal}}$ | 终局奖励              |

Planner 的优化目标为：

$$J(\theta)
=

\mathbb{E}_{\pi_\theta}
\left[
\sum_{t=0}^{T-1}\gamma^t r_t+r_{\text{terminal}}
\right]$$

其中 $\pi_\theta$ 是 Planner policy。

---

## 8.1 Terminal reward

终局奖励用于刻画对话最终结果：

$$r_{\text{terminal}} =
\begin{cases}
+R_{\text{success}}, & \text{任务完成} \\
-R_{\text{annoy}}, & \text{因广告反感退出} \\
-R_{\text{fail}}, & \text{任务未完成退出} \\
0, & \text{中性结束}
\end{cases}$$

这个设计避免将所有“结束”都视为负反馈。

例如：

```text
任务完成后的自然结束：正向；
用户因广告反感退出：强负向；
用户未完成任务就退出：负向；
普通中性结束：中性。
```

---

# 九、对话长度控制

如果直接累加每轮 reward，Planner 可能学到一种错误策略：

> 通过拖长对话获得更多累计 reward。

为避免这一问题，采用三种机制。

---

## 9.1 折扣因子

$$G=\sum_{t=0}^{T-1}\gamma^t r_t+r_{\text{terminal}}$$

其中：

$$0\leq\gamma\leq1$$

折扣因子降低远期 reward 的权重，减少无意义拖长对话的收益。

---

## 9.2 最大对话长度

设定最大 turn 数：

$$T\leq T_{\max}$$

超过最大轮数后 episode 强制结束。

---

## 9.3 终局奖励

Terminal reward 区分不同结束类型：

```text
任务完成：正向；
广告反感退出：强负向；
任务未完成退出：负向；
中性结束：零或弱惩罚。
```

这样可以避免把“用户完成任务后结束”错误惩罚，也可以避免 Planner 通过无限延长对话获得高回报。
