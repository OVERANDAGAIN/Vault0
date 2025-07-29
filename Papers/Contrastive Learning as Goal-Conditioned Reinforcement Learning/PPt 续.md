---
创建时间: 2025-七月-29日  星期二, 2:49:34 下午
---

### 🎓 Slide：预备知识 – 目标导向强化学习（Goal-Conditioned RL）


### ✅ 定义（任务建模）

在目标导向强化学习（Goal-Conditioned RL, GCRL）中，每个任务由一个目标状态 $s_g$ 表示，其问题定义如下：

* **状态空间**：$s_t \in \mathcal{S}$
* **动作空间**：$a_t \in \mathcal{A}$
* **初始状态分布**：$p_0(s)$
* **环境动力学（转移概率）**：$p(s_{t+1} \mid s_t, a_t)$
* **目标状态分布**：$p_g(s_g)$
* **每个目标对应的奖励函数**：$r_g(s, a)$

---

是否需要我将这部分格式化为适用于 PowerPoint 的文字或图示版本？我也可以继续为下一页方法部分设计。


---

### 🧩 Slide：GCRL 中的目标奖励定义与优化目标

#### 🎯 奖励函数定义（避免手动设计距离函数）：

$$
r_g(s_t, a_t) = (1 - \gamma) \cdot p(s_{t+1} = s_g \mid s_t, a_t)
$$

> 即一步之内达到目标状态的概率密度，替代手动设定距离度量（如 L2）

---

#### 💡 强化学习目标函数

* 最大化采样目标后轨迹回报：

$$
\max_\pi \mathbb{E}_{s_g \sim p_g, \tau \sim \pi(\cdot|s_g)} \left[ \sum_{t=0}^\infty \gamma^t r_g(s_t, a_t) \right]
$$

* Q函数定义为带条件目标的期望累计回报：

$$
Q^\pi_{s_g}(s,a) = \mathbb{E} \left[ \sum_{t'=t}^\infty \gamma^{t'-t} r_g(s_{t'}, a_{t'}) \mid s_t = s, a_t = a \right]
$$

---

---


### 🔁 Slide：折扣状态占用分布 & 多策略经验融合

#### 📉 折扣状态占用分布（Discounted State Occupancy Measure）：

$$
p^\pi(st^+ = s \mid s, a, s_g) = (1 - \gamma) \sum_{t=0}^\infty \gamma^t p^\pi_t(s_t = s)
$$

* 从几何分布  $t \sim \text{Geom}(1 - \gamma)$ 中采样时间步，取该时刻访问的状态

#### 🔄 平均策略下的目标加权状态分布（用于经验融合）：

$$
p^\pi(st^+ = s \mid s, a) = \int p^\pi(st^+ = s \mid s, a, s_g) \cdot p^\pi(s_g \mid s, a) \, ds_g
$$




---
---

---

### 🎓 预备知识（2/2）：对比表示学习

#### ✅ 基本概念

* **对比学习（Contrastive Learning）**：从**正样本对**与**负样本对**中学习表示，使得：

  * 正样本对表示相似（靠近）
  * 负样本对表示不相似（远离）

---

#### ✅ 示例形式

* 设输入为一对样本 $(u, v)$，例如：

  * $u$：一张原始图像；
  * $v$：该图像的某种增强版本。

* 样本对的采样方式：

  * **正样本对**：从联合分布 $p(u, v)$ 中采样；
  * **负样本对**：从边缘分布 $p(u)p(v)$ 中独立采样（无语义关系）。

---

#### ✅ 目标函数定义：基于二分类的 NCE 损失

我们使用 **NCE-binary 对比损失**，也被称为 **InfoNCE/InfoMax 目标**：

$$
\max_{f(u, v)} \; \mathbb{E}_{(u, v^+) \sim p(u, v)} \; \mathbb{E}_{v^- \sim p(v)} \left[
\log \sigma(f(u, v^+)) + \log (1 - \sigma(f(u, v^-)))
\right]
$$

其中：

* $f(u, v) = \phi(u)^\top \psi(v)$：称为**critic函数**，即两种编码器之间的相似度；

  * $\phi(u)$：表示 u 的编码器；
  * $\psi(v)$：表示 v 的编码器；
* $\sigma(\cdot)$：Sigmoid 函数，用于二分类；
* $v^+$：与 u 同源的正样本；
* $v^-$：与 u 无关的负样本。

---



