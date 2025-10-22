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