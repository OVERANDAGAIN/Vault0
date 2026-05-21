---
创建时间: 2026-五月-18日  星期一, 5:24:09 下午
---
[[REC-DIAL]]

[[5-15会议]]



Dy2025102110010


# 文献调研
## DEAR
> (2019/09/09) DEAR: Deep Reinforcement Learning for Online Advertising Impression in Recommender Systems


可以。下面这个版本只保留 **DEAR 原文明确给出的 formulation 和实现设置**；凡是原文没有给出的训练细节，例如 learning rate、batch size、GRU 层数等，不纳入表格。

# 1. DEAR 的整体 MDP 设置

| 组件                   | 原文设置                                  | 具体含义                                              |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| **问题对象**             | Advertising problem within a rec-list | 在推荐系统已经生成 rec-list 后，广告系统决定是否插入广告、插入哪个广告、插入到哪个位置。 |
| **MDP**              | $(S,A,P,R,\gamma)$                    | 将推荐列表中的广告插入建模为马尔可夫决策过程。                           |
| **Agent**            | Advertising-Agent, AA                 | 广告智能体。                                            |
| **Environment**      | $E$, users                            | 用户环境。用户浏览混合后的 rec-ad list 并反馈。                    |
| **State**            | $s_t \in S$                           | 用户在 $t$ 之前的 browsing history + 当前 request 信息。     |
| **Action**           | $a_t=(a^{ad}_t,a^{loc}_t)$            | 组合动作：是否插广告、插哪个广告、插到哪个位置。                          |
| **Reward**           | $r(s_t,a_t)$                          | 广告收益 + 用户体验影响。                                    |
| **Transition**       | $p(s_{t+1}\mid s_t,a_t)$              | 执行动作后，用户浏览并反馈，进入下一状态。                             |
| **Discount factor**  | $\gamma \in [0,1]$；实验中 $\gamma=0.95$  | 控制未来 reward 的折扣。                                  |
| **Policy objective** | $\pi:S\rightarrow A$                  | 学习一个广告策略，最大化长期累计 reward，即最大化广告收入并最小化广告对用户体验的负面影响。 |

原文在 Problem Statement 中明确把该问题定义为 Advertising-Agent 与 users 交互的 MDP，并给出 state、action、reward、transition、discount factor 和 policy objective 的定义。

# 2. State 的组成与维度

DEAR 的 state 写作：

$$s_t = \text{concat}(p^{rec}_t, p^{ad}_t, c_t, rec_t)$$

| State 部分     |          符号 | 原文构造方式                                                              | 原文给出的维度 |
| ------------ | ----------: | ------------------------------------------------------------------- | ------: |
| 推荐浏览历史表示     | $p^{rec}_t$ | 用一个 GRU 编码用户最近浏览过的 recommendations，取最后 hidden state 表示用户对推荐内容的动态偏好。 |      64 |
| 广告浏览历史表示     |  $p^{ad}_t$ | 用另一个 GRU 编码用户最近浏览过的 ads，取最后 hidden state 表示用户对广告内容的动态偏好。            |      64 |
| 当前请求上下文      |       $c_t$ | 包括 OS、app version、feed type 等当前 request context。                    |      13 |
| 当前推荐列表表示     |     $rec_t$ | 将当前 rec-list 中 $L$ 个推荐 item 的特征拼接，再经过一层 tanh 变换。                    |     360 |
| **最终 state** |       $s_t$ | 拼接上述四部分。                                                            | **501** |

其中 $rec_t$ 的原文公式是：

$$rec_t = \tanh(W_{rec}\text{concat}(rec_1,\cdots,rec_L)+b_{rec})$$

所以最终 state 的维度由原文给出的四部分维度相加得到：

$$64+64+13+360=501$$

也就是：

$$s_t \in \mathbb{R}^{501}$$

原文明确说明，推荐历史和广告历史分别用两个 GRU 编码，当前 rec-list 通过 concat 加 tanh 得到低维 dense vector，并在 Implementation Details 中给出 $p^{rec}_t, p^{ad}_t, c_t, rec_t, a^{ad}_t$ 的维度分别为 64、64、13、360、60。

# 3. 原始 item / ad 特征设置

