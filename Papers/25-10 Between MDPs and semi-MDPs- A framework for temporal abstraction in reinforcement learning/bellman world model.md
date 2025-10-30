[[25-10 Between MDPs and semi-MDPs-A framework for temporal abstraction in reinforcement learning]]



非常好，这句话是理解 **intra-option model learning（选项内模型学习）** 与传统 **终止后更新** 的关键。我们逐句分解它的含义，并结合两组公式（16–17 与 18–19）来看。

---

## 🔹原文

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

* \alpha [r_{t+1} + \gamma(1-\beta(s_{t+1}))\hat r^o_{s_{t+1}} - \hat r^o_{s_t}],
  $$

$$
\hat p^o_{s_t x} \leftarrow \hat p^o_{s_t x}

* \alpha [\gamma(1-\beta(s_{t+1}))\hat p^o_{s_{t+1} x}
* \gamma\beta(s_{t+1})\delta_{s_{t+1},x} - \hat p^o_{s_t x}].
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
