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


