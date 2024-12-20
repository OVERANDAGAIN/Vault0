---
创建时间: 2024-十二月-17日  星期二, 10:14:56 上午
---
[[HOP_Overall]]



# Codes/Questions

```python

```


# Answers

## Overall_Answers
以下是对 **`SocialInfluenceModel`** 的代码进行函数调用关系逻辑的梳理，以及从输入输出的角度分析其思想：

---

## **1. 函数调用逻辑：主要函数之间的关系**

代码中的主要函数包括：
1. **`forward_rnn(inputs, state, seq_lens)`**：主循环网络前向传播，用于决策动作输出。
   - 依赖于：**`_preprocess`（卷积处理）** 和 **`lstm`（时间序列处理）**。
   - 输出：动作 logits（用于选择动作）、更新的 LSTM 状态。

2. **`value_function()`**：用于计算值函数（Value Function）。
   - 依赖于：`forward_rnn()` 中存储的 `_features`（LSTM 输出特征）。
   - 输出：用于强化学习的状态值（单一标量）。

3. **`compute_intrinsic_reward(inputs, all_action, my_action, alive_time)`**：计算内在奖励（Intrinsic Reward）。
   - 依赖于：
     - **`_preprocess`**：提取观测特征。
     - **`cal_my_action_prob`**：计算智能体自己的动作概率分布。
     - **`compute_cond_prob`**：计算其他智能体的条件概率。
     - KL 散度用于度量自己的动作对其他智能体的影响。
   - 输出：内在奖励（用于强化学习的奖励信号）。
````ad-note
![[Pasted image 20241220102316.png]]
````
4. **`compute_cond_prob(conv_processed, cond_action, i)`**：计算其他智能体 $i$ 的动作的条件概率。
   - 依赖于：**卷积特征（`conv_processed`）** 和 **MOA 模型分支（`moa_action_branch`）**。
   - 输出：智能体 $i$ 动作的概率分布。

5. **`cal_my_action_prob(obs_postprocessed, action_mask, state)`**：计算当前智能体的动作概率分布。
   - 依赖于：LSTM 输出特征和动作掩码。
   - 输出：当前智能体的动作概率分布。

---


## 1_Answers
### **函数分析：`__init__` 和 `get_initial_state`**

---

### **1. `__init__` 构造函数分析**

#### **目的：**
初始化 `SocialInfluenceModel` 的模型参数和组件，包括：
- 观测数据的预处理模块（卷积层）。
- 时间序列处理模块（LSTM）。
- 动作分支和价值分支（全连接层）。
- 多智能体的动作预测模块（MOA 分支）。
- 模型的设备选择（CPU 或 GPU）。

---

#### **具体初始化内容：**

1. **父类初始化：**
   ```python
   nn.Module.__init__(self)
   super().__init__(obs_space, action_space, num_outputs, model_config, name)
   ```
   - 调用 PyTorch 的 `nn.Module` 和 `RecurrentNetwork` 的构造方法，完成基础模块的初始化。

---

2. **配置参数提取：**
   ```python
   self.lstm_state_size = model_config['custom_model_config']['lstm_state_size']
   self.input_channels = model_config['custom_model_config']['input_channels']
   self.world_height = model_config['custom_model_config']['world_height']
   self.world_width = model_config['custom_model_config']['world_width']
   self.player_num = self.input_channels - 2
   self.action_num = action_space.n
   ```
   - **LSTM 隐状态尺寸：** `lstm_state_size` 决定 LSTM 的隐藏层维度。
   - **输入通道数：** `input_channels` 决定观测输入的维度，其中：
     - 输入通道包括智能体自身信息（2个通道）和其他玩家信息（`player_num = input_channels - 2`）。
   - **网格大小：** `world_height` 和 `world_width` 表示环境的网格维度。
   - **动作数量：** `action_num` 表示动作空间的大小。

---

3. **设备选择：**
   ```python
   if torch.cuda.is_available():
       self.device = torch.device("cuda:0")
   else:
       self.device = torch.device("cpu")
   ```
   - 如果 GPU 可用，则使用 GPU 加速，否则使用 CPU。

---

