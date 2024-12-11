#paper_summary 

# Inspiration



# Innovation
few-shot adaptation in mixed-motive environments (despite success in zero-sum and pire-cooperative environments)


# Background
1. efficiently adapting to co-players in mixed-motive environments $\Longrightarrow$ hierarchically model co-players' behavior based on inferring their characteristics $\Longrightarrow$ difficulties int efficient reasoning and utilization of inferred information


# Theory
ToM $\Longrightarrow$ understand others' goals/beliefs from their actions $\Longrightarrow$ between and within episodes
opponent modeling


# Related Work
Add intrinstic rewards, consider the impact on others, maximize extrinstic rewards:

ToMAGA $\Longrightarrow$ hand-crafted intrinstic rewards access to rewards of co-players
counterfactual reasoning
LOLA, POLA, M-FOS $\Longrightarrow$ consider the impact (rather than treating them as a static part) $\Longrightarrow$ require knowledge of co-players' netwprl parameters
I-POMDP, opponent modeling $\Longrightarrow$ esrious computational complexity

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
	sample co-players' goals on $b_{ij}(g_{j})$ 
	time **t** at episode **K** :
		sample goal combination $g_{-i}={g_{j}~b_{ij}^K}$ 
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



