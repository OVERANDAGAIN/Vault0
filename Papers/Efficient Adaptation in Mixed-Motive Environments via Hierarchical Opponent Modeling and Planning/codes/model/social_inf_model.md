---
创建时间: 2024-十二月-17日  星期二, 10:14:56 上午
修改时间: 2024-十二月-17日  星期二, 11:14:18 上午
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

#### `compute_cond_prob` 方法

##### **函数定义**
```python
def compute_cond_prob(self, conv_processed, cond_action, i):
```
- **功能**：计算给定条件动作（`cond_action`）和预处理后的观测数据（`conv_processed`），当前智能体 `i` 预测其他智能体动作的概率分布。
- **参数**：
   - `conv_processed`：预处理后的观测数据，通过卷积网络 `_preprocess` 得到。
   - `cond_action`：条件动作，是一个离散值向量。
   - `i`：智能体索引，用于选择对应的 `moa_action_branch`。

---

##### **逐行分析**
```python
cond_action = cond_action.to(self.device).to(torch.int64)
cond_action = F.one_hot(cond_action, self.action_num + 1)
cond_action = cond_action.reshape(conv_processed.shape[0], (self.action_num + 1) * self.player_num).float()
```
- **功能**：
   - 将 `cond_action` 转移到计算设备（GPU/CPU）。
   - **one-hot 编码**：将离散动作编码为 one-hot 向量。
      - `self.action_num + 1`：动作数 + 1，表示可能的空闲或未选择状态。
   - 将 one-hot 向量 reshape 成形状 `[batch_size, (action_num+1)*player_num]`。
     - 每个 batch 包含当前所有玩家的动作信息。

```python
x = torch.cat((conv_processed, cond_action), dim=1)
x = self.moa_action_branch[i](x)
x = nn.Softmax(dim=-1)(x)
```
- **功能**：
   - 将卷积提取的特征 `conv_processed` 与条件动作 `cond_action` 拼接在一起。
   - 输入到 MOA 分支网络 `self.moa_action_branch[i]`。
      - 每个智能体对应一个独立的 MOA 网络分支。
   - 通过 `Softmax` 计算动作的概率分布。

```python
return x
```
- **返回**：给定条件动作下，智能体 `i` 的预测动作概率分布。

---

####  `compute_intrinsic_reward` 方法

##### **函数定义**
```python
def compute_intrinsic_reward(self, inputs, all_action, my_action, alive_time):
```
- **功能**：计算智能体的内在奖励。
   - 通过 **KL 散度** 衡量当前智能体的行为如何影响其他智能体的行为。
   - 激励智能体采取能影响他人决策的动作。
- **参数**：
   - `inputs`：输入数据，包含观测和动作掩码。
   - `all_action`：所有智能体的动作。
   - `my_action`：当前智能体的动作。
   - `alive_time`：存活时间（未在当前代码中使用）。

---

##### **逐行分析**

**1. 输入观测与动作掩码预处理**
```python
obs = torch.tensor(inputs[:, self.action_num:], device=self.device).float()
action_mask = torch.tensor(inputs[:, :self.action_num], device=self.device).float()
obs = obs.reshape(inputs.shape[0], self.input_channels, self.world_height, self.world_width)
all_action = torch.tensor(all_action).to(self.device)
```
- **功能**：
   - 将输入 `inputs` 分解为观测（`obs`）和动作掩码（`action_mask`）。
   - **reshape**：将观测数据转换为 `[batch_size, channels, height, width]`。
   - 将所有智能体的动作转换为张量。

**2. 卷积特征提取**
```python
obs_preprocess = self._preprocess(obs)
obs_preprocess_time = obs_preprocess.unsqueeze(0)
action_mask_time = action_mask.unsqueeze(0)
```
- **功能**：
   - 使用 `_preprocess` 卷积网络提取观测特征。
   - 为时间维度扩展特征 `obs_preprocess` 和动作掩码 `action_mask`。

**3. 计算自身动作概率**
```python
state_batch = self.get_initial_state()
for i in range(2):
    state_batch[i] = state_batch[i].unsqueeze(0)
my_action_prob, _ = self.cal_my_action_prob(obs_preprocess_time, action_mask_time, state_batch)
my_action_prob = my_action_prob.squeeze(0)
```
- **功能**：
   - 初始化 LSTM 隐状态。
   - 使用 `cal_my_action_prob` 方法计算当前智能体在观测数据下的动作概率分布。

---

**4. 计算条件概率列表**
```python
cond_prob_list = [[] for _ in range(self.player_num - 1)]

for i in range(self.action_num):
    all_action_one_hot = all_action.to(dtype=torch.int64)
    all_action_one_hot[:, -1] = i
    all_action_one_hot = F.one_hot(all_action_one_hot, self.action_num + 1)
    all_action_one_hot = all_action_one_hot.reshape(obs.shape[0], (self.action_num + 1) * self.player_num).float()
    x = torch.cat((obs_preprocess, all_action_one_hot), dim=1).float()
```
- **功能**：
   - 遍历所有可能的动作 `i`，将 `all_action` 的最后一列替换为 `i`。
   - 将 `all_action` 转换为 one-hot 编码并 reshape。
   - 将 `obs_preprocess` 和 one-hot 动作拼接作为 MOA 输入。

```python
    for j in range(self.player_num - 1):
        y = self.moa_action_branch[j](x)
        y = nn.Softmax(dim=-1)(y)
        cond_prob_list[j].append(y)
```
- **功能**：
   - 遍历其他智能体，为每个智能体的 MOA 分支计算给定条件动作下的动作概率分布。

---

**5. 计算边际概率与真实条件概率**
```python
marginal_prob_list = []
for j in range(self.player_num - 1):
    marginal_prob = torch.zeros(obs_preprocess.shape[0], self.action_num)
    for i in range(self.action_num):
        marginal_prob += (cond_prob_list[j][i] * (my_action_prob[:, i].unsqueeze(1)))
    marginal_prob_list.append(marginal_prob)
```
- **功能**：
   - 计算边际概率：对所有可能动作的概率分布加权平均，得到每个智能体的边际动作概率。

```python
true_conditional_prob_list = []
for j in range(self.player_num - 1):
    true_conditional_prob = torch.zeros(obs_preprocess.shape[0], self.action_num)
    for id, ac in enumerate(my_action):
        true_conditional_prob[id] = cond_prob_list[j][ac][id]
    true_conditional_prob_list.append(true_conditional_prob)
```
- **功能**：
   - 计算真实条件概率：基于真实动作 `my_action` 提取其他智能体的动作概率分布。

---

**6. 计算内在奖励**
```python
intrinsic_reward = torch.zeros(obs_preprocess.shape[0])
for j in range(self.player_num - 1):
    intrinsic_reward += torch.mean(F.kl_div(
        torch.log(marginal_prob_list[j] + 1e-30),
        true_conditional_prob_list[j],
        reduction='none'
    ), dim=1)
```
- **功能**：
   - 计算边际概率与真实条件概率之间的 KL 散度。
   - 将 KL 散度作为内在奖励。

```python
return intrinsic_reward.numpy()
```
- **返回**：内在奖励的 numpy 数组。

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