---
创建时间: 2026-一月-15日  星期四, 3:09:12 下午
---
#experiments
![[Pasted image 20260115151001.png]]

# Objectives

几个新环境：
1. Cleanup
2. CoinGame
3. SnowDrift
4. StagHunt
5. ModifiedCleanup?
6. IPD
# Results
# Insights
## on_policy和off_policy的更新分离开来：

两条路径的对照表（只谈处理方式）

| 项目       | On-policy 路径                         | Off-policy（buffer-sampled）路径                 |
| -------- | ------------------------------------ | -------------------------------------------- |
| 数据来源     | 当前 episode 采样得到                      | ReplayBuffer 历史 episode 抽样                   |
| 关键数据结构   | `log_probs`, `values`, `update_info` | `buffer[i]`, `sample()`                      |
| 触发频率     | 每 `update_freq`                      | 每 `self_update_freq` 且 `size()>minimal_size` |
| 更新对象     | `symp_agents`                        | `selfish_agents` + `agents_imagine`          |
| 时间维度处理   | 用 `this_eps_len` 的有效段                | 遍历 `env.final_time` 的序列（含 padding）           |
| 是否依赖历史复用 | 基本不复用                                | 强复用（抽样）                                      |

## 

# Setup
# Methodology
# Issues & Debugging

## Problem1: 
- [?] 

### 1_Answers


### 2_Answers



## Problem2: 
- [?] 

### 1_Answers


### 2_Answers



# Limitations
# Future Work
# FootNotes