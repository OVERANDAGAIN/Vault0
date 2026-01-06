---
创建时间: 2026-一月-6日  星期二, 8:44:50 晚上
---
[[(2020-03-17) Dream to Control-Learning Behaviors by Latent Imagination]]

# Questions

- [?] 
如何理解这句话：
>The value model is updated to regress the targets, around which we stop the gradient as typical

# Answers

## GPT_Answers
这句话可以拆成两层来理解：**“critic 怎么学”以及“哪些地方不传梯度”**。

---

## 1) “updated to regress the targets” 是什么意思

这里的 *value model* 指价值网络 $v_\psi(s)$（critic）。
“regress the targets” 指它用监督回归的方式去拟合一个目标值（target），例如论文里用的 $\lambda$-return：

$$\min_\psi ; \mathbb{E}\big[(v_\psi(s_\tau) - \text{target}_\tau)^2\big]$$

也就是：把 $\text{target}_\tau$ 当作“标签”，让 $v_\psi$ 逼近它。

---

## 2) “around which we stop the gradient” 是什么意思

关键是：这个 target（例如 $V_\lambda(s_\tau))$并不是常数，它本身由很多可学习模块产出/参与计算，比如：

* world model（奖励预测、状态转移）
* actor（因为 imagined trajectory 由 $\pi$ 采样/生成动作）
* 甚至 target 里还可能出现另一个 $v_\psi$（bootstrap 项）

如果你不做任何处理，反向传播会沿着 target 这条计算图回流，导致：

* critic 的梯度不仅更新 critic 本身，还会“顺便”更新 world model / actor（以及 critic 自己在 target 端的那份）
* 这会造成目标漂移（moving target）更严重，训练不稳定，甚至出现“自举自洽但数值发散”的问题

所以论文说的 **stop the gradient**，就是：在计算 critic 的损失时，把 target 当作常数对待，**不允许梯度从损失穿过 target 回传到生成 target 的网络**。

形式上就是：
$$L_v = \big(v_\psi(s_\tau) - \text{sg}(\text{target}_\tau)\big)^2$$
其中 $\text{sg}(\cdot)$ 表示 stop-gradient（detach）。

---

## 3) “as typical” 指什么“典型做法”

在 actor-critic / TD 学习里，这是标准做法：

* critic 拟合一个由“旧估计/自举”构成的 target
* target 端不反传梯度，避免出现“自己追着自己跑”的不稳定问题
  这和 DQN 的 target network、TD target 的 detach、GAE 里 advantage 的 detach，思想一致。

---

## 4) Dreamer 语境下更具体的直觉

* **critic 更新**：只让 $v_\psi(s)$ 变得更接近 $V_\lambda$，所以梯度只作用在 $v_\psi(s)$ 这一边。
* **actor 更新**：才需要让梯度穿过 imagined trajectory（世界模型）去更新策略，这在论文的 actor objective 里单独做。
  两者职责分离，训练更稳。



## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
