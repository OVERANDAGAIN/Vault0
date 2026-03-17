---
创建时间: 2026-三月-17日  星期二, 8:53:51 晚上
---
#paper_summary 

# Inspiration
## Take-away Message
文章认为==其他智能体的行为会影响受控智能体的观察==，因此可以学习受控智能体（the controlled agent）与其他被建模智能体（the modeled agents）的轨迹间的联系。
## Inspiration for Us


# Focus
## 问题一：LIAM算法是基于轨迹的吗？也就是输入从0时刻至t时刻的轨迹去重建或者编码？
![[Pasted image 20260317212739.png]]


LIAM 的 **encoder 是一个 recurrent encoder（LSTM）**，在每个时刻 $t$ 生成 embedding $z_t$。这个 $z_t$ 不是只看当前一步，而是条件在 **controlled agent 到当前时刻为止的局部历史** 上，也就是 $(o^1_{1:t}, a^1_{1:t-1})$。论文原文明确写了：
>at each time step $t$, the encoder generates $z_t$, conditioned on the controlled agent’s information up to time $t$。

但 decoder **不是拿 $0:t$ 整段轨迹一次性重建整条序列**。它在每个时刻 $t$ 用当前的 $z_t$ 去重建 **modelled agent 在当前时刻的 observation 和 action**，即 $(o^{-1}_t, a^{-1}_t)$，训练损失也是对所有时刻求和。


## 问题二：为什么会有lIAM-VAE这个baseline，和原算法有什么不同？
这里的 LIAM-VAE 其实不是 Figure 3 里那种“主 baseline”，而是 **Section 4.5 ablation study 里专门拿来检验 LIAM 架构设计的一个变体**。作者在这一节里就是想说明：为什么他们最终采用的是现在这个“简单的 deterministic encoder-decoder LIAM”，而不是更复杂的 variational sequential latent model。论文明确说，他们额外评估了一个 **variational encoder-decoder model**，称为 **LIAM-VAE**，它对一个 HMM 风格的 latent process 做 inference，并学习一个先验 $p(z_t \mid z_{t-1})$ 来表达 latent 的时间关系。

它和原始 LIAM 的主要区别有三点：

1. **LIAM 是 deterministic embedding；LIAM-VAE 是 stochastic latent variable model**
   * LIAM：encoder 直接输出 $z_t$。
   * LIAM-VAE：encoder 输出高斯 posterior 的均值和方差，再从中得到 latent；actor/critic 用的是 posterior mean。

2. **LIAM-VAE 多了显式 prior / KL regularization**
   * 原始 LIAM 的损失就是 reconstruction loss（obs MSE + action log-likelihood）。
   * LIAM-VAE 优化的是 ELBO，多了 $\mathrm{KL}(q \mid p)$ 约束，而且 prior 建模 $p(z_t \mid z_{t-1})$ 的时间依赖。

3. **动机不同**
   * 原始 LIAM 更强调“让 $z_t$ 尽量信息充分，能支持 agent modelling 和 downstream RL”。
   * LIAM-VAE 则引入概率建模和时间先验，测试“更标准的 sequential VAE 做法”是否更好。

作者最后的结论是：**LIAM-VAE 比 LIAM 差**，他们认为主要原因是 **KL regularization 太强，限制了表示的信息量**，导致 learned representations 没有 LIAM 那么 informative。

所以，为什么会有这个 baseline？本质上是为了回答一个设计问题：

> “LIAM 需要做成 VAE / HMM 式的 latent sequence model 吗？”

作者的实验回答是：**不需要，至少在他们的设定里，简单的 LIAM 更好。**

## 问题三：Figure 4中的b和c都有action reconstruction accuracy这个指标，为什么放两次？
所以两者不是重复，而是两个切片：

* **4b：时间维度分析**，回答“随着 episode 推进，LIAM 什么时候变得足够准？”
* **4c：环境维度分析**，回答“在固定时刻，不同环境谁更容易/更难被建模？”

作者还解释了为什么 4c 里 LBF 和 PP 更低：因为这些环境里 controlled agent **不一定总能观察到 modelled agent**，所以更难预测其动作。

你可以把它理解成：



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
