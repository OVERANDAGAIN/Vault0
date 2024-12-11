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

![[Pasted image 20241211165021.png]]
### **3. 叶子节点的评估**
当树搜索到达叶子节点 $s_L$ 时，进行两种评估：
1. **值网络评估 $v_\theta(s_L)$**：利用神经网络直接预测该状态的价值。
2. **回合模拟 $z_L$**：从叶子节点开始基于快速 rollout 策略 $p_\pi$ 模拟到终止状态，计算折扣回报。

两种评估结果通过混合参数 $\lambda$ 结合为叶子节点的最终评估值：
$$V(s_L) = (1 - \lambda)v_\theta(s_L) + \lambda z_L$$
![[Pasted image 20241211165032.png]]
### **4. 访问次数和 Q值的更新**
每次模拟结束后，所有经过的边（状态-动作对 $(s, a)$）会被更新：
1. **访问次数更新 $N(s, a)$**：
$$N(s, a) = \sum_{i=1}^n 1(s, a, i)$$
其中 $1(s, a, i)$ 表示在第 $i$ 次模拟中，是否访问了边 $(s, a)$。

2. **Q值更新 $Q(s, a)$**：
$$Q(s, a) = \frac{1}{N(s, a)} \sum_{i=1}^n 1(s, a, i)V(s_L^i)$$
- $V(s_L^i)$ 是第 $i$ 次模拟的叶子节点评估值。
- $Q(s, a)$ 是 $(s, a)$ 的所有模拟中叶子节点价值的平均值。

这段描述讲的是 **MCTS（蒙特卡洛树搜索）中的回传（Backup）操作**，用于在模拟结束后，将结果向上回传更新搜索树中状态-动作对的统计值。这是 MCTS 的核心步骤之一，以下是详细解析：

---

### **1. 回传（Backup）的作用**
- **核心目标**：从叶子节点（模拟结束位置）将模拟结果逐步回传到根节点，更新每个路径上的节点统计值。
- **涉及的参数**：每个状态-动作对 $(s_t, a_t)$ 的以下统计值：
  - **$N_{v}(s_t, a_t)$**：访问次数（主线程统计）。
  - **$N_r(s_t, a_t)$**：rollout 的访问次数（rollout 线程统计）。
  - **$W_{v}(s_t, a_t)$**：累计价值（主线程）。
  - **$W_r(s_t, a_t)$**：rollout 的累计价值。
  - **$Q(s, a)$**：动作的平均值，最终通过 $W$ 和 $N$ 计算。

---

### **2. 回传过程**
回传分为两部分：**虚拟损失更新**和**最终结果更新**。

#### **(1) 虚拟损失更新**
- 在模拟进行中，虚拟损失（Virtual Loss）用于避免多个线程重复探索同一条路径。
- 每次模拟中，更新以下值：
  $$N_r(s_t, a_t) \gets N_r(s_t, a_t) + n_{vl}$$
  $$W_r(s_t, a_t) \gets W_r(s_t, a_t) - n_{vl}$$
  - **$n_{vl}$** 是虚拟损失的权重，表示该路径的损失。
  - **目的**：临时降低该路径的权重，鼓励其他线程探索不同的路径。

---

#### **(2) 最终结果更新**
- 模拟结束后，从叶子节点返回实际的奖励 $z_t$，回传更新以下统计值：
  - **访问次数**（rollout 和主线程）：
    $$N_r(s_t, a_t) \gets N_r(s_t, a_t) - n_{vl} + 1$$
    $$N(s_t, a_t) \gets N(s_t, a_t) + 1$$
  - **累计价值**（rollout 和主线程）：
    $$W_r(s_t, a_t) \gets W_r(s_t, a_t) + n_{vl} + z_t$$
    $$W(s_t, a_t) \gets W(s_t, a_t) + v_\theta(s_L)$$
  - $z_t$ 是通过 rollout 策略计算的最终折扣回报。
  - $v_\theta(s_L)$ 是值网络对叶子节点状态的评估值。

---

### **3. 动作价值更新**
最终，每个状态-动作对的动作值 $Q(s, a)$ 是基于主线程和 rollout 的统计值，按权重参数 $\lambda$ 的加权平均：
$$Q(s, a) = (1 - \lambda) \frac{W(s, a)}{N(s, a)} + \lambda \frac{W_r(s, a)}{N_r(s, a)}$$
- **第一部分**：由主线程的累计价值和访问次数计算，权重为 $1 - \lambda$。
- **第二部分**：由 rollout 累计价值和访问次数计算，权重为 $\lambda$。

这种加权方式融合了值网络的全局评估和 rollout 的模拟结果，从而提供更准确的估计。



# Evaluation
Even without rollouts AlphaGo exceeded the performance of all other Go programs, demonstrating that value networks provide a viable alternative to Monte Carlo evaluation in Go.


# Results



# Limitations