4. **输入预处理模块：**
   ```python
   self._preprocess = nn.Sequential(
       nn.Conv2d(self.input_channels, 16, 3, 1, 1),
       nn.ReLU(),
       nn.Conv2d(16, 32, 3, 1, 1),
       nn.ReLU(),
       nn.Conv2d(32, 32, 3, 1, 1),
       nn.ReLU(),
       nn.Flatten()
   ).to(self.device)
   ```
   - **卷积层：**
     - 输入：`self.input_channels`，表示观测数据的通道数。
     - 输出：经过 3 层卷积，每层后接 ReLU 激活，最终将特征映射到 32 通道。
   - **作用：** 提取环境中网格状观测数据的空间特征，并展平成向量用于后续处理。

---

5. **LSTM 模块：**
   ```python
   self.lstm = nn.LSTM(32 * self.world_height * self.world_width,
                       self.lstm_state_size,
                       batch_first=True).to(self.device)
   ```
   - **输入：** 卷积特征展平后的向量。
   - **输出：** 隐藏状态维度为 `lstm_state_size`，用于编码时间序列信息。

---

6. **动作分支和价值分支：**
   ```python
   self._action_branch = nn.Linear(self.lstm_state_size, self.action_num).to(self.device)
   self._value_branch = nn.Linear(self.lstm_state_size, 1).to(self.device)
   ```
   - **动作分支：** 输出动作 logits，用于生成策略分布。
   - **价值分支：** 输出单一标量值 $V(s)$，用于强化学习中的价值评估。

---

7. **MOA 模块：多智能体条件概率分支**
   ```python
   self.moa_action_branch = []
   for _ in range(self.player_num - 1):
       self.moa_action_branch.append(
           nn.Sequential(
               nn.Linear(32 * self.world_height * self.world_width + 
                         (self.action_num + 1) * self.player_num, 512),
               nn.ReLU(),
               nn.Linear(512, self.action_num)
           ).to(self.device)
       )
   ```
   - **MOA 分支数量：** $self_{player\_num} - 1$，为每个其他智能体构建一个分支。
   - **输入：**
     - 卷积提取的观测特征（全局信息）。
     - 所有玩家的动作（使用 One-Hot 编码表示）。
   - **输出：** 其他智能体的动作概率分布 $p(a^j | a^k, z)$。

---

### **总结：`__init__` 函数思想**
1. 模型包含三大功能模块：
   - **卷积处理模块：** 提取环境观测的空间特征。
   - **时间序列处理模块：** LSTM 处理时间相关性。
   - **动作与价值分支：** 用于动作决策和状态价值评估。
   - **MOA 分支：** 用于预测其他智能体的动作分布（社会影响建模的核心）。

2. 设备无缝支持（CPU/GPU），保证训练的高效性。

---

### **2. `get_initial_state` 函数分析**

#### **作用：**
初始化 LSTM 的隐状态和细胞状态，用于时间序列的处理。

---

#### **代码分析：**
```python
def get_initial_state(self):
    return [self._preprocess[0].weight.new(1, self.lstm_state_size).zero_().squeeze(0),
            self._preprocess[0].weight.new(1, self.lstm_state_size).zero_().squeeze(0)]
```

1. **返回内容：**
   - **隐状态 `h`:** 大小为 `(1, self.lstm_state_size)`，初始值为 0。
   - **细胞状态 `c`:** 同样大小和初始值为 0。

2. **生成方法：**
   - 使用 `_preprocess[0].weight.new()` 确保初始状态与 LSTM 权重张量的设备和数据类型一致（避免类型冲突）。
   - `.zero_()` 将值全部置为 0。

---

## 2_Answers
以下是对这段代码中各函数的分析，重点是它们的输入、输出以及逻辑思想：

---

### **1. `forward_rnn(inputs, state, seq_lens)`**

#### **作用：**
- 实现 RNN（LSTM）的前向传播，用于根据输入观测和当前状态生成动作 logits 和新的 LSTM 状态。
- 结合观测数据预处理、时间序列特征提取和动作掩码处理。

#### **输入：**
- `inputs`：包含观测数据和动作掩码，形状为 $(batch, seq\_len, obs\_dim)$，其中：
  - `inputs[:, :, :self.action_num]` 是动作掩码，表示可用的动作。
  - `inputs[:, :, self.action_num:]` 是观测数据。
- `state`：LSTM 的隐藏状态和细胞状态，包含两个张量，形状为 $(batch, lstm\_state\_size)$。
- `seq_lens`：序列长度，用于支持变长序列的批量处理（未在此函数中使用）。

