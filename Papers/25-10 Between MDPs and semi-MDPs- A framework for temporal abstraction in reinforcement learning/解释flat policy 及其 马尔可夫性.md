[[25-10 Between MDPs and semi-MDPs-A framework for temporal abstraction in reinforcement learning]]
p7
# Questions

- [?] 
![[Pasted image 20251009213015.png]]

# Answers

## GPT_Answers
好的，我来帮你把前面对 **flat policy** 和 **马尔可夫性** 的解释重新整理成一个统一、规范的说明版本（公式都按 `$…$` 规则输出）：

---

# Flat Policy 与 Markov 性

## 背景：Policies over Options

在 **Semi-MDP (SMDP)** 中，agent 的决策并不总是直接作用于 **原子动作 $a \in \mathcal{A}$**，而是通过更高层的 **options (选项)**。

一个 **option $o$** 本质上是一个“子策略”，它从某状态启动，然后在内部执行一系列原子动作，直到达到终止条件。
这就产生了两层决策：

1. **高层策略 (policy over options)**：
   $\mu : \mathcal{S} \to \mathcal{O}$，在状态 $s_t$ 下选择 option $o$。

2. **option 内部策略**：
   在 option 内部，每个时间步决定执行的 primitive action。

---

## Flat Policy 的定义

由于每个 option 最终都会映射为一连串原子动作，从环境的角度看，agent 还是在执行一个 **state → action** 的普通策略。
因此我们可以定义：

$$
\pi = \text{flat}(\mu)
$$

即把 policy over options $\mu$ 展开到原子动作层面的等价策略，这个策略被称为 **flat policy**。

---

## 举例

* $o_1$：前进 5 步。
* $o_2$：左转，然后前进 2 步。

如果 agent 在某个状态下选了 $o_1$，从环境角度看，它就等价于执行
“前进 → 前进 → 前进 → 前进 → 前进”。

因此我们可以定义一个等价的 **flat policy $\pi$**，它直接决定原子动作，而无需显式地再引入 option 的概念。

---

## Flat Policy 与 Markov 性

### 1. 特殊情况：Flat Policy 是 Markov 的

当所有 option 都是 **primitive action（一步即终止）** 时，flat policy $\pi$ 就是标准的 Markov 策略：
$$
P(a_t \mid s_t) .
$$

### 2. 一般情况：Flat Policy 往往不是 Markov 的

即便：

* 高层策略 $\mu$ 是 Markov 的（只依赖当前状态 $s_t$），
* 每个 option 的内部策略也是 Markov 的，

flat policy 仍然**不一定是 Markov 的**，只要存在 **multi-step option（时间延展的选项）**。

原因是：

* 在状态 $s_\tau$ 下，动作的选择不仅依赖于 $s_\tau$，
* 还依赖于 **此刻正在执行的 option 以及它的内部进程**。

因此，flat policy 的动作分布实际是：
$$
P(a_\tau \mid s_\tau) = \sum_{o} P(a_\tau \mid s_\tau, o_{\text{active}}, i); P(o_{\text{active}}, i \mid h_\tau),
$$

其中：

* $o_{\text{active}}$：当前正在执行的 option，
* $i$：该 option 已经执行的步数，
* $h_\tau$：自策略启动以来的历史。

这表明 flat policy 依赖于 **历史 $h_\tau$**，而不仅仅是 $s_\tau$。

### 3. 如何恢复 Markov 性

如果我们把扩展状态定义为：
$$
(s_\tau, o_{\text{active}}, i),
$$
那么在这个扩展状态空间中，flat policy 又重新满足 Markov 性。

---

## 总结

* **policy over options $\mu$**：高层次的决策，选择 option。
* **flat policy $\pi = \text{flat}(\mu)$**：展开 option 后的等价动作层策略。
* **Markov 性差异**：

  * 当 option = primitive action 时，$\pi$ 在 $S$ 上是 Markov 的；
  * 当 option 是 multi-step 时，$\pi$ 在 $S$ 上不是 Markov 的，而需要在扩展状态 $(s, o, i)$ 上才能恢复 Markov 性。

---


# Codes

```python

```


# FootNotes
