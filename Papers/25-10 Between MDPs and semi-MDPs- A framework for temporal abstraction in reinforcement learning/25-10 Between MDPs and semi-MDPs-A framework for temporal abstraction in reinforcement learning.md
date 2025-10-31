---
创建时间: 2025-十月-9日  星期四, 8:25:27 晚上
---
#paper_summary 

# Inspiration
## Take-away Message
MDP+option=SMDP（Semi-MDP),其本质就是建模了一个更高层次的option，一旦选择了一个option,就需要在一段时期内执行完他其中包含的所有原子动作。作者还讨论了interruption机制，即假如option可以终止会发生什么。
该框架证明了“temporally abstract actions”可以在不改变RL基本收敛理论（Bellman equation, Q-learning）的前提下统一建模。
## Inspiration for Us
这里的option与subgoal的关系：subgoal 并非独立于 option 的概念，而是一种“用于改进 option 的结构信号“。但是这里的option和subgoal仍然是静态和手工制定的。
>subgoal ≈ option 的 termination criterion β(s) 所隐含的目标。


在SMDP中，option内部的累积reward与state transition以折扣形式加权，保证option作为高层action仍保持与MDP一致的马尔可夫结构。
nterruption 是一种“on-policy improvement”机制，允许 agent 动态放弃低价值option，从而在不增加额外学习成本的情况下提升策略性能
# Focus

在这篇论文： Hierarchical Reinforcement Learning: A Survey and Open Research Challenges 中提到的分层建模的综述，提到了以下方法： Discovering hierarchy in reinforcement learning with HEXQ，其许多基础概念来源于本论文： 
Between MDPs and **semi-MDPs**: A framework for temporal abstraction in reinforcement learning 
# Innovation
# Theroy
本文从介绍option开始，引入MDP+option=Semi-MDP的思想，即SMDP。SMDP中的特殊action即是option，`agent` 首先会选择自己的option，是一个顶层的指导反向，在这个option的影响下，再去执行一系列的action，目的就是达成option,当一个option结束后，就选择 $option'$ ，重新这个过程。

# Perspective
所以，把整个trajectory切分成history的组合，SMDP实际上不是Markov性的。
>当切分的很小，option=action时，SMDP=MDP，这时就具有Markov性
>
>虽然每个option执行内部可跨越多个时间步，但SMDP形式上保持Markov性；只有当将其展平成原子动作序列时，才表现为semi-Markov（history-dependent）过程。


讨论了SMDP下的：
- 贝尔曼方程
- 环境建模（<span style="background:#affad1">折扣版本的reward和dynamics</span>)
- interruption机制，即若允许option终止会发生什么
- subgoal机制（但这里的subgoal仍然是静态和手工制定的，不太清楚这里和option的区别？）
# Formulation
# Background
# Related Work
# Methodology
# Evaluation
# Results
![[Pasted image 20251031215504.png]]
# Limitations
# FootNotes
