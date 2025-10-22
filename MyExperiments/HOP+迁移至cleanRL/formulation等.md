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



# eg


---

### **2.2 Opponent Modeling Formulation**

在 HOP+ 中，核心创新是引入了一个 **隐变量 $z_t$** 表征对手的潜在行为模式。
我们使用一个 **变分自编码器（VAE）** 来捕获这种潜在结构：

* 编码器：$q_\phi(z_t|s_t, a_t)$
* 先验分布：$p(z_t) = \mathcal{N}(0,I)$
* 解码器/策略：$\pi_\theta(a_t|s_t, z_t)$

VAE 优化目标：
$$
\mathcal{L}*{\text{VAE}} =
\mathbb{E}*{q_\phi(z_t|s_t,a_t)}[-\log p_\theta(a_t|s_t,z_t)]

* D_{\text{KL}}(q_\phi(z_t|s_t,a_t) \Vert p(z_t))
  $$

这样，$z_t$ 就成为一个可学习的对手特征嵌入，用于增强策略网络的感知能力。

---

### **2.3 Policy Learning Formulation**

在策略层面，HOP+ 仍然是基于强化学习（如 PPO）的优化：
$$
\mathcal{L}*{\text{policy}} =
\mathbb{E}*{t}\left[
-\log \pi_\theta(a_t|s_t, z_t) A_t

* \beta D_{\text{KL}}(\pi_\theta(\cdot|s_t,z_t)\Vert \pi_{\theta_{\text{old}}}(\cdot|s_t,z_t))
  \right]
  $$

其中 $A_t$ 为优势函数，$\beta$ 为 KL 正则系数。

---

### **2.4 MOA Formulation（Model-of-Agents）**

HOP+ 的另一个核心部分是 **MOA（对手行为预测模块）**。
它的目标是从历史轨迹中预测对手的未来动作：

$$
\mathcal{L}*{\text{MOA}} =
\mathbb{E}*{(s_t, a_t^{-i})\sim D}
\left[-\log p_\psi(a_t^{-i}|s_t, z_t)\right]
$$

这一项鼓励模型在潜空间中学到“对手如何决策”的可预测结构。

---

### **2.5 Joint Optimization Objective**

最终，HOP+ 的整体优化目标为：

$$
\min_{\theta, \phi, \psi}
\mathcal{L}*{\text{total}} =
\mathcal{L}*{\text{policy}}

* \alpha \mathcal{L}_{\text{VAE}}
* \beta \mathcal{L}_{\text{MOA}}
  $$

其中：

* $\mathcal{L}_{\text{policy}}$ —— 主策略更新项
* $\mathcal{L}_{\text{VAE}}$ —— 对手行为嵌入学习项
* $\mathcal{L}_{\text{MOA}}$ —— 对手动作预测项
* $\alpha, \beta$ 为权重系数（通常通过实验调节）



# Setup






# Methodology
# Issues & Debugging









# Limitations
# Future Work
# FootNotes