[[(2020-03-17) Dream to Control-Learning Behaviors by Latent Imagination]]

# Questions

- [?] 


# Answers

## GPT_Answers

这里的 **(I)** 指的是**互信息（Mutual Information）**，是信息论中的一个基本量，用来**度量两个随机变量之间共享的信息量**。

---

## 1) 互信息的正式定义

对两个随机变量 $X, Y$，互信息定义为：

$$I(X;Y) \doteq \mathbb{E}_{p(x,y)}\left[\log \frac{p(x,y)}{p(x)p(y)}\right]$$

等价形式还有：

$$I(X;Y) = \mathbb{E}_{p(x,y)}[\log p(x\mid y)] - \mathbb{E}_{p(x)}[\log p(x)]$$

$$I(X;Y) = H(X) - H(X\mid Y) = H(Y) - H(Y\mid X)$$

其中：

* $H(\cdot)$：熵（entropy）
* $H(\cdot\mid\cdot)$：条件熵

---

## 2) 互信息“在量化什么”（直觉）

一句话直觉：

> **知道 $Y$ 之后，对 $X$ 的不确定性减少了多少。**

* 若 $I(X;Y)=0$：
  $X$ 与 $Y$ 完全独立，知道一个对另一个没有任何帮助。
* 若 $I(X;Y)$ 大：
  $X$ 和 $Y$ 强相关，信息高度共享。

---

## 3) 条件互信息（论文里常用）

在你看到的 IB 目标中，用的是**条件互信息**：

$$I(X;Y\mid Z)$$

定义为：

$$I(X;Y\mid Z) = \mathbb{E}_{p(x,y,z)}\left[\log \frac{p(x,y\mid z)}{p(x\mid z)p(y\mid z)}\right]$$

直觉：

> **在已知 $Z$ 的前提下，$X$ 与 $Y$ 还剩多少关联。**

在强化学习/世界模型中，$Z$ 常是动作序列 $a_{1:T}$，意思是：**控制因素固定后，状态与观测/奖励之间的依赖强度**。

---

## 4) 为什么互信息在 IB 里是核心

IB 的目标：

$$\max\ I(Z;Y) - \beta I(Z;X)$$

每一项都是互信息，因为互信息有两个关键性质：

1. **与参数化无关**：不依赖具体的网络结构
2. **直接刻画“信息保留 vs 信息压缩”**，而不是某个特定损失函数

因此它非常适合用来定义“什么是好的表示”。

---

## 5) 放回你当前论文语境的一句话解释

在那篇论文里：

* $I(s;(o,r)\mid a)$：
  潜状态 $s$ **对预测观测和奖励有多有用**
* $I(s;i\mid a)$：
  潜状态 $s$ **从当前输入中记住了多少“样本身份/细节”**

两者一拉一压，定义了“既有用又不冗余”的 latent state。

---

## 6) 一句话总结

**$I(\cdot;\cdot)$ 是互信息，衡量两个随机变量之间共享的信息量；在 IB 中，它被用来精确刻画“保留任务相关信息”和“压缩输入冗余信息”这两种相互对抗的目标。**
## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
