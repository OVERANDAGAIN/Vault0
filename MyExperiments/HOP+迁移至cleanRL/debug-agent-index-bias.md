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

## 解决方案
### 修改：agent_id 默认都是player_1
````ad-important


## 1. 现在的真实现象再梳理一下

* **环境对称性** 已经通过多组实验验证过：

  * 4 Random、4 NS / 4 NS 混合，`player_1~4` 的平均回报非常接近；
  * 说明 **环境本身没有编号 bias**，`__obs_state__` 的重排也没有明显问题。

* **单 PPO + 3 NS** 的实验结果：

  * PPO 作为 `player_1` 时：

    * reward 平滑升到 $\approx 2.9$；
    * `entropy` 先降后稳、`ppo_pg_loss / total_loss / value_loss` 都是 $\mathcal{O}(1)$ 并收敛，很“教科书式”。
  * PPO 作为 `player_2/3/4` 时：

    * reward 也能升到 $\approx 2.9$；
    * 但：

      * `entropy` 基本在 0.5–0.7 上下乱飘甚至回升；
      * `value_loss` 几百上千、一度上升，和 `player_1` 完全两个世界。
  * 这说明：**PPO 虽然学到了一个还不错的策略，但训练过程严重“不自洽”**，而且这种异常 **与 agent index 高度相关**。

结合你之前「4 个 PPO self-play 时只有 player_1 的 loss 正常，其余 value_loss 爆炸」——这已经非常像：

> *所有 PPO 策略都在用某一个固定编号的轨迹训练*。

---

## 2. 关键 bug：PPO 不知道“自己是谁”

看 `HOPPlusPolicy.train` 的这几行（这是整个问题的核心）：

```python
def train(self, agent_trajectories: dict, agent_ids: list):
    ...
    my_id = self.agent_id
    if my_id is None:
        # 只有一个键时自动识别；否则 fallback 第一个
        if len(agent_trajectories) == 1:
            my_id = next(iter(agent_trajectories.keys()))
        else:
            my_id = agent_ids[0] if agent_ids else next(iter(agent_trajectories.keys()))
        self.agent_id = my_id  # 记住
```

然后在收集样本时：

```python
for aid in agent_ids:
    traj = agent_trajectories.get(aid, [])
    ...
    if aid == my_id:
        my_rows.append(row)
    else:
        opponents_rows.append(row)
```

问题在于：

### 2.1 在你的训练脚本里，`agent_ids` 一直是全体玩家

在 `PPO_single_player` 主程序中，train 调用是这样的：

```python
for aid in agent_ids:
    if aid != ppo_aid:
        continue
    policy_dict[aid].train(
        agent_trajectories=agent_trajectories,
        agent_ids=agent_ids,   # ← 这里传的是 ['player_1', 'player_2', 'player_3', 'player_4']
    )
```

即使只有一个 PPO（比如 `player_3`），**`agent_trajectories` 里依然有四个 key**，`agent_ids` 也是 4 个名字。

于是进入 `HOPPlusPolicy.train` 时：

* `self.agent_id` 初始为 `None`；
* `len(agent_trajectories) == 4`，走 `else` 分支；
* `my_id = agent_ids[0]`，也就是永远被设成 `'player_1'`；
* 并且 `self.agent_id = my_id` 被记住了 —— 之后每一次调用都用 `'player_1'`。

**结论：无论这份 PPO policy 被挂在 `player_1`、`player_2`、`player_3` 还是 `player_4` 上，它训练时永远只吃 `player_1` 的轨迹。**

## 3. 直接的修复方案

核心原则：**让每个 HOPPlusPolicy 明确知道自己对应的是哪个 agent id**，而不是在 `train()` 里瞎猜。

### 3.1 在创建 policy 时显式写入 `agent_id`

例如在你的 `PPO_single_player` 脚本里，把这一段：

```python
for aid in agent_ids:
    if aid == ppo_aid:
        model_core = MyModel(base_cfg["model"])
        policy_dict[aid] = HOPPlusPolicy(
            config=cfg_by_agent[aid],
            env_creator=env_creator,
            model_core=model_core,
            device=args.device,
        )
        policy_dict[aid].set_writer(writer)
```

改成：

```python
for aid in agent_ids:
    if aid == ppo_aid:
        cfg_this = cfg_by_agent[aid].copy()
        cfg_this["agent_id"] = aid              # ✅ 显式告诉 PPO：你就是这个 agent
        model_core = MyModel(cfg_this["model"])
        policy_dict[aid] = HOPPlusPolicy(
            config=cfg_this,
            env_creator=env_creator,
            model_core=model_core,
            device=args.device,
        )
        policy_dict[aid].set_writer(writer)
    else:
        policy_dict[aid] = NSAdapter(ns_cfg)
```

````


### 修改结果

#### PPO self-play (4\*4 4h1s)
##### reward



##### loss

#### PPO as player_2  +  3NS(4\*4 4h1s)
##### reward
##### loss

#### PPO as player_3  +  3NS(4\*4 4h1s)
##### reward
##### loss


#### PPO as player_4  +  3NS(4\*4 4h1s)
##### reward
##### loss


# Limitations
# Future Work
# FootNotes