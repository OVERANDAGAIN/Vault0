---
创建时间: 2024-十二月-17日  星期二, 10:14:56 上午
修改时间: 2024-十二月-17日  星期二, 11:03:38 上午
---
[[HOP_Overall]]



# Codes/Questions

```python

```


# Answers

## Overall_Answers
### **逐行代码分析**

#### **导入库**
```python
from ray.rllib.models.torch.recurrent_net import RecurrentNetwork
from ray.rllib.utils.torch_ops import FLOAT_MAX, FLOAT_MIN
import torch
from torch import nn
import torch.nn.functional as F
```
- **功能**：导入必要的 PyTorch 和 RLlib 库。
- **关键点**：
   - `RecurrentNetwork`：用于实现支持循环神经网络（RNN）的 RLlib 模型。
   - `FLOAT_MAX` 和 `FLOAT_MIN`：用于数值稳定性，限制浮点数范围。

---

#### **类定义与初始化**
```python
class SocialInfluenceModel(RecurrentNetwork, nn.Module):
    def __init__(self, obs_space, action_space, num_outputs, model_config, name):
        nn.Module.__init__(self)
        super().__init__(obs_space, action_space, num_outputs, model_config, name)
```
- **功能**：定义 `SocialInfluenceModel` 类，继承自 `RecurrentNetwork` 和 `nn.Module`。
- **用途**：该模型用于强化学习中的 **社会影响建模** 和 **内在奖励计算**。

---

#### **模型参数初始化**
```python
self.lstm_state_size = model_config['custom_model_config']['lstm_state_size']
self.input_channels = model_config['custom_model_config']['input_channels']
self.world_height = model_config['custom_model_config']['world_height']
self.world_width = model_config['custom_model_config']['world_width']
self.player_num = self.input_channels - 2
self.action_num = action_space.n
```
- **说明**：
   - 从配置文件中读取 **LSTM 隐状态大小**、**输入通道数**、**网格尺寸** 和 **动作空间大小**。
   - `self.player_num = self.input_channels - 2`：假设输入通道中有两个特殊通道（如障碍物或目标），剩下的是玩家通道。

```python
if torch.cuda.is_available():
    self.device = torch.device("cuda:0")
else:
    self.device = torch.device("cpu")
```
- **功能**：设置模型计算设备（GPU 或 CPU）。

---

#### **共享网络（卷积层）**
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
- **功能**：对输入状态进行卷积处理，用于特征提取。
- **结构**：
   - 三层卷积层，每层输出通道分别为 16 和 32。
   - **ReLU 激活函数**：引入非线性。
   - `Flatten`：将卷积输出压平成一维向量。

---

#### **LSTM 模块**
```python
self.lstm = nn.LSTM(32 * self.world_height * self.world_width,
                    self.lstm_state_size,
                    batch_first=True).to(self.device)
```
- **功能**：使用 LSTM 处理时间序列数据。
- **输入**：
   - 卷积特征的维度 `32 * self.world_height * self.world_width`。
   - 输出隐藏状态大小为 `self.lstm_state_size`。

---

#### **动作分支与价值分支**
```python
self._action_branch = nn.Linear(self.lstm_state_size, self.action_num).to(self.device)
self._value_branch = nn.Linear(self.lstm_state_size, 1).to(self.device)
```
- **功能**：
   - `self._action_branch`：从 LSTM 隐状态预测动作 logits。
   - `self._value_branch`：从 LSTM 隐状态预测状态价值。

---

#### **MOA（Model of Others）分支**
```python
self.moa_action_branch = []
for _ in range(self.player_num - 1):
    self.moa_action_branch.append(
        nn.Sequential(
            nn.Linear(32 * self.world_height * self.world_width + (self.action_num + 1) * self.player_num, 512),
            nn.ReLU(),
            nn.Linear(512, self.action_num)
        ).to(self.device)
    )
```
- **功能**：<span style="background:#d2cbff">为每个其他智能体单独建模</span>，预测其动作分布。
- **结构**：
   - 输入：卷积特征和其他智能体动作的 one-hot 编码。[^1]
   - 输出：其他智能体的动作概率分布。

---

#### **`forward_rnn` 方法**
```python
obs_flatten = inputs[:, :, self.action_num:].float()
obs = obs_flatten.reshape(obs_flatten.shape[0], obs_flatten.shape[1], self.world_height, self.world_width, self.input_channels)
obs = obs.permute(0, 1, 4, 2, 3)
```
- **功能**：重塑输入，将观测转换为 `[batch, seq_len, channels, height, width]` 格式。

```python
self._features, [h, c] = self.lstm(self.obs_postprocessed, [torch.unsqueeze(state[0], 0), torch.unsqueeze(state[1], 0)])
```
- **功能**：将卷积提取的特征输入 LSTM，输出隐藏状态和记忆状态。

```python
action_mask = inputs[:, :, :self.action_num].float()
inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
action_logits = self._action_branch(self._features)
return action_logits + inf_mask, [torch.squeeze(h, 0), torch.squeeze(c, 0)]
```
- **功能**：通过 `action_mask` 过滤非法动作，并输出合法动作的 logits。

---

#### **`compute_intrinsic_reward` 方法**
- **功能**：计算内在奖励，基于 KL 散度评估自身行为对其他智能体行为的影响。
- **过程**：
   1. 计算 **边际概率**：基于自身可能的所有动作，预测其他智能体的动作概率。
   2. 计算 **真实条件概率**：基于真实动作，计算其他智能体的动作概率。
   3. 使用 KL 散度衡量两者差异，作为内在奖励。

---

#### **`compute_cond_prob` 方法**
- **功能**：基于当前观测和条件动作，预测其他智能体的动作概率分布。

---

#### **总结**

1. **功能定位**：
   - `SocialInfluenceModel` 通过 LSTM 和共享卷积网络提取时空特征。
   - 使用 MOA 分支建模其他智能体的动作分布，评估社会影响力。

2. **核心特性**：
   - **动作与价值预测**：为自身强化学习提供基础。
   - **MOA 建模**：通过 KL 散度计算内在奖励，激励智能体影响其他智能体。

3. **应用场景**：
   - 适用于多智能体强化学习（MARL）中存在社会影响因素的任务。

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes

[^1]: [[one-hot]]