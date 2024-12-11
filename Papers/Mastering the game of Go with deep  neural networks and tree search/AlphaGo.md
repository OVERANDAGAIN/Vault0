#paper_summary 

# Inspiration



# Innovation



# Background
All games of perfect information have an optimal value function, $v^{*}(s)$, which determines the outcome of the game, from every board position or state s, under perfect play by all players.


# Related Work



# Theroy
Effective search space can be reduced by:
1. depth of search $\Longrightarrow$ position evaluation; replacing the subtree below $s$   by an approximate value function $v(s) ≈ v^{*}(s)$ 
2. breadth of the search $\Longrightarrow$  sampling actions from a policy $p(a|s)$ that is a probability distribution over possible moves $a$ in position $s$.


# Methodology
- use convolutional layers to construct a representation of the position
- neural networks to reduce the effective depth and breadth of the search tree
- evaluating positions using a value network
- sampling actions using a policy network
$\Longleftrightarrow$
- (SL) policy network $p_{\sigma}$ directly from expert human moves
- fast policy $p_{\pi}$that can rapidly sample actions during rollouts
- (RL) policy network $p_{\rho}$ that improves the SL policy network by optimizing the final outcome of games of selfplay.
- a value network $v_{\theta}$ that predicts the winner of games played by the RL policy network against itself.

## Supervised learning of policy networks
The SL policy network alternates between convolutional layers with weights σ, and rectifier nonlinearities.

A final softmax layer outputs a probability distribution over all legal moves a.

sampled state-action pairs (s, a), using stochastic gradient ascent to maximize the likelihood of the human move a selected in state s

a faster but less accurate rollout policy pπ(a|s), using a linear softmax of small pattern features (see Extended Data Table 4) with weights π;

## Reinforcement learning of policy networks
The RL policy network pρ is identical in structure to the SL policy network,
its weights ρ are initialized to the same values, ρ = σ.
Randomizing from a pool of opponents in this way stabilizes training by preventing overfitting to the current policy.
## Reinforcement learning of value networks
This neural network has a similar architecture to the policy network, but outputs a single prediction instead of a probability distribution.
## Searching with policy and value networks
(s, a) of the search tree stores an action value Q(s, a), visit count N(s, a), and prior probability P(s, a).


### **1. 树中存储的信息**
在每个状态-动作对 $(s, a)$ 中，MCTS 存储了以下信息：
- **Q值 $Q(s, a)$**：动作 $a$ 在状态 $s$ 的平均价值评估。
- **访问次数 $N(s, a)$**：动作 $a$ 在状态 $s$ 被访问的次数。
- **先验概率 $P(s, a)$**：动作 $a$ 在状态 $s$ 的初始选择概率，来自策略网络 $p_\sigma(a|s)$。


### **2. 动作选择公式**
在每次模拟中，从当前状态 $s_t$ 选择动作 $a_t$ 的规则：
$$a_t = \arg\max_a \left( Q(s_t, a) + u(s_t, a) \right)$$
其中：
- **$Q(s_t, a)$**：当前估计的动作值。
- **$u(s_t, a)$**：基于先验概率和访问次数的探索奖励，用于平衡探索与利用。
$$u(s_t, a) \propto \frac{P(s_t, a)}{1 + N(s_t, a)}$$
  - **$P(s_t, a)$**：初始策略中动作 $a$ 的概率。
  - **$1 + N(s_t, a)$**：随着访问次数 $N(s_t, a)$ 的增加，探索奖励逐渐减少。


### **3. 叶子节点的评估**
当树搜索到达叶子节点 $s_L$ 时，进行两种评估：
1. **值网络评估 $v_\theta(s_L)$**：利用神经网络直接预测该状态的价值。
2. **回合模拟 $z_L$**：从叶子节点开始基于快速 rollout 策略 $p_\pi$ 模拟到终止状态，计算折扣回报。

两种评估结果通过混合参数 $\lambda$ 结合为叶子节点的最终评估值：
$$V(s_L) = (1 - \lambda)v_\theta(s_L) + \lambda z_L$$

### **4. 访问次数和 Q值的更新**
每次模拟结束后，所有经过的边（状态-动作对 $(s, a)$）会被更新：
1. **访问次数更新 $N(s, a)$**：
$$N(s, a) = \sum_{i=1}^n 1(s, a, i)$$
其中 $1(s, a, i)$ 表示在第 $i$ 次模拟中，是否访问了边 $(s, a)$。

2. **Q值更新 $Q(s, a)$**：
$$Q(s, a) = \frac{1}{N(s, a)} \sum_{i=1}^n 1(s, a, i)V(s_L^i)$$
- $V(s_L^i)$ 是第 $i$ 次模拟的叶子节点评估值。
- $Q(s, a)$ 是 $(s, a)$ 的所有模拟中叶子节点价值的平均值。


# Evaluation



# Results



# Limitations