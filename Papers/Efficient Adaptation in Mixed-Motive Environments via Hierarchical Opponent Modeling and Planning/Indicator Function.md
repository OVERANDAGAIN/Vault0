[[HOP]]

# Questions


# Answers


## GPT_Answers
**Indicator Function** (指示函数)用于表示条件是否成立，定义如下：

$$I_A(x) =
\begin{cases} 
1, & \text{if } x \in A, \\
0, & \text{if } x \notin A.
\end{cases}$$

### Python 实现

```python
def indicator_function(x, A):
    return 1 if x in A else 0
```

### 示例

```python
A = {1, 2, 3}
print(indicator_function(2, A))  # 输出: 1
print(indicator_function(4, A))  # 输出: 0
```

### 常见用途

1. **条件约束**:
   $$f(x) = I_{[a, b]}(x) \cdot g(x)$$
   限制 $x$ 在区间 $[a, b]$。

2. **积分区域控制**:

```python
from scipy.integrate import quad

f = lambda x: x**2 * indicator_function(x, range(1, 4))
result, _ = quad(f, 0, 5)  # 实际积分在 [1, 3]
print(result)
```

简单高效，用于数学建模、分类等场景。


## Other_Answers



# Codes

```python

```
