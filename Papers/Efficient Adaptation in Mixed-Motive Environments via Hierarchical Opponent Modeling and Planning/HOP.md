---
创建时间: 2024-十二月-18日  星期三, 8:35:22 晚上
---
#paper_summary 

# Inspiration

## Take-away Message（关键信息）
few-shot; ToM and opponent modeling
1. Few-shot adaptation in mixed-motive environments —— by leveraging hierarchical opponent modeling and planning.
2. Hierarchical opponent modeling —— high-level goal inference and low-level goal-conditioned policy learning, continuously updating beliefs both within and across episodes.
3. Planning with MCTS —— integrating Monte Carlo Tree Search (MCTS) with belief updates
4. Emergence of social intelligence —— self-organized cooperation and the formation of disadvantaged alliances



## Inspiration for Us（启发点）

1. **Hierarchical Opponent Modeling as a Design Paradigm**  
   **分层对手建模作为设计范式**  
   - The HOP framework showcases the value of combining high-level reasoning (goal inference) with low-level policy learning. This inspires MARL researchers to explore more hierarchical approaches for solving complex tasks where goals and strategies are intertwined.  
   - HOP 框架展示了高层推理（目标推断）与低层策略学习结合的价值，这启发研究者在解决目标与策略交织的复杂任务时，探索更多分层方法。

2. **Belief Update Mechanisms**  
   **信念更新机制**  
   - The belief update component of HOP demonstrates the importance of modeling uncertainty about opponents’ goals. Future research could focus on enhancing belief updates using probabilistic models, Bayesian frameworks, or neural network-based approaches.  
   - HOP 的信念更新部分展示了对手目标不确定性建模的重要性，未来研究可以通过概率模型、贝叶斯框架或基于神经网络的方法来增强信念更新能力。

3. **Few-shot Adaptation in Dynamic Systems**  
   **动态系统中的少样本适应性**  
   - HOP’s success in few-shot learning highlights the potential of combining structure-aware opponent modeling with meta-learning techniques, providing a new avenue for improving adaptability in MARL.  
   - HOP 在少样本学习中的成功凸显了结合结构化对手建模与元学习技术的潜力，为提升 MARL 中的适应性提供了新方向。

8. **Higher-Order Reasoning in Multi-Agent Systems**  
   **多智能体系统中的高阶推理**  
   - HOP's hierarchical approach opens the door for exploring higher-order Theory of Mind (ToM), where agents reason not only about their opponents’ goals but also about their reasoning processes.  
   - HOP 的层次化方法为探索更高阶“心智理论”（ToM）奠定了基础，使智能体不仅能够推断对手的目标，还能推断对手的推理过程。

# Innovation
few-shot adaptation in mixed-motive environments (despite success in zero-sum and pure-cooperative environments)


# Background
1. efficiently adapting to co-players in mixed-motive environments $\Longrightarrow$ hierarchically model co-players' behavior based on inferring their characteristics $\Longrightarrow$ difficulties int efficient reasoning and utilization of inferred information


# Theory
ToM $\Longrightarrow$ understand others' goals/beliefs from their actions $\Longrightarrow$ between and within episodes
opponent modeling


# Related Work
Add intrinstic rewards, consider the impact on others, maximize extrinstic rewards:

ToMAGA $\Longrightarrow$ hand-crafted intrinstic rewards access to rewards of co-players
counterfactual reasoning
LOLA, POLA, M-FOS $\Longrightarrow$ consider the impact (rather than treating them as a static part) $\Longrightarrow$ require knowledge of co-players' network parameters
I-POMDP, opponent modeling $\Longrightarrow$ serious computational complexity

# Methodology
two modules:
1. an opponent modeling module $\Longrightarrow$ infer others' goals (high level) $\Longleftrightarrow$ learn corresponding goal-conditioned policies (low level)
2. a planning module $\Longrightarrow$ MCTS $\Longrightarrow$ to avoid the growing joint action space in multi-agent environments $\Longrightarrow$ estimate policies of co-players $\Longleftrightarrow$ plan only for the fotal agents' actions $\Longrightarrow$ maintain a policy and value network 

updating beliefs about others' goals  $\Longleftrightarrow$ both across and within episodes
information from the opponent module $\Longrightarrow$ guide planning

## Oponent Modeling with Efficient Adaptation
Chanllenge of co-players' goals changing within episodes $\Longrightarrow$ two procedures based on ToM: intra-OM (infer immediate goals within a single episode) and inter-OM (summarize co-players'goals based on their historical episodes)

intra-OM: inaccuracy of the prior when past trajectories not long enough for updates $\Longrightarrow$ inter-OM: $\alpha$ control the importance of the history

## Planning under Uncertain Co-player Models
Obstacle to applying MCTS: co-player policies estimated by the opponent module contain uncertainty over co-plaers' goals. $\Longrightarrow$ sample co-players' goal combinations according to the belief maintained by the opponent modeling module $\Longrightarrow$ estimate action value by MCTS based on the samples 


run MCTS for $N_{s}$ rounds:
	sample co-players' goals on $b_{ij}(g_{j})$ : Specifically
	time **t** at episode **K** :
		sample goal combination $g_{-i}={\{g_{j}\ {\sim}\ b_{ij}^{K,t}(\cdot),j\neq i}$ 
		at state $s^{ {\sim}k}$ in the MCTS tree: 
			co-players' actions $\tilde{a}_{-i}$ :  $s\enspace{\sim}\enspace \pi_{\omega}(\cdot|\tilde{s}^{k},g_{j})$  $\Longrightarrow$ from goal-conditioned policy
			MCTS: estimated action value of current state $Q(s^{K,t},a,g_{-i})=V(\tilde{s}'(a))\ (a\in A_{i})$
				$\tilde{s}'(a)$ is next state after taking $\tilde{a}^{0}_{-i}\cup a$ form $\tilde{s}^{0}=s^{K,t}$ 
			average the estimated action value $Q_{avg}(s^{K,t},a)=\sum_{l=1}^{N_{s}}Q_{l}(s^{K,t},a,g_{-i}^{l})$
			agent $i$ 's policy follows Boltzmann rationality model $\pi_{MCTS}(a|s^{K,t})=\frac{\exp(\beta Q_{avg}(s^{K,t},a))}{\sum_{a'\in A_{i}}\exp(\beta Q_{avg}(s^{K,t},a')}$
				$\beta$ is rationality coefficient $\Longrightarrow$ $\beta$ increases $\Longleftrightarrow$ policy more rational


a neural network $\theta$ to predict policy and value functions 
# Evaluation
Markov Stag-Hunt (MSH)
Markov Snowdrift Games (MSG) 
self-play
social intelligence 

LOLA, A3C, PR2, direct-OM
# Results
superior few-shot adaptation
excels int self-play scenarios
emergence of social intelligence


# Limitations



