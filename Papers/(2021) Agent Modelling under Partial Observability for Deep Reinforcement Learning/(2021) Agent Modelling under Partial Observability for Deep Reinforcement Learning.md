---
创建时间: 2026-三月-17日  星期二, 8:53:51 晚上
---
#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
## 问题一：LIAM算法是基于轨迹的吗？也就是输入从0时刻至t时刻的轨迹去重建或者编码？

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
