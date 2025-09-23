---
创建时间: 2025-九月-23日  星期二, 8:42:54 晚上
---
[[Alice in Differentiable Wonderland]]



We close with two additional observations that will be useful. First, we can write the sum of the elements of a vector as its dot product with a vector 1 composed entirely of ones:

$$
\langle x, 1 \rangle = \sum_{i=1}^{d} x_i
$$

Second, the distance between two vectors can also be written in terms of their dot products:

$$
\|x - y\|^2 = \langle x, x \rangle + \langle y, y \rangle - 2 \langle x, y \rangle
$$

The case $y = 0$ gives us $\|x\|^2 = \langle x, x \rangle$. Both equations can be useful when writing equations or in the code.

---

---

**Definition D.2.4 (Hadamard multiplication)** *The Hadamard multiplication of two matrices of the same shape is done element-wise:*

$$
[X \odot Y]_{ij} = X_{ij} Y_{ij}
$$

While Hadamard multiplication does not have all the interesting algebraic properties of standard matrix multiplication, it is commonly used in differentiable models for performing masking operations (e.g., setting some elements to zero) or scaling operations. Multiplicative interactions have also become popular in some recent families of models, as we will see next.

---
---

```python
X = torch.randn((5, 5))  
X = torch.exp(X) # Element-wise exponential 
X = torch.linalg.matrix_exp(X) # Matrix exponential
```
>Difference between the element-wise exponential of a matrix and the matrix exponential as defined in linear algebra textbooks. Specialized linear algebra operations are generally encapsulated in their own sub-package.

```ad-hint
好问题 👍，这个公式是在线性代数和深度学习里非常重要的 **矩阵指数 (matrix exponential)** 定义。我们一步一步来理解：

---

## 1. 回忆标量的指数函数

对于一个实数 $x$，指数函数定义为幂级数：

$$
e^x = \sum_{k=0}^\infty \frac{x^k}{k!}
$$

这是微积分里最基本的展开式。

---

## 2. 推广到矩阵

如果把标量 $x$ 换成矩阵 $X$（方阵），那么定义 **矩阵指数** 为：

$$
\text{mat-exp}(X) = e^X = \sum_{k=0}^\infty \frac{1}{k!} X^k
$$

其中：

* $X^0 = I$（单位矩阵）
* $X^1 = X$，$X^2 = XX$，以此类推
* 每一项都是矩阵乘法（不是 Hadamard 逐元素乘法！）

---

## 3. 为什么这样定义？

这样定义的原因是：

* 保证矩阵指数和标量指数有类似的代数性质。
* 特别重要的是：

  * 如果 $X$ 是一个 **线性算子矩阵**，那么 $e^X$ 表示“连续时间演化”的解。
  * 比如在线性微分方程 $\frac{d}{dt}x(t) = Ax(t)$ 中，解就是：

    $$
    x(t) = e^{At} x(0)
    $$
  * 这在 **动力系统、物理、深度学习（如连续时间模型、ODE-RNN）** 里非常常见。

---

## 4. 举个例子

设

$$
X = \begin{bmatrix}0 & -1 \\ 1 & 0\end{bmatrix}
$$

这是一个 **旋转算子矩阵**。那么：

$$
e^{X\theta} = \begin{bmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{bmatrix}
$$

这就解释了为什么指数矩阵自然出现了 **旋转、演化** 这样的操作。

  ```



---

---

ing lower and upper indices, in which case we assume that the summation runs along the full axis:

$$
\sum_i x_i = \sum_{i=1}^n x_i
$$

In PyTorch and other frameworks, reduction operations correspond to methods having an **axis** argument:

```python
r = X.sum(axis=1)
```


---

---

## 🔹 Asymptotic Analysis of Matrix Multiplication

1. **Naive implementation**

   * Matrix multiplication $Z = XY$, where

     * $X$ has shape $(a, b)$
     * $Y$ has shape $(b, c)$.
   * To compute each element $Z_{ij}$, we need **b multiplications and b additions**.
   * There are $a \times c$ such elements.
   * Hence the total cost is:

     $$
     O(a \cdot b \cdot c)
     $$

   So the runtime grows linearly with respect to all three parameters.

---

2. **Special case: square matrices**

   * If both matrices are $(n, n)$:

     $$
     O(n \cdot n \cdot n) = O(n^3)
     $$
   * This is why we say **naive matrix multiplication is cubic in the input dimension**.

---

