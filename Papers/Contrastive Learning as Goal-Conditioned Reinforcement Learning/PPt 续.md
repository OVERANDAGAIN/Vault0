---
创建时间: 2025-七月-29日  星期二, 2:49:34 下午
---
好的，以下是对论文第 3 节 **Preliminaries（预备知识）** 的 PPT 整理，适合用于介绍 contrastive RL 方法前的背景铺垫。建议在正式进入方法之前用 **1～2页 PPT** 简明介绍这些概念。

---

### 🎓 Slide：预备知识 – 目标导向强化学习（Goal-Conditioned RL）

#### ✅ 定义（任务建模）

* 强化学习中每个任务目标被建模为一个“目标状态”（goal state）\$s\_g\$
* 问题组成：

  * 状态空间：\$s\_t \in \mathcal{S}\$
  * 动作空间：\$a\_t \in \mathcal{A}\$
  * 初始状态分布：\$p\_0(s)\$
  * 状态转移概率：\$p(s\_{t+1} | s\_t, a\_t)\$
  * 目标状态分布：\$p\_g(s\_g)\$
  * 每个目标对应一个奖励函数：\$r\_g(s, a)\$

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

### 🔁 Slide：折扣状态占用分布 & 多策略经验融合

#### 📉 折扣状态占用分布（Discounted State Occupancy Measure）：

$$
p^\pi(st^+ = s \mid s, a, s_g) = (1 - \gamma) \sum_{t=0}^\infty \gamma^t p^\pi_t(s_t = s)
$$

* 从几何分布 \$t \sim \text{Geom}(1 - \gamma)\$ 中采样时间步，取该时刻访问的状态

#### 🔄 平均策略下的目标加权状态分布（用于经验融合）：

$$
p^\pi(st^+ = s \mid s, a) = \int p^\pi(st^+ = s \mid s, a, s_g) \cdot p^\pi(s_g \mid s, a) \, ds_g
$$

---
