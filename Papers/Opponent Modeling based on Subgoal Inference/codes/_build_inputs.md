---
创建时间: 2025-一月-16日  星期四, 3:22:21 下午
created: 2025-01-16T15:22
updated: ...
---
[[omg_overall]]



# Codes/Questions

- [?] `_build_inputs` 的逻辑是什么？


A: 观测状态（全局或非全局）、动作独热编码、智能体标识独热编码、model的隐藏维度,最终按最后一个维度拼接。

关于拼接[^1][[维度拼接]]



# Answers

````ad-note
`_build_inputs` 和 `_build_vae_inputs` 的构建都来源于 `batch` 中的 `state` 或 `obs` ，即 `get_env_state()/obs()`
````


下面是一个例子，详细展示 `_build_inputs` 方法中张量的变化过程。假设以下条件：

---

### 假设条件
1. **环境和智能体**：
   - 智能体数量：`n_agents = 3`
   - 批量大小：`bs = 2`（一次处理两个环境的样本）
   - 每个智能体的观测值维度：`obs_dim = 4`
   - 动作维度：`n_actions = 5`

2. **参数配置**：
   - `args.obs_is_state = False`（不使用全局状态）。
   - `args.obs_last_action = True`（使用上一步的动作）。
   - `args.obs_agent_id = True`（添加智能体标识）。
   - `args.agent_shift = 1`（需要偏移智能体顺序）。

3. **输入数据结构**：
   - 当前时间步 `t = 1`。
   - `batch["obs"]`：智能体的观测值，形状为 `[bs, n_agents, obs_dim]`。
   - `batch["actions_onehot"]`：上一时间步的动作（独热编码），形状为 `[bs, n_agents, n_actions]`。

4. **AM 模型输出**：
   - 每个 AM 模型的输出维度为 `am_dim = 2`。

---

### 初始数据
- **`batch["obs"]`**：
  ```python
  batch["obs"] = th.tensor([
      [[1.0, 2.0, 3.0, 4.0], [5.0, 6.0, 7.0, 8.0], [9.0, 10.0, 11.0, 12.0]],  # 第一个环境
      [[13.0, 14.0, 15.0, 16.0], [17.0, 18.0, 19.0, 20.0], [21.0, 22.0, 23.0, 24.0]]  # 第二个环境
  ])
  ```
  形状为 `[2, 3, 4]`。

- **`batch["actions_onehot"]`**：
  ```python
  batch["actions_onehot"] = th.tensor([
      [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0]],  # 第一个环境
      [[0, 0, 0, 1, 0], [0, 0, 0, 0, 1], [1, 0, 0, 0, 0]]  # 第二个环境
  ])
  ```
  形状为 `[2, 3, 5]`。

- **智能体标识**：
  ```python
  th.eye(n_agents) = th.tensor([
      [1.0, 0.0, 0.0],
      [0.0, 1.0, 0.0],
      [0.0, 0.0, 1.0]
  ])
  ```
  每行表示一个智能体的标识。

- **AM 模型输出**：
  假设每个 AM 模型返回以下固定输出：
  ```python
  model.forward(batch, t) = th.tensor([
      [0.1, 0.2], [0.3, 0.4], [0.5, 0.6]  # 第一个环境
  ])
  ```
  输出形状为 `[bs, n_agents, am_dim]`。

---

### 计算过程

#### 1. 初始化 `obs_inputs`
- **加入观测值**：
  ```python
  obs_inputs = [batch["obs"][:, t]]  # 取当前时间步
  obs_inputs[0] = th.tensor([
      [[1.0, 2.0, 3.0, 4.0], [5.0, 6.0, 7.0, 8.0], [9.0, 10.0, 11.0, 12.0]],  # 第一个环境
      [[13.0, 14.0, 15.0, 16.0], [17.0, 18.0, 19.0, 20.0], [21.0, 22.0, 23.0, 24.0]]  # 第二个环境
  ])
  ```

- **加入上一步动作**：
  ```python
  obs_inputs.append(batch["actions_onehot"][:, t - 1])
  obs_inputs[1] = th.tensor([
      [[1, 0, 0, 0, 0], [0, 1, 0, 0, 0], [0, 0, 1, 0, 0]],  # 第一个环境
      [[0, 0, 0, 1, 0], [0, 0, 0, 0, 1], [1, 0, 0, 0, 0]]  # 第二个环境
  ])
  ```

- **加入智能体标识**：
  ```python
  obs_inputs.append(th.eye(n_agents).unsqueeze(0).expand(bs, -1, -1))
  obs_inputs[2] = th.tensor([
      [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]],  # 第一个环境
      [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]  # 第二个环境
  ])
  ```

