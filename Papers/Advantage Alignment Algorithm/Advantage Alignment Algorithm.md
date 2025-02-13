---
创建时间: 2024-十二月-10日  星期二, 1:51:01 下午
created: 2024-12-18T20:35
updated: 2024-12-18T20:35
---
#paper_summary 

# Inspiration



# Innovation
1. introduce <font color="#ff0000">Advantage Alignment</font> and PPA (Promixal Advantage Alignment $\Longleftrightarrow$ two opponent shaping algorthms $\Longrightarrow$ based on policy gradient estimators
2. prove LOLA and LOQA perform<font color="#ff0000"> Advantage Alignment</font> 
3. extend REINFORCE-based opponent shaping to <font color="#ff0000">continuous action environments</font> $\Longleftrightarrow$ sota results
4. apply in social dilemma $\Longleftrightarrow$ sota results


# Background
1. Pareto-suboptimal Nash equilibra $\Longrightarrow$ Opponent Shaping
2. LOLA: an opponent shaping algorithm that influences the behavior of other agents $\Longrightarrow$ by assuming they are naive learners $\Longleftrightarrow$  taking gradients with respect to simulated parameter updates
3. Pareto-optimal strategy in the Coin Game $\Longleftrightarrow$ collect only the coins matching their color
4. social dilemma in the Negotiation Game $\Longrightarrow$ take as many items as possible ( low return ) $\Longrightarrow$ Pareto-optimal: take all the items that are more valuable to them


# Problem



# Methodology
1. align the advantages of interacting agents, increasing the probability of mutually beneficial actions when their interaction has been positive.


# Evaluation
IPD/Coin Game/a continuous action variant of the Negotiation Game/Melting Pot's Commons Harvest Open


# Limitations



# Applications