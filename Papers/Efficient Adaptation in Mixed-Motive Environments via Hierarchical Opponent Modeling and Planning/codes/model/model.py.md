---
创建时间: 2024-十二月-16日  星期一, 11:46:05 中午
created: 2024-12-18T20:35
updated: 2024-12-23T14:50
---
[[HOP_Overall]]



# Codes/Questions

```python

```


# Answers

## GPT_Answers
### 大致功能和调用梳理

#### **文件概述**

在`model.py`中，定义了两个主要的模型类：`MyModel`和`RLModel`。这些模型类继承了`TorchModelV2`和`nn.Module`，并实现了强化学习中的神经网络模型。它们被设计来处理输入的观测数据，并通过卷积神经网络（CNN）和循环神经网络（LSTM）来生成动作输出和价值函数（critic）。这些模型通常用于强化学习框架（如Ray RLlib）。

#### **主要类和功能**

1. **MyModel**
    - 继承自`TorchModelV2`和`nn.Module`，是一个基本的CNN模型，主要用于处理2D图像输入，进行状态评估和动作预测。
    - 构造函数：`__init__`
        - 初始化网络结构，包括卷积层、全连接层以及输出层。
        - 设置设备（CPU或GPU）。
    - `forward`方法：
        - 处理输入数据，经过卷积层提取特征，拼接时间信息后，送入全连接层。
        - 使用输出生成策略（actor）和价值（critic），并返回加权的动作概率（通过`action_mask`）和状态价值。
    - `value_function`方法：返回当前状态的价值。
    - `compute_priors_and_value`方法：用于通过当前观测和时间信息计算先验（即动作分布）和价值，通常用于模型评估。

2. **RLModel**
    - 继承自`RecurrentNetwork`和`nn.Module`，是一个带有LSTM层的强化学习模型，适用于处理时间序列或部分观察信息的场景。
    - 构造函数：`__init__`
        - 初始化网络结构，包含卷积层用于提取特征，以及LSTM层处理时间信息。
        - 初始化设备（GPU或CPU）。
    - `get_initial_state`方法：初始化LSTM的隐状态（`h` 和 `c`）。
    - `forward_rnn`方法：
        - 处理输入序列，经过卷积层处理每帧的观测数据，然后通过LSTM层进行时序建模。
        - 生成动作的logits和对应的动作掩码（`action_mask`），并返回经过`action_mask`修正的输出。
    - `value_function`方法：返回当前状态的价值。

#### **类与方法调用梳理**

- **MyModel类**：
    - `forward`方法会处理输入的观测数据（`input_dict`），首先根据是否包含`observation`字段选择不同的处理方式，然后将数据传递给共享层（`shared_layers`）进行特征提取。
    - 然后拼接时间信息，并传递给全连接层进行进一步处理，最后输出动作的logits和价值函数。
    - `compute_priors_and_value`方法会利用当前的观测和时间信息，通过`forward`方法计算动作分布（通过softmax）和状态价值。

- **RLModel类**：
    - `forward_rnn`方法接收输入数据（`inputs`），首先对观测数据进行处理（通过卷积层），然后输入到LSTM中进行时序建模。LSTM的隐状态会在序列中进行更新。接着输出动作的logits和对应的动作掩码。
    - `value_function`方法返回当前状态的价值，这是通过LSTM输出的特征计算得到的。

### 总结

这两个类通过不同的网络结构（`MyModel`使用CNN和全连接层，`RLModel`使用CNN和LSTM）来处理输入数据，并计算强化学习中的动作策略（actor）和价值函数（critic）。`MyModel`适用于处理较为静态的输入（如单帧图像），而`RLModel`则适用于需要时间依赖（如序列数据）的场景。

## MyModel_Answers
下面是对 `MyModel` 类的逐行分析：

### 类定义：
```python
class MyModel(TorchModelV2, nn.Module, ABC):
```
- 这是一个自定义的神经网络模型类，继承了 `TorchModelV2`、`nn.Module` 和 `ABC` 类。
  - `TorchModelV2` 是 Ray RLlib 框架中的基类，提供了许多强化学习模型所需的接口和功能。
  - `nn.Module` 是 PyTorch 中的基类，用于创建神经网络模型。
  - `ABC` 是抽象基类的模块，允许创建抽象方法和抽象类。

