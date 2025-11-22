

[[HOP+迁移至cleanrl]]


# Objectives
# Results
# Insights
## 环境本身不对称
1. 或者 reward 分配逻辑里不小心用了 player_id 顺序，这里可以看一看。


## 训练流程上的不对称
训练循环里对 agent 的处理顺序固定（总是先更新 player_1，再 player_2...），且更新逻辑有依赖；

buffer 写入 / 采样，对某些 agent 更有利（样本更多 / 更高质量）。


## 模型与配置上的不对称

不同 agent 的 config 不完全一样（learning rate、gamma、ToM_config、my_id 等）；

subgoal / MOA / WM 中隐含使用 my_id 导致「第一个 my_id=1 的 agent」被更好地建模。

## 日志或奖励统计 bug

reward 写错了：例如所有人 reward 都记录到 agent_1 上；

或者 agent_k 的 reward 被缩放 / mask 掉一部分。



# Setup
# Methodology
# Issues & Debugging

## 阶段一：环境对称性检查（不训练，只跑随机）
目标：先验证纯环境 + 随机策略下，4 个 agent 的期望收益是不是相等。

![[Pasted image 20251123030503.png]]













# Limitations
# Future Work
# FootNotes