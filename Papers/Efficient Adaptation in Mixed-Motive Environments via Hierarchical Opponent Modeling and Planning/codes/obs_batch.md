---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-3日  星期一, 10:23:13 上午
---
[[HOP_Overall]]



# Codes/Questions

- [?] 


LOLA_policy: 

```python
我想查看inout_dict；obs_batch里面的内容    @override(Policy)
    def compute_actions_from_input_dict(
        self, input_dict, explore=None, timestep=None, episodes=None, state_batches=None, **kwargs
    ):
        #self.Q_temp=min(1+(7-1)*1e-6*timestep,7)
        with torch.no_grad():
            action_batch=[]
            new_state_batch=[]
            obs_batch=input_dict['obs']
            for n in range(len(obs_batch)):
                obs_flatten=obs_batch[n]
                time=episodes[n].length
                if state_batches == None:
                    if time==0:
                        state=self.get_initial_state()
                    else:
                        state=episodes[n].user_data[f'recurrent_state{self.my_id}'][-1]
                else:
                    state=np.array(state_batches)[:,n] 
                obs=obs_flatten[7:].reshape((self.world_height,self.world_width,self.player_num+3))
            
```

```bash
(RolloutWorker pid=576435) obs_batch: [[1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]]
(RolloutWorker pid=576435) obs_batch shape: (1, 87)
(RolloutWorker pid=576435) obs_batch first sample: [1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
```

```python
   def flatten_state_forward(self,state_flatten):
        x=state_flatten[:,7:].reshape(state_flatten.shape[0], self.world_height, self.world_width, self.input_channels)
        x=x.to(self.device).permute(0,3,1,2).float()
        action_mask=state_flatten[:,:7].to(self.device).float()
        x = self.shared_layer(x)
        inf_mask=torch.clamp(torch.log(action_mask),FLOAT_MIN,FLOAT_MAX)
        action_prob = F.softmax(self._action_branch(x)+inf_mask, dim=1)
        return action_prob.cpu()
```
# Answers

## Overall_Answers

首先，来看一下 `obs_batch` 输出的内容和形状：

### **`obs_batch` 数据解析**
```plaintext
obs_batch: [[1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 
             1. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0. 
             2. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
obs_batch shape: (1, 87)
obs_batch first sample: [1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 
                          1. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0.
                          2. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.]
```
- `obs_batch` 是一个形状为 `(1, 87)` 的数组，表示有 **1个样本**，且每个样本有 **87个特征**。

从地图 `4x4` 和 **玩家数为 2** 的描述来看，**87个特征**符合以下推理：
- **`4x4` 的地图**：表示地图有 16 个格子，每个格子的状态是一个特征。4x4 的地图会有 16 个格子，可能每个格子有多个通道（如每个玩家的状态、目标的状态等）。假设每个格子有 5 个特征，则 `4 * 4 * 5 = 80` 特征。
- **7个动作特征**：代表 **7个可能的动作**，这通常是一个动作掩码，用来指定某个时刻某个动作是否可用。

### **`flatten_state_forward` 方法分析**

```python
def flatten_state_forward(self, state_flatten):
    # Step 1: reshape state_flatten to match the expected input dimensions for the neural network
    x = state_flatten[:, 7:].reshape(state_flatten.shape[0], self.world_height, self.world_width, self.input_channels)
    # Step 2: move tensor to the device (GPU or CPU) and change its format for convolution layers
    x = x.to(self.device).permute(0, 3, 1, 2).float()
    # Step 3: Get the action mask (first 7 values)
    action_mask = state_flatten[:, :7].to(self.device).float()
    # Step 4: Pass the reshaped input through a shared neural network layer
    x = self.shared_layer(x)
    # Step 5: Apply log on the action_mask and clamp the values to avoid infinity
    inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)
    # Step 6: Compute the action probabilities using the softmax function
    action_prob = F.softmax(self._action_branch(x) + inf_mask, dim=1)
    # Step 7: Return the computed action probabilities on the CPU
    return action_prob.cpu()
```

### **详细解释**

1. **第1步：重塑状态**  
   `state_flatten[:, 7:]` 表示从 `state_flatten` 中提取 **从第 8 个特征开始**的所有数据（即排除前 7 个动作特征）。这些数据将用于计算状态。
   - `state_flatten[:, 7:]` 产生的结果是一个包含 **80 个地图特征**和 **其他状态特征**的数据。接着，使用 `.reshape(state_flatten.shape[0], self.world_height, self.world_width, self.input_channels)` 将数据 **重塑**为 `(batch_size, height, width, input_channels)` 的形状。假设每个格子有多个特征（比如玩家状态、目标位置等），然后将其转换成一个 4D 张量。 
     - 例如：`self.world_height=4, self.world_width=4, self.input_channels=5`，则每个格子包含 **5个特征**（假设是玩家和环境的状态）。

2. **第2步：设备转换与数据格式转换**  
   `x.to(self.device).permute(0, 3, 1, 2).float()`：这一步将张量 `x` 转换为目标设备（CPU 或 GPU），然后通过 `permute` 交换维度顺序，以便符合卷积神经网络（CNN）的输入格式。卷积神经网络期望的输入是 `(batch_size, channels, height, width)` 的形状，因此需要将原来的 `(batch_size, height, width, channels)` 转换成 `(batch_size, channels, height, width)`。

3. **第3步：提取动作掩码**  
   `action_mask = state_flatten[:, :7].to(self.device).float()`：从 `state_flatten` 中提取前 7 个特征，这代表 **动作掩码**，用于指示哪些动作是有效的。将其转换为张量，并移至目标设备。

4. **第4步：共享层处理**  
   `x = self.shared_layer(x)`：将重新排列过的数据传入一个共享的神经网络层（`shared_layer`），这个层可能是一个卷积层或其他特征提取层，负责提取地图特征及其他状态信息。

5. **第5步：计算动作掩码的对数并避免溢出**  
   `inf_mask = torch.clamp(torch.log(action_mask), FLOAT_MIN, FLOAT_MAX)`：计算动作掩码的对数并限制其值的范围，以防止对数运算中的溢出问题。`FLOAT_MIN` 和 `FLOAT_MAX` 是常量，用来限制值的范围。

6. **第6步：计算动作概率**  
   `action_prob = F.softmax(self._action_branch(x) + inf_mask, dim=1)`：将共享层的输出传递到 `_action_branch` 中进行动作预测，并将动作掩码 `inf_mask` 加到预测结果上，最后通过 `softmax` 函数计算每个动作的概率。`softmax` 可以确保所有动作的概率和为 1。

7. **第7步：返回结果**  
   `return action_prob.cpu()`：将计算得到的动作概率从 GPU 移回到 CPU，然后返回。

---

### **总结**

这段代码的处理过程的核心步骤是：
1. **处理状态数据**：从 `state_flatten` 中提取地图特征（80 个）并通过 `reshape` 转换为 4D 张量（适合卷积网络处理）。
2. **提取并处理动作掩码**：从前 7 个特征中获取动作掩码，用于限制可选动作。
3. **神经网络推理**：使用共享网络层处理地图信息，然后计算每个动作的概率（包括掩码的调整）。

假设你的环境地图为 4x4，玩家数为 2，且动作数为 7，这种结构在强化学习中常用于处理具有**复杂地图和多个动作选择**的环境，使用卷积神经网络（CNN）来提取地图特征，基于这些特征进行动作选择。
## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