### `__init__` 方法：
```python
def __init__(self, obs_space, action_space, num_outputs, model_config, name):
    TorchModelV2.__init__(self, obs_space, action_space, num_outputs, model_config, name)
    nn.Module.__init__(self)
```
- `__init__` 方法是类的构造函数，用于初始化模型。
- 首先调用了 `TorchModelV2` 和 `nn.Module` 的构造函数，确保初始化了这些基类所需的参数。
- `obs_space`、`action_space`、`num_outputs` 和 `model_config` 是来自 RLlib 框架的配置，用于设置观测空间、动作空间、输出层的大小和模型的其他配置。

```python
self.input_channels = model_config['custom_model_config']['input_channels']
self.world_height = model_config['custom_model_config']['world_height']
self.world_width = model_config['custom_model_config']['world_width']
```
- 从 `model_config` 中提取自定义的配置项，设置输入通道数、世界的高度和宽度。

```python
if torch.cuda.is_available():
    self.device = torch.device("cpu")
else:
    self.device = torch.device("cpu")
```
- 检查是否可用 GPU，如果有则使用 GPU，否则使用 CPU。这里的代码似乎有误，因为无论如何都会设置为 `cpu`，应该是 `cuda:0` 而非 `cpu`。

```python
self.shared_layers = nn.Sequential(
    nn.Conv2d(self.input_channels, 16, 3, 1, 1),
    nn.ReLU(),
    nn.Conv2d(16, 32, 3, 1, 1),
    nn.ReLU(),
    nn.Conv2d(32, 32, 3, 1, 1),
    nn.Flatten()
).to(self.device)
```
- 定义了一个卷积层模块 `shared_layers`，用于从输入中提取特征。
  - 三个卷积层，分别输出 16、32、32 个特征图，每个卷积层之后都有 ReLU 激活函数。
  - 最后用 `Flatten()` 将多维输出展平，准备传递给全连接层。

```python
self.flatten_layers = nn.Sequential(
    nn.Linear(32 * self.world_height * self.world_width + 1, 512),
    nn.ReLU(),
).to(self.device)
```
- `flatten_layers` 是一个全连接层，用于将卷积层的输出扁平化并传递到更高的层次。
  - 输入的大小是卷积层输出的 32 个通道，乘以世界的高度和宽度，外加 1（可能是时间步或者其他特征）。
  - 输出为 512 维，并通过 ReLU 激活函数。

```python
self.actor_layers = nn.Linear(512, 6).to(self.device)
self.critic_layers = nn.Linear(512, 1).to(self.device)
```
- `actor_layers` 是一个线性层，用于生成动作的 logits，输出维度为 6（表示可能的动作数）。
- `critic_layers` 是一个线性层，用于生成值函数的输出，输出维度为 1。

```python
self._value_out = None
```
- 初始化 `_value_out`，用于存储批量计算中的值函数输出。

```python
for m in self.modules():
    if isinstance(m, nn.Conv2d) or isinstance(m, nn.Linear):
        nn.init.kaiming_normal_(m.weight)
```
- 对模型中的每个卷积层和全连接层进行 He 初始化，以提高模型的训练效率。



- [!] <span style="background:#d2cbff">note</span> [^1] 

### `forward` 方法：
```python
def forward(self, input_dict, state, seq_lens, time):
```
- `forward` 方法定义了模型的前向传播。接收输入字典 `input_dict`、状态 `state`、序列长度 `seq_lens` 和时间 `time`。

```python
if 'observation' not in input_dict.keys():
    obs_flatten = input_dict['obs_flat']
    x = obs_flatten[..., 6:].reshape(obs_flatten.shape[0], self.input_channels, self.world_height, self.world_width)
    action_mask = obs_flatten[..., :6]
    x = x.to(self.device)
    action_mask = action_mask.to(self.device)
```
- 检查输入字典中是否有 `observation` 键。如果没有，使用 `obs_flat` 键来获取观察值。
- 提取观察值的后续部分，并将其重塑为正确的形状（批量大小、输入通道数、世界高度、世界宽度）。
- 提取动作掩码（前 6 个元素），并将其移动到相同的设备。

