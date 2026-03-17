---
创建时间: 2026-三月-17日  星期二, 8:53:51 晚上
---
#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
## 问题一：LIAM算法是基于轨迹的吗？也就是输入从0时刻至t时刻的轨迹去重建或者编码？
![[Pasted image 20260317212739.png]]


LIAM 的 **encoder 是一个 recurrent encoder（LSTM）**，在每个时刻 $t$ 生成 embedding $z_t$。这个 $z_t$ 不是只看当前一步，而是条件在 **controlled agent 到当前时刻为止的局部历史** 上，也就是 $(o^1_{1:t}, a^1_{1:t-1})$。论文原文明确写了：
>at each time step $t$, the encoder generates $z_t$, conditioned on the controlled agent’s information up to time $t$。

但 decoder **不是拿 $0:t$ 整段轨迹一次性重建整条序列**。它在每个时刻 $t$ 用当前的 $z_t$ 去重建 **modelled agent 在当前时刻的 observation 和 action**，即 $(o^{-1}_t, a^{-1}_t)$，训练损失也是对所有时刻求和。


## 问题二：为什么会有lIAM-VAE这个baseline，和原算法有什么不同？

## 问题三：Figure 4中的b和c都有action reconstruction accuracy这个指标，为什么放两次？




# Innovation
# Theroy
方法：LIAM （local information agent modeling)
Encoder-decoder架构：
	encoder: 自己的轨迹变为latent
	decoder:latent重建对手的obs和action
实验：合作（double spealer-listener)竞争（modified predator prey) 混合（level-based foraging)
对比基线：FIAM（upper bound)、NAM(lower bound)、VariBad、CBAM、CARL

主要结论：LIAM 在只用本地信息执行的前提下，通常显著优于不做显式 agent modelling 的方法，并在部分场景接近使用完整对手轨迹的上界方法 FIAM
![[Pasted image 20260317211835.png|400]]
# Perspective
1. 类似于CTDE的，执行时只有自己的信息，拿不到对手的信息
2. 直接基于轨迹的重建或者编码？
3. 
# Formulation
# Background
# Related Work
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
