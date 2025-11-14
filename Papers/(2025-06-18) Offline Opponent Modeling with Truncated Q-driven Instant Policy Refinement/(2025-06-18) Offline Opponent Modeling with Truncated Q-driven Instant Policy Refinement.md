#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
## 方法概述
针对OOM(offline opponent modeling)问题中，如何使用一个次优离线数据集，达到在线的快速适应问题：

提出：
1. Truncated Q-value function(H horizon) with ICL $\Longrightarrow$ 学习一个额外的Q函数
2. Instant Policy Refinement(IPR) $\Longrightarrow$ 如何运用额外的Q函数来决定是否 切换策略


## 实验
实验环境：POMDP，Competitive environment

## future work
1. 目前的Truncated Q-value function 的Horizon确定：如何寻找最优的horizon大小
2. 在在线测试阶段，对手的策略是固定不变的，并没有面对learning-based的opponents去做在线适应

# Innovation
# Theroy
# Perspective
# Formulation
# Background
# Related Work
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
