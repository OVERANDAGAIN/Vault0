[[Controlled Markov Processes and Viscosity Solutions]]

# Control Markov Processes

```ad-note

---

## 一、基本思想

普通的 **马尔可夫过程**（Markov process）描述的是系统状态 $x(s)$ 随时间随机变化的过程，其变化仅由系统自身的随机性决定。

而在 **受控马尔可夫过程（Controlled Markov process）** 中，系统的演化不仅取决于随机性，还受到一个外部“控制过程” $u(s)$ 的影响。

也就是说：

> 我们可以通过控制变量 $u(s)$（例如调节输入信号、决策、策略等）来影响系统状态 $x(s)$ 的演化。

---

## 二、符号解释

* $x(s)$：状态（state），表示系统在时刻 $s$ 的状态。
* $u(s)$：控制变量（control process），表示我们在时刻 $s$ 施加的控制动作。
* $\Sigma$：状态空间（state space），即 $x(s)$ 可能取的所有值的集合。
* $U$：控制空间（control space），即 $u(s)$ 可以取的所有控制动作的集合。

---

## 三、两个例子

### 🔹 Example 6.1 Controlled Markov chain

这里说的是**有限状态马尔可夫链**的控制版本。

* 对于每个固定的控制 $v \in U$，系统从状态 $x$ 跳到状态 $y$ 的“瞬时跳转率”（infinitesimal jumping rate）是 $\rho(s, x, y, v)$。
* 如果控制是动态的（即随时间变化的）$u(s)$，那么跳转率就会随之变化为 $\rho(s, x, y, u(s))$。

📖 **直观理解**：
你可以想象一个系统，它有若干个状态（比如机器的不同工作模式），而你通过控制输入 $u(s)$ 来改变它的跳转概率。

---

### 🔹 Example 6.2 Controlled Markov diffusion

这一例子是**连续状态空间**下的情况，也就是受控随机微分方程（SDE）。

系统的动态满足：
$$
dx = f(s, x(s), u(s))ds + \sigma(s, x(s), u(s))dw(s)
$$
其中：

* 第一项 $f(s, x(s), u(s))ds$ 表示**确定性漂移项**；
* 第二项 $\sigma(s, x(s), u(s))dw(s)$ 表示**随机扰动项（扩散项）**；
* $w(s)$ 是标准布朗运动。

📖 **解释**：
这类模型常用于控制连续系统，比如机器人控制、自动驾驶、金融投资组合等。


---

## 五、一般形式与算子表示

接下来作者讨论更一般的情形：

> 对于每个常数控制 $v \in U$，状态过程 $x(s)$ 是一个马尔可夫过程，其生成算子为 $A^v$。

这里的 $A^v$ 可以理解为：

* 当控制固定为 $v$ 时，系统对应的马尔可夫过程的“生成算子（generator）”。
* 比如在扩散情形下：
  $$
  A^v f = \frac{1}{2}\sigma^2 \frac{\partial^2 f}{\partial x^2} + f'(x)f(s,x,v)
  $$

作者进一步引入算子定义域 $\mathcal{D}(A^v)$，并假设存在一个“足够大”的公共空间 $\mathcal{D}$，它被包含在所有 $\mathcal{D}(A^v)$ 之内，用于统一处理不同控制下的算子。

---

## 六、总结一句话

> “受控马尔可夫过程”就是一个在马尔可夫随机动态系统中**嵌入控制信号 $u(s)$ 来改变系统演化**的模型。

它是后续研究最优控制（optimal control）、动态规划（dynamic programming）和 HJB（Hamilton–Jacobi–Bellman）方程的基础。


```


