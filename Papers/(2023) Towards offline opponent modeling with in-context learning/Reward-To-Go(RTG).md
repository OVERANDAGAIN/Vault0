---
创建时间: 2025-十一月-18日  星期二, 4:22:33 下午
---
[[(2023) Towards offline opponent modeling with in-context learning]]

# Questions

- [?] 这里的$G_{t}$表示的是奖励的总和，但是并没有计算折扣的奖励（`expected cumulative discounted reward`)

![[Pasted image 20251118162338.png]]

## 下面两个例子同上，没有计算折扣的奖励： 
1. [comparison - What is the return-to-go in reinforcement learning? - Artificial Intelligence Stack Exchange](https://ai.stackexchange.com/questions/24005/what-is-the-return-to-go-in-reinforcement-learning)[^1]
   ![[Pasted image 20251118162949.png]]
   ```ad-tip
   并且上面的讨论还谈到了：Reward-To-Go 和 Return-To-Go:
   >Short answer:  the return-to-go is just a synonym of the reward-to-go, which instead is a well known term used to define the basic form of policy gradient, e.g. REINFORCE-like.
   ```
2. [SAS Help Center](https://documentation.sas.com/doc/it/pgmsascdc/v_061/casrlpg/p13fq0r9wk6vtnn14ptfx8skiaz1.htm)[^2]
![[Pasted image 20251118163144.png]]
## 但是在下面的例子里面使用的折扣的奖励：

1. [策略梯度算法](https://hrl.boyuai.com/chapter/2/%E7%AD%96%E7%95%A5%E6%A2%AF%E5%BA%A6%E7%AE%97%E6%B3%95)[^3]
![[Pasted image 20251118163204.png]]


# Answers

## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: 未计算折扣奖励的例子1
[^2]: 未计算折扣价奖励的例子2
[^3]: 使用折扣奖励的例子1