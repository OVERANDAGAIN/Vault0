---
创建时间: 2025-九月-23日  星期二, 8:42:54 晚上
---
[[Alice in Differentiable Wonderland]]


# vector计算技巧
## 与1点积
We close with two additional observations that will be useful. First, we can write the sum of the elements of a vector as its dot product with a vector 1 composed entirely of ones:

$$
\langle x, 1 \rangle = \sum_{i=1}^{d} x_i
$$
## 向量距离
Second, the distance between two vectors can also be written in terms of their dot products:

$$
\|x - y\|^2 = \langle x, x \rangle + \langle y, y \rangle - 2 \langle x, y \rangle
$$

The case $y = 0$ gives us $\|x\|^2 = \langle x, x \rangle$. Both equations can be useful when writing equations or in the code.
### 证明
```ad-tip

### 1. 从定义出发

向量的欧几里得距离平方定义为：

$$
\|x-y\|^2 = (x-y)^\top (x-y)
$$

---

### 2. 展开乘法

$$
(x-y)^\top (x-y) = x^\top x - 2x^\top y + y^\top y
$$

---

### 3. 用内积符号改写

* $x^\top x = \langle x, x \rangle$
* $y^\top y = \langle y, y \rangle$
* $x^\top y = \langle x, y \rangle$

所以：

$$
\|x-y\|^2 = \langle x, x \rangle + \langle y, y \rangle - 2 \langle x, y \rangle
$$

---

### 4. 特殊情况 $y=0$

$$
\|x - 0\|^2 = \langle x, x \rangle
$$

这其实就是 **范数的平方等于向量和自己做点积**。
```

