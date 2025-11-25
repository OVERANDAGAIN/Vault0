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

```ad-summary

```
#### PPO as player_1
```python
tensorboard --logdir="D:\cleanrl\cleanRL\runs\ppo_single_player1__1__1764062161"
```
##### reward
![[Pasted image 20251125204623.png]]
##### loss
![[Pasted image 20251125204631.png]]

####  PPO as player_2
```python
tensorboard --logdir="D:\cleanrl\cleanRL\runs\ppo_single_player2__1__1764062165"
```
##### reward
![[Pasted image 20251125204640.png]]
##### loss
![[Pasted image 20251125204647.png]]


####  PPO as player_3
```python
 tensorboard --logdir="D:\cleanrl\cleanRL\runs\ppo_single_player3__1__1764062167"
```
##### reward
![[Pasted image 20251125204707.png]]
##### loss
![[Pasted image 20251125204717.png]]


####  PPO as player_4
```python
 tensorboard --logdir="D:\cleanrl\cleanRL\runs\ppo_single_player4__1__1764062169"
```
##### reward
![[Pasted image 20251125204727.png]]
##### loss
![[Pasted image 20251125204734.png]]


```ad-summary

> ### 阶段结论：agent_idx_bias 的来源定位
>
> 1. 4×Random、4×NS 的实验中，4 个 agent 平均回报接近，对称性良好 → 环境 & VecEnv 本身没有偏置。
> 2. 4×PPO self-play 以及 “3NS+1PPO，轮流把 PPO 绑到 player_1/2/3/4” 实验中：
>
>    * 奖励都能收敛到 2.8–2.9；
>    * 但只有 PPO 作为 player_1 时 loss 曲线（尤其 value_loss、entropy）表现正常，其余位置的 loss 极大且震荡。
> 3. 结合训练代码分析，最可疑的一点是：
>    **`HOPPlusPolicy.train()` 可能始终在使用 `"player_1"` 的轨迹进行训练，而不随 PPO 所在的 agent 位置变化，导致“参数绑定位置”和“训练数据来源”错位。**
> 4. 下一步工作：
>
>    * 在 `HOPPlusPolicy` 中显式记录 `my_aid` / `my_idx`；
>    * 在 `train()` 开头打印 / 记录实际使用的轨迹 key，验证上述假设；
>    * 如被证实，修复 `make_hop_config` 和 `HOPPlusPolicy.train()` 中关于 agent 索引的逻辑。


```








# Limitations
# Future Work
# FootNotes