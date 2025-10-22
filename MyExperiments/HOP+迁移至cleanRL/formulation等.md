[[HOP+迁移至cleanrl]]


# Problem setup

## 环境和对象：
多智能体 混合动机博弈   $\Longrightarrow$ 非平稳性，challenge

adaptation $\Longrightarrow$ 实际应用

引入：opponent modeling ，简要介绍现有方法 $\Longrightarrow$ 预定义目标的不合理性
	$\Longrightarrow$ 如何自动得出目标，并且得到高的adaptation能力




# Definition 
标准的Markov Game (MDP)，一些符号定义：状态空间，动作空间，转移函数，策略，奖励函数，折扣 （多智能体交互总体问题）

###  Multi-Agent Environment Formulation

我们首先把交互过程形式化为一个 **部分可观测的多智能体马尔可夫博弈**（POMG）：

$$
\mathcal{G} = \langle \mathcal{S}, {\mathcal{A}*i}*{i=1}^N, {\mathcal{O}*i}*{i=1}^N, P, {r_i}_{i=1}^N, \gamma \rangle
$$

其中：

* $\mathcal{S}$：全局状态空间
* $\mathcal{A}_i$：智能体 $i$ 的动作空间
* $\mathcal{O}_i$：观测空间（HOP+中为局部网格视野）
* $P(s'|s, a_1,\dots,a_N)$：状态转移函数
* $r_i(s,a_1,\dots,a_N)$：个体奖励函数
* $\gamma$：折扣因子

每个智能体的目标是最大化自己的期望累计回报：
$$
J_i(\pi_i, \pi_{-i}) = \mathbb{E}\left[ \sum_{t=0}^T \gamma^t r_i(s_t, a_t^1, \dots, a_t^N) \right]
$$


非常好，这个判断非常专业。
既然你当前阶段的实验还没有涉及**部分可观测性（partial observability）**，那么在PPT中的理论建模部分就应该使用**标准的 Markov Game (MG)**，而不是 POMG，以保持一致性和简洁性。

下面我为你重写了这一部分（Slide 3 和 Slide 4）的正式英文PPT内容，保证：

* 不涉及 POMG；
* 内容简洁、逻辑自然；
* 语气符合学术汇报风格；
* 可直接接入后续 *Formulation / HOP+ Framework* 部分。

---

## **Slide 3 — Multi-Agent Reinforcement Learning Framework**

**Title:**
**Modeling Interactive Decision-Making**

**Main Content (PPT text):**

* To study cooperation and adaptation quantitatively, we use the framework of **Multi-Agent Reinforcement Learning (MARL)**.
* In a Markov Game, multiple agents interact within a shared environment characterized by:
  [
  \mathcal{G} = \langle \mathcal{S}, {\mathcal{A}_i}, P, {r_i}, \gamma \rangle
  ]
  where ( \mathcal{S} ) is the state space, ( \mathcal{A}_i ) the action space of agent ( i ),
  ( P ) the transition function, and ( r_i ) the individual reward.
* Each agent learns a policy (  ) to maximize its expected cumulative reward:
  [
  J_i = \mathbb{E}!\left[\sum_t \gamma^t r_i(s_t, a_t^1, \dots, a_t^N)\right]
  ]
* This framework provides a formal foundation to analyze how agents learn, cooperate, and compete in dynamic environments.

**Visual Suggestion:**
Diagram of several agents interacting with a common environment (state → actions → rewards → next state).

**Footer Reference:**
Littman (1994); Leibo et al. (2017)

**Presenter Notes（中文）**
这一页只需要讲清楚：

1. 我们如何抽象多智能体交互问题（Markov Game）；
2. 每个智能体的目标是什么（最大化期望累计回报）。
   语气平稳，不展开算法细节。

---

## **Slide 4 — From Game Formulation to Learning Objectives**

**Title:**
**Learning to Adapt within the Reinforcement Learning Paradigm**

**Main Content (PPT text):**

* The MARL formulation allows agents to learn optimal behaviors through trial and interaction.
* However, in **mixed-motive** settings, opponents’ policies may change over time, creating non-stationary dynamics.
* To achieve **few-shot adaptation**, agents must not only optimize rewards but also **model other agents’ behaviors** and learn transferable representations.
* Our goal is to design learning objectives that combine:

  * **Policy optimization** for reward maximization,
  * **Opponent modeling** for behavioral understanding, and
  * **Representation learning** for adaptive generalization.
* This unified perspective lays the foundation for our proposed framework.

**Visual Suggestion:**
Simple schematic:
Environment (state) → Agent Policy → Interaction Loop
and a secondary box labeled *Opponent Model* connected back to policy.

**Footer Reference:**
Foerster et al. (2018); Rabinowitz et al. (2018)

**Presenter Notes（中文）**
这是一个“承上启下”的过渡页。
你不必展示公式，只需讲清逻辑：

* RL 提供了交互与优化的机制；
* 但在混合动机环境中，单纯优化回报不足以应对变化；
* 因此，我们引入对手建模和表征学习，为后面的 HOP+ 打开入口。

---

### ✅ 整体逻辑复盘

| Slide | 核心目标        | 内容关键词                                   |
| ----- | ----------- | --------------------------------------- |
| 3     | 建立数学建模语言    | Markov Game, Policy, Reward             |
| 4     | 引出学习目标与创新思路 | Policy + Opponent Modeling + Adaptation |

这样衔接起来就非常自然：
**前两页**讲合作与适应的重要性；
**这一页**用强化学习框架刻画交互；
**下一页**（Methodology / HOP+ Formulation）就可以正式写出：
[
\mathcal{L}*{total} = \mathcal{L}*{policy} + \alpha \mathcal{L}*{VAE} + \beta \mathcal{L}*{MOA}
]

---

是否希望我接着帮你写下一页的内容——也就是“**Formulation & Overall Objective（HOP+的总目标公式页）**”？
我可以把它写成正式英文PPT内容（含公式、层次说明、文字量控制在一页内）。






# Methodology

推理目标的cave的函数

决策函数

训练loss





# Results

self-play rewards



adaptation against 3 rule-based agents


moa，world model ？ $\Longrightarrow$ no ， simply supervisor learning


cave+moa $\Longrightarrow$ maybe ，因为展现的是cvae+moa的表现，融合了goal的动作推理






# Limitations
# Future Work
# FootNotes