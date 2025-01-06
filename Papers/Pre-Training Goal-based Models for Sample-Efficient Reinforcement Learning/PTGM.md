---
创建时间: 2025-一月-2日  星期四, 10:33:39 上午
---
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

- employing a combination of the temporal abstraction provided with the pre-trained goal-conditioned policy, clustering in the goal space, and behavior regularization with the goal prior model,
- notably in the challenging benchmark of Minecraft




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


 1. pre-trained (low-level) goal-conditioned policy $P_{\phi}(a_t|s_t, s^g)$ to provide temporal abstractions for RL in downstream tasks
	 1. For a $k$-step subsequence $\tau = (s_t, a_t, \cdots, s_{t+k}, a_{t+k})$ in an episode, we label each sample $(s_i, a_i), t \leq i \leq t+k$ with the goal state $s^g = s_{t+k}$. We train $P_{\phi}$ with behavior cloning, minimizing the negative log-likelihood of action prediction:

$$\mathcal{L}(\phi) = \mathbb{E}_{\mathcal{D}} \big[ -\log P_{\phi}(a_i | s_i, s^g) \big].$$
2. To enhance the sample efficiency and stability of RL, we propose a goal clustering method and a pre-trained goal prior model
	1. Clustering in the Goal Space
		1. cluster the states in the dataset to discretize the goal space
		2.  sample a large set of states from $D$, apply t-SNE  to reduce the dimension of states
		3. apply a clustering algorithm such as K-Means (Lloyd, 1982) to group similar goal states together and output $N$ clusters.
			1. The discretized goal space is represented with $G = \{i : s^g_i\}_{i=1}^N$, where $s^g_i$ is the goal state of the $i$-th cluster center
	2.  Pre-Training the Goal Prior Model
		1. the high-level policy lacks prior knowledge to provide reasonable goals
		2. The goal prior model $\pi_{\psi}^p(a^h|s)$ has the same structure as the high-level policy, where $a^h \in A^h$ is the index of the goal cluster centers.
		3. In the discretized goal space $G$, we match the goal that is closest to $s^g$ based on cosine similarity:

$$a^h = \arg\max_{i \in [N]} \left( \frac{s_i^g \cdot s^g}{\|s_i^g\| \cdot \|s^g\|} \right).$$
			
		4. The training objective for the goal prior model is to minimize the negative log-likelihood of goal prediction:(a regularizer for the high-level policy, providing intrinsic rewards)

$$\mathcal{L}(\psi) = \mathbb{E}_{\mathcal{D}} \big[ -\log \pi_{\psi}^p(a^h|s_t) \big].$$

3. In RL, we train a high-level policy $\pi_{\theta}(s^g|s_t)$ which outputs a goal state to guide the low-level goal-conditioned policy $P_{\phi}$ to act in the environment for $k$ steps
	1. At each time step, the high-level policy $\pi_{\theta}(a^h|s)$ selects an index of the goal $s^g_{a^h}$ in the clustered goal space
	2. The fixed low-level policy acts in the environment for $k$ steps conditioned on $s^g_{a^h}$. 
	3. The high-level policy is updated based on the environment rewards and the intrinsic rewards from the goal prior model.
	4. maximize the expected return:

$$J(\theta) = \mathbb{E}_{\pi_{\theta}} \left[ \sum_{t=0}^{\infty} \gamma^t \left( \sum_{i=kt}^{(k+1)t} R(s_i, a_i) - \alpha D_{KL} \left( \pi_{\psi}^p(a^h|s_{kt}) \| \pi_{\theta}(a^h|s_{kt}) \right) \right) \right], \tag{4}$$

 


# Evaluation
on the following two challenging benchmarks with long-horizon tasks:
1. Kitchen
2. Minecraft



several baselines:
1. SPiRL
   Pre-trains a sequential VAE to generate continuous skill latent variables $z$, with the high-level policy selecting skills $z$ and the low-level decoder executing $k$-step actions based on those skills.
2. TACO
   Uses offline RL to pre-train a low-level policy conditioned on skill latent variables $z$, regularized by KL divergence to a learned skill prior, enabling the high-level policy to be trained for online RL.
3. VPT-finetune
   Trains a foundation model on a large-scale behavior cloning dataset and fine-tunes the full model or transformer adapters to adapt to downstream tasks
4. Steve-1
    builds an instruction-following agent in Minecraft. It first trains a goal-conditioned policy $\pi(a_t|o_{0:t}, g)$ on the contractor dataset, which is the same as the low-level policy in PTGM. Then, Steve-1 adopts a language-labeled dataset to map instructions to goals

ABLATION STUDY

# Results
Both PTGM and SPiRL outperform BC-finetune a lot, indicating that training RL with temporal abstraction provided by the pre-trained models improves sample efficiency significantly.
1. clustering in the goal space, 
2. the KL reward provided with the goal prior model, 
3. the temporal abstraction for RL


# Limitations
the goal space in PTGM is inherently determined by the offline dataset, rendering the acquired skills susceptible to data bias. $\Longrightarrow$ In the future, we plan to use larger Internetscale datasets to enhance the capabilities of PTGM
the efficacy of goal clustering relies on a good state representation that can compactly represent goals, $\Longrightarrow$ We leave better goal representation learning for PTGM to future work.



# FootNotes
