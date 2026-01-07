---
创建时间: 2026-一月-7日  星期三, 3:24:16 下午
---
[[(2020-03-17) Dream to Control-Learning Behaviors by Latent Imagination]]

# Questions

- [?] 


# Answers

## GPT_Answers
# 笔记：从重建到对比（InfoNCE）——Dreamer 附录 B 相关推导

## 0. 背景动机：为什么不想做像素重建

* 生成式观测模型 $q(o_t\mid s_t)$ 意味着要"从状态解码像素"。对高维图像：
  * 需要高模型容量；
  * 容易把状态学成"图像缓存"（保留大量与控制无关的细节）；
  * 重建好不等于对控制有用。
* 替代思路：**不预测像素，而是让状态与图像强相关**（最大化互信息），并用对比学习估计互信息下界。

---

## 1) 生成式（重建）下界：式(14) 的意义

从信息瓶颈目标的第一项（状态对观测+奖励的可预测性）出发，可得一个可训练下界：

$$\mathbb{E}\Big[\sum_t \log q(o_t\mid s_t) + \log q(r_t\mid s_t)\Big]$$

解释：
* $\log q(o_t\mid s_t)$：观测重建/预测项（高维像素的 likelihood）。
* $\log q(r_t\mid s_t)$：奖励预测项（通常低维，较容易）。

**问题：**观测项需要建模高维 $q(o_t\mid s_t)$，代价大、目标不一定对齐控制。

---

## 2) 关键转换：把"观测重建"变成"互信息"形式

我们对观测项做一个等价变形（只差一个常数）：

### Step A：加减一个边缘项（常数）

$$\mathbb{E}[\log q(o_t\mid s_t)] \doteq \mathbb{E}[\log q(o_t\mid s_t) - \log q(o_t)]$$

理由：
* $\log q(o_t)$ 是数据在 encoder/数据分布下的边缘项（对表示参数不提供有效梯度或被视为常数基线），因此加减不改变优化方向（本质是梯度不变）。

### Step B：识别成互信息（在 $q$ 分布下）

$$\mathbb{E}[\log q(o_t\mid s_t) - \log q(o_t)] = I_q(s_t; o_t)$$

直觉：
* 这是"知道 $s_t$ 后对 $o_t$ 的不确定性减少多少"。

### Step C：用 Bayes rule 换成"从图像预测状态"

$$\log q(o_t\mid s_t) - \log q(o_t) = \log q(s_t\mid o_t) - \log q(s_t)$$

推导：
$$q(o_t\mid s_t)=\frac{q(s_t\mid o_t)q(o_t)}{q(s_t)}
\Rightarrow \log q(o_t\mid s_t)-\log q(o_t)=\log q(s_t\mid o_t)-\log q(s_t)$$

**重要含义：**
* 左边依赖"解码器" $q(o_t\mid s_t)$（从状态生成像素）。
* 右边依赖"编码器/状态模型" $q(s_t\mid o_t)$（从图像预测状态）。
* 这一步实现了论文说的：**用 state model 替换 observation model**，避免像素生成。

---

## 3) 新问题：出现 state marginal $q(s_t)$，通常不可计算

互信息形式变成：
$$\mathbb{E}\big[\log q(s_t\mid o_t) - \log q(s_t)\big]$$

其中：
* $\log q(s_t\mid o_t)$ 好算（网络输出分布/得分）。
* $\log q(s_t)$ 是状态边缘分布：
  $$q(s_t) = \int q(s_t\mid o)q(o)do$$
  难点：积分/期望对所有 $o$ 不可得。

所以必须引入一个可计算的估计方法：**NCE / InfoNCE**。

---

## 4) InfoNCE mini-batch 下界：用 batch 内负样本近似边缘项

核心做法：用当前 mini-batch（或当前序列 batch）中的其他观测 $o'$ 来近似"对所有 $o$"的平均。

得到下界形式（对应你截图式(15)最后一行）：
$$\mathbb{E}\Big[
\log q(s_t\mid o_t)
-\log \sum_{o'} q(s_t\mid o')
+ \log q(r_t\mid s_t)
\Big]$$

这里：
* **正样本项**：$\log q(s_t\mid o_t)$  
  让 $s_t$ 与当前图像 $o_t$ 强匹配、可预测。
* **负样本（归一化）项**：$-\log \sum_{o'} q(s_t\mid o')$  
  让同一个 $s_t$ 不要对所有图像都高概率（防止 collapse）。  
  直观上，它在估计 $\log q(s_t)$ 的"分母/背景频率"。
* **奖励项仍然保持生成式**：$\log q(r_t\mid s_t)$  
  因为奖励低维，建模代价小且直接与控制相关。

---

## 5) 直观图景：这套对比目标在做什么？

可以把它看成一个分类问题：

> 给定一个状态样本 $s_t$，在一堆候选图像 $\{o_t, o'_1, \dots\}$ 中，哪个是与它匹配的"正确图像"？

* 正样本：$(s_t, o_t)$
* 负样本：$(s_t, o')$

优化目标鼓励：
* 正配对得分高；
* 其他配对得分低；
  从而最大化状态与观测之间的互信息下界。

---

## 6) 为什么"已经有重建下界"还要走这一步？

因为这不是"多加一层下界"，而是**替换建模路线**：
* 重建路线（式14）：需要 $q(o_t\mid s_t)$ ——高维像素生成，吃容量、偏离控制。
* 对比路线（式15）：用 $q(s_t\mid o_t)$ + InfoNCE 估计互信息 ——无需像素解码器，更聚焦可区分因素、更节省容量、抗 collapse。

---

## 7) 你可以记住的最简总结（可背诵）

1. 重建下界给出 $\log q(o_t\mid s_t)$，但像素重建昂贵且不一定对控制有用。
2. 加减 $\log q(o_t)$ 得到互信息形式；用 Bayes 把它改写为 $\log q(s_t\mid o_t)-\log q(s_t)$。
3. $\log q(s_t)$ 难算，用 InfoNCE 的 mini-batch 负样本 $\sum_{o'} q(s_t\mid o')$ 近似。
4. 最终目标：正样本匹配 + 负样本分母防塌缩 + 奖励仍用生成式预测。

## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
