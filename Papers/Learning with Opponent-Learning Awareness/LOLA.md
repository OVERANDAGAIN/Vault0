#paper_summary 

# Inspiration

## Take-away Message

1. LOLA explicitly incorporates the opponent's learning process into its own strategy update
2. LOLA fosters cooperative behavior by shaping opponent updates, unlike independent learners that often lead to defection
3. LOLA agents can exploit naive learners, but higher-order exploits yield diminishing returns



## Inspiration for Us

1. Modeling and influencing opponent updates allows for more sophisticated strategies in multi-agent environments.
2. LOLA highlights how cooperation can emerge from strategic interactions, inspiring the design of self-organizing multi-agent systems
3. LOLA’s gradient-based approach to influencing opponents —— whether LOLA can be exploited by adversarial agents using global search methods.


- LOLA (Exact Gradient + Hessian):  core idea of explicitly considering the opponent's gradient updates
- LOLA (Policy Gradient-Based): Adapts to deep reinforcement learning environments, eliminating the need for exact Hessians but still requiring access to opponent parameters.
- LOLA (Opponent modeling): Relaxes the assumption by inferring opponent parameters through modeling or interaction, without direct access.
- Higher-Order LOLA: Extends LOLA by considering that the opponent is also using LOLA and reasoning over higher-order game dynamics.


-  Naive Learner (对照组)，只用自己的梯度，不关心对手的反应。
- LOLA（精确梯度 + Hessian） 提出核心思想，显式考虑对手在学习时会改变梯度。
- LOLA（基于策略梯度） 适配深度强化学习环境，不再需要精确 Hessian，但仍要求知道对手的参数。
- LOLA（对象建模） 放宽假设，不需要直接访问对手参数，而是通过建模/交互来推断。
- Higher Order LOLA 进一步考虑对手也在LOLA考虑自己的更新，进行高阶博弈推理。

# Focus
1. Instead, LOLA considers general sum games.
2. LOLA assumes learning agents, which effectively correspond to unbounded memory policies.
3. LOLA agent directly shapes the policy updates of all opponents in order to maximise its own reward.

LOLA is the first method that aims to shape the learning of other agents in a multi-agent RL setting.

1. Naive Learner (对照组)，只用自己的梯度，不关心对手的反应。
2. LOLA（精确梯度 + Hessian） 提出核心思想，显式考虑对手在学习时会改变梯度。
3. LOLA（基于策略梯度） 适配深度强化学习环境，不再需要精确 Hessian，但仍要求知道对手的参数。
4. LOLA（对手建模） 放宽假设，不需要直接访问对手参数，而是通过建模/交互来推断。
5. Higher Order LOLA 进一步考虑对手也在LOLA考虑自己的更新，进行高阶博弈推理。

为什么需要 Hessian？ —— 因为要显式计算“对手的更新如何依赖我的参数”，这是 LOLA 最核心的“对手学习意识”。
为什么改用 PG？ —— 因为在大型或复杂环境里无法显式拿到 Hessian，必须用抽样近似。
为什么要 opponent modeling？ —— 因为现实中往往拿不到对手的真实参数或梯度，需要通过数据来建模对手。



这样，LOLA 在论文中就分成了几个版本：

1. 精确 Hessian 版本（理论推导/小例子）；
2. 基于策略梯度的 LOLA（能用在深度 RL 里）；
3. Opponent Modeling 的 LOLA（不需要直接访问对手参数，而是从交互中学到对手策略）；
4. Higher-Order LOLA（考虑对手也在用 LOLA，于是要“再考虑对手考虑我在考虑对手”……一直迭代下去，这就走向更复杂的高阶推理）


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