#### **输出：**
- `action_logits + inf_mask`：动作 logits，添加了动作掩码后，用于策略的动作选择。
- `[torch.squeeze(h, 0), torch.squeeze(c, 0)]`：更新后的 LSTM 隐藏状态和细胞状态。

#### **逻辑：**
1. **提取观测数据：**
   - 从 `inputs` 中提取动作掩码和观测数据：
     ```python
     obs_flatten = inputs[:, :, self.action_num:].float()
     obs = obs_flatten.reshape(obs_flatten.shape[0], obs_flatten.shape[1], self.world_height, self.world_width, self.input_channels)
     obs = obs.permute(0, 1, 4, 2, 3)
     ```
     - 将观测数据从扁平形式转化为图像形式（网格 + 通道）。

2. **卷积预处理：**
   - 对每个时间步的观测数据通过卷积网络提取特征：
     ```python
     for i in range(obs.shape[1]):
         obs_postprocess_set.append(self._preprocess(obs[:, i, ...]))
     self.obs_postprocessed = torch.stack(obs_postprocess_set, dim=1)
     ```
     - 得到每个时间步的卷积特征，并堆叠为时序特征张量。

3. **LSTM 处理时序特征：**
   - 将卷积特征输入 LSTM，提取时间序列信息：
     ```python
     self._features, [h, c] = self.lstm(self.obs_postprocessed, [torch.unsqueeze(state[0], 0), torch.unsqueeze(state[1], 0)])
     ```

4. **动作掩码处理：**
   - 对动作掩码取对数，并使用 $\text{log}(x)$ 的最小值限制无效动作的值为负无穷：
     ```python
     inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
     ```

5. **计算动作 logits：**
   - 使用动作分支生成 logits，并与动作掩码相加：
     ```python
     action_logits = self._action_branch(self._features)
     return action_logits + inf_mask, [torch.squeeze(h, 0), torch.squeeze(c, 0)]
     ```

---

### **2. `value_function()`**

#### **作用：**
根据 LSTM 提取的特征计算状态值 $V(s)$，用于强化学习中的价值估计。

#### **输入：**
无直接输入，但依赖 `forward_rnn()` 中生成的 `_features`。

#### **输出：**
- 状态值，形状为 $(batch,)$，是强化学习中 Critic 的输出。

#### **逻辑：**
1. 检查 `_features` 是否存在：
   ```python
   assert self._features is not None, "must call forward() first"
   ```

2. 使用价值分支计算状态值，并展平为一维张量：
   ```python
   return torch.reshape(self._value_branch(self._features), [-1])
   ```

---

### **3. `conv_process(inputs)`**

#### **作用：**
对输入观测进行卷积预处理，提取网格状特征的空间信息。

#### **输入：**
- `inputs`：包含动作掩码和观测数据，形状为 $(batch, obs\_dim)$。

#### **输出：**
- 观测特征张量，形状为 $(batch, \text{flattened feature dim})$。

#### **逻辑：**
1. 从 `inputs` 中提取观测数据：
   ```python
   obs = inputs[:, self.action_num:].to(self.device).float()
   obs = obs.reshape(inputs.shape[0], self.input_channels, self.world_height, self.world_width)
   ```

2. 通过 `_preprocess` 提取特征：
   ```python
   return self._preprocess(obs)
   ```

---

### **4. `compute_cond_prob(conv_processed, cond_action, i)`**
好的，我已更新规则，现在重新开始对函数 `compute_cond_prob` 的分析。

---

### **函数分析：`compute_cond_prob`**

#### **作用：**
该函数计算条件概率分布 $p(a^j | a^k, z)$，即基于环境观测 $z$ 和当前智能体动作 $a^k$，预测其他智能体 $j$ 的可能动作分布。

---

### **输入参数：**

1. **`conv_processed`**：
   - 卷积特征，从观测数据中提取的特征，表示环境状态 $z$。
   - 形状为 $(batch, \text{feature\_dim})$，其中 $\text{feature\_dim} = 32 \times \text{world\_height} \times \text{world\_width}$。

2. **`cond_action`**：
   - 条件动作信息，表示其他智能体的动作，用整数索引表示。
   - 形状为 $(batch,)$，每个样本对应一个离散动作。

3. **`i`**：
   - 当前 MOA 模型分支的索引，用于为第 $i$ 个智能体计算条件概率。

---

### **输出：**

- 条件概率分布 $p(a^j | a^k, z)$，由 Softmax 归一化后的概率分布表示。
- 输出形状为 $(batch, \text{action\_num})$，每个样本中每个动作的概率。