```python
else:
    x = input_dict["observation"]
    action_mask = input_dict['action_mask']
    x = convert_to_tensor(x).to(self.device).float()
    action_mask = convert_to_tensor(action_mask).to(self.device).float()
    x = x.unsqueeze(0)
    action_mask = action_mask.unsqueeze(0)
```
- 如果 `observation` 键存在，直接提取观察值和动作掩码。
- 将其转换为 PyTorch 张量并移动到设备上，然后增加一个额外的维度（批量大小维度）。

- **分支处理**：检查 `input_dict` 是否包含键 `'observation'`。
  - 如果没有 `'observation'`，数据被认为是展平后的形式（`obs_flat`）。
    - 动作掩码是展平数据的前 6 列。
    - 剩余部分是输入特征，需要重新塑形为 `(batch_size, input_channels, height, width)` 的三维数据。
  - 如果有 `'observation'`，直接使用它作为特征数据，同时提取动作掩码。
- **数据转换**：
  - 调用 `convert_to_tensor` 将 NumPy 数组转为 PyTorch 张量。
  - 确保数据类型是浮点数，并且数据被放到指定设备（`CPU` 或 `GPU`）。
- **维度处理**：
  - 添加批次维度 (`unsqueeze`) 是为了确保输入数据符合后续层（例如卷积层）的要求。


```python
time = time.to(self.device)
```
- 将时间信息移动到设备上。

```python
x = self.shared_layers(x)
x = torch.cat((x, time), dim=1)
x = self.flatten_layers(x)
```
- 将输入 `x` 传递通过共享的卷积层。
- 将时间信息与卷积层的输出连接（拼接）。
- 然后通过扁平层进一步处理。

```python
logits = self.actor_layers(x)
inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
```
log_mask处理[^3]
logits-actor_layers[^4]
- 使用 `actor_layers` 计算 logits，表示每个动作的概率。
- 计算动作掩码的对数，并使用 `clamp` 限制值的范围，避免数值溢出。

```python
self._value_out = self.critic_layers(x)
```
- 使用 `critic_layers` 计算值函数的输出，存储在 `_value_out` 中。
critic_layers[^5]


```python
return (logits + inf_mask).cpu(), []
```
- 返回计算的 logits（加上动作掩码的影响）和一个空的列表。此方法通常返回的是动作的 logits 和状态信息。


#### Forward数据流：[^2]


### `value_function` 方法：
```python
def value_function(self):
    return self._value_out.cpu()
```
- 返回值函数的输出，将其移动到 CPU 上。
value_function[^6]
### `compute_priors_and_value` 方法：
```python
def compute_priors_and_value(self, obs, time):
    with torch.no_grad():
        model_out = self.forward(obs, None, [1], torch.tensor([[time]]))
        logits, _ = model_out
        value = self.value_function()
        logits, value = torch.squeeze(logits), torch.squeeze(value)
        priors = nn.Softmax(dim=-1)(logits)

        priors = priors.cpu().numpy()
        value = value.cpu().numpy()

        return priors, value
```
```ad-note
 融合 Prior 和 Critic 信息
主要逻辑：

    使用 forward 方法计算 logits 和值函数。
    对 logits 应用 softmax，得到动作概率分布。
    返回动作概率和值函数。

应用场景：

    在 MCTS（蒙特卡洛树搜索）中使用动作概率（prior）指导搜索。
```
- 计算给定观察值和时间步长下的先验概率和价值。
- 通过 `forward` 方法计算 logits 和值函数输出。
- 使用 Softmax 函数对 logits 进行归一化，以得到每个动作的先验概率。
- 将结果转回 CPU 并转换为 NumPy 数组，返回先验概率和价值。



---



## RLModel_Answers

### **RLModel 的分析**
这个 `RLModel` 类实现了一个带有 LSTM 的强化学习模型，用于处理时间序列任务，特别是涉及多步决策和历史依赖的情况。以下是逐步分析：

---

### **初始化方法**
#### `__init__` 方法：
```python
class RLModel(RecurrentNetwork, nn.Module):
    def __init__(self, obs_space, action_space, num_outputs, model_config, name):
        nn.Module.__init__(self)
        super().__init__(obs_space, action_space, num_outputs, model_config, name)
        self.lstm_state_size=model_config['custom_model_config']['lstm_state_size']
        self.input_channels=model_config['custom_model_config']['input_channels']
        self.player_num=model_config['custom_model_config']['input_channels']-8
        self.world_height=model_config['custom_model_config']['world_height']
        self.world_width=model_config['custom_model_config']['world_width']class RLModel(RecurrentNetwork, nn.Module):
```