| 类型           | 原文中的角色                     | 原文列出的特征                                                            | 处理方式                                      |
| ------------ | -------------------------- | ------------------------------------------------------------------ | ----------------------------------------- |
| Normal video | 推荐 item / recommended item | id、like score、finish score、comment score、follow score、group score  | 每个 feature 被 discretize 成 one-hot vector。 |
| Ad video     | 广告 item / advertised item  | id、image size、bid-price、hidden-cost、predicted-CTR、predicted-recall | 每个 feature 被 discretize 成 one-hot vector。 |

原文说明，normal video 和 ad video 的特征都会被离散化为 one-hot vector，并且这些特征也被 baseline 使用，以保证公平比较。

# 4. Action 的组成与维度

DEAR 的 action 写作：

$$a_t=(a^{ad}_t,a^{loc}_t)$$

| Action 部分 |                                               符号 | 原文设置                                         | 维度 / 数量 |
| --------- | -----------------------------------------------: | -------------------------------------------- | ------: |
| 候选广告特征    |                                       $a^{ad}_t$ | 一个 candidate ad 的特征表示。                       |      60 |
| 插入位置      |                                      $a^{loc}_t$ | 给定长度为 $L$ 的 rec-list，有 $L+1$ 个真实插入位置。        |   $L+1$ |
| 不插广告      |                               special location 0 | 原文将 “not interpolating an ad” 视为特殊位置 0。      |       1 |
| DQN 输出层   | $Q(s_t,a^{ad}_t)^0,\cdots,Q(s_t,a^{ad}_t)^{L+1}$ | 对某个 candidate ad，一次输出所有位置的 Q-value，包括 no-ad。 | $L+2=8$ |

因此，实验中 DQN 输出层长度为：

$$L+2=8$$

其中包含一个表示“不插广告”的位置。由这个等式可以直接推出实验里的 rec-list 长度满足：

$$L=6$$

但原文直接写的是 “output layer is (L+2=8)”；$L=6$ 是由该式反推得到的。

# 5. Q-network 的输入输出设置

| 项目       | 原文设置                                             |   |                  |   |    |
| -------- | ------------------------------------------------ | - | ---------------- | - | -- |
| 网络输入     | state $s_t$ 和一个 candidate ad $a^{ad}_t$          |   |                  |   |    |
| 网络输出     | 该 candidate ad 在所有位置上的 Q-value                   |   |                  |   |    |
| 输出长度     | $L+2=8$                                          |   |                  |   |    |
| no-ad 表示 | $Q(s_t,a^{ad}_t)^0$ 表示不插广告                       |   |                  |   |    |
| 实际决策     | 遍历 candidate ads，并在所有 ad-location Q-values 中取最大值 |   |                  |   |    |
| 时间复杂度变化  | 从传统枚举的 $O(|A| \cdot L)$ 降为 $O(|A|)$ |   |                  |   |    |

也就是说，DEAR 不是一次性输出所有广告和所有位置的 Q-value，而是：

$$\text{input: } (s_t, a^{ad}_t)$$

$$\text{output: } [Q(s_t,a^{ad}_t)^0, Q(s_t,a^{ad}_t)^1, \cdots, Q(s_t,a^{ad}_t)^{L+1}]$$

其中 index 0 对应不插广告，其他 index 对应真实插入位置。原文强调，这种设计可以同时处理 “whether / which ad / where” 三个相关子动作。

# 6. Dueling-style Q-function 设置

| 部分                 |                符号 | 输入                           | 原文解释                                                                           |
| ------------------ | ----------------: | ---------------------------- | ------------------------------------------------------------------------------ |
| Value function     |          $V(s_t)$ | state features               | 是否插广告主要受 state 影响，尤其是 browsing history、contextual information 和当前 rec-list 质量。 |
| Advantage function | $A(s_t,a^{ad}_t)$ | state features + ad features | 选择哪个广告、放在哪个位置，与当前 rec-list 和广告特征都有关。                                           |
| 网络结构               |                 — | —                            | 原文说使用两个 2-layer neural networks 分别生成 $V(s_t)$ 和 $A(s_t,a^{ad}_t)$。             |

原文没有给出这两个 2-layer neural networks 的 hidden size、activation、optimizer 等细节。这里不展开。

# 7. Reward 设置

DEAR 的 reward 写作：

$$r_t(s_t,a_t)=r^{ad}_t+\alpha r^{ex}_t$$

