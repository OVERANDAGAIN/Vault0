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

Goal inference as a foundation for planning
基于目标推断的规划基础
HOP highlights the potential of goal inference in improving the adaptability and efficiency of decision-making in uncertain environments.
HOP 强调了目标推断在提升不确定环境中决策适应性与效率的潜力。

2. Scalable solutions for multi-agent environments
多智能体环境的可扩展解决方案
The hierarchical design avoids the computational explosion of joint action spaces, offering a scalable approach for large-scale multi-agent cooperation.
分层设计避免了联合动作空间的计算爆炸，为大规模多智能体合作提供了可扩展的方法。

3. Few-shot learning in dynamic systems
动态系统中的少样本学习
Few-shot adaptation in mixed-motive games inspires research on dynamic and adaptive strategies in real-world applications like robotics and human-computer interaction.
混合动机游戏中的少样本适应能力启发我们研究动态且自适应的策略，可应用于机器人和人机交互等实际场景。

4. Social dynamics and emergent behavior
社会动态与涌现行为
The observed emergence of alliances and cooperation suggests opportunities to explore social intelligence in AI, especially for multi-agent coordination.
涌现的联盟与合作现象提示我们可以进一步探索 AI 中的社会智能，尤其在多智能体协调领域。

5. Human-centric applications
以人为中心的应用
HOP’s ability to infer and respond to opponents’ goals offers insights for designing AI systems that align with human values and preferences in collaborative settings.
HOP 推断并响应对手目标的能力，为设计与人类价值观和偏好一致的协作 AI 系统提供了启发。

6. Future exploration of hierarchical reasoning
层次化推理的未来探索
The potential extension to higher-order Theory of Mind (ToM) and autonomous goal abstraction opens new avenues for improving decision-making algorithms.
拓展至更高阶“心智理论”（ToM）及自主目标抽象的可能性，为改进决策算法开辟了新方向。



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



