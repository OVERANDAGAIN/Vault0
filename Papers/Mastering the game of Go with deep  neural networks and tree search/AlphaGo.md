#paper_summary 

# Inspiration



# Innovation



# Background
All games of perfect information have an optimal value function, $v^{*}(s)$, which determines the outcome of the game, from every board position or state s, under perfect play by all players.


# Related Work



# Theroy
Effective search space can be reduced by:
1. depth of search $\Longrightarrow$ position evaluation; replacing the subtree below $s$   by an approximate value function $v(s) ≈ v^{*}(s)$ 
2. breadth of the search $\Longrightarrow$  sampling actions from a policy $p(a|s)$ that is a probability distribution over possible moves $a$ in position $s$.


# Methodology
use convolutional layers to construct a representation of the position. We use these neural networks to reduce the effective depth and breadth of the search tree: evaluating positions using a value network, and sampling actions using a policy network

1. (SL) policy network $p_{\sigma}$ directly from expert human moves
2. fast policy $p_{\pi}$that can rapidly sample actions during rollouts
3. (RL) policy network $p_{@}$ that improves the SL policy network by optimizing the final outcome of games of selfplay.
4. a value network vθ that predicts the winner of games played by the RL policy network against itself.

# Evaluation



# Results



# Limitations