| Reward 部分 |         符号 | 原文定义                                                 |
| --------- | ---------: | ---------------------------------------------------- |
| 广告收益      | $r^{ad}_t$ | ad income；如果插入广告，则为正值；如果不插广告，则为 0。                   |
| 用户体验      | $r^{ex}_t$ | formal definition 中，continue 为 $1$，leave 为 $-1$。     |
| 权重        |   $\alpha$ | 控制用户体验项的重要程度。                                        |
| 实验实现处说明   | $r^{ex}_t$ | Implementation / Metrics 附近写的是：用户继续浏览下一列表则为 1，否则为 0。 |

这里要注意，原文前后有一个小差异：Reward Function 小节中的公式是 continue = 1、leave = -1；实验说明里写的是 continue = 1、otherwise = 0。两者都属于原文内容，不能强行合并成一个版本。

# 8. Transition / state update 设置

| State 部分        | 从 $s_t$ 到 $s_{t+1}$ 的更新方式                                                    |
| --------------- | ---------------------------------------------------------------------------- |
| $p^{rec}_{t+1}$ | 时间 $t$ 浏览过的 recommendations 被加入 recommendation browsing history，再生成新的推荐偏好表示。 |
| $p^{ad}_{t+1}$  | 时间 $t$ 浏览过的 ads 被加入 ad browsing history，再生成新的广告偏好表示。                         |
| $c_{t+1}$       | 取决于用户在 $t+1$ 时的行为 / request context。                                         |
| $rec_{t+1}$     | 来自推荐系统下一次生成的 rec-list。                                                       |

原文明确说，recommendations 和 ads browsed at time $t$ 会被加入 browsing history，从而生成 $p^{rec}_{t+1}$ 和 $p^{ad}_{t+1}$；$c_{t+1}$ 依赖用户在 $t+1$ 的行为；$rec_{t+1}$ 来自推荐系统。

# 9. 训练相关的原文设置

| 项目                 | 原文设置                                                                    |
| ------------------ | ----------------------------------------------------------------------- |
| 训练方式               | Off-policy training                                                     |
| 数据来源               | users’ offline log                                                      |
| Behavior policy    | $b(s_t)$，即日志中的已有广告策略                                                    |
| transition         | $(s_t,a_t,r_t,s_{t+1})$                                                 |
| replay buffer size | 10,000                                                                  |
| target network     | 使用 separated evaluation and target networks                             |
| discount factor    | $\gamma=0.95$                                                           |
| $\alpha$           | 通过 cross-validation 选择                                                  |
| 不插广告时的 $a^{ad}_t$  | 使用 all-zero vector                                                      |
| 数据划分               | 按时间顺序收集 1,000,000 sessions，前 70% 用作 training / validation，后 30% 用作 test |

# 10. 最终压缩版

| 模块                         | DEAR 原文设置                                                      |
| -------------------------- | -------------------------------------------------------------- |
| **State**                  | $s_t=\text{concat}(p^{rec}_t,p^{ad}_t,c_t,rec_t)$                     |
| **State 维度**               | $64+64+13+360=501$                                             |
| **Recommendation history** | GRU 编码，最后 hidden state，64 维                                    |
| **Ad history**             | GRU 编码，最后 hidden state，64 维                                    |
| **Context**                | OS、app version、feed type 等，13 维                                |
| **Current rec-list**       | $rec_t=\tanh(W_{rec}\text{concat}(rec_1,\cdots,rec_L)+b_{rec})$，360 维 |
| **Action**                 | $a_t=(a^{ad}_t,a^{loc}_t)$                                     |
| **Ad feature**             | $a^{ad}_t$，60 维                                                |
| **Location output**        | $L+2=8$，包含 no-ad 特殊位置                                          |
| **Reward**                 | $r_t=r^{ad}_t+\alpha r^{ex}_t$                                 |
| **Discount factor**        | $\gamma=0.95$                                                  |
| **Replay buffer**          | 10,000                                                         |
| **Network split**          | 两个 2-layer networks 分别生成 $V(s_t)$ 和 $A(s_t,a^{ad}_t)$          |
| **Training**               | 基于 offline log 的 off-policy DQN 训练                             |

一句话概括：

> DEAR 的 state 是一个 501 维拼接向量，由 64 维推荐历史偏好、64 维广告历史偏好、13 维当前上下文和 360 维当前推荐列表表示组成；action 是 $(a^{ad}_t,a^{loc}_t)$，其中广告特征为 60 维，位置由 DQN 输出层表示，输出长度为 $L+2=8$，包含一个 no-ad 特殊位置；reward 为广告收益加权用户体验项，即 $r_t=r^{ad}_t+\alpha r^{ex}_t$。






# Limitations
# Future Work
# FootNotes