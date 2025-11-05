---
创建时间: 2025-十一月-5日  星期三, 9:22:51 晚上
---
[[(2023) Towards offline opponent modeling with in-context learning]])

# Questions

- [?] 


# OPPONENT POLICIES IN MARKOV SOCCER

## 

| 编号                        | 策略名称    | 核心行为逻辑                                                 | 策略风格           |
| ------------------------- | ------- | ------------------------------------------------------ | -------------- |
| **o1 SnatchAttackPolicy** | 抢球 + 进攻 | - 无球 → 以最短路径抢球（Snatch）<br> - 有球 → 以最短路径朝对手球门推进（Attack） | **主动进攻型**      |
| **o2 SnatchEvadePolicy**  | 抢球 + 逃避 | - 无球 → 同样抢球<br> - 有球 → 远离对手，沿最远路径移动（Evade）             | **控球与规避型**     |
| **o6 GuardAttackPolicy**  | 防守 + 进攻 | - 无球 → 防守对手球门前位置（Guard）<br> - 有球 → 快速朝球门推进             | **稳健反击型**      |
| **o7 GuardEvadePolicy**   | 防守 + 逃避 | - 无球 → 仍然在对手球门附近防守<br> - 有球 → 远离对手避免被断球                | **防守型 + 安全持球** |



## OPPONENT POLICIES IN PARTICLEWORLD ADVERSARY

| 编号                       | 策略名称                  | 行为核心逻辑                                      | 策略风格描述                |
| ------------------------ | --------------------- | ------------------------------------------- | --------------------- |
| **o1 FixOnePolicy**      | 固定目标策略                | 每回合随机选一个 landmark 作为目标，始终沿最短路径移动到该 landmark | **单目标执着型**：没有策略变化     |
| **o2 ChaseOnePolicy**    | 追逐单体策略                | 每回合随机选一个受控体作为追逐对象，始终追着对方走                   | **侵略追踪型**             |
| **o3 MiddlePolicy**      | 中点逼近策略                | 目标固定为两个 landmark 的中点，始终朝这个点移动               | **区域压迫型**（维持中心控制）     |
| **o4 BouncePolicy**      | 目标在两个 landmark 之间来回切换 | 当接近当前 landmark 时切换到另一个 landmark，重复此过程       | **往返巡逻型**（周期性策略）      |
| **o6 FixThreePolicy**    | 随机固定目标策略              | 每回合随机选择 landmark1、landmark2 或中点为固定目标        | **离散式多目标随机选择**        |
| **o7 ChaseBouncePolicy** | 追逐对象动态切换              | 追逐一个受控体，当距离过近则切换追逐另一个，反复循环                  | **对手压力分配型**：动态骚扰两名受控体 |


## Other_Answers


# Codes

```python

```


# FootNotes
