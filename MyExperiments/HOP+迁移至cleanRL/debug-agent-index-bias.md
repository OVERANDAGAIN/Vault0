---
创建时间: 2025-十一月-23日  星期日, 1:59:53 凌晨
---


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
### 4Random (4\*4 4h1s)
![[Pasted image 20251123030503.png]]

### 4NS(4\*4 4h1s)

![[Pasted image 20251123031714.png]]


### PPO self-play(4\*4 4h1s)
```python
(cleanrl) PS D:\cleanrl> tensorboard --logdir="D:\cleanrl\cleanRL\runs\PPO__2__1763839534"  
```

运行了6h，虽然最终四个平均奖励达到了2.8（总体收敛）

```ad-bug
但他们的训练过程中也出现了编号相关的偏差
>player_1训练效果最好，value_loss正常
>其余三个value_loss都在上百

```


![[Pasted image 20251123112517.png]]


![[Pasted image 20251123112558.png]]



```ad-summary
结论：
>环境 / 多环境封装 / reward 统计路径基本 OK；
>问题很可能集中在「数据 → EpisodeBatch → _refine_batch → value/advantage 计算 → loss」这条链上，
>而且是跟 my_id / agent index 相关的逻辑。
```


### PPO+3ns 更改agent_idx分别跑四次（(4\*4 4h1s)








# Limitations
# Future Work
# FootNotes