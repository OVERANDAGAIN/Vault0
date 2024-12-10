[[HOP]]

# Questions


# Answers


## GPT_Answers
**Indicator Function**（指示函数）用来表示条件是否成立，其定义如下：

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
print(indicator_function(2, A))  # 输出 1
print(indicator_function(4, A))  # 输出 0
```

### 应用示例

**积分中使用：**

```python
import numpy as np

def f(x):
    return x**2

a, b = 0, 2
integral = np.sum([f(x) * indicator_function(x, range(a, b+1)) for x in np.linspace(-1, 3, 100)])
print(integral)
```

指示函数用于条件约束和事件判断，具有广泛应用于数学、统计和机器学习中。

## Other_Answers



# Codes

```python

```