3. **Beyond naive multiplication**

   * Strassen’s algorithm: $O(n^{2.81})$
   * Coppersmith–Winograd (and successors): $O(n^{2.37})$ (theoretical, ==not practical for most deep learning==).**(此事在Alice中亦有记载)**
   * In practice, most frameworks (PyTorch, TensorFlow, NumPy) rely on optimized BLAS/LAPACK kernels (like Intel MKL, cuBLAS), which are still essentially $O(n^3)$ but with heavy optimizations (parallelization, cache efficiency, GPU acceleration).

---

---

As an example of the former, consider two tensors $X \sim (n,a,b)$ and $Y \sim (n,b,c)$.
**Batched matrix multiplication (BMM)** is defined as:

$$
[\text{BMM}(X,Y)]_i = X_i Y_i \sim (n,a,c) \tag{E.2.9}
$$

Operations in most frameworks operate transparently on batched versions of their arguments, which are assumed like in this case to be **leading dimensions** (the first dimensions). For example, batched matrix multiplication in PyTorch is the same as standard matrix multiplication, see Box C.2.3.
```python
X = torch.randn((4, 5, 2)) Y = torch.randn((4, 2, 3)) (torch.matmul(X, Y)).shape # Or X @ Y # [Out]: (4, 5, 3)
```

````ad-hint
好问题 👍，你正好触到了 **PyTorch/NumPy 等框架对 `matmul` 的维度处理规则**。我给你系统解释一下：

---

## 1. `torch.matmul` 的核心规则

在 PyTorch（和 NumPy `@` 类似）里：

* **如果输入是 2D 张量**：就是普通的矩阵乘法。
* **如果输入是 1D 向量**：按规则退化成向量乘法（点积、矩阵-向量乘法等）。
* **如果输入是高维张量**：**只对最后两个维度做矩阵乘法**，前面的维度会被当作 **batch 维度** 自动广播。

---

## 2. 为什么例子里第一维是 batch？

你的例子：

```python
X = torch.randn((4, 5, 2))  # shape (batch=4, m=5, k=2)
Y = torch.randn((4, 2, 3))  # shape (batch=4, k=2, n=3)
Z = torch.matmul(X, Y)      # shape (4, 5, 3)
```

* 最后两维 `(5,2) @ (2,3) → (5,3)`
* 前面的维度 `4` 被当作 batch → 保留下来
* 所以结果是 `(4, 5, 3)`

这就是“第一维默认是 batch”的原因：因为 `matmul` 只关心最后两个维度。

---

## 3. 如果有更多维会怎样？

假设：

```python
A = torch.randn(10, 4, 5, 2)
B = torch.randn(10, 4, 2, 3)
C = A @ B
```

* 这里 `A.shape = (10, 4, 5, 2)`
* `B.shape = (10, 4, 2, 3)`
* 最后两维 `(5,2) @ (2,3) → (5,3)`
* 前面 `(10,4)` 保留作为 batch 维
* 结果：`C.shape = (10, 4, 5, 3)`

---

## 4. 更一般的规则

在 PyTorch 文档里，`matmul` 的规则是：

* 如果 `A.shape = (*batch, m, k)`，`B.shape = (*batch, k, n)`，
  那么

  $$
  C = A @ B \quad \Rightarrow \quad C.shape = (*batch, m, n)
  $$

* `*batch` 表示可以有任意多个 batch 维（甚至可以广播）。

---

## 5. 广播例子

```python
X = torch.randn(3, 5, 2)   # (3,5,2)
Y = torch.randn(2, 3)      # (2,3) → 会自动广播成 (3,2,3)
Z = X @ Y                  # (3,5,3)
```

这里 Y 本来是 2D，但会广播到 batch 维度 `(3,2,3)`，才能和 X 匹配。

---

✅ **总结**

* `matmul` **只考虑最后两维做矩阵乘法**。
* 其余维度都是 **batch 维度**，会自动保留下来或广播。
* 所以 `(4,5,2) @ (4,2,3)` → `(4,5,3)`。
* 如果有更多维，就会有更多 batch 维。


````

---
---


文中定义了一个广义点积 (**Generalized Dot Product, GDT**)：

$$
\text{GDT}(X, Y) = \sum_{i,j,k} [X \odot Y]_{ijk}
$$

* 这里的 $\odot$ 表示 **Hadamard 乘法（逐元素乘法）**。
* $[X \odot Y]_{ijk} = X_{ijk} Y_{ijk}$。
* 最后再对所有索引 $i,j,k$ 进行求和。

换句话说：

$$
\text{GDT}(X, Y) = \sum_{i,j,k} X_{ijk} Y_{ijk}
$$

