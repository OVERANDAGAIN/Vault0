---
created: 2024-12-18T20:35
updated: 2024-12-18T20
---
[[DiCE]]

**Backpropagation**（反向传播）是一种用于训练神经网络的算法，通过链式法则计算梯度，并利用这些梯度更新网络权重以最小化误差。以下是关键点和代码机制：

---

### **关键步骤**
1. **前向传播**：
   - 输入通过网络计算输出，得到损失值。

2. **计算误差**：
   - 损失函数衡量输出和目标值之间的差距（如均方误差、交叉熵）。

3. **误差反向传播**：
   - 利用链式法则计算损失函数对每个权重的偏导数。

4. **权重更新**：
   - 用梯度下降法或其变种（如 SGD, Adam）调整权重：
     $$w = w - \eta \frac{\partial L}{\partial w}$$
     其中 $w$ 为权重，$\eta$ 为学习率，$\frac{\partial L}{\partial w}$ 为梯度。

---

### **核心代码机制**
以 PyTorch 为例，以下代码演示了 Backpropagation 的核心机制：

```python
import torch
import torch.nn as nn
import torch.optim as optim

# 简单网络
model = nn.Sequential(
    nn.Linear(2, 4),
    nn.ReLU(),
    nn.Linear(4, 1)
)

# 损失函数和优化器
criterion = nn.MSELoss()
optimizer = optim.SGD(model.parameters(), lr=0.01)

# 数据
inputs = torch.tensor([[1.0, 2.0], [3.0, 4.0]], requires_grad=True)
targets = torch.tensor([[5.0], [6.0]])

# 训练步骤
# 1. 前向传播
outputs = model(inputs)
loss = criterion(outputs, targets)

# 2. 反向传播
loss.backward()  # 自动计算梯度

# 3. 权重更新
optimizer.step()  # 用梯度更新参数
optimizer.zero_grad()  # 清零梯度，避免累积

print("Loss:", loss.item())
```

---

### **抓重点机制**
1. **梯度计算**：
   - `loss.backward()` 自动利用链式法则计算损失函数对参数的梯度。

2. **参数更新**：
   - `optimizer.step()` 根据计算出的梯度调整权重。

3. **清零梯度**：
   - `optimizer.zero_grad()` 确保每次迭代梯度不会累积。

---

**总结**：Backpropagation 的核心是通过链式法则高效计算梯度并更新权重。代码实现通常通过框架（如 PyTorch）处理复杂的计算过程。