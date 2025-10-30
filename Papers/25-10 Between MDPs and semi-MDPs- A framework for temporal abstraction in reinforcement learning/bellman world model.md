---
创建时间: 2025-十月-30日  星期四, 6:41:52 晚上
---
[[25-10 Between MDPs and semi-MDPs-A framework for temporal abstraction in reinforcement learning]]



# 🔹原文

> Eqs. (16) and (17) were applied **whenever an option terminated**,
> whereas, in the **intra-option model-learning method**,
> Eqs. (18) and (19) were applied **on every step** to **all options that were consistent with the action taken on that step.**

---

## 一、(16)-(17)：**“option-level” 更新，只在终止时进行**

这两式是最早的 *SMDP model learning* 形式：

$$
\hat r^o_s \leftarrow \hat r^o_s + \alpha [r - \hat r^o_s], \
\hat p^o_{sx} \leftarrow \hat p^o_{sx} + \alpha [\gamma^k \delta_{s'x} - \hat p^o_{sx}],
$$

它们的含义是：

* 你把整个 option 看成一个**宏动作（macro-action）**；
* 只有当 option **执行结束（terminated）** 时，才知道：

  * 这次 option 从哪开始（$s$）；
  * 执行了多久（$k$）；
  * 最终落到哪个状态（$s'$）；
  * 得到了什么总奖励（$r$）。
* 然后一次性更新对 option 模型的估计。

👉 因此，它是 **episodic / option-level 更新**：
只有在 option 执行完之后（$\beta=1$）才更新。

---

## 二、(18)-(19)：**“intra-option” 更新，每步都更新**

新的公式：

$$
\hat r^o_{s_t} \leftarrow \hat r^o_{s_t}

+ \alpha [r_{t+1} + \gamma(1-\beta(s_{t+1}))\hat r^o_{s_{t+1}} - \hat r^o_{s_t}],
  $$

$$
\hat p^o_{s_t x} \leftarrow \hat p^o_{s_t x}

+ \alpha [\gamma(1-\beta(s_{t+1}))\hat p^o_{s_{t+1} x}
+ \gamma\beta(s_{t+1})\delta_{s_{t+1},x} - \hat p^o_{s_t x}].
  $$

特点是：

* **每一步**（不论是否终止）都进行更新；
* 更新目标是 *option 内部的Bellman一致性*；
* 每步都在逼近“如果我继续执行该 option，其奖励与终止概率如何递推”。

这就像是 TD(0) 对值函数的学习，只不过目标变成了 *option 的模型*。

---

## 三、“applied … on every step to all options consistent with the action taken”

这一句非常重要，意思是：

> 每当执行环境动作 $a_t$ 时，所有**其内部策略 $\pi_o$ 在该状态 $s_t$ 下也可能选择 $a_t$** 的 option，
> 都可以用这一步的经验 $(s_t,a_t,r_{t+1},s_{t+1})$ 来更新自己的模型。

换句话说：

* 假如当前执行的 action $a_t$ 符合某个 option 的内部策略 $\pi_o(a_t|s_t)>0$，
  那么这条经验对该 option 也是“有效的”，可以用于更新该 option 的模型估计。
* 因此，一个经验样本可以**同时更新多个 options** 的模型。

这就是 “consistent with the action taken” 的含义。

它反映出 option 学习的 **off-policy / parallel updating** 特征：
即便当前执行的 option 不是 $o$，
只要当前动作对 $o$ 来说是可能的，
也可以让 $o$ 的模型获得学习信号。

---

## 四、总结对比表

| 项目     | 旧方法 (16–17)      | 新方法 (18–19)                 |
| ------ | ---------------- | --------------------------- |
| 更新时机   | 仅当 option 终止时    | 每一步都更新                      |
| 学习粒度   | 整个 option 执行一次更新 | 连续时间步 TD 更新                 |
| 可更新的对象 | 只有当前执行的 option   | 所有内部策略包含当前动作的 options       |
| 更新信息   | 总奖励 + 最终终止状态     | 局部奖励 + 下一步状态                |
| 类比     | SMDP-level 学习    | TD(0)-style online learning |

---

## 五、直观理解

* **(16)-(17)** 就像：“等你整个任务做完后再总结一次经验。”
* **(18)-(19)** 则是：“每走一步就反思一下刚才的结果”，
  而且不止自己（当前option）反思，
  任何“可能也会走这步”的option都能同时学到。

---
---

即便当前执行的 option 不是 $o$，只要当前动作对 $o$ 来说是可能的，也可以让 $o$ 的模型获得学习信号。

# 为什么可以这么说


非常好的追问。
为什么我们能说：

> 即便当前执行的 option 不是 $o$，只要当前动作对 $o$ 来说是可能的，也可以让 $o$ 的模型获得学习信号？

这句话的核心依据来自 **intra-option learning 的 off-policy 特性**。
下面分三步解释它的逻辑。

---

## 一、option 内部模型依赖的是状态–动作–下一个状态三元组

观察 Bellman 式 (18) 和 (19)：

$$
\hat r^o_{s_t} \leftarrow \hat r^o_{s_t} +
\alpha,[r_{t+1}+\gamma(1-\beta(s_{t+1}))\hat r^o_{s_{t+1}}-\hat r^o_{s_t}],
$$
$$
\hat p^o_{s_t x} \leftarrow \hat p^o_{s_t x} +
\alpha,[\gamma(1-\beta(s_{t+1}))\hat p^o_{s_{t+1}x}
+\gamma\beta(s_{t+1})\delta_{s_{t+1},x}-\hat p^o_{s_t x}].
$$

可以看到：
更新所需的信息只有当前 $(s_t,a_t,r_{t+1},s_{t+1})$ 以及该 option 的终止概率 $\beta(s_{t+1})$。

**并没有要求当前整个 episode 确实在执行该 option。**
只要我们知道 option $o$ 的内部策略 $\pi_o$ 在 $s_t$ 下会如何选动作，就能评估这条经验对 $o$ 的一致性。

---

## 二、“consistent with the action taken” 的含义

对于某个 option $o$，如果它的内部策略满足
$$
\pi_o(a_t|s_t) > 0,
$$
就表示该动作是 $o$ 在该状态下**可能选择的动作**。

换句话说——如果现在环境中执行的动作 $a_t$ 是 $o$ 有可能执行的，那么从 $o$ 的角度看，这个 transition $(s_t,a_t,s_{t+1},r_{t+1})$ 是它的一个“合法样本”。

因此我们可以把这个样本视为 $o$ 的一次 off-policy 经验，用于改进 $o$ 的模型估计（即 $\hat r^o$ 与 $\hat p^o$）。

---

## 三、为什么这样做是合理的（理论依据）

1. **目标是一致性学习，而非策略行为还原。**
   我们学习的是 option 的 *model*，即它满足的 Bellman 一致性方程。
   这个方程只依赖于环境动力学 $p(s'|s,a)$ 与 $\pi_o(a|s)$，而不依赖当前行为策略是否等于 $\pi_o$。

2. **off-policy 学习原理：**
   在 off-policy 场景下，我们可以用任意“行为策略”收集的数据，只要对目标策略可达的 $(s,a)$ 采样覆盖到。
   这里行为策略是“实际执行的 option”，目标策略是“被学习的 option $o$”。
   只要 $\pi_o(a_t|s_t)>0$，就意味着当前样本对 $o$ 有统计意义。

3. **多 option 并行更新的优势：**
   通过允许不同 option 同时更新（只要动作一致），我们能在一次交互中学习所有与当前行为相兼容的 options。
   这极大地提高了样本利用率，使 option 的模型能更快收敛。

---

## 四、直观类比

可以把一个 option 看作一个“假想的专家”，它对每个状态都有自己的行动分布 $\pi_o(a|s)$。

* 如果当前真实执行的动作 $a_t$ 也是这个专家可能采取的动作，
  那么该专家可以观察这次执行结果 $(r_{t+1}, s_{t+1})$ 来修正自己对世界的理解（model）。
* 即使当下执行的不是它自己主导的决策，它仍然能从观察到的经验中学习。

这就像多个司机观察同一个交通场景：
只要他们都认为“在这个路口可以左转”，那当其中一个司机真的左转并观察到结果（堵车或顺畅），
其他司机也能更新自己对“左转后路况模型”的估计。

---

✅ **总结一句话：**

> 在 intra-option model learning 中，
> option 的模型学习依赖的是环境动力学和其内部策略的动作分布；
> 因此，只要当前执行的动作是该 option 内策略可能采取的，
> 就能视为该 option 的一次有效样本，从而对它的模型进行 off-policy 更新。
