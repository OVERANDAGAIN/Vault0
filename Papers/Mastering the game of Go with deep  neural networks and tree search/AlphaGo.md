---
created: 2024-12-18T20:35
updated: 2024-12-18T20
---
#paper_summary 

# Inspiration



1. 减少搜索空间的两层：
   - 深度：近似值函数
   - 广度：策略采样
2. PUCT算法，平衡先验概率+访问次数与动作价值 [[AlphaGo#^PUCT]]


### 时间线总结
| **网络类型**        | **更新时间**                   | **更新方式**                     | **目的**                            |
|---------------------|--------------------------------|----------------------------------|-------------------------------------|
| **策略网络（SL）**  | 训练之前（初期阶段）           | 监督学习，基于人类棋谱           | 模仿专家棋谱，获得基本策略能力       |
| **策略网络（RL）**  | 训练过程中（强化学习阶段）     | 强化学习，自我对弈优化           | 最大化胜率，超越人类策略            |
| **价值网络**        | 训练之前和训练过程中均有更新   | 初期监督学习 + 强化学习数据优化  | 提高对当前策略状态的准确评估         |
| **快速走子策略网络** | 通常仅在训练之前更新           | 监督学习，基于规则或人类棋谱     | 提供快速、简化的落子能力            |


### 2. **局限性**
#### (1) **对人类棋谱的依赖**
- 初期策略网络需要大量的专家棋谱进行训练，如果没有足够的数据，策略网络的基础能力会受到限制。
- 这种方式可能在早期阶段过于依赖人类智慧，限制了完全从零到超人的可能性。

#### (2) **自我对弈的计算资源需求**
- 强化学习阶段的自我对弈需要大量的计算资源，尤其是结合蒙特卡洛树搜索的情况下。
- 自我对弈产生的数据需要不断训练和更新策略网络与价值网络，计算开销非常大。

#### (3) **训练过程复杂**
- 多阶段的训练需要精心设计，每个阶段的目标、超参数调节都至关重要。
- 不同网络之间的协同优化可能导致训练难度增加，例如策略网络的改进可能导致价值网络需要重新调整。

#### (4) **局限于单一任务**
- 这种方式在围棋任务中表现出色，但由于它强依赖任务特定的特征（如围棋规则和胜负评估），很难直接迁移到其他任务。



#### **2. 数据与模型的协同优化**
- **启发**：
  - AlphaGo 强调数据质量的重要性，通过数据增强（对称性变换）和多样化生成（随机动作、自我对弈）避免过拟合。
  - 数据和模型的优化是协同进行的，数据的多样性直接提高了模型的泛化能力。

#### **3. 使用领域知识构建特征**
- **启发**：
  - AlphaGo 的输入特征设计直接嵌入了围棋的规则（如气、提子、合法性），并通过神经网络自动提取深层特征。
  - 这种将领域知识与深度学习相结合的方式，弥补了纯数据驱动模型的不足。



#### **4. 树搜索与深度学习的结合**
- **启发**：
  - AlphaGo 将深度学习与树搜索相结合，策略网络为 MCTS 提供先验概率，值网络提供局面评估，从而大幅提升了搜索效率。


#### **5. 解决稀疏奖励问题**
- **启发**：
  - AlphaGo 使用值网络和 MCTS 缓解了围棋奖励稀疏的问题，将长远回报分解为局部评估和快速反馈。




# Innovation



# Background
All games of perfect information have an optimal value function, $v^{*}(s)$, which determines the outcome of the game, from every board position or state s, under perfect play by all players.


# Related Work



# Theroy
Effective search space can be reduced by:
1. depth of search $\Longrightarrow$ position evaluation; replacing the subtree below $s$  by an <font color="#ff0000">approximate value function</font> $v(s) ≈ v^{*}(s)$ 
2. breadth of the search $\Longrightarrow$  <font color="#ff0000">sampling actions</font> from a policy $p(a|s)$ that is a probability distribution over possible moves $a$ in position $s$.


# Methodology
- use convolutional layers to construct a representation of the position
- neural networks to reduce the effective depth and breadth of the search tree
- evaluating positions using a value network
- sampling actions using a policy network
$\Longleftrightarrow$
- (SL) policy network $p_{\sigma}$ directly from expert human moves
- fast policy $p_{\pi}$ that can rapidly sample actions during rollouts
- (RL) policy network $p_{\rho}$ that improves the SL policy network by optimizing the final outcome of games of selfplay.
- a value network $v_{\theta}$ that predicts the winner of games played by the RL policy network against itself.

## Supervised learning of policy networks
The SL policy network alternates between convolutional layers with weights σ, and rectifier nonlinearities.

A final softmax layer outputs a probability distribution over all legal moves a.

sampled state-action pairs $(s, a)$, using stochastic gradient ascent to maximize the likelihood of the human move $a$ selected in state $s$

a faster but less accurate rollout policy $p_π(a|s)$, using a linear softmax of small pattern features (see Extended Data Table 4) with weights $π$

## Reinforcement learning of policy networks
The RL policy network $p_ρ$ is identical in structure to the SL policy network,
its weights $ρ$ are initialized to the same values, $ρ = σ$.
Randomizing from a pool of opponents in this way stabilizes training by preventing overfitting to the current policy.

## Reinforcement learning of value networks
This neural network has a similar architecture to the policy network, but outputs a single prediction instead of a probability distribution.
## Searching with policy and value networks
$(s, a)$ of the search tree stores an action value $Q(s, a)$, visit count $N(s, a)$, and prior probability $P(s, a)$.


### **1. 树中存储的信息**
在每个状态-动作对 $(s, a)$ 中，MCTS 存储了以下信息：
- **Q值 $Q(s, a)$**：动作 $a$ 在状态 $s$ 的平均价值评估。
- **访问次数 $N(s, a)$**：动作 $a$ 在状态 $s$ 被访问的次数。
- **先验概率 $P(s, a)$**：动作 $a$ 在状态 $s$ 的初始选择概率，来自策略网络 $p_\sigma(a|s)$。


### **2. 动作选择公式**
在每次模拟中，从当前状态 $s_t$ 选择动作 $a_t$ 的规则：
$$a_t = \arg\max_a \left( Q(s_t, a) + u(s_t, a) \right)$$
其中： ^PUCT
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


#### **A. 回传（Backup）的作用**
- **核心目标**：从叶子节点（模拟结束位置）将模拟结果逐步回传到根节点，更新每个路径上的节点统计值。
- **涉及的参数**：每个状态-动作对 $(s_t, a_t)$ 的以下统计值：
  - **$N_{v}(s_t, a_t)$**：访问次数（主线程统计）。
  - **$N_r(s_t, a_t)$**：rollout 的访问次数（rollout 线程统计）。
  - **$W_{v}(s_t, a_t)$**：累计价值（主线程）。
  - **$W_r(s_t, a_t)$**：rollout 的累计价值。
  - **$Q(s, a)$**：动作的平均值，最终通过 $W$ 和 $N$ 计算。


#### **B. 回传过程**
回传分为两部分：**虚拟损失更新**和**最终结果更新**。

##### **(1) 虚拟损失更新**
- 在模拟进行中，虚拟损失（Virtual Loss）用于避免多个线程重复探索同一条路径。
- 每次模拟中，更新以下值：
  $$N_r(s_t, a_t) \gets N_r(s_t, a_t) + n_{vl}$$
  $$W_r(s_t, a_t) \gets W_r(s_t, a_t) - n_{vl}$$
  - **$n_{vl}$** 是虚拟损失的权重，表示该路径的损失。
  - **目的**：临时降低该路径的权重，鼓励其他线程探索不同的路径。


##### **(2) 最终结果更新**
- 模拟结束后，从叶子节点返回实际的奖励 $z_t$，回传更新以下统计值：
  - **访问次数**（rollout 和主线程）：
    $$N_r(s_t, a_t) \gets N_r(s_t, a_t) - n_{vl} + 1$$
    $$N_{v}(s_t, a_t) \gets N_{v}(s_t, a_t) + 1$$
  - **累计价值**（rollout 和主线程）：
    $$W_r(s_t, a_t) \gets W_r(s_t, a_t) + n_{vl} + z_t$$
    $$W_{v}(s_t, a_t) \gets W_{v}(s_t, a_t) + v_\theta(s_L)$$
  - $z_t$ 是通过 rollout 策略计算的最终折扣回报。
	  - $v_\theta(s_L)$ 是值网络对叶子节点状态的评估值。

> [!tip] 虚拟损失更新与最终结果更新relationship：
> - 从最终结果的值来看：
> 	-$N_{v}$ 与 $W_{v}$ : 前者+1 ； 后者+$V_{\theta}$
> 	-$N_{r}$ 与 $W_{r}$ : 前者+1 ； 后者+$Z_{t}$ 
>- 从两者关系（与初始值相比）看：
> 	-$N_{r}$ 与 $W_{r}$ ：前者+$n_{vl}$ ; 后者-$n_{vl}$


#### **C. 动作价值更新**
最终，每个状态-动作对的动作值 $Q(s, a)$ 是基于主线程和 rollout 的统计值，按权重参数 $\lambda$ 的加权平均：
$$Q(s, a) = (1 - \lambda) \frac{W_{v}(s, a)}{N_{v}(s, a)} + \lambda \frac{W_r(s, a)}{N_r(s, a)}$$
- **第一部分**：由主线程的累计价值和访问次数计算，权重为 $1 - \lambda$。
- **第二部分**：由 rollout 累计价值和访问次数计算，权重为 $\lambda$。

这种加权方式融合了值网络的全局评估和 rollout 的模拟结果，从而提供更准确的估计。
![[Pasted image 20241211171349.png]]

###  **5. Expansion（扩展阶段）解析**

在蒙特卡洛树搜索（MCTS）中，**扩展阶段（Expansion）** 是指在搜索树中为未访问过的状态添加新节点，以便进一步探索。这段描述了扩展阶段的具体操作和参数的关系。以下是详细解析：


#### **A. 触发扩展的条件**
扩展发生的条件是：
$$N_r(s, a) > n_{thr}$$
- **$N_r(s, a)$**：动作 $a$ 在状态 $s$ 下的访问次数（rollout 线程统计）。
- **$n_{thr}$**：扩展阈值。如果某个动作被访问的次数超过阈值，则触发扩展。

#### **目的**：
- 确保只有经过足够探索的动作才会扩展对应的后续状态 $s' = f(s, a)$。
- 避免因过早扩展而浪费计算资源。


#### **B. 扩展新节点的初始化**
扩展一个新节点 $s'$ 后，该节点会被初始化为以下默认值：
- **访问次数**：
  $$N(s', a) = N_r(s', a) = 0$$
  表示新节点刚被添加，还未进行探索。

- **累计价值**：
  $$W(s', a) = W_r(s', a) = 0$$
  累计价值初始化为 0。

- **先验概率**：
  $$P(s', a) = p_\sigma(a | s')$$
  使用基于策略网络的树策略 $p_\tau(a | s')$ 初始化先验概率。树策略 $p_\tau$ 类似于 rollout 策略，但具有更高的表达能力。


#### **C. 节点添加和 GPU 计算队列**
- **节点添加**：将 $s'$ 添加到搜索树中，以便在后续模拟中探索。
- **GPU 队列**：同时将 $s'$ 添加到一个队列，供策略网络（SL policy network）进行异步计算，计算动作的先验概率 $p_\sigma^\beta(a | s')$。

#### **先验概率的计算和更新**：
1. 初始扩展时，先使用一个占位符概率 $P(s', a)$，由树策略 $p_\tau$ 提供。
2. 后续由策略网络计算更准确的概率分布：
   $$P(s', a) \gets p_\sigma^\beta(a | s')$$
   - $p_\sigma^\beta$：由策略网络生成，使用 softmax 温度参数 $\beta$ 调整动作概率的分布平滑度。


#### **D. 节点扩展的动态调整**
- **阈值 $n_{thr}$**：扩展阈值动态调整，以确保节点扩展的速率与 GPU 的计算能力匹配。
- **小批量评估**：对扩展的节点 $s'$ 进行策略网络和值网络的评估，采用 mini-batch 的大小为 1，优化端到端评估时间。

---

![[Pasted image 20241212141514.png]]


> [!NOTE] Changes
> - Expansion已被AlphaGo Zero抛弃


### **6.rollout policy（回合模拟策略）的设计与作用**


#### **A Rollout Policy 的定义**
- **$p_\pi(a | s)$** 是基于局部模式的线性 softmax 策略：
  - 它快速、增量计算，主要利用**局部特征**来评估候选动作 $a$ 在状态 $s$ 下的优先级。
  - 特征分为两类：
    - **响应模式（response patterns）**：与前一步导致当前状态的动作有关的局部模式。
    - **非响应模式（non-response patterns）**：围绕当前候选动作 $a$ 的局部模式。
#### **B. 特征设计**
##### **(1) 非响应模式**
- **局部 3×3 格子模式**：
  - 以候选动作 $a$ 为中心的 3×3 棋盘格子，特征包括：
    - 颜色：黑色、白色或空。
    - **Liberty count**（气的数量）：1、2 或 ≥3。

##### **(2) 响应模式**
- **12 点菱形模式**：
  - 基于上一步动作的颜色和气的数量，匹配一个特定的 12 点菱形区域特征。
  - 用二元特征表示是否满足特定模式。

##### **(3) 手工规则**
- 添加了一些通用围棋规则的手工特征，例如：
  - 合法性检查。
  - 常识性策略（如围空、逃跑）。


### **7. 解析：Symmetries（对称性）的处理**

#### **A. 对称性在围棋中的特性**
围棋的棋盘具有以下对称性：
- 旋转对称性（90°, 180°, 270°）。
- 镜像对称性（水平翻转、垂直翻转和对角线翻转）。

这些对称性构成了一个 8 元二面体群（dihedral group），记为 $\{d_1(s), d_2(s), \dots, d_8(s)\}$，表示状态 $s$ 在不同变换下的等效位置。

##### **之前方法的局限性**
在早期方法中，通常在神经网络的卷积层中使用对称性不变的滤波器来编码这些对称性：
- 优点：在小网络中效果较好。
- 缺点：在大型网络中，这种对称性不变性会阻碍卷积滤波器学习到不对称的局部模式，从而影响性能。



#### **B. 本文方法：动态利用对称性**
##### **(1) 动态对称性变换**
- 在运行时，对状态 $s$ 进行所有可能的 8 种对称变换，得到 $d_1(s), \dots, d_8(s)$。
- 将这些变换后的状态分别传入**策略网络**和**值网络**进行并行评估。

##### **(2) 值网络的输出**
对于值网络的评估，将 8 个对称变换的输出直接平均：
$$\bar{v}_\theta(s) = \frac{1}{8} \sum_{j=1}^8 v_\theta(d_j(s))$$
- 这种方法利用对称性减少了单一评估的偏差。

##### **(3) 策略网络的输出**
对于策略网络的评估，需要对输出概率平面进行逆变换回原始坐标，再平均：
$$\bar{p}_\theta(a|s) = \frac{1}{8} \sum_{j=1}^8 d_j^{-1} \big(p_\theta(\cdot|d_j(s))\big)$$
- 通过逆变换 $d_j^{-1}$，确保所有输出概率都映射回原始状态 $s$ 的动作空间。



#### **C. 简化策略：隐式对称性集合**
由于显式计算所有 8 种对称性会消耗较多计算资源，本文方法引入了一种**隐式对称性集合**的策略：
- 在每次评估时，随机选择一个对称变换 $j \in \{1, 2, \dots, 8\}$ 对状态 $s$ 进行评估，而不是同时计算 8 个变换。
- **值网络评估**：对叶子节点 $s_L$，仅计算随机选择的一个变换 $v_\theta(d_j(s_L))$。
- **策略网络评估**：同样对策略网络，仅计算一个变换：
  $$d_j^{-1} \big(p_\theta(\cdot | d_j(s))\big)$$

##### **好处**
- 减少了计算开销。
- 在多次模拟中，通过不同模拟的随机选择，依然能实现对对称性集的整体平均效果。



#### **D. 参数和公式间的关系**
##### **对称性处理相关的参数**
- **$d_j(s)$**：状态 $s$ 的第 $j$ 个对称变换。
- **$d_j^{-1}$**：将策略网络输出从变换状态映射回原始状态的逆变换。
- **$v_\theta$**：值网络的输出，表示状态的价值评估。
- **$p_\theta$**：策略网络的输出，表示动作的概率分布。

##### **公式关系**
1. **值网络的平均输出**：
   $$\bar{v}_\theta(s) = \frac{1}{8} \sum_{j=1}^8 v_\theta(d_j(s))$$
2. **策略网络的平均输出**：
   $$\bar{p}_\theta(a|s) = \frac{1}{8} \sum_{j=1}^8 d_j^{-1} \big(p_\theta(\cdot | d_j(s))\big)$$
3. **简化策略**：在每次评估中，仅计算一个随机选择的变换。

### 8. Policy Network: Classification

这段内容描述了策略网络（Policy Network）的训练过程，目的是通过分类任务模拟围棋专家的动作选择能力。以下是分步骤解析：

#### 数据集说明
- **数据来源**：使用 KGS 数据集（KGS 6 到 9 段人类玩家对局）。
- **数据规模**：
  - 包含 **29.4 百万局面**，来源于 16 万局游戏。
  - 其中 **35.4% 的对局是让子棋**。
- **数据分割**：
  - 测试集：100 万局面。
  - 训练集：其余 28.4 百万局面。
- **预处理**：
  - 排除了 “过棋”（pass move）的数据。
  - 每个局面由原始棋盘描述 $s$ 和人类玩家选择的动作 $a$ 构成。
- **对称性增强**：
  - 对每个局面进行 **8 种对称性变换**（旋转与镜像），从而扩充训练数据。

#### 数据特征
- 每个局面 $s$ 的输入特征经过预计算，确保训练效率。
- 增强后的数据通过对称性处理，保留了围棋棋盘的几何特性，减少了模型对特定棋盘配置的偏差。

#### 训练方法
1. **Mini-Batch 随机梯度下降**
   - 从增强的 KGS 数据集中随机采样一个 mini-batch $\{s^k, a^k\}_{k=1}^m$。
   - Mini-batch 大小为 $m = 16$。
2. **异步更新**
   - 使用异步随机梯度下降（Asynchronous Stochastic Gradient Descent, ASGD）。
   - 梯度更新公式：
     $$\Delta \sigma = \frac{\alpha}{m} \sum_{k=1}^m \frac{\partial \log p_\sigma(a^k | s^k)}{\partial \sigma}$$
     - $\alpha$：学习率，初始值为 0.003，每 80 百万次训练步骤减半。
     - 优化目标是最大化动作的对数似然。
    

> [!tip] Difference between SL and RL 
> [[ASGD]]

1. **训练设置**
   - 梯度丢弃：如果梯度小于 100 次更新，则丢弃。
   - 分布式训练：
     - 使用 50 个 GPU，并行进行梯度计算。
     - 利用 **DistBelief 框架** 实现高效的分布式更新。


### 9. Policy Network: Reinforcement Learning

这段描述了通过策略梯度强化学习对策略网络（Policy Network）的进一步优化，旨在让网络通过自我对弈提升策略质量。

#### 强化学习训练流程
1. **游戏模拟**
   - 每次训练迭代包含一个 mini-batch，其中有 $n$ 个并行进行的对局。
   - 对战双方：
     - **当前策略网络** $p_\rho$：正在训练的网络参数为 $\rho$。
     - **对手策略网络** $p_{\rho'}$：从先前迭代中随机采样，参数为 $\rho'$，以提升训练的稳定性。
   - 每 500 次迭代，将当前参数 $\rho$ 添加到对手池 $p_{\rho'}$ 中。

2. **游戏终止和得分计算**
   - 每局对局从初始状态开始，直到终止（终止时间为 $T^i$）。
   - 从每位玩家的视角计算每步的奖励 $z_t^i$：
     $$z_t^i = \pm r(s_{T^i})$$
     - $+r(s_{T^i})$：当前玩家的视角下获得的正奖励。
     - $-r(s_{T^i})$：对手的视角下获得的负奖励。

#### 策略梯度更新
策略梯度更新使用 **REINFORCE 算法**，其目标是最大化累积回报。更新公式为：
$$\Delta \rho = \frac{\alpha}{n} \sum_{i=1}^n \sum_{t=1}^{T^i} \frac{\partial \log p_\rho(a_t^i | s_t^i)}{\partial \rho} \big(z_t^i - v(s_t^i)\big)$$
- **梯度更新细节**：
  - $\alpha$：学习率。
  - $p_\rho(a_t^i | s_t^i)$：策略网络预测的动作概率。
  - $z_t^i$：从奖励函数获得的实际回报。
  - $v(s_t^i)$：值函数基线，用于降低方差。
- **基线的作用**：
  - 在训练的第一轮，基线设置为 0。
  - 在第二轮及之后，使用值网络 $v_\theta(s)$ 作为基线，提高性能。

#### 训练设置
- Mini-batch 大小为 **128 局对弈**。
- 使用 **50 个 GPU** 进行异步并行训练。
- 总计训练 **10,000 个 mini-batches**，耗时约一天。



### 10. Value Network: Regression

这段描述了值网络 $v_\theta(s)$ 的训练过程，其目的是逼近强化学习策略网络 $v^{p_\rho}(s)$ 的值函数，用于评估给定状态的预期回报。

#### 数据集构造
1. **数据来源**
   - 使用**自我对弈**生成超过 3000 万个局面，每个局面来自不同的自我对弈游戏，确保数据集样本间独立性，避免对局内状态的强相关性造成过拟合。
2. **生成过程**
   - 每局游戏分三阶段生成：
     1. **随机采样起始时刻**：
        - 从对局中随机选择一个时间步 $U \sim \text{unif}(1, 450)$。
     2. **第一阶段：SL 策略网络生成前 $U-1$ 步**：
        - 使用 SL 策略网络 $a_t \sim p_\sigma(\cdot | s_t)$ 选择动作。
     3. **第二阶段：随机生成一步动作**：
        - 在可用动作中随机选择一个动作 $a_U \sim \text{unif}(1, 361)$。
     4. **第三阶段：RL 策略网络完成游戏**：
        - 使用 RL 策略网络 $a_t \sim p_\rho(\cdot | s_t)$ 选择后续动作，直至游戏终止。
   - 最终记录：
     $$z_t = \pm r(s_T)$$
     - $r(s_T)$：游戏结束时的奖励，正负号由玩家视角决定。

3. **采样数据点**
   - 每局游戏从中采样一个训练样本 $(s_{U+1}, z_{U+1})$。
   - 提供值函数的无偏估计：
     $$v^{p_\rho}(s_{U+1}) = \mathbb{E}[z_{U+1} | s_{U+1}, a_{U+1}, \dots, T \sim p_\rho]$$

#### 训练方法
1. **损失函数**
   - 使用均方误差（MSE）损失函数来最小化预测值和观察回报之间的误差：
     $$\Delta \theta = \frac{\alpha}{m} \sum_{k=1}^m (z^k - v_\theta(s^k)) \frac{\partial v_\theta(s^k)}{\partial \theta}$$
     - $\alpha$：学习率。
     - $z^k$：观察到的奖励。
     - $v_\theta(s^k)$：值网络预测的状态价值。

2. **数据多样性**
   - 前两阶段采样的策略引入更多的噪声分布，提高训练数据的多样性，避免模型过拟合。
   - 值网络的训练方法与 SL 策略网络相同，唯一不同是基于观察回报进行参数更新。

3. **训练设置**
   - 每个 mini-batch 包含 32 个样本。
   - 使用 50 个 GPU 并行计算。
   - 总训练 50 百万次 mini-batches，耗时约一周。



### 11. Features for Policy/Value Network

这段内容描述了策略网络和值网络输入特征的构造方式，展示了围棋局面在网络输入中的表示方法。

#### 特征描述
1. **棋盘特征**
   - 每个棋盘局面 $s$ 被预处理为一个 **19×19 的特征平面集合**。
   - 这些特征直接来源于围棋规则的基本表示，用于描述棋盘上每个交点的状态。
   - 特征包括：
     - **棋子颜色（stone colour）**：
       - 表示当前交点的棋子属于玩家还是对手，而不是单纯的黑色或白色。
     - **气（liberties）**：
       - 表示棋子链的相邻空点数（气数），如 1 气、2 气，直到 $\geq 8$ 气。
     - **提子（captures）**：
       - 表示在当前局面下是否有棋子可以被提走。
     - **合法性（legality）**：
       - 表示当前交点是否为合法落子点。
     - **落子后的轮数（turns since stone was played）**：
       - 表示自从某个交点放置棋子以来已经过去的轮数。
     - **当前落子方颜色（for value network only）**：
       - 特定于值网络，记录当前执棋方的颜色。

2. **策略性特征**
   - 包含一个简单的战术特征，用于计算“打劫搜索”（ladder search）的结果。



#### 特征表示方式
1. **相对颜色**
   - 所有特征相对于当前执棋方的颜色计算：
     - 棋子颜色被表示为“玩家”或“对手”，而非“黑”或“白”。
2. **多平面表示**
   - 每个整数值特征被分解为多个 19×19 的二值平面（One-Hot Encoding）。
   - 例如：
     - 气数被表示为多个二值特征平面：1 气、2 气，直到 $\geq 8$ 气，每种气数有一个独立的平面。



#### 数据来源与参考
- 所有特征直接从棋盘的原始表示中计算，无需额外复杂的特征提取。
- 完整特征平面列表详见 Extended Data Table 2。


### 12.  Neural Network Architecture

这段描述了策略网络和值网络的神经网络架构，详细阐述了输入特征、卷积层设计以及输出结构。

#### 策略网络架构
1. **输入**
   - 输入为一个 $19 \times 19 \times 48$ 的图像堆栈，由 48 个特征平面构成。
2. **第一隐藏层**
   - 对输入进行零填充（zero padding），扩展到 $23 \times 23$ 图像。
   - 卷积操作：
     - 卷积核大小：$5 \times 5$。
     - 卷积核数量：$k$。
     - 步幅（stride）：1。
     - 激活函数：Rectifier 非线性函数（ReLU）。
3. **第 2 到第 12 隐藏层**
   - 对每一层的输入进行零填充，扩展到 $21 \times 21$ 图像。
   - 卷积操作：
     - 卷积核大小：$3 \times 3$。
     - 卷积核数量：$k$。
     - 步幅：1。
     - 激活函数：ReLU。
4. **输出层**
   - 卷积操作：
     - 卷积核大小：$1 \times 1$。
     - 卷积核数量：1。
     - 步幅：1。
   - 每个位置应用不同的偏置（bias）。
   - 应用 softmax 函数，生成每个位置的概率分布。

5. **参数设置**
   - AlphaGo 使用的策略网络中 $k = 192$。
   - 另外的实验中使用了 $k = 128$、$k = 256$、$k = 384$。



#### 值网络架构
1. **输入**
   - 输入为 $19 \times 19 \times 48$ 的图像堆栈，与策略网络类似。
   - 额外增加了一个二值特征平面，描述当前执棋方的颜色。
2. **隐藏层**
   - **第 2 到第 11 隐藏层**：
     - 与策略网络架构相同。
   - **第 12 层**：
     - 增加了一个卷积层，参数未详细描述。
   - **第 13 层**：
     - 卷积操作：
       - 卷积核大小：$1 \times 1$。
       - 卷积核数量：1。
       - 步幅：1。
   - **第 14 层**：
     - 全连接层：
       - 输出为 256 个 rectifier 单元（ReLU 激活）。
3. **输出层**
   - 全连接层：
     - 输出单元为 1。
     - 激活函数：tanh 函数，输出值在 (-1, 1) 范围内，表示状态的价值。



# Evaluation
Even without rollouts AlphaGo exceeded the performance of all other Go programs, demonstrating that value networks provide a viable alternative to Monte Carlo evaluation in Go.

# Overview
### AlphaGo 的训练过程总结

AlphaGo 的训练过程结合了监督学习、自我对弈强化学习以及蒙特卡洛树搜索（MCTS）的改进，以下是从头开始的完整步骤，包括每一步的内容、目标和方法。



#### 1. 数据准备
- **目标**：利用人类专家对局数据训练初始的策略网络，模仿人类的动作选择。
- **方法**：
  1. 收集大规模人类对局数据集（如 KGS 数据集）。
     - 包含 29.4 百万局面，来自 160,000 场 KGS 6 到 9 段人类玩家的对局。
  2. 数据预处理：
     - 排除“过棋”（pass moves）。
     - 使用 **8 种对称性变换**（旋转和镜像）扩展局面。
  3. 输入特征：
     - 棋子颜色、气数、合法性、打劫搜索结果等，共 $19 \times 19 \times 48$ 特征平面。



#### 2. 策略网络的监督学习（SL）
- **目标**：模仿人类动作选择，通过分类任务预测人类专家的落子。
- **方法**：
  1. 构建一个深度卷积神经网络作为策略网络 $p_\sigma(a|s)$。
  2. 优化目标：
     $$\max_\sigma \sum \log p_\sigma(a|s)$$
     - 使用交叉熵损失来最小化预测与实际落子的差异。
  3. 训练细节：
     - 使用异步随机梯度下降（ASGD）。
     - Mini-batch 大小：16。
     - 数据增强后的训练集包含 28.4 百万局面。
     - 分布式训练：50 个 GPU，耗时约 3 周。



#### 3. 策略网络的强化学习（RL）
- **目标**：通过自我对弈优化策略，使其超越人类专家的水平。
- **方法**：
  1. 自我对弈：
     - 策略网络 $p_\rho$ 与历史对手网络 $p_{\rho'}$ 对弈，历史对手参数从先前迭代采样。
  2. 回报计算：
     - 对每步的奖励进行累计，以终局得分为回报：
       $$z_t^i = \pm r(s_T)$$
  3. 策略更新：
     - 使用 REINFORCE 策略梯度方法，优化目标为最大化期望累积回报：
       $$\Delta \rho = \frac{\alpha}{n} \sum_{i=1}^n \sum_{t=1}^{T^i} \frac{\partial \log p_\rho(a_t^i | s_t^i)}{\partial \rho} \big(z_t^i - v(s_t^i)\big)$$
       - 使用值网络 $v(s_t^i)$ 作为基线，减少梯度的方差。
  4. 训练设置：
     - Mini-batch 大小：128 个对局。
     - 使用 50 个 GPU 训练，耗时约 1 天。



#### 4. 值网络的回归训练
- **目标**：评估局面的价值函数 $v_\theta(s)$，辅助策略网络和 MCTS 提高搜索效率。
- **方法**：
  1. 自我对弈生成数据：
     - 使用 SL 策略生成初始动作。
     - 中间随机插入一个动作，增加多样性。
     - 剩余动作由强化学习策略网络完成。
  2. 值函数估计：
     - 每局只取一个样本 $(s, z)$，其中 $z$ 为游戏终局回报。
     - 值网络通过 MSE 最小化误差：
       $$\Delta \theta = \frac{\alpha}{m} \sum_{k=1}^m (z^k - v_\theta(s^k)) \frac{\partial v_\theta(s^k)}{\partial \theta}$$
  3. 训练细节：
     - 使用 50 个 GPU，训练 1 周。



#### 5. 蒙特卡洛树搜索（MCTS）
- **目标**：通过策略网络的先验概率和值网络的局面评估，改进搜索效率和决策质量。
- **方法**：
  1. 树搜索改进：
     - 使用策略网络的输出 $p_\sigma(a|s)$ 初始化动作的先验概率 $P(s, a)$。
     - 使用值网络的输出 $v_\theta(s)$ 作为叶子节点的价值估计。
  2. 动作选择：
     $$a_t = \arg\max_a \big(Q(s, a) + u(s, a)\big)$$
     - $Q(s, a)$：平均值。
     - $u(s, a)$：探索奖励，基于 $P(s, a)$ 和访问次数 $N(s, a)$。
  3. 扩展与回传：
     - 当访问次数 $N(s, a)$ 超过阈值时扩展节点。
     - 模拟结束后，更新经过路径上的 $Q(s, a)$ 和 $N(s, a)$。



#### 6. AlphaGo 的最终版本
- **训练流程整合**：
  1. 使用监督学习初始化策略网络。
  2. 强化学习进一步优化策略。
  3. 引入值网络，为 MCTS 提供价值评估。
  4. 改进的 MCTS 实现高效的搜索和决策。
- **对战性能**：
  - 通过自我对弈和 MCTS，AlphaGo 的策略和价值评估不断提升，最终击败职业围棋选手。




# Results



# Limitations