---
创建时间: 2025-一月-15日  星期三, 12:44:55 下午
created: 2025-01-15T12:44
updated: ...
---
#experiments


# Objectives
## ***2025-01-21***
1. ~~Train HOP~~
2. ~~MCTS、RLlib 与 OMG 的  controller 关系~~
3. ~~整合Goal inference 到belif over goal 前~~
4. ~~先基于猎鹿的代码~~
5. ~~EFT替代MCTS的可行方法——发邮件 2025-1-21-17:45~~
6. HOP迭代更新
7. ~~最终可能的要训练的有三个模块~~
8. ~~等邮件结果——2025-1-23-14:51~~ $\Longrightarrow$ at least 5 Feb 2025
9. OMG的Buffer, ~~episode_batc~~h相关与HOP适配

---
## ***2025-3-10***

训练lola、vae
整理优化代码
优化git仓库，上传

---
## ***2025-3-14***
1. nearset-stag 和 nearest-hare 上测试 goal inference 的效果
2. HOP 的 state 是 二维地图 （4\*4\*5） 的 0-1 分布 。所以 vae 的loss 计算应该用 ==bce== 而非 mse?

---
## ***2025-3-24***

### 一堆控制变量，变量： 

1.  `omg_buffer` 相关
	1. ~~定期清除 `buffer`  内的历史轨迹，更新~~
	2. 写为和 `moa_buffer` 类似的处理 $\Longrightarrow$ ==合并==
2.  `horizon` 相关
	1. ~~数值变化  $15$ $\Longrightarrow$ $10$~~
	2.  `MCTS` 中==是否==每步需要更新 `goal` ，还是一段时间更新一次？
3. 重建损失 `recon_loss`  的优化： 相较于 `MSE` ，能否使模型更关注 `goal` 的信息？
	1. 目标维度变化 $64$ $\Longrightarrow$ $16$ $\Longrightarrow$ $4$ $\Longrightarrow$ $2$ ，使得训练 `loss` 没那么 低 且 不明显
	2. ==重新设计== `omg_loss` 
4. `MCTS` 树的数量变化 $\Longrightarrow$ 训练更鲁棒  $1$ $\Longrightarrow$ $5$
	-  ~~可用 `for` 循环处理多棵树，不一定用 `pool` (因为后者只能使用CPU)~~
5. 延伸： 部分观察的环境 去替代 原来的 全观测
---

# Results




# Insights




# Setup




# Methodology





# Issues & Debugging

## Problem1
- [?] 

### 1_Answers


### 2_Answers



## Problem2
- [?] 

### 1_Answers


### 2_Answers



# Limitations




# Future Work




# FootNotes