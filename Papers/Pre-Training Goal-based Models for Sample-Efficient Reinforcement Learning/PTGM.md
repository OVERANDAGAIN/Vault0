#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us





# Focus
1. PTGM involves ==pre-training a low-level, goal-conditioned policy== and ==training a high-level policy to generate goals== for subsequent RL tasks.
2. pre-trains a goal-conditioned policy via behavior cloning and hindsight relabeling
````ad-note
```ad-note

The pre-trained model is fixed during the RL phase, requiring it to have the capacity to model all the behaviors in the dataset and to decode action sequences accurately.
```

---
```ad-note

A goal refers to the final state of a sub-trajectory in the dataset
```
````






# Innovation
1. propose pre-training goal-based models for RL
2. clustering in the goal space and pre-training the goal prior model,
3. capability to learn on diverse domains and solve the challenging Minecraft tasks efficiently


# Theroy



# Background
==Pre-training on task-agnostic large datasets== is a promising approach for enhancing the ==sample efficiency== of reinforcement learning (RL) in solving complex tasks
```ad-note
The complexity and long-horizon nature of these tasks make it difficult for RL to explore and receive positive rewards, thereby resulting in low sample efficiency.

Pre-training on such datasets to improve RL has emerged as an important research topic.
```

# Related Work
pre-training from task-specific datasets and pre-training from large task-agnostic datasets
>In this paper, we study pre-training low-level skills from task-agnostic datasets.

Goal-conditioned RL

Hierarchical RL



# Methodology
![[Pasted image 20250106100935.png]]


 1. pre-trained goal-conditioned policy $P_{\phi}(a_t|s_t, s^g)$ to provide temporal abstractions for RL in downstream tasks
	 1. For a $k$-step subsequence $\tau = (s_t, a_t, \cdots, s_{t+k}, a_{t+k})$ in an episode, we label each sample $(s_i, a_i), t \leq i \leq t+k$ with the goal state $s^g = s_{t+k}$. We train $P_{\phi}$ with behavior cloning, minimizing the negative log-likelihood of action prediction:

$$\mathcal{L}(\phi) = \mathbb{E}_{\mathcal{D}} \big[ -\log P_{\phi}(a_i | s_i, s^g) \big].$$

 2. In RL, we train a high-level policy $\pi_{\theta}(s^g|s_t)$ which outputs a goal state to guide the low-level goal-conditioned policy $P_{\phi}$ to act in the environment for $k$ steps
 3. To enhance the sample efficiency and stability of RL, we propose a goal clustering method and a pre-trained goal prior model


# Evaluation



# Results



# Limitations


# FootNotes