#### 2. 添加 AM 模型输出
- 遍历 AM 模型，添加其输出：
  ```python
  model.forward(batch, t) = th.tensor([
      [0.1, 0.2], [0.3, 0.4], [0.5, 0.6]  # 第一个环境
  ])
  ```
  添加到 `temp` 中。

#### 3. 拼接输入
- 将 `obs_inputs` 和 AM 模型的输出按最后一个维度拼接：
  ```python
  temp = th.cat([obs_inputs[0], obs_inputs[1], obs_inputs[2], am_output], dim=-1)
  temp = th.tensor([
      [[1.0, 2.0, 3.0, 4.0, 1, 0, 0, 0, 0, 1.0, 0.0, 0.0, 0.1, 0.2],  # Agent 1
       [5.0, 6.0, 7.0, 8.0, 0, 1, 0, 0, 0, 0.0, 1.0, 0.0, 0.3, 0.4],  # Agent 2
       [9.0, 10.0, 11.0, 12.0, 0, 0, 1, 0, 0, 0.0, 0.0, 1.0, 0.5, 0.6]],  # Agent 3
      [[13.0, 14.0, 15.0, 16.0, 0, 0, 0, 1, 0, 1.0, 0.0, 0.0, 0.1, 0.2],
       [17.0, 18.0, 19.0, 20.0, 0, 0, 0, 0, 1, 0.0, 1.0, 0.0, 0.3, 0.4],
       [21.0, 22.0, 23.0, 24.0, 1, 0, 0, 0, 0, 0.0, 0.0, 1.0, 0.5, 0.6]]
  ])
  ```
  拼接后形状为 `[bs, n_agents, input_dim]`。

#### 4. 偏移智能体顺序
- 根据 `agent_shift=1`，对智能体输入进行偏移：
  ```python
  temp = th.cat([temp[:, 1:, :], temp[:, :1, :]], dim=1)
  ```
  结果形状保持不变，但智能体顺序调整。

#### 5. 重塑为最终输入
- 重塑为 `[bs * n_agents, input_dim]`：
  ```python
  inputs = temp.view(bs * n_agents, -1)
  inputs = th.tensor([
      [5.0, 6.0, 7.0, 8.0, 0, 1, 0, 0, 0, 0.0, 1.0, 0.0, 0.3, 0.4],  # Agent 2
      [9.0, 10.0, 11.0, 12.0, 0, 0, 1, 0, 0, 0.0, 0.0, 1.0, 0.5, 0.6],  # Agent 3
      [1.0, 2.0, 3.0, 4.0, 1, 0, 0, 0, 0, 1.0, 0.0, 0.0, 0.1, 0.2],  # Agent 1
      ...
  ])
  ```

---

最终，这些输入可以用于智能体的前向计算，支持策略更新或动作选择。
## Overall_Answers
以下是对 `_build_inputs` 方法每一行代码的详细分析：

### 方法概览
`_build_inputs` 方法的主要作用是为多智能体控制器中的每个智能体构建输入张量。输入包括状态、观测值、上一次动作以及智能体的标识符等，同时可能包含从子目标推断模块（AM模型）的额外信息。

---

### 代码逐行解析

#### **方法定义与注释**
```python
    def _build_inputs(self, batch, t):
        # Assumes homogenous agents with flat observations.
        # Other MACs might want to e.g. delegate building inputs to each agent
```
- 定义了 `_build_inputs` 方法，该方法接受两个参数：
  - `batch`：存储了智能体的观测值、动作、状态等信息的批量数据。
  - `t`：当前时间步。
- 注释说明：
  - 假设所有智能体是同质的（即具有相同的输入形状）。
  - 如果是异质智能体，可能需要为每个智能体单独构建输入。

#### **获取批量大小**
```python
        bs = batch.batch_size
```
- 从 `batch` 对象中提取批量大小 `bs`，用于后续处理输入数据的形状。

#### **处理全局状态**
```python
        if self.args.obs_is_state:
            state = batch["state"]
```
- 检查是否使用全局状态（`obs_is_state=True`）。
- 如果是，则从 `batch` 中提取全局状态 `state`。

```python
            if len(state.shape) == 3:
                state = state.unsqueeze(2).repeat(1, 1, self.n_agents, 1)
            elif len(state.shape) == 4:
                pass
            else:
                raise IndexError
```
- 根据状态 `state` 的维度调整形状：
  - 如果 `state` 的形状为 `[bs, t, features]`（3维），扩展维度并沿智能体维度复制（`repeat`），得到 `[bs, t, n_agents, features]`。
  - 如果 `state` 的形状已经是 `[bs, t, n_agents, features]`（4维），直接使用。
  - 如果状态形状不符合上述情况，抛出异常。

