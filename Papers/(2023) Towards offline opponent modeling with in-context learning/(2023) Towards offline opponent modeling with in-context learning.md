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

下面整理这篇论文中 **所有 baseline 方法的背景、核心思想、模型结构要点、以及为什么能够用于离线对手建模（OOM）对比实验**。内容已经为你总结成可直接写进论文或 PPT 的形式。

---

## **1) DRON-concat（He et al., 2016a）**

**论文：** *Opponent modeling in deep reinforcement learning*, ICML 2016

### **核心思想**

* DRON（Deep Reinforcement Opponent Network）是最早将“对手建模模块 + 自身决策模块”结合的深度对抗 RL 方法之一。
* DRON-concat 版本将**对手的特征向量**与**自身的状态特征** **直接拼接（concatenate）** 后送入策略网络决策。

### **如何建模对手**

* 对手特征为**手工特征（hand-crafted features）**，如对手最近动作、行为统计等。
* 辅助网络将这些特征编码成 embedding，再与自身状态特征合并。

### **优缺点**

| 优点            | 缺点                |
| ------------- | ----------------- |
| 实现简单          | 对手特征依赖人工设计，表达能力有限 |
| 可快速适配到 OOM 实验 | 不能泛化到复杂或新对手策略     |

---

## **2) DRON-MoE（He et al., 2016a）**

同样来自 DRON，但采用了 **Mixture-of-Experts（MoE）** 结构。

### **核心思想**

* 对手策略可能来自多个策略模式（style），MoE 可以 **自动选择更匹配的子策略专家**。
* 相当于让模型学会：“当前对手长得像哪种对手？”

### **对手建模方式**

* 多个“专家”网络并行输出动作建议；
* 一个 gating network 根据对手特征选择权重。

### **对比 DRON-concat 的优势**

* **可以隐式识别对手策略类别 → 更接近 OOM 的需求**

### **不足**

* 仍然依赖对手特征是人工构造 → 泛化能力仍有限。

---

## **3) LIAM（Papoudakis et al., 2021）**

**论文：** *Agent modelling under partial observability for deep RL*, NeurIPS 2021

### **核心思想**

* 通过 **AutoEncoder（AE）重建对手行为序列**来学习对手策略 embedding。
* 受控智能体不需要对手真实内部状态，只通过对手可观察动作和轨迹就能学习其策略“风格”。

### **思路流程**

1. 用 AE 编码对手轨迹 → 得到低维 embedding；
2. 将 embedding 作为额外输入送入受控智能体策略网络。

### **特点**

* 能从轨迹中**自动提取对手行为模式**；
* 比 DRON 系列**更通用、无需手工特征**。

---

## **4) MeLIBA（Zintgraf et al., 2021）**

**论文：** *Deep Interactive Bayesian Reinforcement Learning via Meta-Learning*, AAMAS 2021

### **核心思想**

* 与 LIAM 类似，但使用 **变分自编码器（VAE）** 而不是普通 AE。
* VAE 提供了一个**可解释且可采样的对手策略分布表示**。

### **优势**

* Embedding 不仅是点表示（deterministic），而是**概率分布** → 可以表达行为不确定性与多样性。

### **适用于 OOM 的原因**

* 可以总结多个已知对手策略间共享的行为结构，并泛化到未知对手。

---

## **5) Prompt-DT（Xu et al., 2022）**

**论文：** *Prompting Decision Transformer for Few-Shot Policy Generalization*, ICML 2022

### **核心思想**

* Decision Transformer（DT）将 RL 任务转成序列建模（类似语言模型）。
* Prompt-DT 在输入序列前加上 **context prompt**，用于表征不同任务或策略条件。

### **为什么可以用于 OOM**

* 对手不同策略可视为不同任务；
* 将对手轨迹片段（或奖励-To-Go、状态行为序列）作为**prompt**，引导策略快速适应。

### **局限**

* Prompt 只使用受控智能体侧数据，而**忽略对手信息本身**，因此在 unseen 对手场景上表现较差（论文实验也证实了）。

---

## **6) TAO w/o PEL（本文消融）**

* 即 **移除 Policy Embedding Learning 阶段**（不训练 OPE，不用 L_gen 和 L_dis）。
* 直接进入 Stage 2 的 in-context response training。

### **作用**

* 作为消融对照，用于证明：

  * **PEL 对于表示对手策略差异**是必要的；
  * 没有 PEL，将削弱模型辨析并适应不同对手的能力。

---

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