1. **继承与初始化**：
   - **父类**：继承了 `RecurrentNetwork` 和 `nn.Module`。
   - 使用 `super()` 初始化父类，用于支持 RNN 特性。

2. **模型参数配置**：
   - `lstm_state_size`：LSTM 隐藏层状态的大小，表示 LSTM 的记忆能力。
   - `input_channels`：输入通道数，包含玩家、障碍物、目标等多个特征。
   - `player_num`：玩家数量，计算为 `input_channels - 8`，假设 `8` 是固定的环境特征通道。
   - `world_height` 和 `world_width`：环境的高度和宽度。

3. **设备选择**：
   - 判断是否有 GPU 可用，如果没有，则使用 CPU。

4. **特征提取层**：
   ```python
   self._preprocess = nn.Sequential(
       nn.Conv2d(self.input_channels, 16, 3, 1, 1),
       nn.ReLU(),
       nn.Conv2d(16, 32, 3, 1, 1),
       nn.ReLU(),
       nn.Conv2d(32, 32, 3, 1, 1),
       nn.ReLU(),
       nn.Flatten()
   )
   ```
   - 通过卷积网络提取输入的空间特征，经过三层卷积后展平成一维。

5. **LSTM 模块**：
   ```python
   self.lstm = nn.LSTM(32 * self.world_height * self.world_width, self.lstm_state_size, batch_first=True)
   ```
   - 输入维度：提取的卷积特征维度。
   - 输出维度：`lstm_state_size`，用于存储历史信息。

6. **动作和值函数网络**：
   ```python
   self._action_branch = nn.Linear(self.lstm_state_size, 6)
   self._value_branch = nn.Linear(self.lstm_state_size, 1)
   ```
   - 动作分支：将 LSTM 的输出映射到动作空间（6 个动作的 logits）。
   - 值分支：将 LSTM 的输出映射到标量状态值。

---

### **方法解析**

#### **1. `get_initial_state`**
```python
def get_initial_state(self):
    return [
        self._preprocess[0].weight.new(1, self.lstm_state_size).zero_().squeeze(0),
        self._preprocess[0].weight.new(1, self.lstm_state_size).zero_().squeeze(0)
    ]
```

- **作用**：
  - 返回 LSTM 的初始状态，包括隐藏状态（hidden state）和记忆状态（cell state）。
- **具体实现**：
  - 使用 `torch.zero_()` 初始化为全零，表示没有历史信息。
  - 每个状态的大小为 `(1, lstm_state_size)`，并去掉批次维度。

---

#### **2. `forward_rnn`**
```python
def forward_rnn(self, inputs, state, seq_lens):
```

- **参数**：
  - `inputs`：输入观测值。
  - `state`：LSTM 的初始状态，包括隐藏状态和记忆状态。
  - `seq_lens`：时间序列的长度，通常用于处理批次中的变长序列。

- **具体实现**：
  1. **分离状态**：
     ```python
     state = [state[0], state[1]]
     ```
     将输入的状态分离为隐藏状态和记忆状态。

  2. **提取观测和掩码**：
     ```python
     obs_flatten = inputs[:, :, 6:].float()
     obs = obs_flatten.reshape(
         obs_flatten.shape[0], obs_flatten.shape[1],
         self.input_channels, self.world_height, self.world_width
     )
     action_mask = inputs[:, :, :6].float()
     ```
     - `obs_flatten`：从输入中提取观测值，排除动作掩码部分（前 6 个通道）。
     - `obs`：将观测值恢复为原始的多通道结构。
     - `action_mask`：提取动作掩码，用于限制合法动作。

  3. **特征提取**：
     ```python
     obs_postprocess_set = []
     for i in range(obs.shape[1]):
         obs_postprocess_set.append(self._preprocess(obs[:, i, ...]))
     obs_postprocessed = torch.stack(obs_postprocess_set, dim=1)
     ```
     - 遍历时间步，将每一帧的观测输入卷积网络。
     - 将所有时间步的特征堆叠为 `(batch_size, seq_len, features)`。

  4. **LSTM 前向传播**：
     ```python
     self._features, [h, c] = self.lstm(
         obs_postprocessed,
         [torch.unsqueeze(state[0], 0), torch.unsqueeze(state[1], 0)]
     )
     ```
     - 将提取的特征输入 LSTM，输出每个时间步的特征 `_features`。
     - 更新隐藏状态和记忆状态 `[h, c]`。

  5. **动作和掩码处理**：
     ```python
     inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
     action_logits = self._action_branch(self._features)
     ```
     - 使用动作掩码过滤非法动作。
     - 使用 `_action_branch` 输出动作 logits。

  6. **返回值**：
     ```python
     return action_logits + inf_mask, [torch.squeeze(h, 0), torch.squeeze(c, 0)]
     ```
     - 返回动作 logits 和更新后的 LSTM 状态。