---

### **函数逻辑：**

#### **1. 动作的 One-Hot 编码**
```python
cond_action = cond_action.to(self.device).to(torch.int64)
cond_action = F.one_hot(cond_action, self.action_num + 1)
cond_action = cond_action.reshape(conv_processed.shape[0], (self.action_num + 1) * self.player_num).float()
```

1. **目的：**
   - 将离散的动作 $a^k$ 转换为 One-Hot 表示，生成独特的向量表示每个动作。

2. **详细过程：**
   - `F.one_hot(cond_action, self.action_num + 1)`：将每个动作编码为长度为 `self.action_num + 1` 的 One-Hot 向量。
   - `.reshape(...)`：将所有动作向量展平为一个大向量，表示所有玩家的动作信息。

3. **结果：**
   - 编码后的动作信息，形状为 $(batch, (\text{action\_num} + 1) \times \text{player\_num})$。

---

#### **2. 拼接输入特征**
```python
x = torch.cat((conv_processed, cond_action), dim=1)
```

1. **目的：**
   - 将环境卷积特征 $z$ 和条件动作 $a^k$ 拼接，作为输入特征。
   - $\text{conv\_processed}$：提供环境的全局信息。
   - $\text{cond\_action}$：提供动作条件，用于建模 $a^k$ 对 $a^j$ 的影响。

---

#### **3. 条件概率建模**
```python
x = self.moa_action_branch[i](x)
```

1. **`self.moa_action_branch[i]` 的作用：**
   - 神经网络分支，用于学习从输入特征到条件概率的映射。
   - 第 $i$ 个分支对应第 $i$ 个智能体的条件动作概率模型。

2. **逻辑：**
   - 神经网络通过训练学习到：
     - 给定环境 $z$ 和当前智能体动作 $a^k$，其他智能体 $j$ 的动作分布 $p(a^j | a^k, z)$。

---

#### **4. Softmax 转换为概率分布**
```python
x = nn.Softmax(dim=-1)(x)
```

1. **Softmax 的作用：**
   - 将网络输出的 logits 转换为概率分布。
   - 输出的每个值表示一个动作的概率，所有值的和为 1。

2. **为什么需要 Softmax？**
   - 条件概率 $p(a^j | a^k, z)$ 是合法的概率分布，需要满足非负性和归一化。

---

### **代码总结**

#### **输入：**
- 卷积特征 $\text{conv\_processed}$，表示环境信息。
- 条件动作 $\text{cond\_action}$，表示当前动作。

#### **输出：**
- 条件概率分布 $p(a^j | a^k, z)$，表示其他智能体的动作分布。

#### **逻辑：**
1. 动作通过 One-Hot 编码，转换为神经网络可处理的形式。
2. 将卷积特征和条件动作拼接，作为输入。
3. 使用 MOA 分支建模 $p(a^j | a^k, z)$，输出 logits。
4. Softmax 转换 logits 为条件概率分布。

---

### **为什么这样计算？**

- **建模智能体间因果关系：**
  $p(a^j | a^k, z)$ 描述了当前智能体动作对其他智能体动作的影响，捕捉智能体间的因果关系。

- **深度学习的优势：**
  使用神经网络建模 $p(a^j | a^k, z)$ 能够自动从复杂环境中提取交互模式。

- **概率输出：**
  Softmax 确保输出满足概率分布的要求，为后续信息论指标（如 KL 散度）提供基础。

---

通过以上逻辑，这段代码有效地实现了条件概率分布的计算，并为多智能体强化学习的因果建模提供支持。
为什么神经网络这边计算的是条件概率[^2] #to_be_solved 
````ad-help
你提到的疑问非常有意义。让我们仔细分析为什么这段代码实现的是条件概率 $p(a^j | a^k, z)$，以及其中条件概率的影子体现在哪些部分。

---

### **条件概率的定义**
条件概率 $p(a^j | a^k, z)$ 的数学定义为：
$$p(a^j | a^k, z) = \frac{p(a^j, a^k, z)}{p(a^k, z)},$$
表示在当前智能体的动作 $a^k$ 和环境状态 $z$ 给定的情况下，其他智能体的动作 $a^j$ 的概率分布。

为了实现这一条件概率，我们需要：
1. 输入 $z$ 表示环境状态。
2. 输入 $a^k$ 表示当前智能体的动作。
3. 一个函数关系来映射这些输入到 $a^j$ 的分布。

