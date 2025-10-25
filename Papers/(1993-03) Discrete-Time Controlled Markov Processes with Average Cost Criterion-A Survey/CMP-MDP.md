---
创建时间: 2025-十月-25日  星期六, 6:40:48 晚上
---
[[(1993-03) Discrete-Time Controlled Markov Processes with Average Cost Criterion-A Survey]])

# Questions

- [?] 


# Answers

## GPT_Answers
非常好的问题 👍
你注意到文中既提到了 **Controlled Markov Process (CMP)**，又提到了 **Markov Decision Process (MDP)**，它们看起来几乎一样——确实，它们在本质上是**同一个数学对象**，但在**使用语境和理论侧重点上**略有区别。下面我帮你分层解释清楚。

---

## 🧩 一、核心结论

> ✅ **CMP 与 MDP 在数学定义上是等价的**。
> 也就是说，一个离散时间、平稳的 CMP $(S, A, U, P, c)$ 与一个标准的 MDP $(S, A, P, R)$（或 $(S, A, P, c)$）是**同一类对象的两种叫法**。

区别主要在于：

* CMP 是**控制理论（control theory）/ 随机控制（stochastic control）**领域的叫法；
* MDP 是**强化学习（reinforcement learning）/ 运筹学（operations research）**领域的叫法。

---

## 🧱 二、形式结构对比

| 元素    | CMP 表述            | MDP 表述                | 含义           |       |                 |
| ----- | ----------------- | --------------------- | ------------ | ----- | --------------- |
| 状态空间  | $S$               | $S$                   | 系统可能处于的所有状态  |       |                 |
| 动作空间  | $A$               | $A$                   | 可采取的控制或决策    |       |                 |
| 可行动作集 | $U(x)\subseteq A$ | 通常不单列（默认所有动作可行）       | 状态相关的动作约束    |       |                 |
| 转移概率核 | $P(\cdot          | x,a)$                 | $P(s'        | s,a)$ | 执行动作后转移到下一状态的分布 |
| 代价函数  | $c(x,a)$          | 奖励函数 $r(s,a)=-c(s,a)$ | 执行动作的即时损失或收益 |       |                 |
| 策略    | 测度映射 $\pi(a       | x)$                   | 策略 $\pi(a    | s)$   | 决定在状态下采取动作的规则   |

👉 可以看到，唯一区别：

* CMP 更强调 **“控制”** 和 **“代价最小化”**；
* MDP 更强调 **“决策”** 和 **“奖励最大化”**。

因此两者本质上只差一个负号：
$$
\text{MDP: maximize } \mathbb{E}\left[\sum_t \gamma^t r(s_t, a_t)\right]
\quad\Longleftrightarrow\quad
\text{CMP: minimize } \mathbb{E}\left[\sum_t \gamma^t c(x_t, a_t)\right]
$$

---

## 🧠 三、学科语境上的区别

| 语境             | 常用术语                           | 典型参考                                                                                                               |
| -------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **控制理论 / 概率论** | Controlled Markov Process（CMP） | Bertsekas & Shreve《Stochastic Optimal Control》, Hernández-Lerma & Lasserre《Discrete-Time Markov Control Processes》 |
| **强化学习 / 运筹学** | Markov Decision Process（MDP）   | Puterman《Markov Decision Processes》, Sutton & Barto《Reinforcement Learning》                                        |

CMP 强调**数学严谨性**与**可测性假设**（Borel空间、多值映射、测度核等）；
MDP 强调**算法可实现性**与**数值优化**（价值迭代、策略梯度、Q-learning 等）。

---

## 📚 四、总结一句话记忆

> * CMP 是“**受控马尔可夫过程**”，强调理论与可测性，常见于数学控制论；
> * MDP 是“**马尔可夫决策过程**”，强调决策与最优化，常见于强化学习；
> * 二者本质上完全等价，区别仅是学术传统与符号习惯。

---

如果你希望，我可以帮你做一个 **CMP ↔ MDP 对照图**（一张结构化思维图，展示它们的映射关系和公式对应），是否要我生成一张？


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
