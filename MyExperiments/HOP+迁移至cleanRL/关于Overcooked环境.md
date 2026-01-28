[[HOP+迁移至cleanrl]]


# Objectives
调研overcooked环境是否可以用来测试adaptation能力，即根据对手行为的不同，自身的行为需要调整

>哪些论文使用这个环境
>一些adaptation任务的方法使用的类似环境， 或者在原版Overcooked环境上的改变
>schelling图？ $\Longrightarrow$ 综述
>t-SNE


# 关于环境
## PO-Overcooked（Partially Observable Overcooked）
>Fast Peer Adaptation with Context-aware Exploration

论文明确指出其合作环境是 PO-Overcooked，在 Carroll et al. (2019) 的 Overcooked 基础上，结合 Charakorn et al. (2023) 的多菜谱版本，并做了额外、关键性的改动，
1. 部分可观测（Partial Observability）是核心改动
2. 多菜谱 + 多原料（复杂偏好空间）
	1. 原料数：6 种(Tomato, Onion, Carrot, Lettuce, Potato, Broccoli)
	2. 菜谱数：9 种
3. adaptation 定义为：$Neps$ 个 episode 上的总回报最大化




# 关于对手
## 带噪声的、基于偏好的 rule-based agent
>Fast Peer Adaptation with Context-aware Exploration

每一个对手策略 =(固定菜谱偏好 + 确定性子任务规划 + 可控随机扰动),
并非使用self-play的策略:
$$ψ = (recipe_{pref}, P_{nav}, P_{act})$$








# Insights

# Future Work
# FootNotes