#paper_summary 

# Inspiration



# Focus
1. Instead, LOLA considers general sum games.
2. LOLA assumes learning agents, which effectively correspond to unbounded memory policies.
3. LOLA agent directly shapes the policy updates of all opponents in order to maximise its own reward.

LOLA is the first method that aims to shape the learning of other agents in a multi-agent RL setting.
# Innovation



# Theroy



# Background
1. Considering future applications of multi-agent RL, such as self-driving cars, it is obvious that many of these will be only partially cooperative and contain elements of competition and conflict.
2. Considering future applications of multi-agent RL, such as self-driving cars, it is obvious that many of these will be only partially cooperative and contain elements of competition and conflict.
3. One well-known shortcoming is that they fail to consider the learning process of the other agents and simply treat the other agent as a static part of the environmento


# Related Work




# Methodology
We also present a version of LOLA adopted to the deep RL setting using **likelihood ratio policy gradients**, making LOLA scalable to settings with high dimensional input and parameter spaces.




# Evaluation
 1. infinitely repeated iterated prisoners’ dilemma
 2. round-robin tournament against other multi-agent learning algorithms 
 3. derive a policy gradient-based version of LOLA, applicable to a deep RL setting
 4. scale the policy gradient-based version of LOLA to the Coin Game
 5. We further remove agents’ access to the opponent agents’ policy parameters and replace with opponent modeling
 6.  briefly address the exploitability of LOLA agents $\Longrightarrow$ show that in the IPD both agents are incentivised to use LOLA, while higher order exploits show no further gain


# Results



# Limitations


# FootNotes