这段代码通过神经网络 **近似建模** 了条件概率分布 $p(a^j | a^k, z)$，并且条件概率的体现主要体现在输入特征的构造和网络的训练过程。

---

### **代码中的条件概率体现**

#### **1. 特征的条件性：**
条件概率的关键在于**条件的体现**，即模型的输入特征需要包含足够的信息来描述条件 $a^k$ 和 $z$。

##### **代码中的条件体现：**
```python
x = torch.cat((conv_processed, cond_action), dim=1)
```
- **`conv_processed`：** 提供了环境状态 $z$ 的全局信息。
- **`cond_action`：** 提供了当前智能体动作 $a^k$ 的信息，确保网络知道条件的动作是什么。

这种特征拼接意味着，网络在生成输出时，已经基于输入的 $z$ 和 $a^k$ 来推断 $a^j$ 的分布。

---

#### **2. 神经网络输出是条件概率的参数化近似：**
神经网络的核心作用是对条件概率分布 $p(a^j | a^k, z)$ 进行参数化建模。具体体现在：
```python
x = self.moa_action_branch[i](x)
x = nn.Softmax(dim=-1)(x)
```

- **`moa_action_branch[i]`**：
  - 是一个可学习的神经网络，用于建模从输入特征 $[z, a^k]$ 到输出 $p(a^j | a^k, z)$ 的映射关系。
  - 通过训练，网络学习到了不同的 $z$ 和 $a^k$ 对 $a^j$ 的影响。

- **`Softmax`**：
  - 确保输出是合法的概率分布，满足条件概率的性质（非负性和归一化）。

---

#### **3. 神经网络训练过程中的条件性：**
网络能够学习到条件概率分布的关键在于**训练过程**。在训练时：
1. **输入：**
   - 将环境状态 $z$ 和当前智能体动作 $a^k$ 输入到网络。
2. **目标：**
   - 网络输出的分布 $p(a^j | a^k, z)$ 被约束为接近真实的分布（通过交叉熵或 KL 散度等损失函数）。
3. **结果：**
   - 通过优化，网络的权重调整到能够精确拟合条件概率分布。

---

#### **4. 条件概率的近似而非显式计算：**
代码中并未直接计算条件概率的公式（如 $\frac{p(a^j, a^k, z)}{p(a^k, z)}$），而是通过以下方式实现了其近似：
- 利用神经网络从特征 $[z, a^k]$ 映射到分布 $p(a^j | a^k, z)$。
- 输入中的 $a^k$ 和 $z$ 被显式纳入，保证了输出的条件性。

---

### **为什么看不出条件概率的影子？**

如果你觉得这段代码难以直观地看出条件概率，可能有以下原因：
1. **显式公式 vs 学习方法：**
   - 条件概率的数学定义是一个显式的公式计算，而这段代码使用的是深度学习方法，通过神经网络直接近似条件概率分布，并未显式计算分母和分子。

2. **条件性依赖在输入中隐式体现：**
   - 条件 $a^k$ 和 $z$ 的依赖关系通过输入特征的拼接隐式地体现出来，用户可能需要结合训练过程来理解其条件概率的性质。

---

### **总结：为什么这段代码是条件概率？**

1. **输入特征的条件性：**
   - 输入特征中显式包含条件 $a^k$ 和环境状态 $z$。

2. **输出是合法的概率分布：**
   - 通过神经网络映射特征到概率分布，并使用 Softmax 确保输出满足条件概率的性质。

3. **训练过程约束条件概率：**
   - 训练中，网络的输出被优化为符合真实分布的条件概率。

虽然代码中没有显式计算条件概率公式，但通过神经网络和输入特征构造，这段代码实现了对条件概率 $p(a^j | a^k, z)$ 的有效建模。
````


## 3_Answers
### **函数分析：`compute_intrinsic_reward`**

#### **作用：**
该函数计算智能体的内在奖励（Intrinsic Reward），用来衡量当前智能体的动作对其他智能体的动作选择的因果影响。这是一个基于多智能体因果关系的奖励设计，主要通过KL散度（Kullback-Leibler Divergence）实现。

---

### **输入参数：**
1. **`inputs`**:
   - 包括动作掩码和观测数据：
     - `inputs[:, :self.action_num]` 是动作掩码（表示当前可执行的动作）。
     - `inputs[:, self.action_num:]` 是观测数据（环境信息）。
   - 形状：$(batch, obs_dim)$。

