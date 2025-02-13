---
创建时间: 2024-十二月-17日  星期二, 2:10:16 下午
created: 2024-12-18T20:35
updated: 2024-12-24T19:23
---

#paper_summary 

Note[^2]
```ad-note
[mp.weixin.qq.com/s?\_\_biz=MzIwMTc4ODE0Mw==&mid=2247505166&idx=1&sn=e17c4a97ffe35351b3d0e48bc020d880&chksm=96ea0a8ea19d8398e377955f5ae4a263ab14771d0d9055f5061b3a475499bc26bd036e275ad2&scene=4](https://mp.weixin.qq.com/s?__biz=MzIwMTc4ODE0Mw==&mid=2247505166&idx=1&sn=e17c4a97ffe35351b3d0e48bc020d880&chksm=96ea0a8ea19d8398e377955f5ae4a263ab14771d0d9055f5061b3a475499bc26bd036e275ad2&scene=4)
```


# Inspiration



# Focus
 - ==coordination and communication== in MARL
 - rewarding agents for having ==causal influence== over other agents’ actions.
 - Causal influence is assessed using ==counterfactual reasoning==

 - Intrinsic Motivation for Reinforcement Learning (RL) $\Longrightarrow$ sometimes in ==the absence of environmental reward==


# Innovation
MOA:
1. only through observing other agents’ actions, 
2. without requiring a centralized controller or access to another agent’s reward function.

ties to the literature on empowerment, in which agents maximize the mutual information between their actions and their future state：
1. a novel social form of empowerment.



# Theroy
About Causal influence:
```ad-note
At each timestep:
 - an agent **simulates alternate actions** that it could have taken
 - computes their **effect on the behavior of other agents**. 
 - Actions that lead to **bigger changes in other agents’ behavior** are considered influential and are rewarded.
```

1. 因果影响回报可以促进通信的产生:
   在这个案例研究中，紫色影响者智能体学会了使用自己的动作作为一个二元编码，来传递环境中是否存在苹果这个消息。Harvest 游戏中同样有类似的行为。这种基于行为的通信可以与蜜蜂的摇摆舞联系起来。这表明，因果影响回报不仅可以促进协作，还可以促进通信的产生。
   为了进一步验证上面得出的结论，即因果影响回报可以促进通信的产生，下面我们使用因果影响回报来训练基于通信学习的多智能体强化学习算法。

# Background
1. Empirical results demonstrate that influence leads to enhanced coordination and communication in challenging social dilemma environments, dramatically increasing the learning curves of the deep RL agents, and leading to more meaningful learned communication protocols
2. In contrast, key previous works on emergent communication in the MARL setting were ==unable to learn diverse policies in a decentralized manner== and had to resort to centralized training
3. Social learning/intrinsic social motivation for RL$\Longrightarrow$ these approaches ==rely on hand-crafted rewards== specific to the environment, or ==allowing agents to view the rewards obtained by other agents==$\Longrightarrow$ make it<span style="background:#affad1"> impossible to achieve independent training of MARL agents </span>across multiple environments.
4. Crawford & Sobel (1982) find that in theory, the information communicated is proportional to the amount of common interest; thus, ==as agents’ interests diverge, no communication is to be expected==

SSDs:
1. the collective reward obtained by a group of agents in these SSDs gives a clear signal about how well the agents learned to cooperate
2. experiment with two SSDs
	1. a public goods game Cleanup, 
	2. a public pool resource game Harvest.



# Related Work

 - Intrinsic Motivation for Reinforcement Learning (RL) 




# Methodology
multi-agent environment: Sequential Social Dilemma (SSD) 
````ad-seealso

![[Pasted image 20241219212848.png]]
![[Pasted image 20241219212907.png]]
![[Pasted image 20241219212920.png]]

![[Pasted image 20241219212951.png]]

![[Pasted image 20241219213032.png]]

![[Pasted image 20241219213115.png]]

![[Pasted image 20241219213143.png]]
![[Pasted image 20241219213210.png]]

````

一个有趣的方向是，如果我们将多智能体网络视为单个智能体，则可以将影响力用作调节器，以鼓励网络的不同模块集成来自其他网络的信息。例如，防止分层强化学习算法崩溃。

# Evaluation



# Results



# Limitations


# FootNotes

[^2]: 关于本篇文章思路的很好的梳理