### 扩展：三种范数 正则化
[如何通俗易懂地解释「范数」？](https://www.zhihu.com/tardis/zm/art/26884695?source_id=1003)[^1]

````ad-info


# 📑 范数与正则化总结

## 1. 范数是什么？

* **数学工具**：用来度量向量/矩阵的“大小”或“复杂度”。
* 常见范数：

  * **$L^0$ “范数”**：$\|x\|_0 = \#\{i : x_i \neq 0\}$ → 表示向量中非零元素的个数，直接衡量稀疏性（严格来说不是数学意义上的范数，但常用于稀疏建模）。
  * **$L^1$ 范数**：$\|x\|_1 = \sum |x_i|$ → 强调稀疏性。
  * **$L^2$ 范数**：$\|x\|_2 = \sqrt{\sum x_i^2}$ → 几何上表示长度，平滑。
  * **$L^\infty$ 范数**：$\|x\|_\infty = \max |x_i|$ → 衡量“最大偏移量”，最坏情况。
  * **矩阵 Frobenius 范数**：$\|W\|_F = \sqrt{\sum_{i,j} W_{ij}^2}$。
  * **矩阵核范数**：$\|W\|_* = \sum \sigma_i(W)$，奇异值和，常用于低秩约束。

### 范数的性质

* **几何形状不同**：

  * $\|x\|_0 \le 1$：只允许最多 1 个非零元素 → 单位球是坐标轴上的稀疏点集。
  * $\|x\|_2 \le 1$：圆 / 球。
  * $\|x\|_1 \le 1$：菱形 / 多面体。
  * $\|x\|_\infty \le 1$：正方形 / 立方体。
* **范数等价性**：有限维空间里，所有范数都能相互界定（数值不同但量级相近）。
* **对偶范数**：$L^1 \leftrightarrow L^\infty$，$L^2 \leftrightarrow L^2$。

---

## 2. 正则化是什么？

* **机器学习中的优化策略**：在损失函数里加入“复杂度惩罚”项，避免过拟合。
* 常见形式：

  $$
  \min_\theta L(\theta; \mathcal{D}) + \lambda R(\theta)
  $$

  * $L$：经验风险（如交叉熵、MSE）。
  * $R(\theta)$：正则化项（通常是某种范数）。
  * $\lambda$：平衡系数。

### 典型例子

* **L0 正则化**

  $$
  R(\theta) = \|\theta\|_0
  $$

  → 强制稀疏（只保留少量非零参数），但优化问题是 NP-hard，通常用 L1 来近似。

* **L2 正则化（Ridge 回归）**

  $$
  R(\theta) = \|\theta\|_2^2
  $$

  → 限制权重过大，鼓励平滑。

* **L1 正则化（Lasso 回归）**

  $$
  R(\theta) = \|\theta\|_1
  $$

  → 促使参数稀疏。

* **核范数正则化**

  $$
  R(W) = \|W\|_*
  $$

  → 鼓励矩阵低秩，适合推荐系统、压缩表示学习。

---

## 3. 范数 vs 正则化

* **范数**：数学定义，度量“大小”。
* **正则化**：利用范数作为惩罚项，控制模型复杂度。

📌 类比：

* 范数 = **尺子**（度量大小的工具）。
* 正则化 = **规则**（训练时用尺子惩罚过于复杂的解）。



````


---
---

# Hadamard multiplication
**Definition D.2.4 (Hadamard multiplication)** *The Hadamard multiplication of two matrices of the same shape is done element-wise:*

$$
[X \odot Y]_{ij} = X_{ij} Y_{ij}
$$

While Hadamard multiplication does not have all the interesting algebraic properties of standard matrix multiplication, it is commonly used in differentiable models for performing ==masking operations== (e.g., setting some elements to zero) or ==scaling operations==. Multiplicative interactions have also become popular in some recent families of models, as we will see next.

---
---
# 元素指数与矩阵指数
连续时间演化的解？

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
# 按axis的sum
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

# 矩阵运算复杂度

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
   * In practice, most frameworks (PyTorch, TensorFlow, NumPy) rely on optimized BLAS/LAPACK kernels (like Intel MKL, cuBLAS), ==which are still essentially $O(n^3)$ but with heavy optimizations== (parallelization, cache efficiency, GPU acceleration).

---

---
# 批次矩阵乘法: `matmul` or `mm`
As an example of the former, consider two tensors $X \sim (n,a,b)$ and $Y \sim (n,b,c)$.
**Batched matrix multiplication (BMM)** is defined as:

$$
[\text{BMM}(X,Y)]_i = X_i Y_i \sim (n,a,c) \tag{E.2.9}
$$

Operations in most frameworks operate transparently on batched versions of their arguments, which are assumed like in this case to be **leading dimensions** (the first dimensions). For example, batched matrix multiplication in PyTorch is the same as standard matrix multiplication, see Box C.2.3.
```python
X = torch.randn((4, 5, 2)) 
Y = torch.randn((4, 2, 3)) 
(torch.matmul(X, Y)).shape # Or X @ Y # [Out]: (4, 5, 3)
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
# 广义点积

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
# 偏导 梯度 方向导数
![[Pasted image 20250923235448.png]]

## 证明
````ad-tip
可以用“把沿着方向 $\mathbf v$ 的一维曲线拉出来”来证。
令

$$
g(t)=f(\mathbf x+t\mathbf v),\qquad t\in\mathbb R .
$$

则 $g(t)$ 就是把多元函数 $f$ 限制到经过点 $\mathbf x$ 且方向为 $\mathbf v$ 的直线上。**方向导数**按定义是

$$
D_{\mathbf v}f(\mathbf x)=\left.\frac{d}{dt}g(t)\right|_{t=0}
=\left.\frac{d}{dt}f(\mathbf x+t\mathbf v)\right|_{t=0}.
$$

对 $g$ 用链式法则（或一阶泰勒展开）：

$$
\frac{d}{dt}f(\mathbf x+t\mathbf v)
=\sum_{i=1}^d \frac{\partial f}{\partial x_i}(\mathbf x+t\mathbf v)\,\frac{d}{dt}(x_i+t v_i)
=\sum_{i=1}^d \frac{\partial f}{\partial x_i}(\mathbf x+t\mathbf v)\,v_i .
$$

在 $t=0$ 处取值，得到

$$
D_{\mathbf v}f(\mathbf x)
=\sum_{i=1}^d \frac{\partial f}{\partial x_i}(\mathbf x)\,v_i
=\nabla f(\mathbf x)\cdot \mathbf v.
$$

等价地，也可从极限定义出发：

$$
D_{\mathbf v}f(\mathbf x)
=\lim_{h\to 0}\frac{f(\mathbf x+h\mathbf v)-f(\mathbf x)}{h}
\overset{\text{泰勒}}=
\lim_{h\to 0}\frac{h\,\nabla f(\mathbf x)\cdot \mathbf v+o(h)}{h}
=\nabla f(\mathbf x)\cdot \mathbf v.
$$

这就证明了

$$
D_{\mathbf v}f(\mathbf x)=\langle \nabla f(\mathbf x),\mathbf v\rangle
=\sum_i \partial_{x_i}f(\mathbf x)\,v_i.
$$

````

---
---
# 雅可比矩阵

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

# 雅可比矩阵的形式随输入不同
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

---
---
# 方向导数与优化

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

* ==即梯度和方向向量的点积。==

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

```ad-help
## 2. 任意方向的移动 = 各坐标方向的组合

假设我们想走的方向是 $p = (p_x, p_y)$，那实际上是：

* 在 $x$ 方向走了 $p_x$ 单位，
* 在 $y$ 方向走了 $p_y$ 单位。

这就是一个“线性组合”：你选的方向，本质上是 **沿着坐标轴方向的加权移动**。

---

## 3. 函数的变化率 = 各坐标变化率的加权和

那么函数值的变化率，自然就是：

$$
\Delta f \approx \frac{\partial f}{\partial x} \cdot p_x + \frac{\partial f}{\partial y} \cdot p_y
$$

这其实就是梯度和方向的点积：

$$
\nabla f(x,y) \cdot p
$$

```



---
---
# 非平凡 非凸
````ad-note
##  下半部分：非凸模型和凸模型的对比

> *“non-trivial model is non-convex … This is in contrast to … support vector machines, which maintain non-linearity while allowing for convex optimization.”*

解释：

* **非平凡的模型（比如神经网络）**：大多数都是 **非凸的**，因此优化中会有多个停点（局部最小值、鞍点）。
* **凸优化的优势**：

  * 比如 SVM，虽然模型可以引入非线性（通过核函数），但它的优化问题仍然是 **凸优化**。
  * 凸优化只有一个全局最优点，所以更容易解。
* **现实中的经验**：

  * 尽管非凸问题很难保证全局最优，
  * 但在实践中（比如深度学习），只要初始化合理，优化算法（SGD、Adam）往往还是能收敛到一个 **效果不错的点**，在经验性能上足够好。
````

---
---
# 梯度下降
## Momentum 梯度下降

* **问题**：普通梯度下降更新方向变化大，容易“抖动”（尤其在凸函数下，连续两步梯度甚至可能正交）。
* **动量思想**：保留一部分上一次的更新方向，使迭代更平滑。
* **更新公式**：

  $$
  g_t = -\eta_t \nabla f(x_{t-1}) + \lambda g_{t-1}
  $$

  $$
  x_t = x_{t-1} + g_t
  $$
* **直观类比**：像小球下山时带有惯性，不会因每一步的局部坡度剧烈改变方向。
* **效果**：减少震荡、加快收敛。


## Adam (Adaptive Moment Estimation)

* **思想**：结合 **Momentum**（一阶动量，梯度的指数加权平均）和 **RMSProp**（二阶动量，平方梯度的指数加权平均）。
* **公式**：

  * 一阶动量（类似动量法）：

    $$
    m_t = \beta_1 m_{t-1} + (1-\beta_1) \nabla f(x_t)
    $$
  * 二阶动量（类似RMSProp）：

    $$
    v_t = \beta_2 v_{t-1} + (1-\beta_2) (\nabla f(x_t))^2
    $$
  * 偏差修正：

    $$
    \hat{m}_t = \frac{m_t}{1-\beta_1^t}, \quad \hat{v}_t = \frac{v_t}{1-\beta_2^t}
    $$
  * 参数更新：

    $$
    x_t = x_{t-1} - \eta \frac{\hat{m}_t}{\sqrt{\hat{v}_t} + \epsilon}
    $$
* **特点**：

  * 自适应学习率（不同参数可有不同步长）
  * 收敛更快，调参较少
  * 默认参数（$\beta_1=0.9, \beta_2=0.999, \epsilon=10^{-8}$）效果已很好
* **直观类比**：在“有惯性的小球”基础上，还会根据历史梯度大小调整每个方向的“步幅”。



---
---

# 极大似然估计
````ad-note

### 3. 与 KL 散度的关系

事实上，可以证明：

$$
s^* = \arg\max_s \mathbb{E}_{x \sim p(x)} [\log f(x; s)]
$$

等价于：

$$
s^* = \arg\min_s D_{\text{KL}}(p(x) \, \| \, f(x; s)),
$$

也就是：**极大似然估计等价于最小化真实分布和模型分布的 KL 散度**。

换句话说，MLE 选出的分布参数，是在 KL 意义下最接近真实分布的那个。

---
推导很短也很关键。设真实分布为 $p(x)$，模型族为 $f(x;s)$。定义 **KL 散度**（离散/连续只差积分号）：

$$
D_{\mathrm{KL}}\!\left(p \,\|\, f(\cdot;s)\right)
= \mathbb{E}_{x\sim p}\!\left[\log \frac{p(x)}{f(x;s)}\right]
= \mathbb{E}_{p}[\log p(x)] - \mathbb{E}_{p}[\log f(x;s)] .
$$

注意两点：

1. $\mathbb{E}_{p}[\log p(x)]$ **与参数 $s$ 无关**；
2. 为使 KL 有限，需要假设：只要 $p(x)>0$ 则 $f(x;s)>0$（即 $\mathrm{supp}(p)\subseteq \mathrm{supp}(f)$）。

因此，对任意可行 $s$,

$$
\arg\min_{s} D_{\mathrm{KL}}\!\left(p \,\|\, f(\cdot;s)\right)
= \arg\min_{s}\Big(\mathbb{E}_{p}[\log p(x)]-\mathbb{E}_{p}[\log f(x;s)]\Big)
= \arg\max_{s}\mathbb{E}_{p}[\log f(x;s)] .
$$

这就得到

$$
s^*=\arg\max_{s}\mathbb{E}_{x\sim p}[\log f(x;s)]
\quad \Longleftrightarrow \quad
s^*=\arg\min_{s} D_{\mathrm{KL}}\!\left(p \,\|\, f(\cdot;s)\right).
$$

---

### 与 MLE 的关系（样本近似）

有 $n$ 个 i.i.d. 样本 $\{x_i\}_{i=1}^n\sim p$。由大数定律，

$$
\mathbb{E}_{p}[\log f(x;s)]
\approx \frac{1}{n}\sum_{i=1}^n \log f(x_i;s) .
$$

于是最大化期望对数似然等价于最大化**经验对数似然**（即 MLE）；而这又等价于最小化 $D_{\mathrm{KL}}(p\|f(\cdot;s))$ 的经验近似。

````

---
---
# 经验风险(ERM) 期望风险(ER)

````ad-note

### 1. 经验风险（Empirical Risk）总能“完美最小化”

公式 (E.3.4) 定义了一个“极端模型”：

$$
f(x) = 
\begin{cases} 
y & \text{如果 } (x,y) \text{ 在训练集中} \\
\bar{y} & \text{否则 (一个常数预测，比如 0)}
\end{cases}
$$

意思就是：

* 如果输入 $x$ 是训练集里见过的，就直接输出它在训练集的标签 $y$；
* 如果不是，就随便输出一个默认值（比如 0）。

这种模型等于是 **查表记忆 (memorization)**。
因为训练集上所有的 $(x,y)$ 都能被完美复现，所以它的**经验风险（训练误差）总是最低的**。

👉 但是问题是：它对新数据（不在训练集里的）完全没用，也就是没有 **泛化能力**。
这说明“光最小化训练误差”没有实际意义。

---

### 2. 学习 ≠ 记忆

作者强调了 **记忆 (memorization)** 和 **学习 (optimization)** 的区别：

* **记忆**：模型死记硬背训练集，训练误差=0，但泛化误差可能极差。
* **学习**：模型通过优化，找到规律，能够在**未来未见数据**上表现良好。

所以我们真正关心的不是训练误差，而是模型在所有可能样本上的表现。

---

### 3. 期望风险（Expected Risk）

为此，引入了 **期望风险 (expected risk, ER)** 的概念：

$$
ER[f] = \mathbb{E}_{(x,y)\sim p(x,y)} \big[ l(y, f(x)) \big]
$$

解释：

* 这里的 $p(x,y)$ 是真实的数据分布（比如自然界的分布、邮件分类里的真实邮件分布）。
* $l(y, f(x))$ 是损失函数，衡量预测 $f(x)$ 和真实 $y$ 的差距。
* ER 就是：在 **所有可能的输入-输出对** 上，模型平均的预测误差。

---

### 4. 实际问题

* 在理论上，**如果我们能最小化期望风险，模型一定能泛化得很好**。
* 但是我们没法访问整个分布 $p(x,y)$，因为它包含“所有可能的数据点”。
* 所以我们只能依靠**有限的训练数据**作为近似，这就是 **经验风险最小化 (ERM)**。

---

### 5. 总结

* **经验风险 (ERM)**：在有限训练集上的平均损失。容易被“记忆”模型完美最小化，但没意义。
* **期望风险 (ER)**：在真实分布上的平均损失。才是真正的目标，但不可直接计算。
* **解决办法**：用训练集（经验风险）近似期望风险，并加入正则化、防止过拟合。
````
---
---
# 损失函数与概率建模
````ad-note


很棒的问题 👍。这段内容其实是在解决 **如何从“损失函数的角度”转到“概率建模的角度”来描述学习问题**。

---

## 1. 传统做法：直接定义一个损失函数

在机器学习里，我们通常会说：

* 分类：用交叉熵 loss。
* 回归：用平方误差 loss。

这里损失函数 $l(y, \hat{y})$ 是人为设定的，编码了我们对任务的先验知识（比如分类更注重概率分布，回归更关注数值距离）。
但是这样做有两个问题：

1. 损失函数的选择有点 ad hoc（人为设计，缺少统一原则）。
2. 难以直接解释模型的不确定性。

---

## 2. 概率化的思路

作者引入了一种更**原则化的框架**：把整个训练过程重写为**概率建模问题**。

### 关键想法：

* 我们假设训练样本来自某个分布 $p(x,y)$。
* 通过概率乘法法则分解为：

  $$
  p(x,y) = p(x)p(y \mid x).
  $$
* 学习的目标就是逼近条件分布 $p(y\mid x)$。

于是：

* 分类问题里，$f(x)$ 不直接输出类别，而是 **参数化一个分布**（比如 softmax 输出一个多项分布）。

  $$
  p(y \mid f(x)) = \prod_i f_i(x)^{y_i}.
  $$
* 回归问题里，$f(x)$ 不直接输出一个数，而是输出高斯分布的参数（均值和方差）：

  $$
  p(y \mid f(x)) = \mathcal{N}(y \mid f_1(x), f_2(x)^2).
  $$

---

## 3. 解决的问题

这样一来：

* 不需要手工挑选损失函数，**损失函数自然地由似然函数推导出来**。

  * 例如：最大似然估计下，高斯回归 → 平方误差；分类的 softmax → 交叉熵。
* 允许模型直接表达 **预测的不确定性**（比如回归预测方差）。
* 给设计者更多灵活性，因为“选一个分布参数化”往往比“设计一个损失函数”更自然。

---

## 4. 引出的思想

这部分引出了一个重要观点：

> **机器学习可以理解为在参数化的概率分布族中寻找最佳近似分布，而不是在“损失函数空间”里随便挑一个函数。**

换句话说：

* 损失函数视角 → “优化某个指标”
* 概率视角 → “建模 $p(y \mid x)$，损失函数是最大似然自然导出的结果”

---

✅ **总结**：
这一部分解决的是：

* 为什么直接定义损失函数有局限；
* 如何通过概率建模（对 $p(y \mid x)$ 建模）来统一分类、回归问题；
* 并且引出了\*\*“模型输出 = 分布参数化”\*\*的思想。

---

要不要我帮你推一下 **为什么高斯似然对应 MSE，softmax 对应交叉熵**？这样你会更直观地看到“损失函数其实是分布选择的结果”。


👌太好了，这正是概率化视角的核心。我们来一步一步推导 **损失函数是如何自然地由似然函数得到的**。

---

## 1. 最大似然估计 (MLE) 回顾

假设我们有数据集 $\{(x_i, y_i)\}_{i=1}^n$，模型的目标是最大化条件概率：

$$
s^* = \arg\max_s \prod_{i=1}^n p(y_i \mid x_i; s).
$$

取对数（log-likelihood）后：

$$
s^* = \arg\max_s \sum_{i=1}^n \log p(y_i \mid x_i; s).
$$

训练时我们通常写成 **最小化负对数似然 (NLL)**：

$$
\mathcal{L}(s) = -\sum_{i=1}^n \log p(y_i \mid x_i; s).
$$

👉 所以：**损失函数 = 负对数似然**。

---

## 2. 分类任务（Softmax → 交叉熵）

假设输出空间是 $K$ 个类别，模型 $f(x)$ 给出一个概率分布：

$$
p(y \mid x; s) = \text{Categorical}(y; \pi(x)), \quad \pi(x) = \text{softmax}(f(x)).
$$

写成概率：

$$
p(y=k \mid x; s) = \pi_k(x).
$$

NLL：

$$
\mathcal{L}(s) = - \sum_{i=1}^n \log \pi_{y_i}(x_i).
$$

这正好就是 **交叉熵损失**：

$$
\mathcal{L} = -\sum_i \sum_{k=1}^K \mathbf{1}\{y_i=k\} \log \pi_k(x_i).
$$

---

## 3. 回归任务（高斯分布 → MSE）

假设我们用高斯分布建模：

$$
p(y \mid x; s) = \mathcal{N}(y \mid \mu(x), \sigma^2).
$$

概率密度：

$$
p(y \mid x; s) = \frac{1}{\sqrt{2\pi\sigma^2}} \exp\!\left(-\frac{(y - \mu(x))^2}{2\sigma^2}\right).
$$

负对数似然：

$$
-\log p(y \mid x; s) = \frac{(y - \mu(x))^2}{2\sigma^2} + \text{const}.
$$

如果假设 $\sigma^2$ 固定，这就等价于最小化：

$$
\mathcal{L} = \sum_i (y_i - \mu(x_i))^2,
$$

也就是我们熟悉的 **均方误差 (MSE)**。

---

## 4. 总结

* 分类：从 **Categorical + Softmax** 出发，NLL = 交叉熵损失。
* 回归：从 **Gaussian** 出发，NLL = MSE。

所以常见的损失函数并不是凭空设计的，而是自然地从 **选择的似然模型** 推导出来的。

---

✅ **一句话总结**：
损失函数就是负对数似然函数，不同的损失函数对应于对 $p(y \mid x)$ 选择了不同的分布假设。

````

---
---


# 📑 概念总结表（到目前为止）

| **概念**                         | **数学表达式**                                                          | **直观理解**                    | **与 loss 的关系**   |
| ------------------------------ | ------------------------------------------------------------------ | --------------------------- | ---------------- |
| **概率分布** $p(x,y)$              | $p(x,y) = p(x)p(y\mid x)$                                          | 世界上数据的真实分布                  | 我们想要学习/逼近它       |
| **模型输出分布** $f(x)$              | $p(y\mid f(x))$                                                    | 模型不直接给答案，而是给出一个条件分布         | 决定了对应的 loss 形式   |
| **似然函数** (Likelihood)          | $L(f) = \prod_i p(y_i \mid f(x_i))$                                | 模型在给定参数下，生成我们观测到的数据的“可信度”   | 我们最大化它来拟合数据      |
| **对数似然** (Log-likelihood)      | $\ell(f) = \sum_i \log p(y_i \mid f(x_i))$                         | 方便计算，避免数值下溢                 | loss = 负对数似然     |
| **经验风险** (Empirical risk, ERM) | $\hat{R}(f) = \frac{1}{n}\sum_i l(y_i, f(x_i))$                    | 在训练集上的平均损失                  | 实际优化的目标          |
| **期望风险** (Expected risk)       | $R(f) = \mathbb{E}_{(x,y)\sim p(x,y)} [l(y,f(x))]$                 | 在真实分布上的平均损失，才是真正目标          | ERM 是它的近似        |
| **交叉熵 loss**                   | $-\sum_i \log p(y_i \mid f(x_i))$，分类时 softmax                      | 来自 **Categorical 分布** 的 NLL | 分类常用             |
| **均方误差 (MSE)**                 | $\sum_i (y_i - f(x_i))^2$                                          | 来自 **Gaussian 分布** 的 NLL    | 回归常用             |
| **KL 散度**                      | $D_{KL}(p\|f) = \mathbb{E}_p[\log p(x)] - \mathbb{E}_p[\log f(x)]$ | 度量模型分布和真实分布的差异              | 最大似然等价于最小化 KL 散度 |
| **最大似然估计 (MLE)**               | $f^* = \arg\max_f \prod_i p(y_i \mid f(x_i))$                      | 选择最能解释数据的参数                 | 训练的数学基础          |
### 📑 这一章（datasets and loss）的主要内容

1. **数据 (datasets)**

   * 假设样本来自某个真实分布 $p(x,y)$。
   * 我们只有有限的训练集，所以实际做的是经验风险最小化。

2. **风险 (risk)**

   * 区分 **期望风险**（理想目标，基于真实分布） vs **经验风险**（可计算目标，基于训练集）。
   * 引出 **ERM** 框架。

3. **似然 (likelihood)**

   * 从概率论角度重新看待监督学习：学习 = 拟合条件分布 $p(y|x)$。
   * 用最大似然（MLE）来选择最合理的模型参数。

4. **损失函数 (loss)**

   * 解释了为什么训练时优化的“损失”其实就是 **负对数似然 (NLL)**。
   * 举例说明：

     * **分类**：Categorical 分布 → 交叉熵 loss
     * **回归**：Gaussian 分布 → MSE
   * 提出一个统一思想：**损失函数来自概率分布选择**。



````ad-question
到底 **$f(x)$** 和 **$p(y \mid f(x))$** 是什么关系？他们是不是“一个东西”？

---

### 1. **不是一个东西**

* **$f(x)$** ：模型的输出，通常是一些“参数”或者“特征”。

  * 在分类问题里：$f(x)$ 可以是 logits（未归一化的分数）。
  * 在回归问题里：$f(x)$ 可以是 $\mu, \sigma$ 这样的参数。

* **$p(y \mid f(x))$** ：真正的**概率分布**，需要 $f(x)$ 提供的参数来定义。

  * 在分类里：把 $f(x)$ 的 logits 经过 softmax，就变成了类别分布：

    $$
    p(y=i \mid f(x)) = \frac{\exp(f_i(x))}{\sum_j \exp(f_j(x))}
    $$
  * 在回归里：假设 $y$ 服从高斯分布，$f(x) = (\mu(x), \sigma(x))$，于是

    $$
    p(y \mid f(x)) = \mathcal{N}(y \mid \mu(x), \sigma^2(x))
    $$

👉 所以：

* **$f(x)$** 给你“参数化的输出”。
* **$p(y \mid f(x))$** 用这些参数来定义一个分布。

---

### 2. **为什么要从 $f(x)$ 转向 $p(y \mid f(x))$**

* 如果你只学 $f(x)$，那你只能学一个确定性映射（输入 → 输出）。
* 但现实中很多任务是**不确定的、多模态的**：

  * 一个句子可能有多种翻译；
  * 一个图像可能对应多个合理的标签。
* 这时候直接输出 $f(x)$ 不够了，你需要建模 **整个条件分布** $p(y \mid f(x))$。

---

### 3. **简洁理解**

* $f(x)$ 是“神经网络的原始输出”。
* $p(y \mid f(x))$ 是“把 $f(x)$ 解释成概率分布”之后的形式。
* 它们 **不是同一个东西**，但 **密切相关**：前者参数化后者。

---

📌 总结：

* $f(x)$ ≠ $p(y \mid f(x))$，但是 $f(x)$ **提供参数**，而 $p(y \mid f(x))$ **才是真正的分布**。
* 换句话说：$f(x)$ 是“原材料”，$p(y \mid f(x))$ 是“成品概率分布”。
````


---
---



````ad-note
明白了 ✅ 我来把 **Regularizing the least-squares solution（岭回归）** 这一小节重新总结，并且严格按照你要求的公式规范来写：

---

# 📑 Regularizing the Least-Squares Solution 总结

## 1. 问题背景

* 在最小二乘法 (Least Squares, LS) 中，闭式解为：
  [
  w^{*} = (X^{\top}X)^{-1}X^{\top}y
  ]
* 但是当 (X^{\top}X) 接近奇异（singular）或条件数很大时，矩阵求逆会变得 **数值不稳定**。

---

## 2. 正则化思路

* 为了提升稳定性，可以在矩阵上加一个正则项：
  [
  w^{*} = (X^{\top}X + \lambda I)^{-1}X^{\top}y, \quad \lambda > 0
  ]
* 这样做的好处是：

  * 让矩阵更“接近对角阵”，条件数更好。
  * 避免了直接求逆时的数值不稳定。

---

## 3. 优化问题的形式

* 该解对应于一个带正则化的优化问题：
  [
  \text{LS-Reg}(w) = \frac{2}{n}|y - Xw|^{2} + \frac{\lambda}{2}|w|^{2}
  ]
* 其中 (|w|^{2} = \sum_{i} w_{i}^{2})，即 **(L_{2}) 范数平方**。

---

## 4. 名称与解释

* 这个方法被称为 **正则化最小二乘 (Regularized LS)**，更常见的名字是 **岭回归 (Ridge Regression)**。
* 红色项 (\frac{\lambda}{2}|w|^{2}) 就是 **(L_{2})-正则化**。
* 它代表了我们对“低范数解”的偏好（参数尽量小，避免过拟合）。
* 从贝叶斯视角看：岭回归等价于在权重 (w) 上假设一个均值为 0、方差固定的 **高斯先验**，最终得到 MAP（最大后验估计）。

---

✅ 总结一句话：
岭回归通过在最小二乘的闭式解中加入 (\lambda I)，改善了矩阵的数值稳定性，同时在优化目标中引入了 (L_{2})-正则化，从而限制参数规模，避免过拟合。

---

要不要我接下来把前面 **普通最小二乘 (LS)** 的小节也帮你用同样规范重新总结一下，这样对比会更清晰？

````














# References

[^1]: 知乎关于范数，正则化的解释