2. **`all_action`**:
   - 所有智能体的动作，形状为 $(batch, player_num)$。

3. **`my_action`**:
   - 当前智能体的动作列表，形状为 $(batch,)$。

4. **`alive_time`**:
   - 生存时间（未在函数中使用）。

---

### **输出：**
- **`intrinsic_reward`**:
  - 内在奖励，形状为 $(batch,)$。
  - 每个样本的奖励值表示智能体当前动作对其他智能体动作选择的因果影响。

---

### **逻辑分析：**

#### **1. 观测预处理和初始化**
- 提取观测数据和动作掩码，并将数据转为适合模型的张量形式：
  ```python
  obs = torch.tensor(inputs[:, self.action_num:], device=self.device).float()
  obs = obs.reshape(inputs.shape[0], self.input_channels, self.world_height, self.world_width)
  action_mask = torch.tensor(inputs[:, :self.action_num], device=self.device).float()
  ```

- 对观测数据进行卷积预处理：
  ```python
  obs_preprocess = self._preprocess(obs)
  ```

- 初始化 LSTM 的状态，并计算当前智能体的动作概率分布：
  ```python
  state_batch = self.get_initial_state()
  for i in range(2):
      state_batch[i] = state_batch[i].unsqueeze(0)
  my_action_prob, _ = self.cal_my_action_prob(obs_preprocess.unsqueeze(0), action_mask.unsqueeze(0), state_batch)
  my_action_prob = my_action_prob.squeeze(0)
  ```

---

#### **2. 条件概率计算**
- 遍历每个可能的动作（假设当前智能体采取不同的动作），计算其他智能体的条件概率分布：
  ```python
  cond_prob_list = [[] for _ in range(self.player_num - 1)]
  for i in range(self.action_num):
      all_action_one_hot = all_action.to(dtype=torch.int64)
      all_action_one_hot[:, -1] = i
      all_action_one_hot = F.one_hot(all_action_one_hot, self.action_num + 1).reshape(
          obs.shape[0], (self.action_num + 1) * self.player_num
      ).float()
      x = torch.cat((obs_preprocess, all_action_one_hot), dim=1)
      for j in range(self.player_num - 1):
          y = self.moa_action_branch[j](x)
          y = nn.Softmax(dim=-1)(y)
          cond_prob_list[j].append(y)
  ```

- **逻辑：**
  - 通过 One-Hot 编码模拟智能体可能的动作（每次改变最后一个动作）。
  - 拼接观测特征和动作信息，输入到 MOA 模型分支，生成其他智能体的动作条件概率。

---

#### **3. 边缘概率计算**
- 根据条件概率分布和当前智能体的动作概率，计算其他智能体的边缘概率：
  ```python
  marginal_prob_list = []
  for j in range(self.player_num - 1):
      marginal_prob = torch.zeros(obs_preprocess.shape[0], self.action_num)
      for i in range(self.action_num):
          marginal_prob += (cond_prob_list[j][i] * (my_action_prob[:, i].unsqueeze(1)))
      marginal_prob_list.append(marginal_prob)
  ```

- **逻辑：**
  - 使用公式 $p(a^j | z) = \sum_{a^k} p(a^j | a^k, z) p(a^k | z)$。
  - 对智能体的每个动作可能性 $p(a^k | z)$ 加权条件概率 $p(a^j | a^k, z)$。

---

#### **4. 真实条件概率提取**
- 根据实际执行的动作，提取对应的条件概率：
  ```python
  true_conditional_prob_list = []
  for j in range(self.player_num - 1):
      true_conditional_prob = torch.zeros(obs_preprocess.shape[0], self.action_num)
      for id, ac in enumerate(my_action):
          true_conditional_prob[id] = cond_prob_list[j][ac][id]
      true_conditional_prob_list.append(true_conditional_prob)
  ```

- **逻辑：**
  - 遍历批次中每个样本的真实动作。
  - 提取对应的条件概率 $p(a^j | a^k, z)$。

---

#### **5. 内在奖励计算**
- 对每个其他智能体，计算边缘概率与真实条件概率的 KL 散度，并累加为内在奖励：
  ```python
  intrinsic_reward = torch.zeros(obs_preprocess.shape[0])
  for j in range(self.player_num - 1):
      intrinsic_reward += torch.mean(
          F.kl_div(torch.log(marginal_prob_list[j] + 1e-30), true_conditional_prob_list[j], reduction='none'),
          dim=1,
      )
  ```

