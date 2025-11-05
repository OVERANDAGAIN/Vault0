#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
# Innovation
# Theroy
# Perspective
# Formulation
# Background
# Related Work

## **1) DRON-concat（He et al., 2016a）**

**论文：** *Opponent modeling in deep reinforcement learning*, ICML 2016

### **核心思想**

* DRON（Deep Reinforcement Opponent Network）是最早将“对手建模模块 + 自身决策模块”结合的深度对抗 RL 方法之一。
* DRON-concat 版本将**对手的特征向量**与**自身的状态特征** **直接拼接（concatenate）** 后送入策略网络决策。

---

## **2) DRON-MoE（He et al., 2016a）**

同样来自 DRON，但采用了 **Mixture-of-Experts（MoE）** 结构。

### **核心思想**

* 对手策略可能来自多个策略模式（style），MoE 可以 **自动选择更匹配的子策略专家**。
* 相当于让模型学会：“当前对手长得像哪种对手？”

### **对手建模方式**

* 多个“专家”网络并行输出动作建议；
* 一个 gating network 根据对手特征选择权重。

---

## **3) LIAM（Papoudakis et al., 2021）**

**论文：** *Agent modelling under partial observability for deep RL*, NeurIPS 2021

### **核心思想**

* 通过 **AutoEncoder（AE）重建对手行为序列**来学习对手策略 embedding。
* 受控智能体不需要对手真实内部状态，只通过对手可观察动作和轨迹就能学习其策略“风格”。


---

## **4) MeLIBA（Zintgraf et al., 2021）**

**论文：** *Deep Interactive Bayesian Reinforcement Learning via Meta-Learning*, AAMAS 2021

### **核心思想**

* 与 LIAM 类似，但使用 **变分自编码器（VAE）** 而不是普通 AE。
* VAE 提供了一个**可解释且可采样的对手策略分布表示**。


---

## **5) Prompt-DT（Xu et al., 2022）**

**论文：** *Prompting Decision Transformer for Few-Shot Policy Generalization*, ICML 2022

### **核心思想**

* Decision Transformer（DT）将 RL 任务转成序列建模（类似语言模型）。
* Prompt-DT 在输入序列前加上 **context prompt**，用于表征不同任务或策略条件。

## **总结比较表**

| 方法          | 是否手工特征           | 是否自动学习对手 embedding | 是否可泛化到 unseen 对手 | 表示方式                                      |
| ----------- | ---------------- | ------------------ | ---------------- | ----------------------------------------- |
| DRON-concat | ✅ 是              | ❌ 否                | ❌ 差              | 拼接特征                                      |
| DRON-MoE    | ✅ 是              | ⚠️ 部分              | ❌ 一般             | 专家混合结构                                    |
| LIAM        | ❌ 否              | ✅ 是（AE）            | ⚠️ 中等            | 轨迹重构 embedding                            |
| MeLIBA      | ❌ 否              | ✅ 是（VAE）           | ✅ 更优             | 概率分布 embedding                            |
| Prompt-DT   | ❌ 没有对手信息         | ❌ 否                | ❌ 差              | Prompt 任务指定                               |
| TAO w/o PEL | ❌ 不预训练 embedding | ⚠️ 部分              | ⚠️ 可适应但弱         | 直接 in-context                             |
| **TAO（本文）** | ❌ 否              | ✅ 是（生成 + 判别式对手表征）  | ✅ 最强             | Transformer in-context + policy embedding |

---


# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
