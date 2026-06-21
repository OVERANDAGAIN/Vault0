[[REC-DIAL]]

[[5-15会议]]




# formulation 具体

```text
将 REC-DIAL 形式化为一个部分可观测的序列决策问题。
每个 episode 是 agent 与 Mock User 之间的一次多轮对话。
在每个 decision step，Planner 接收由 Monitor 构造的压缩 state，并输出一个 Planner action。
Speaker 将该 action 实现为自然语言回复。
随后 Mock User 产生下一轮用户反馈。
用户反馈本身不是 reward，而是 raw feedback；Monitor 和 RewardCalculator 将其分别解释为下一轮状态信号和当前轮标量 reward。
```


![[Pasted image 20260608135436.png]]



---

# Slide 1：Episode 怎么定义

一个 episode 是一次完整的用户-agent 多轮对话，从用户初始需求开始，到对话结束为止。

在 REC-DIAL 中，episode 开始于：

```text
Start:
- sample / load user u
- load user profile p_u
- generate initial user query q_0
```

其中，$u$ 表示当前 episode 中的用户，$p_u$ 表示该用户的 profile / persona prior，$q_0$ 表示初始用户需求。

结束条件可以包括：

```text
用户主动离开
达到最大轮数
任务完成
系统主动结束
```

```ad-tip
**当前代码里已经有其中两个比较明确的结束条件：**

1. UserSimulator 返回 EXIT_ACTION
2. turn_count 达到 max_turns

`DialogueEnv.step()` 里会根据 `user_response.text == EXIT_ACTION` 判断 `done`，
`run_simulation.py` 里会用 `turn_count < max_turns` 控制 episode 长度。
```

## Episode 长度

episode 不定义为固定长度，而是定义为变长对话过程，并设置最大轮数上限。

也就是说，一个 episode 的长度 $T$ 满足：

$$T \leq T_{\max}$$

其中，$T_{\max}$ 是最大允许轮数，而不是固定 episode 长度。

1. 有些用户可能很快完成需求，
2. 有些用户会继续探索，
3. 有些用户会因为广告或低满意度提前离开。

系统优化的是完整 episode 的长期 return，而不是固定轮数下的单轮收益。

---

# Slide 2：Decision step 怎么定义

在对话系统文献中，turn 的用法并不完全统一。一些 dialogue annotation 语境中，turn 指某一方说话者的一次连续发言：

```text
user turn   = 用户的一次发言
system turn = 系统的一次回复
```

而在任务型对话数据集和 dialogue policy learning 中，turn 往往也被用作对话状态更新和系统动作决策的基本轮次。因此，turn 本身不是 REC-DIAL formulation 中最关键的定义对象。

> Kwan W C, Wang H R, Wang H M, et al. A survey on recent advances and challenges in reinforcement learning methods for task-oriented dialogue policy learning[J]. Machine Intelligence Research, 2023, 20(3): 318-334.


REC-DIAL 关注的是 RL 训练中的 decision boundary。这里不讨论一个 turn 是否严格等于“用户一句话”或“用户-系统一组交互”。更重要的是明确：Planner 什么时候做一次决策，什么时候得到用户反馈，什么时候形成下一状态和 reward。

因此，对于 RL formulation 来说，最自然的 step 边界就是系统做出一次 policy decision 的时刻。这个时刻对应对话中的 **system turn**。

在任务型对话的 dialogue policy learning 中，系统通常在每个 turn 根据当前 dialogue state 选择下一步 system action。RL-based dialogue policy learning 进一步将 system 视为 agent，将 user 视为 environment，因此一次系统动作选择自然对应一个 RL decision step。

基于这一设定，REC-DIAL 将一个 RL decision step 定义为一个 system turn：

> 令 $t=0,1,\dots,T-1$ 表示 episode 中的第 $t$ 个 RL decision step。

表示 episode 中的第 $t$ 个 RL decision step，其中 $T$ 是该 episode 的实际长度。

