[[HOP_Overall]]



# Codes/Questions

```python

```


# Answers

## Overall_Answers
### **代码功能概述**

`SocialInfluenceModel` 是一个强化学习模型，包含以下核心功能：
1. **RNN 网络**：
   - 使用 LSTM 模型处理观测数据的时间序列，捕获智能体的历史状态信息。
2. **动作预测**：
   - 提供基于当前状态的动作概率分布。
3. **MOA（Model of Others）分支**：
   - 针对其他智能体行为建模，预测它们的条件概率分布。
4. **内在奖励计算**：
   - 通过 KL 散度度量智能体对其他智能体行为的影响力，生成内在奖励。

---

### **逐行代码分析**

#### **初始化函数**

```python
class SocialInfluenceModel(RecurrentNetwork, nn.Module):
    def __init__(self, obs_space, action_space, num_outputs, model_config, name):
        nn.Module.__init__(self)
        super().__init__(obs_space, action_space, num_outputs, model_config, name)
```
- **父类继承**：同时继承了 `RecurrentNetwork` 和 `nn.Module`，支持 RNN 网络的时间序列建模。

```python
self.lstm_state_size = model_config['custom_model_config']['lstm_state_size']
self.input_channels = model_config['custom_model_config']['input_channels']
self.world_height = model_config['custom_model_config']['world_height']
self.world_width = model_config['custom_model_config']['world_width']
self.player_num = self.input_channels - 2
self.action_num = action_space.n
```
- 从 `model_config` 提取关键参数：
   - `lstm_state_size`：LSTM 隐状态的大小。
   - `input_channels`：输入特征通道数。
   - `world_height` 和 `world_width`：输入网格的尺寸。
   - `player_num`：玩家数量（通过 `input_channels - 2` 推断）。
   - `action_num`：可执行的动作数。

---

#### **网络结构**

1. **共享卷积层** (`_preprocess`)：
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
   - 输入：二维网格状态。
   - 输出：经过特征提取的平坦向量。

2. **LSTM 层**：
   ```python
   self.lstm = nn.LSTM(32 * self.world_height * self.world_width,
                       self.lstm_state_size,
                       batch_first=True).to(self.device)
   ```
   - 输入：卷积特征序列。
   - 输出：LSTM 隐状态和记忆状态，用于时间序列建模。

3. **动作和价值分支**：
   - **动作分支**：输出动作 logits。
     ```python
     self._action_branch = nn.Linear(self.lstm_state_size, self.action_num).to(self.device)
     ```
   - **价值分支**：输出状态价值。
     ```python
     self._value_branch = nn.Linear(self.lstm_state_size, 1).to(self.device)
     ```

4. **MOA 分支**：为每个其他玩家单独建模。
   ```python
   self.moa_action_branch = []
   for _ in range(self.player_num - 1):
       self.moa_action_branch.append(
           nn.Sequential(
               nn.Linear(32 * self.world_height * self.world_width + (self.action_num+1) * self.player_num, 512),
               nn.ReLU(),
               nn.Linear(512, self.action_num)
           ).to(self.device)
       )
   ```
   - 这些网络专门用于预测其他智能体在给定条件下的动作分布。

---

#### **`forward_rnn` 函数**

```python
def forward_rnn(self, inputs, state, seq_lens):
    obs_flatten = inputs[:, :, self.action_num:].float()
    obs = obs_flatten.reshape(obs_flatten.shape[0], obs_flatten.shape[1], self.world_height, self.world_width, self.input_channels)
    obs = obs.permute(0, 1, 4, 2, 3)
```
- **输入**：
   - `inputs`：包含观测和动作掩码的数据。
- **步骤**：
   1. 将输入重塑为 `[batch, seq_len, channels, height, width]` 格式。
   2. 使用 `_preprocess` 卷积层提取特征。

```python
self._features, [h, c] = self.lstm(self.obs_postprocessed, [torch.unsqueeze(state[0], 0), torch.unsqueeze(state[1], 0)])
```
- **LSTM 前向传播**：
   - 输入卷积后的特征序列和初始状态，输出隐藏状态 `_features`。

```python
action_mask = inputs[:, :, :self.action_num].float()
inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
action_logits = self._action_branch(self._features)
return action_logits + inf_mask, [torch.squeeze(h, 0), torch.squeeze(c, 0)]
```
- **动作输出**：
   - 输出 logits，并通过 `inf_mask` 遮蔽非法动作（掩码将非法动作概率置为极小值）。

---

#### **`compute_intrinsic_reward` 函数**

- 计算内在奖励，通过 KL 散度度量智能体对其他玩家行为的影响。

**过程**：
1. **边际概率计算**：
   - 假设自身采取所有可能动作，预测其他智能体的动作概率。

2. **真实条件概率计算**：
   - 在实际动作条件下，计算其他玩家的动作概率分布。

3. **KL 散度计算**：
   ```python
   intrinsic_reward += torch.mean(F.kl_div(
       torch.log(marginal_prob_list[j] + 1e-30),
       true_conditional_prob_list[j],
       reduction='none'
   ), dim=1)
   ```
   - 使用 KL 散度衡量两者的差异。

---

### **总结**

1. **`SocialInfluenceModel` 的主要功能**：
   - 使用 LSTM 处理时间序列观测。
   - 通过共享网络和 MOA 分支，预测自身和其他智能体的动作分布。
   - 计算内在奖励，鼓励智能体通过自身行为影响其他智能体。

2. **特点**：
   - **MOA 分支**：每个智能体都有独立的网络预测其行为。
   - **KL 散度奖励**：评估智能体的社会影响力，推动其做出具有影响力的决策。

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