#### **初始化观测输入列表**
```python
        obs_inputs = []
```
- 初始化一个空列表，用于存储各时间步的观测输入。

#### **添加状态或观测值**
```python
        if self.args.obs_is_state:
            obs_inputs.append(state[:, t])
```
- 如果使用全局状态，将当前时间步的状态 `state[:, t]` 添加到 `obs_inputs` 中。

```python
        else:
            obs_inputs.append(batch["obs"][:, t])  # b1av
```
- 否则，从 `batch` 中提取当前时间步的观测值 `obs`（形状 `[bs, n_agents, obs_dim]`），添加到 `obs_inputs`。

#### **添加上一步动作（如果需要）**
```python
            if self.args.obs_last_action:
                if t == 0:
                    obs_inputs.append(th.zeros_like(batch["actions_onehot"][:, t]))
                else:
                    obs_inputs.append(batch["actions_onehot"][:, t - 1])
```
- 如果 `obs_last_action=True`，表示需要将上一步的动作作为输入：
  - 如果是第一个时间步（`t==0`），用零张量填充，因为没有上一步动作。
  - 否则，将上一时间步的动作（`actions_onehot`）添加到 `obs_inputs`。

#### **添加智能体标识（如果需要）**
```python
        if self.args.obs_agent_id:
            obs_inputs.append(th.eye(self.n_agents, device=batch.device).unsqueeze(0).expand(bs, -1, -1))
```
- 如果 `obs_agent_id=True`，表示需要为每个智能体添加唯一标识：
  - 创建一个单位矩阵（`n_agents x n_agents`），每一行代表一个智能体的 ID。
  - 扩展维度以适配批量大小 `bs`，并添加到 `obs_inputs`。

#### **构建完整输入**
```python
        inputs = []
```
- 初始化 `inputs` 列表，用于存储所有智能体的完整输入。

```python
        for model in self.agents_model:
            temp = [t.clone() for t in obs_inputs]
```
- 遍历每个 AM 模型（子目标推断模块）。
- 将 `obs_inputs` 的每个元素克隆到临时变量 `temp`，以便后续操作。

#### **添加子目标推断的特征**
```python
            temp.append(model.forward(batch, t).squeeze(0).detach())
```
- 调用 AM 模型的 `forward` 方法，基于当前时间步的 `batch` 数据生成额外特征。
- 使用 `squeeze(0)` 移除多余的批量维度，并通过 `detach` 阻止梯度传播。

#### **拼接所有输入**
```python
            temp = th.cat([x.reshape(bs, self.n_agents, -1) for x in temp], dim=-1)
```
- 将 `temp` 中的所有输入按最后一个维度（特征维度）拼接，形成完整的输入张量。
- 输入张量的形状为 `[bs, n_agents, input_dim]`。

#### **处理智能体排列的偏移（如果需要）**
```python
            if self.args.agent_shift:
                temp = th.cat([temp[:, self.args.agent_shift:, :], temp[:, :self.args.agent_shift, :]], dim=1)
```
- 如果启用了智能体排列偏移（`agent_shift`），则调整输入的排列顺序：
  - 将输入张量的后部分（偏移后的智能体）移动到前面。

#### **保存输入**
```python
            inputs.append(temp.view(bs * self.n_agents, -1))
```
- 将调整后的输入重塑为形状 `[bs * n_agents, input_dim]`，并添加到 `inputs` 列表。

#### **返回输入**
```python
        return inputs
```
- 返回 `inputs`，即所有智能体的完整输入列表。

---

### 方法总结
- 该方法支持为多智能体系统构建灵活的输入，包括：
  - 全局状态或局部观测值。
  - 上一步动作。
  - 智能体唯一标识。
  - 子目标推断模块的附加特征。
- 支持智能体排列的动态调整，适配多种任务需求。

## 1_Answers

这个函数 `_build_inputs(self, batch, t)` 主要是用来**构造神经网络的输入 `inputs`**，不同的 `obs_is_state` 取值会导致不同的 `inputs` 结构。

**核心逻辑**
1. **当 `obs_is_state=True`**，输入的是**全局状态（state）**，每个智能体共享相同的状态。
2. **当 `obs_is_state=False`**，输入的是**每个智能体的局部观测（obs）**，不同智能体的输入不同。
3. **额外输入**（如 `obs_last_action`、`obs_agent_id`）可能被添加到输入中。

---