在第 $t$ 个 decision step，系统已经观察到当前用户输入 $q_t$ 和此前对话历史。随后，Monitor 构造当前状态 $s_t$，Planner 选择动作 $a_t$，Speaker 生成系统回复 $y_t$，Mock User 返回下一轮用户反馈 $q_{t+1}$。随后系统构造下一状态 $s_{t+1}$，并计算 reward $r_t$。

形式化表示为：

$$s_t \xrightarrow{a_t} y_t \rightarrow q_{t+1} \rightarrow s_{t+1}, r_t$$

最终用于 RL 训练的 transition 是：

$$(s_t, a_t, r_t, s_{t+1}, \text{done}_t)$$






# Step 2：PlannerInput / State Formulation

# 2.0  原始 observation $o_t$

在第 $t$ 个 decision turn，系统已经看到当前用户输入 $u_t$，并拥有截至当前的完整对话历史：

$$H_t = (q_0, y_0, q_1, y_1, \dots, y_{t-1}, q_t)$$

如果把 previous planner action、广告展示记录、广告点击/拒绝等事件也记录在 episode log 里，那么可以把它们视为 $H_t$ 的一部分。于是原始 observation 定义为：

$$o_t = (p_{u}, H_t)$$

其中：

| 符号      | 含义                   |
| ------- | -------------------- |
| $p_{u}$ | 用户u画像或 persona prior |
| $H_t$   | 截至当前用户输入的完整对话历史与事件日志 |

这里的 $o_t$ 是原始输入，不直接交给 Planner 做决策。


## 2.1 设计目标

在 REC-DIAL 中，
1. Planner 的输入不应是完整对话历史。完整历史过长，包含大量局部细节和噪声；
2. 仅对当前用户输入 $q_t$ 的局部解释又缺乏长期历史上下文。

二者都不能直接作为稳定的决策状态。

因此，我们将 Planner 的输入定义为一个经过压缩和结构化后的决策状态：

$$s_t = (p_u, B_t, D_t)$$

其中：

| 符号    | 名称                    | 含义                             |
| ----- | --------------------- | ------------------------------ |
| $p_u$ | UserProfile / Persona | 当前用户 $u$ 的画像                   |
| $B_t$ | BeliefState           | 系统当前对用户目标、偏好、约束和未解决问题的理解       |
| $D_t$ | DialogueContext       | 对话历史的压缩表示，包括长期摘要、最近几轮原文，历史广告信息 |


这里的 $s_t$ 是 Planner 在第 $t$ 个 decision step 的输入。


---

## 2.2 BeliefState ($B_t$)

BeliefState 表示系统当前对用户需求和偏好的理解。

定义：

$$B_t = (g_t, P_t^+, P_t^-, \mathrm{sat}_t)$$

其中：

| 符号               | 名称                      | 含义                   |
| ---------------- | ----------------------- | -------------------- |
| $g_t$            | user_goal               | 当前用户目标的简短描述          |
| $P_t^+$          | positive_preferences    | 用户已表达的正向偏好           |
| $P_t^-$          | negative_preferences    | 用户已表达的负向偏好、拒绝或不想要的内容 |
| $\mathrm{sat}_t$ | user_satisfaction_state | 系统对当前用户满意度 / 交互状态的估计 |



其中，$\mathrm{sat}_t$ 可以是离散标签，也可以实现为一个连续分数，表示当前用户对对话体验的估计满意度。


BeliefState 由 Monitor 根据用户画像和截至当前的完整对话历史构造：

$$B_t = M_B(p_u, H_t)$$

其中，$M_B$ 表示 Monitor 中负责 belief extraction / belief update 的部分。它负责从历史中抽取并维护当前用户目标、偏好、拒绝项、显式约束和未解决问题。

这里需要强调：BeliefState 并不是为了判断“信息是否足够从而推荐唯一 item”。BeliefState 的作用是帮助 Planner 判断当前更适合采取哪类动作，例如引导探索、轻量澄清、给出初步建议、正式推荐、插入广告、修复体验或结束对话。