> 直观理解:这其实就是「把两个张量展平成向量，再做一次普通的点积」。


---
---

![[Pasted image 20250923235448.png]]

---
---


````ad-note
非常好 👍，这页讲的是 **Jacobian（雅可比矩阵）**，它是梯度在高维函数中的自然推广。我帮你系统解释一下：

---

## 1. 背景：函数输入输出的维度

* **标量函数**：
  输入 $x \in \mathbb{R}^d$，输出 $y \in \mathbb{R}$。

  * 梯度 $\nabla f(x)$ 是一个 **$d$-维向量**。

* **向量函数**：
  输入 $x \in \mathbb{R}^d$，输出 $y \in \mathbb{R}^o$。

  * 每个输出分量 $y_i$ 都有自己的梯度（对输入的偏导）。
  * 把这些梯度堆叠起来，就得到一个 **矩阵** —— 雅可比矩阵 (Jacobian)。

---

## 2. 定义：Jacobian 矩阵

$$
\partial f(x) =
\begin{bmatrix}
\frac{\partial y_1}{\partial x_1} & \cdots & \frac{\partial y_1}{\partial x_d} \\
\vdots & \ddots & \vdots \\
\frac{\partial y_o}{\partial x_1} & \cdots & \frac{\partial y_o}{\partial x_d}
\end{bmatrix}
\quad \sim (o,d)
$$

* 矩阵大小是 $(o, d)$。
* 第 $i$ 行是输出 $y_i$ 对输入所有分量的梯度。

特殊情况：

* 当 $o=1$：Jacobian 就退化成梯度向量。
* 当 $d=1$：Jacobian 就是普通的一维导数。

---

## 3. 重要性质：链式法则 (Composition)

假设有复合函数 $f(g(x))$，那么它的 Jacobian 是：

$$
\partial [f(g(x))] = [\partial f(\cdot)] \, \partial g(x)
$$

这说明 **复合函数的导数就是两个 Jacobian 的矩阵乘法**。
→ 这就是多元函数的 **链式法则**。

在深度学习里，这正是 **反向传播 (backpropagation)** 的数学基础：每一层的梯度由 Jacobian 链式相乘得到。

---

## 4. 几何意义

Jacobian 可以看作是函数在某点附近的 **最佳线性近似**：

$$
\tilde{f}(x) \approx f(x_0) + \partial f(x_0) (x - x_0)
$$

* 这其实就是 **Taylor 一阶展开**。
* 意思是：在一个小邻域里，函数 $f$ 看起来就像一个线性变换，而这个变换由 Jacobian 矩阵给出。

---

## 5. 举个例子

设

$$
f(x,y) =
\begin{bmatrix}
x^2 + y \\
\sin(x) \\
y^2
\end{bmatrix}
$$

那么 Jacobian 是：

$$
J =
\begin{bmatrix}
2x & 1 \\
\cos(x) & 0 \\
0 & 2y
\end{bmatrix}
\quad (3 \times 2 \text{ 矩阵})
$$

解释：

* 每一行对应一个输出的梯度。
* Jacobian 捕捉了函数在输入空间 $(x,y)$ 到输出空间的「局部线性关系」。

---

✅ **总结**

* Jacobian 是「多输出函数的梯度」，形状为 $(输出维度, 输入维度)$。
* 它推广了偏导、梯度的概念。
* Jacobian 的链式法则本质上就是矩阵乘法，这也是反向传播的核心。
* 它给出了函数在某点附近的最佳线性近似（Taylor 一阶展开）。
**PyTorch 代码**，算一个二维函数的 Jacobian，并验证链式法则？

````


---

---

````ad-note
非常好 👍，这一页主要是在提醒你一个经常容易忽视的问题：**Jacobian 的维度会根据你把谁当作输入而不同**。

我帮你拆开解释：

---

## 1. 函数例子

给定一个线性函数：

$$
y = Wx
$$

* $W \in \mathbb{R}^{o \times d}$
* $x \in \mathbb{R}^d$
* 输出 $y \in \mathbb{R}^o$

---

## 2. 把 $x$ 当作输入时

* 输出是 $o$-维，输入是 $d$-维。
* Jacobian 的形状就是 $(o, d)$。
* 实际上，$\partial_x [Wx] = W$。

  * 直观理解：线性函数对输入 $x$ 的导数就是权重矩阵本身。

---

## 3. 把 $W$ 当作输入时

* 这时候输入是矩阵 $W$，维度是 $(o, d)$。
* Jacobian 形状会是 $(o, o, d)$。

  * 因为每个输出分量 $y_i$ 对 $W$ 的每个分量 $W_{jk}$ 都有偏导。

