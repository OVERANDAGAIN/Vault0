#paper_summary 

# Inspiration



# Focus
1. Instead, LOLA considers general sum games.
2. LOLA assumes learning agents, which effectively correspond to unbounded memory policies.
3. LOLA agent directly shapes the policy updates of all opponents in order to maximise its own reward.

LOLA is the first method that aims to shape the learning of other agents in a multi-agent RL setting.

Naive Learner (对照组)，只用自己的梯度，不关心对手的反应。
LOLA（精确梯度 + Hessian） 提出核心思想，显式考虑对手在学习时会改变梯度。
LOLA（基于策略梯度） 适配深度强化学习环境，不再需要精确 Hessian，但仍要求知道对手的参数。
LOLA（对手建模） 放宽假设，不需要直接访问对手参数，而是通过建模/交互来推断。
Higher Order LOLA 进一步考虑对手也在考虑自己的更新，进行高阶博弈推理。

近似方法来估计需要的梯度/二阶梯度
上面两个版本（精确梯度 + Hessian 以及基于策略梯度）都有一个隐含假设：

    能直接访问对手的策略参数 θ2θ2，或者至少对手的策略梯度是可得的。
# Innovation



# Theroy
Instead of optimizing the expected return under the current parameters, $V^{1}(θ_{i}^{1}, θ_{i}^{2})$, a LOLA agent optimises $V^{1}(θ_{i}^{1}, θ_{i}^{2}+ ∆θ_{i}^{2})$, which is the expected return after the opponent updates its policy with one naive learning step,$∆θ_{i}^{2}$


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
