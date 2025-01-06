---
创建时间: 2025-一月-2日  星期四, 4:20:16 下午
---
#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us





# Focus
Multi-Goal Transformers with Prompt Optimization

takes a goal sequence as a prompt and predicts actions in the following sequence of environment observations

we only optimize for the sequence of goals in the prompt

# Innovation
pre-training multi-goal Transformer
novel methods for optimizing goal sequences

# Theroy



# Background



# Related Work




# Methodology
![[Pasted image 20250106182701.png]]


1. Pre-Training Multi-Goal Transformers
### 重新总结段落内容：

**目标序列与提示生成**  
为了抽象代理的长期行为，本文使用目标序列 $g = (g_1, \dots, g_H)$ 来描述轨迹中的关键状态。具体来说：
1. 对于轨迹 $\tau = (o_1, \dots, o_H)$，构造目标序列 $g$ 与轨迹长度一致。
2. 从目标序列中随机采样一个子序列 $p = (g_{i_1}, \dots, g_{i_k}, g_H)$，确保最后一个目标 $g_H$ 始终位于提示末尾。
3. 采样过程可以表示为 $p \sim P(p|\tau)$，提示长度和粒度可变，从而能以不同精度描述行为。

**策略模型设计**  
借鉴 Decision Transformers 的思想，构建因果 Transformer 模型 $\pi_\theta(a_t|p, h_{t-1}, o_t)$，输入为拼接的提示与轨迹序列 $(p, \tau) = (g_{i_1}, \dots, g_{i_k}, g_H, o_1, a_1, \dots, o_H, a_H)$。在每个时间步 $t$，策略仅通过因果注意力掩码访问子序列 $g_{i_1} \dots o_t$，并预测动作分布。

**训练目标与优化**  
通过行为克隆训练策略参数 $\theta$，目标是最大化以下对数似然：
$$\max_\theta \mathbb{E}_{\tau \in D, p \sim P(p|\tau)} \left[ \sum_{t=1}^H \log \pi_\theta(a_t|p, h_{t-1}, o_t) \right].$$
该方法通过利用提示中提供的信息，减少动作预测的不确定性，并能在多种目标间无缝调整行为。




# Evaluation



# Results



# Limitations


# FootNotes