- **逻辑：**
  - 使用 KL 散度公式：
    $$D_{KL}(P \| Q) = \sum_x P(x) \log \frac{P(x)}{Q(x)}.$$
  - 衡量边缘概率 $p(a^j | z)$ 和真实条件概率 $p(a^j | a^k, z)$ 之间的偏差。
  - 累加每个智能体的 KL 散度，得到总内在奖励。

---

## 4_Answers

### **函数分析：`cal_my_action_prob`**

#### **作用：**
该函数计算当前智能体的动作概率分布 $p(a^k | z)$，同时更新 LSTM 的隐藏状态和细胞状态。它结合观测特征和动作掩码，为强化学习中的策略生成动作概率。

---

### **输入参数：**
1. **`obs_postprocessed`**:
   - 观测数据经过卷积和预处理后的特征，形状为 $(batch, seq_len, feature_dim)$。
   - 表示智能体在时间序列上的观测特征。

2. **`action_mask`**:
   - 动作掩码，形状为 $(batch, seq_len, action_num)$。
   - 表示每个时间步上哪些动作是有效的（1表示有效，0表示无效）。

3. **`state`**:
   - LSTM 的初始隐藏状态和细胞状态，形状为 $(batch, lstm_state_size)$。

---

### **输出：**
1. **`prob`**:
   - 当前智能体的动作概率分布，形状为 $(batch, seq_len, action_num)$。
   - 每个时间步的动作概率分布经过 Softmax 归一化。

2. **`[torch.squeeze(h, 0), torch.squeeze(c, 0)]`**:
   - 更新后的 LSTM 隐藏状态和细胞状态，形状为 $(batch, lstm_state_size)$。

---

### **逻辑分析：**

#### **1. 时间序列处理**
```python
self._features, [h, c] = self.lstm(obs_postprocessed, [torch.unsqueeze(state[0], 0), torch.unsqueeze(state[1], 0)])
```
- **输入：**
  - `obs_postprocessed` 是观测特征序列，形状为 $(batch, seq_len, feature_dim)$。
  - 初始隐藏状态 `state[0]` 和细胞状态 `state[1]`。
- **输出：**
  - `_features` 是 LSTM 对输入序列的特征编码，形状为 $(batch, seq_len, lstm_state_size)$。
  - `[h, c]` 是更新后的隐藏状态和细胞状态。

LSTM 的作用是结合时间序列的观测特征，提取每个时间步上的隐藏状态特征。

---

#### **2. 动作掩码处理**
```python
inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
```
- **作用：**
  - 对动作掩码取对数，限制无效动作的概率为负无穷（$-\infty$）。
  - 通过 `torch.clamp` 防止数值计算的溢出，保证数值范围在 $[FLOAT_MIN, FLOAT_MAX]$ 之间。
- **结果：**
  - `inf_mask` 是调整后的动作掩码，形状为 $(batch, seq_len, action_num)$。

该掩码用于避免选择无效动作。

---

#### **3. 动作 logits 计算**
```python
action_logits = self._action_branch(self._features) + inf_mask
```
- **`self._action_branch`:**
  - 是一个全连接层，输入 LSTM 输出特征 `_features`，输出动作 logits，形状为 $(batch, seq_len, action_num)$。
- **逻辑：**
  - 对动作 logits 添加动作掩码 `inf_mask`，确保无效动作的 logits 值为负无穷，从而在 Softmax 后的概率为 0。

---

#### **4. 动作概率分布计算**
```python
prob = nn.Softmax(dim=-1)(action_logits)
```
- **作用：**
  - 对动作 logits 进行 Softmax 归一化，生成动作概率分布。
- **结果：**
  - `prob` 是每个时间步的动作概率分布，形状为 $(batch, seq_len, action_num)$。

---

#### **5. 返回值**
```python
return prob, [torch.squeeze(h, 0), torch.squeeze(c, 0)]
```
- **动作概率分布 `prob`:**
  - 用于后续策略优化（Policy Gradient 或 Actor-Critic 算法中的策略网络）。
- **更新的 LSTM 状态 `[h, c]`:**
  - 用于时间序列建模的下一步输入，保持时间相关性。

---


# FootNotes

[^1]: [[one-hot]]
[^2]: 神经网络来计算条件概率？to_be_solved