# **情况 1：`obs_is_state=True`（使用全局状态）**
```python
if self.args.obs_is_state:
    state = batch["state"]
    if len(state.shape) == 3:
        state = state.unsqueeze(2).repeat(1, 1, self.n_agents, 1)
    elif len(state.shape) == 4:
        pass
    else:
        raise IndexError
```
### **构造 `state`**
- `batch["state"]` 形状：
  - `len(state.shape) == 3`：说明 `state` 的形状是 `[batch_size, max_t, state_dim]`。
  - `unsqueeze(2).repeat(1, 1, self.n_agents, 1)` 使其变成 `[batch_size, max_t, n_agents, state_dim]`，即所有智能体共享相同的全局状态。
  - 如果 `state` 形状已经是 `[batch_size, max_t, n_agents, state_dim]`，则不需要变换（`len(state.shape) == 4`）。

### **构造 `obs_inputs`**
```python
if self.args.obs_is_state:
    obs_inputs.append(state[:, t])
```
- **直接使用 `state[:, t]` 作为输入**，形状是 `[batch_size, n_agents, state_dim]`，所有智能体共享相同的状态。

### **最终 `inputs`**
```python
temp = [t.clone() for t in obs_inputs]
temp.append(model.forward(batch, t).squeeze(0).detach())
temp = th.cat([x.reshape(bs, self.n_agents, -1) for x in temp], dim=-1)
```
- **最终 `inputs` 结构**
  - `[batch_size, n_agents, state_dim]`
  - `model.forward(batch, t).squeeze(0).detach()` 可能是模型的一个额外特征（如潜在表示 `z`）。
  - `inputs` 形状最终变为 `[batch_size * n_agents, feature_dim]`。

---

# **情况 2：`obs_is_state=False`（使用局部观测）**
```python
obs_inputs.append(batch["obs"][:, t])  # b1av
```
- **使用 `batch["obs"][:, t]` 作为输入**，形状是 `[batch_size, n_agents, obs_dim]`。
- 每个智能体的 `obs` 不同。

### **如果 `obs_last_action=True`，加入上一时刻的动作**
```python
if self.args.obs_last_action:
    if t == 0:
        obs_inputs.append(th.zeros_like(batch["actions_onehot"][:, t]))
    else:
        obs_inputs.append(batch["actions_onehot"][:, t-1])
```
- **如果 `t=0`**（第一步），那么上一个动作不存在，补零。
- **否则，使用 `t-1` 时刻的 one-hot 动作**（`batch["actions_onehot"][:, t-1]`）。

### **如果 `obs_agent_id=True`，加入 one-hot 编码的智能体 ID**
```python
if self.args.obs_agent_id:
    obs_inputs.append(th.eye(self.n_agents, device=batch.device).unsqueeze(0).expand(bs, -1, -1))
```
- `th.eye(self.n_agents)` 生成 **`n_agents × n_agents`** 的单位矩阵，每一行是一个智能体的 one-hot ID。
- `expand(bs, -1, -1)` 复制 `batch_size` 份，使形状变为 `[batch_size, n_agents, n_agents]`。

### **最终 `inputs`**
```python
temp = [t.clone() for t in obs_inputs]
temp.append(model.forward(batch, t).squeeze(0).detach())
temp = th.cat([x.reshape(bs, self.n_agents, -1) for x in temp], dim=-1)
```
- **最终 `inputs` 结构**
  - `[batch_size, n_agents, obs_dim]`
  - 可能包括：
    - **当前观察 `obs`**
    - **上一个动作（如果 `obs_last_action=True`）**
    - **智能体 ID（如果 `obs_agent_id=True`）**
    - **模型额外特征 `model.forward(batch, t)`**
  - `inputs` 最终形状变为 `[batch_size * n_agents, feature_dim]`。

---

# **最终总结**
| `obs_is_state` | `inputs` 组成 | 形状（每个智能体） |
|--------------|------------|------------|
| **True** | `state[t]` | `[state_dim]` |
| **False** | `obs[t]`, `last_action[t-1]`, `agent_id` | `[obs_dim + action_dim + agent_id_dim]` |

- **如果 `obs_is_state=True`**
  - `inputs` 直接使用 `state[t]`，全局状态共享。
- **如果 `obs_is_state=False`**
  - `inputs` 使用 `obs[t]`，加上可能的 **上一个动作（`obs_last_action`）** 和 **one-hot 智能体 ID（`obs_agent_id`）**。

这样 `_build_inputs` 就构造出了用于智能体决策的 `inputs`，供神经网络进行训练或推理。
## 2_Answers


## 3_Answers




# FootNotes

[^1]: 关于拼接操作