---

#### **3. `value_function`**
```python
def value_function(self):
    assert self._features is not None, "must call forward() first"
    return torch.reshape(self._value_branch(self._features), [-1])
```

- **作用**：
  - 返回 Critic 网络的状态值。
- **具体实现**：
  - 使用 `_value_branch` 计算状态值。
  - 将状态值展平为一维向量，确保与 RL 框架兼容。

---

### **总结**
这个模型使用了 **卷积网络 + LSTM** 的结构，主要特点是：
1. **特征提取**：
   - 使用卷积网络提取每个时间步的空间特征。
   - 这些特征作为 LSTM 的输入，捕捉时间相关性。

2. **动作和值分支**：
   - 动作分支生成 logits，用于选择动作。
   - 值分支估计状态值，用于策略优化。

3. **动作掩码**：
   - 通过掩码限制非法动作，确保训练稳定性。

4. **状态初始化**：
   - LSTM 的隐藏状态和记忆状态初始化为全零，用于处理无历史的情况。

这种设计适合处理时间序列任务，尤其是多智能体环境中的动态决策问题。


# **MyModel 和 RLModel 的联系与区别**

#### **联系**
1. **共同点**：
   - 两者均为强化学习模型，输出 **动作 logits** 和 **状态值**。
   - 输入包含环境的观测（`observation`）和动作掩码（`action_mask`）。
   - 目标相同，均为解决 **Markov Snowdrift Game (MSG)**。

2. **应用场景**：
   - 都可能用于 **多智能体环境**，为不同智能体提供策略。
   - 提供对比实验基础，测试不同模型在任务中的表现。

---

#### **区别**
1. **网络结构**：
   - **`MyModel`**：仅基于卷积网络（CNN），专注于处理观测空间特征，适合 **单步决策**。
   - **`RLModel`**：结合卷积网络和 LSTM，能够捕捉时间序列特征，适合 **具有时间依赖的任务**。

2. **复杂度与计算成本**：
   - **`MyModel`**：简单快速，适合作为基线（Baseline Model）。
   - **`RLModel`**：引入 LSTM 增加复杂性，适合需要长期规划的智能体。

3. **使用场景**：
   - **`MyModel`**：适合即时决策或静态环境。
   - **`RLModel`**：适合动态环境、时间序列建模，尤其是多步协作任务。

---

#### **为什么有两个模型？**
- **多智能体任务需求**：不同智能体可能使用不同复杂度的模型。
- **实验对比**：`MyModel` 可作为基线，`RLModel` 测试时间序列策略效果。
- **任务特性兼容**：根据是否存在时间依赖性选择合适的模型。

# FootNotes


- ``self._value_out`` 和 ``value_function`` 被转换为 PyTorch 张量。
- `observation` 经卷积层处理，提取空间特征，展平后与时间步拼接。
- 拼接结果通过全连接层进一步处理，生成特征表示。
- Actor 网络根据特征生成动作 logits，并结合掩码调整输出。
- Critic 网络生成状态价值，辅助策略评估。
- 最终返回动作 logits 和状态价值。

[^1]: [[KaiMing Normalization]]
[^3]: log_mask
[^4]: actor-layers
[^5]: critic_layers处理，`action_mask` 在`observation`中返回缓存值
[^2]: forward数据流
[^6]: 同 5