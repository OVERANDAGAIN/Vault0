---
创建时间: 2025-一月-2日  星期四, 4:20:16 下午
---
#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us





# Focus
Multi-Goal Transformers with Prompt Optimization

takes a goal sequence as a prompt and predicts actions in the following sequence of environment observations

we only optimize for the sequence of goals in the prompt

# Innovation
pre-training multi-goal Transformer
novel methods for optimizing goal sequences

# Theroy



# Background



# Related Work




# Methodology
![[Pasted image 20250106182701.png]]


### 3.1 Pre-Training Multi-Goal Transformers

Goal Sequence and Prompt Generation  
To abstract the long-term behavior of the agent, the paper uses a sequence of goals $g = (g_1, \dots, g_H)$ to describe key states in the trajectory. Specifically:
1. For a trajectory $\tau = (o_1, \dots, o_H)$, a goal sequence $g$ of the same length $H$ is constructed.
2. A sub-sequence $p = (g_{i_1}, \dots, g_{i_k}, g_H)$ is uniformly sampled from the goal sequence, ensuring that the final goal $g_H$ is always included at the end of the prompt.
3. The process of sampling a prompt is denoted as $p \sim P(p|\tau)$, allowing the prompt to describe behavior with varying granularities and lengths.

Policy Model Design  
Inspired by Decision Transformers, a causal Transformer model $\pi_\theta(a_t|p, h_{t-1}, o_t)$ is adopted. The input is a concatenated sequence of the prompt and the trajectory $(p, \tau) = (g_{i_1}, \dots, g_{i_k}, g_H, o_1, a_1, \dots, o_H, a_H)$. At each time step $t$, the policy observes only the sub-sequence $g_{i_1} \dots o_t$ through the causal attention mask and predicts the action distribution.

Training Objective and Optimization  
The policy is trained using behavior cloning by maximizing the log-likelihood:
$$\max_\theta \mathbb{E}_{\tau \in D, p \sim P(p|\tau)} \left[ \sum_{t=1}^H \log \pi_\theta(a_t|p, h_{t-1}, o_t) \right].$$
This approach encourages the policy to utilize the information provided in the prompt to reduce uncertainty in action prediction and seamlessly adjust behavior between different goals.


### 3.2: Online Prompt Optimization

Objective:  
For an unseen task with a task goal $g^M$, the algorithm aims to find an optimal prompt $p^*$ with a maximal length $K$ that maximizes the expected return. This involves evaluating prompts over $N$ episodes to optimize the prompt.

Approach:  
1. Buffer Maintenance:  
   A buffer $B$ is maintained to store sampled prompts, their return history, and the trajectory $\tau^*$ with the highest return $R^*$.

2. Iteration Process:  
   Each iteration includes two key steps:
   - Prompt Selection: Select a prompt $p^*$ from $B$, most likely to yield high returns, and collect a trajectory using $\pi(a|p^*, h, o)$.
   - New Prompt Sampling: Sample a new prompt $p' \sim P(p|\tau^*)$ based on the trajectory $\tau^*$. Add $p'$ and its corresponding return, obtained using $\pi(a|p', h, o)$, to the buffer.

3. Uncertainty Modeling:  
   The prompt selection step is modeled as a multi-armed bandit (MAB) problem due to the uncertainty in observed returns. Two solutions are implemented:
   - Upper-Confidence Bound (UCB): Selects the prompt with the highest UCB of expected return.
   - Bayesian Posterior Estimation (BPE): Selects the prompt most likely to yield a return higher than $R^*$, based on the posterior of its return distribution.


# Evaluation



# Results



# Limitations


# FootNotes
