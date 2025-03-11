---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-11日  星期二, 10:06:11 晚上
---
[[omg_overall]]



# Codes/Questions

- [?] 


```python

```


# RNN中的hidden_dim和hidden_state

### **流程分析：`cond_rnn` 的初始化到 `init_hidden(batch_size)` 的调用，再到 `forward` 方法**
---

## **1. `cond_rnn` 初始化**
```python
self.cond_rnn = RNN(cond_input, self._hidden_dim // 4 * 3).to("cuda")
```
### **关键点**
- `self._hidden_dim = 128`
- `hidden_dim = self._hidden_dim // 4 * 3 = 128 // 4 * 3 = 96`
- `cond_rnn` 内部的 GRU 隐藏状态大小 **96**
- 这个 `hidden_dim` 直接影响 `init_hidden()` 的输出形状

---

## **2. `init_hidden(batch_size)` 的调用**
```python
def init_hidden(self, batch_size):
    self.hidden_state = self.cond_rnn.init_hidden().unsqueeze(0).expand(batch_size, self.n_agents, -1)
```
### **流程**
1. `self.cond_rnn.init_hidden()` **调用 `RNN` 类的 `init_hidden()` 方法**
   ```python
   def init_hidden(self):
       return self.f.weight_hh.new(1, self.hidden_dim).zero_()
   ```
   - `self.hidden_dim = 96`，所以返回一个形状 **`(1, 96)`** 的全零张量。

2. `unsqueeze(0)`:
   - 在第 0 维增加一个维度，形状从 **`(1, 96)`** 变成 **`(1, 1, 96)`**。

3. `.expand(batch_size, self.n_agents, -1)`:
   - `batch_size`: 复制成 `batch_size` 个样本。
   - `self.n_agents`: 复制成 `n_agents` 个智能体。
   - `-1`: 维持 `hidden_dim = 96` 不变。
   - **最终 `self.hidden_state` 形状：** `(batch_size, n_agents, 96)`

### **示例**
假设：
- `batch_size = 32`
- `n_agents = 5`
- `hidden_dim = 96`

那么 `init_hidden(32)` 之后：
```python
self.hidden_state.shape  # (32, 5, 96)
```
---

## **3. `forward` 方法的调用**
```python
cond_x, self.hidden_state = self.cond_rnn(cond_inputs, self.hidden_state)
```
### **进入 `RNN` 类的 `forward()` 方法**
```python
def forward(self, inputs, hidden_state):
    x_shape = inputs.shape  # 获取输入形状
    x = inputs.reshape(-1, x_shape[-1])  # 将 inputs 变为 2D
    h_in = hidden_state.reshape(-1, self.hidden_dim)  # 变换 hidden_state 形状
    h_out = self.f(x, h_in)  # 计算 GRU 单元输出
    return h_out.view(x_shape[:-1] + th.Size([-1])), h_out.detach()
```

### **关键步骤**
1. `hidden_state.reshape(-1, self.hidden_dim)`：
   - `self.hidden_state.shape = (batch_size, n_agents, 96)`
   - 变形为 `(batch_size * n_agents, 96)`

2. `self.f(x, h_in)`（GRUCell 计算）：
   - **输入 `x`**（形状 `(batch_size * n_agents, input_dim)`）
   - **隐藏状态 `h_in`**（形状 `(batch_size * n_agents, 96)`）
   - **输出 `h_out`**（形状 `(batch_size * n_agents, 96)`）

3. `h_out.detach()`：
   - `h_out` 作为新的隐藏状态，并 `detach()` 以阻止梯度回传。

4. `h_out.view(x_shape[:-1] + th.Size([-1]))`：
   - 重新调整形状，使其与 `hidden_state` 形状匹配，即 `(batch_size, n_agents, 96)`

---

## **4. 变化总结**
| 过程 | `hidden_state` 形状 | `hidden_dim` 变化 |
|------|--------------------|------------------|
| `self.cond_rnn = RNN(cond_input, 96)` | **无**（还未初始化） | 96 |
| `self.cond_rnn.init_hidden()` | `(1, 96)` | 96 |
| `.unsqueeze(0).expand(batch_size, n_agents, -1)` | `(batch_size, n_agents, 96)` | 96 |
| `self.cond_rnn.forward(cond_inputs, self.hidden_state)` | `(batch_size, n_agents, 96)` → `(batch_size * n_agents, 96)` | 96 |
| `GRU 计算后` | `(batch_size * n_agents, 96)` | 96 |
| `view` 还原形状 | `(batch_size, n_agents, 96)` | 96 |

---

## **5. 结论**
- `hidden_dim` **始终保持 `96`**，它在 `RNN` 初始化时确定，并决定 `hidden_state` 的大小。
- `hidden_state` **在整个计算过程中形状不断变化**：
  - 先初始化 `(1, 96)`
  - 扩展为 `(batch_size, n_agents, 96)`
  - 在 `forward()` 过程中变为 `(batch_size * n_agents, 96)`
  - 计算后恢复为 `(batch_size, n_agents, 96)`
- 这确保了 `GRU` 计算能够在时间步之间正确传递信息。

# weight_hh 的new()操作




## 2_Answers


## 3_Answers




# FootNotes