但这样写太复杂了。于是书里提到：

* 我们可以把 $W$ “展平”为一个向量 $\text{vec}(W) \in \mathbb{R}^{od}$。
* 那么 Jacobian 就是一个 $(o, od)$ 的矩阵。

这样更方便写公式，也避免了多重下标的混乱。

---

## 4. 作者的重点提醒

* 在深度学习中，我们常常直接把输入和输出 **看作向量**，这在记号上就足够了。
* 但是：

  * 真正的 Jacobian 尺寸还要考虑 batch 维度和矩阵展开，可能更大。
  * 所以在实际推导时，要小心这些“隐藏的维度”。
* 在实践中，我们不会显式构造庞大的 Jacobian（计算和存储代价太大），而是用 **vector-Jacobian product (VJP)** 来高效计算需要的梯度。

  * 这正是自动微分框架（PyTorch、TensorFlow）的做法。

---

## 5. 总结一句话

这一页是在说明：

* Jacobian 的“形状”取决于你把谁当作输入。
* 对 $x$ 来说，Jacobian 就是 $W$，形状 $(o,d)$。
* 对 $W$ 来说，Jacobian 是更高维的，可以通过 **展开 (vectorization)** 变成 $(o,od)$。
* 在深度学习里，我们不会真的写出庞大的 Jacobian，而是通过 **向量-雅可比积 (VJP)** 来做高效计算，这也是反向传播的核心技巧。

---

要不要我给你写个 **PyTorch 小实验**：分别计算 $\partial y / \partial x$ 和 $\partial y / \partial W$，然后展示 Jacobian 的形状差异？

````


````ad-note
好 👌，这一页其实是把前面讲的 **方向导数 (directional derivative)** 应用到优化问题上，解释了什么是 **下降方向 (descent direction)**，以及为什么“负梯度方向”是最陡下降的方向。

我分成几步来解释：

---

## 1. 什么是下降方向？

我们想最小化一个函数 $f(x)$。

* 在点 $x_{t-1}$，选择一个移动方向 $p_t$。
* 如果在这个方向上，函数值的瞬时变化率是 **非正的**（小于等于 0），就说明往这个方向走能让函数下降。

数学表达：

$$
p_t \text{ is a descent direction } \;\; \iff \;\; D_{p_t} f(x_{t-1}) \le 0
$$

这里用到了方向导数的定义。

---

## 2. 用方向导数公式展开

根据之前的公式：

$$
D_{p_t} f(x_{t-1}) = \langle \nabla f(x_{t-1}), \; p_t \rangle
$$

* 即梯度和方向向量的点积。

进一步写成：

$$
D_{p_t} f(x_{t-1}) = \|\nabla f(x_{t-1})\| \, \|p_t\| \cos(\alpha)
$$

其中 $\alpha$ 是 $p_t$ 和梯度 $\nabla f(x_{t-1})$ 的夹角。

---

## 3. 哪些方向是下降方向？

* 如果 $\cos(\alpha) > 0$，点积是正的 → 上升方向。
* 如果 $\cos(\alpha) < 0$，点积是负的 → 下降方向。

所以只要 $p_t$ 和梯度的夹角在 $[\pi/2, 3\pi/2]$ 之间，它就是一个下降方向。

换句话说：**任何与梯度方向相差大于 90° 的方向，都是下降方向。**

---

## 4. 最陡下降方向

在所有下降方向里，哪个下降得最快？

* 点积最小（负得最大）的时候，也就是 $\cos(\alpha) = -1$。
* 这对应着 $\alpha = \pi$，即方向 $p_t = -\nabla f(x_{t-1})$。

因此：

$$
p_t = - \nabla f(x_{t-1})
$$

就是所谓的 **最陡下降方向 (steepest descent direction)**。

---

## 5. 直观理解

* 梯度方向：函数增长最快的方向。
* 负梯度方向：函数下降最快的方向。
* 其他下降方向：也能让函数变小，但不如负梯度方向高效。

---

✅ **总结**

* 下降方向定义：方向导数 $\le 0$。
* 数学条件：与梯度夹角在 $90°$ 到 $270°$ 之间。
* 最陡下降方向：负梯度方向。
* 这就是 **梯度下降法 (Gradient Descent)** 的数学依据。

---

要不要我帮你画一个二维函数等高线图，标出梯度方向、下降方向区间，以及最陡下降方向？这样你能直观看到这部分内容。
![[Pasted image 20250924004031.png]]
````