---

## 2.3 DialogueContext / MemoryState ($D_t$)

由于完整 dialogue history 不适合作为 Planner 输入，我们将历史信息压缩为 DialogueContext，也可以理解为 MemoryState：

$$D_t = M_D(H_t)$$

其中，$M_D$ 表示 Monitor 中负责 memory construction / memory update 的部分。

在实现层面，$D_t$ 可以直接由现有工作的一些 memory module 构造，例如 summary memory、retrieval memory、recent context window，或者它们的组合。因此，在 formulation 中不再显式展开 $D_t$ 的内部结构。

$D_t$ 的作用是保存对 Planner 决策有用的上下文信息，包括：

```text
长期对话主线；
最近几轮局部上下文；
已解决和未解决的对话事项；
用户近期表达的态度变化；
历史广告展示、点击、忽略、拒绝等事件。
```


这种设计的好处是：state 更简洁，同时也更贴近现有 memory module 的实现方式。


---

# 3. Monitor 

Monitor 直接把原始 user  压缩成 Planner state：

$$s_t = M(o_t)$$

也就是：

$$s_t = M(p_{u}, H_t)$$

这里 $M$ 是 Monitor。它的职责是：

```ad-info
读取用户画像和完整对话历史；
抽取当前用户需求与偏好；
维护长期 dialogue memory $m_t$；
保留最近 $K_h$ 个 exchange 的局部上下文；
构造结构化广告事件序列；
输出 Planner 可用的压缩状态 s_t。
```

但 Monitor 仍然不做动作选择。它不能输出：

```text
是否插广告；
插哪个广告；
是否换话题；
换到哪个话题。
```

这些是 Planner 的动作。


# 4. Planner action ($a_t$)

Planner 的动作改为一维离散动作。这个动作空间把广告候选和 topic 候选混排在同一个 action list 中。

设广告池为：

$$\mathcal{D} = \{0, 1, \dots, |\mathcal{D}| - 1\}$$

topic 池为：

$$\mathcal{T} = \{0, 1, \dots, |\mathcal{T}| - 1\}$$

定义 Planner action：

$$a_t \in \mathcal{A}$$

其中：

$$\mathcal{A}
=
\{-1\}
\cup
\{0, 1, \dots, |\mathcal{D}| - 1\}
\cup
\{|\mathcal{D}|, \dots, |\mathcal{D}| + |\mathcal{T}| - 1\}$$


也就是说，Planner 每个 decision step 从一个混排的一维 action list 中选择一个动作：

```text
[-1, ad_0, ad_1, ..., ad_m, topic_0, topic_1, ..., topic_n]
```

其中，$-1$ 表示不做广告插入或 topic 切换；前半部分表示广告候选；后半部分表示 topic 候选。

它保证每一步最多选择一种动作：要么插入一个广告，要么切换到一个 topic，要么不执行额外操作。

Planner policy 为标准 RL 形式：

$$a_t \sim \pi_\theta(a \mid s_t)$$

其中，$s_t = (p_u, B_t, D_t)$。

---

# 5. Speaker 输入

Planner 输出一维动作：

$$a_t \in \mathcal{A}$$

Speaker 接收：

$$(s_t, a_t)$$

并生成自然语言回复：

$$y_t = \mathrm{Speaker}(s_t, a_t)$$


Speaker 负责把 Planner action 实现为自然语言回复。

如果 $a_t = -1$，Speaker 正常回复用户当前需求，不插广告，也不主动切换 topic。

如果 $0 \leq a_t < |\mathcal{D}|$，Speaker 在回复中自然插入对应广告。

如果 $|\mathcal{D}| \leq a_t < |\mathcal{D}| + |\mathcal{T}|$，Speaker 将回复自然过渡到对应 topic。

Speaker 不重新决定是否插广告、插哪个广告、是否切换 topic 或切换到哪个 topic。

# 6. Transition Formulation

