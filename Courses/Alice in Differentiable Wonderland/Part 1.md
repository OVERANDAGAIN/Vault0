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


