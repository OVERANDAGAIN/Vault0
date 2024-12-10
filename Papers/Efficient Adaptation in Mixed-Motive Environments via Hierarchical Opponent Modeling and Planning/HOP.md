#paper_summary 

# Inspiration



# Innovation
few-shot adaptation in mixed-motive environments (despite success in zero-sum and pire-cooperative environments)


# Background
1. efficiently adapting to co-players in mixed-motive environments $\Longrightarrow$ hierarchically model co-players' behavior based on inferring their characteristics $\Longrightarrow$ difficulties int efficient reasoning and utilization of inferred information


# Theory
ToM $\Longrightarrow$ understand others' goals/beliefs from their actions $\Longrightarrow$ between and within episodes



# Related Work
add intrinstic rewards, consider the impact on others, maximize extrinstic rewards



# Methodology
two modules:
1. an opponent modeling module $\Longrightarrow$ infer others' goals $\Longleftrightarrow$ learn corresponding goal-conditioned policies
2. a planning module $\Longrightarrow$ MCTS

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



