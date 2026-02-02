---
创建时间: 2026-一月-28日  星期三, 8:32:32 晚上
---
[[HOP+迁移至cleanrl]]


# Objectives
调研overcooked环境是否可以用来测试adaptation能力，即根据对手行为的不同，自身的行为需要调整

>哪些论文使用这个环境
>一些adaptation任务的方法使用的类似环境， 或者在原版Overcooked环境上的改变
>schelling图？ $\Longrightarrow$ 综述
>


# 关于环境
## PO-Overcooked（Partially Observable Overcooked）
>Fast Peer Adaptation with Context-aware Exploration

论文明确指出其合作环境是 PO-Overcooked，在 Carroll et al. (2019) 的 Overcooked 基础上，结合 Charakorn et al. (2023) 的多菜谱版本，并做了额外、关键性的改动，
1. 部分可观测（Partial Observability）是核心改动
2. 多菜谱 + 多原料（复杂偏好空间）
	1. 原料数：6 种(Tomato, Onion, Carrot, Lettuce, Potato, Broccoli)
	2. 菜谱数：9 种
3. adaptation 定义为：$Neps$ 个 episode 上的总回报最大化
$$\max ;\mathbb{E}\Big[\sum_{n=1}^{N_{\text{eps}}}\sum_{t=1}^{T_n} r^1_{n,t}\Big]$$
在一个固定但未知 recipe preference 的合作伙伴存在下，通过跨 episode 的交互识别该偏好，并与其协作完成对应 recipe，以最大化跨 episode 的累计回报。



## multi-recipe variant
>Generating Diverse Cooperative Agents by Learning Incompatible Policies（ICLR 2023）

论文在 Overcooked 上不是用原版，而是实现了一个 multi-recipe variant，用于测试“是否能生成行为多样的合作 agent population”
1. 原料数：4 种 ;菜谱数：6 种
2. 观测：长度 54 的 1-D 向量（位置/朝向、相对距离、手里拿的东西及其状态、相邻 counter 的布尔量、面前物体类型与状态等）


players have to complete and serve one of the six pre-defined recipes as fast as possible, as opposed to delivering a single menu item repeatedly.

指标: success rate


# 关于对手
## 带噪声的、基于偏好的 rule-based agent
>Fast Peer Adaptation with Context-aware Exploration

每一个对手策略 =(固定菜谱偏好 + 确定性子任务规划 + 可控随机扰动),
并非使用self-play的策略:
$$ψ = (recipe_{pref}, P_{nav}, P_{act})$$

## 多样 partner 分布
>Generating Diverse Cooperative Agents by Learning Incompatible Policies（ICLR 2023）

这篇不做 online adaptation；它做的是“为 adaptation 提供多样 partner 分布



丙哥，🐮！


# Insights

# Future Work
# FootNotes