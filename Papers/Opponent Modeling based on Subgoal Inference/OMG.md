---
创建时间: 2024-十二月-30日  星期一, 3:15:27 下午
created: 2025-01-06T21:47
updated: 2025-02-10-17.
---
#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us


hindsight机制
subgoal obtain: 分别的还是整体的
POMDP or MDP

# Focus
1. we propose ==opponent modeling== based on ==subgoal inference== using ==variational inference==, which infers the opponent’s subgoals through historical trajectories
2. design ==two  subgoal selection modes== for ==cooperative== games and ==general-sum== games respectively.


# Innovation



# Theroy
As subgoals are likely to be shared by different opponent policies, predicting subgoals can yield better generalization to unknown opponents.


# Perspective

1. 关于self-interested agent 和 opponent modelinig 的联系：
  >When the objectives of a self-interested agent align with  those of the team, this scenario falls under ad-hoc teamwork [21, 8, 39]; however, in more general  cases, these interactions are framed as noncooperative games [34, 23, 45]. A key technique for  self-interested agents in such settings is opponent modeling[24, 3], which enables them to analyze  and predict the actions, goals, and beliefs of other agents

2. 关于Q函数的stationary和non-stationary比较
````ad-note
1. **Independent Q-learning (公式 2)：**
	   
If an agent treats other agents as part of the environment and ignores the non-stationarity posed by the change of other agents' policies as independent Q-learning [43, 44]. Its Q-function $Q(s_t, a_t)$ is updated by:

$$Q(s_t, a_t) = \mathbb{E}_{\mathcal{P}(s_{t+1} | s_t, a_t^{-i}, a_i)} \left[ r + \gamma \max_a Q(s_{t+1}, a) \right].$$

在这种情况下，智能体将其他智能体的策略变化视为环境的一部分，完全忽略了由此引起的非平稳性问题。

2. **Opponent Modeling (公式 3)：**

Opponent modeling typically predicts the actions of other agents to address the non-stationary problem. The opponent model uses historical trajectory as input to predict $\tilde{a}^{-i} \sim \pi(\cdot | \tau)$, where $\tilde{a}^{-i}$ is the estimate of $a^{-i}$. Then, its Q-function is updated as:

$$Q(s_t, \tilde{a}^{-i}, a_t) = \mathbb{E}_{\mathcal{P}(s_{t+1} | s_t, \tilde{a}^{-i}, a_t)} \left[ r + \gamma \max_a Q(s_{t+1}, a) \right].$$

在这种情况下，通过对历史轨迹进行建模，智能体能够预测其他智能体的行为策略（$\tilde{a}^{-i}$），从而解决非平稳性问题。

````




# Background
1. Opponent modeling plays a crucial role in enhancing the robustness and stability of reinforcement learning

  

# Related Work
1. Variational auto-encoders can also be used to model the opponent’s policy



# Methodology
![[Pasted image 20250103145958.png]]



**"Formally, we transform the original stochastic game $\mathcal{M}$ into a ==state-augmented MDP==, defined by $\mathcal{M}_G = (S, G, A^i, P, R^i, \gamma)$, where $G$ is the subgoal space. $G$ is a ==representation of future states the opponent may go==, $|G| \leq |S|.$"**

1. Policy Learning with Opponent’s Subgoals

 ````ad-note
"Therefore, the agent’s Q-function based on the opponent’s subgoal is updated as:

$$Q(s_t, g_t, a_t) = \mathbb{E}_{P(s_{t+1} | s_t, a_{-i}, a)} \left[ r + \gamma \max_a Q(s_{t+1}, g_t, a) \right].$$

**Here the pair $(s_{t+1}, g_t)$ is used instead of $(s_{t+1}, g_{t+1})$, as we assume that the next state of $(s_t, g_t)$ follows the same goal. In the framework of OMG, $g_t$ and $g_{t+1}$ will reach the same state at the end of the episode."**

````
 
2. Opponent modeling based on subgoal inference
   
	<span style="background:#affad1">subgoal inference model:</span>
