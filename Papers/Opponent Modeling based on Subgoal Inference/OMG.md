---
创建时间: 2024-十二月-30日  星期一, 3:15:27 下午
---
#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us





# Focus
1. we propose ==opponent modeling== based on ==subgoal inference== using ==variational inference==, which infers the opponent’s subgoals through historical trajectories
2. design ==two  subgoal selection modes== for ==cooperative== games and ==general-sum== games respectively.


# Innovation



# Theroy
As subgoals are likely to be shared by different opponent policies, predicting subgoals can yield better generalization to unknown opponents.



# Background
1. Opponent modeling plays a crucial role in enhancing the robustness and stability of reinforcement learning


# Related Work
1. Variational auto-encoders can also be used to model the opponent’s policy
2. 



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

# Evaluation
1. In this paper, we consider the most common setting where ==opponents have unseen, diverse, but fixed policies== during test.
2. The historical trajectory is ==available==
3. For convenience, the learning agent treats all other agents as ==a joint opponen==t with the joint action and reward.
4. ==Subgoals== represent feature ==embeddings of future states== that the opponent aims to achieve
5. 

# Results



# Limitations


# FootNotes