Transition 描述的是：在第 $t$ 个 decision step 中，系统如何从当前状态 $s_t$ 经过一次 Planner action，转移到下一状态 $s_{t+1}$，并得到当前 reward $r_t$。

在第 $t$ 个 decision step，系统已经观察到当前用户输入 $q_t$，并拥有当前历史：

$$H_t = (q_0, y_0, q_1, y_1, \dots, q_{t-1}, y_{t-1}, q_t)$$

原始 observation 为：

$$o_t = (p_u, H_t)$$

Monitor 将原始 observation 压缩为 Planner state：

$$s_t = M(o_t) = M(p_u, H_t)$$

其中：

$$s_t = (p_u, B_t, D_t)$$

Planner 根据当前状态选择动作：

$$a_t \sim \pi_\theta(a \mid s_t)$$

其中，$a_t$ 是一维离散动作。

Speaker 根据当前状态和 Planner action 生成系统回复：

$$y_t = \mathrm{Speaker}(s_t, a_t)$$

随后，Mock User 根据用户画像、当前历史和系统回复产生下一轮用户输入：

$$q_{t+1} = \mathrm{UserSim}(p_u, H_t, y_t)$$

这里，$q_{t+1}$ 是用户对当前系统回复的 raw feedback。它本身不是 reward。

如果当前 action 是广告动作，即：

$$0 \leq a_t < |\mathcal{D}|$$

则本轮展示广告：

$$j_t^{\mathrm{ad}} = a_t$$

并记录广告事件：

$$z_t^{\mathrm{ad}}
=
(1, j_t^{\mathrm{ad}}, \mathrm{out}_t^{\mathrm{ad}})$$

其中，$\mathrm{out}_t^{\mathrm{ad}}$ 由用户反馈 $q_{t+1}$ 或事件日志得到，例如 clicked、accepted、ignored 或 rejected。

如果当前 action 不是广告动作，则：

$$z_t^{\mathrm{ad}}
=
(0, -1, \mathrm{none})$$

随后，系统更新历史：

$$H_{t+1} = H_t \oplus (y_t, q_{t+1}, z_t^{\mathrm{ad}})$$

其中，$\oplus$ 表示将本轮系统回复、下一轮用户输入和广告事件追加到历史中。

Monitor 根据更新后的历史构造下一状态：

$$s_{t+1} = M(p_u, H_{t+1})$$

RewardCalculator 根据本次状态转移计算当前 reward：

$$r_t = R_\phi(s_t, a_t, s_{t+1})$$

因此，第 $t$ 个 decision step 形成的 RL transition 为：

$$(s_t, a_t, r_t, s_{t+1}, \mathrm{done}_t)$$

其中，$\mathrm{done}_t$ 表示当前 episode 是否在本次 transition 后结束。

整体流程可以概括为：

$$s_t
\xrightarrow{a_t}
y_t
\rightarrow
q_{t+1}
\rightarrow
H_{t+1}
\rightarrow
s_{t+1}, r_t$$


# 7. Training Target

REC-DIAL 中 RL 训练的对象是 Planner policy：

$$\pi_\theta(a\mid s)$$

Monitor $M$ 负责构造状态，Speaker 负责实现自然语言回复，Mock User 负责模拟环境反馈，RewardCalculator 负责计算 reward。它们共同构成训练环境的一部分，但不作为当前 RL 优化的直接对象。

Planner 的目标是最大化 episode-level return：

$$J(\theta)
=
\mathbb{E}_{\pi_\theta}
\left[
\sum_{t=0}^{T-1}\gamma^t r_t+r_{\mathrm{terminal}}
\right]$$

其中：

$$a_t\sim\pi_\theta(a\mid s_t)$$

RL 算法通过收集 episode trajectories：

$$\tau =
(s_0,a_0,r_0,s_1,a_1,r_1,\dots,s_T)$$

来更新 Planner policy 参数 $\theta$。





# reward设计： [[reward设计4]]
# Metrics设计： [[metrics设计2]]