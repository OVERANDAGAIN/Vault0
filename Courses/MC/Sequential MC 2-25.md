---
创建时间: 2025-二月-25日  星期二, 3:07:40 下午
---

Sequential MC  范围： 小于等于 6 维


## 1. Sample 1-dimensional desnity
   ![[Pasted image 20250225152505.png]]
   $prob(X\leq x)=F(x)$

Future work: 把高维分布转换为 ==1-dimensional desnity== 

## 2.  Important Sampling
Fair and Diversity

权重: 
$$
w(x)=\frac{\pi(x)}{g(x)}
$$

1. Draw from $\pi(x)$

2. Draw from Uniform DIstribution

3. Draw from $g(x)$ ,which is an approximation of $\pi(x)$


目标: $g(x)$ 比 $\pi(x)$ 更： simpler, broader

```ad-hint
类比： dominate情况、 贫富差距过大；权重分配，diversity 与 represent
```


ESS:  measuring the effectiveness of samples from $g(x)$ is to measure the variance
of the "weights".
$$
ESS(m)=\frac{m}{1+var[w(x)]}
$$


## 分层采样
SMC
识别的公式可能存在一些错误，以下是正确的LaTeX代码，方便你直接使用：
$$\omega(\mathbf{x}) = \frac{g(\mathbf{x}) = g_1(x_1) \cdot g_2(x_2|x_1) \cdots g_n(x_n|x_1, \dots, x_{n-1})}{\pi(\mathbf{x}) = \pi_1(x_1) \cdot \pi_2(x_2|x_1) \cdots \pi_n(x_n|x_1, \dots, x_{n-1})}$$

这个公式表达的是权重 $\omega(\mathbf{x})$ 作为两个概率密度的比值，其中 $g(\mathbf{x})$ 和 $\pi(\mathbf{x})$ 以条件概率的形式展开。

### EX1：SAW
trial proba
### EX2: Curve Tracking