--- 
```ad-note
Employ ==(CVAE)== as the subgoal inference model. 

==Subgoal posterior probability== as $q_\phi(\hat{g}_t|\tau_t, s_t)$ and the ==likelihood estimate== as $p_\theta(s_t|\hat{g}_t, \tau_t)$ with $\phi$ and $\theta$ respectively
	
The ==subgoal prior model==, denoted as $p_\psi(\hat{g}_t|s_t^g)$, is a pre-trained variational autoencoder (VAE)
	
$$\langle \hat{\theta}, \hat{\phi} \rangle = \arg\max_{\theta, \phi} \mathbb{E}_{q_\phi(\hat{g}_t|\tau_t, s_t)} \left[ \log p_\theta(s_t|\hat{g}_t, \tau_t) \right] - \text{KL} \left( q_\phi(\hat{g}_t|\tau_t, s_t) \parallel p_\psi(\hat{g}_t|s_t^g) \right).$$

```
---
	<span style="background:#affad1">subgoal selector</span>
	
two distinct manners for the subgoal selection:

- cooperative games:
$$\bar{g}_t = \arg \max_{s_i \in \mathcal{N}_t^H} \mathbb{E}_{g \sim p_\psi(\cdot | s_i)} V(s_t, g)$$
- general-sum games:
$$\bar{g}_t = \arg \min_{s_i \in \mathcal{N}_t^H} \mathbb{E}_{g \sim p_\psi(\cdot | s_i)} V(s_t, g)$$

 - choice of $H$ gives a trade-off between ==generalization to diverse opponents== and  ==learning difficulty==
	   
 - combination of the prior subgoal $\bar{g}$ and the inferred subgoal $\hat{g}$ as the input of Q-network,

$$g_t = \hat{g}_t \mathbb{I}(\eta > \epsilon) + \bar{g}_t \mathbb{I}(\eta \leq \epsilon), \quad \eta \sim U[0,1],$$

where $\epsilon$ is a hyperparameter that decreases to zero over training. 

<span style="background:#affad1">Pre-train the subgoal’s prior model. </span>
The subgoal’s prior model $p_{\psi}(g | s^g)$ is a VAE that learns from a set of states that are collected while training opponents. The optimization objective of VAE is :

$$\langle \hat{\omega}, \hat{\psi} \rangle = \arg \max_{\omega, \psi} \mathbb{E}_{g \sim q_{\psi}(g | s)} \left[ \log p_{\omega}(s | g) \right] - KL \left( q_{\psi}(g | s) \| \mathcal{N}(0, 1) \right).$$

The decoder $p_{\omega}(s | g)$ is also used to reconstruct the subgoal state, as discussed in Section 5.5.

# Ablation Study
**from: OMG_slides** 
Poster 地址: [NeurIPS Poster Opponent Modeling based on Subgoal Inference](https://neurips.cc/virtual/2024/poster/95566)[^1]
![[Pasted image 20250210174749.png]]

![[Pasted image 20250210174759.png]]



# Evaluation
1. In this paper, we consider the most common setting where ==opponents have unseen, diverse, but fixed policies== during test.
2. The historical trajectory is ==available==
3. For convenience, the learning agent treats all other agents as ==a joint opponen==t with the joint action and reward.
4. ==Subgoals== represent feature ==embeddings of future states== that the opponent aims to achieve


two environments (discrete and continuous  state spaces) and then test its generalization to opponents with unseen policies in a more complex  environment.
	three multi-agent environments:
1. Foraging
2. Predator-Prey
3. SMAC

OMG, OMG-optimistic and OMG-conservative;
Naive OM
LIAM
D3QN&PPO&IQL


# Results

## $a^{-i}$ 和 $g$ 的比较
即： 基于动作和goal的学习的区别：
the method using (s, g, a) naturally holds the advantage of ==faster learning== than the method.


## Ablation Study
OMG-supervised $\Longrightarrow$ the inference model uses an MLP instead of a CVAE

In the OMG, the subgoal is selected by choosing the state within the future H steps that either maximizes or minimizes the value function V (s, g). OMG-random, OMG-1s, OMG-3s

subgoal selection from  $\bar{g}$ to $\hat{g}$  , which should help avoid instability during the training of the subgoal inference model.

## inferred subgoal analysis
we plot the ratio of that an opponent’s future trajectory passes through the opponent’s subgoal state, termed subgoal hit ratio


# Limitations
The limitation of OMG is it cannot handle open multi-agent systems where agents may enter and leave during the interaction

# FootNotes

[^1]: OMG的poster地址NeurIPS