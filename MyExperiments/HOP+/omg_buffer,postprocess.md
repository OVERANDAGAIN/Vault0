---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-27日  星期四, 4:37:45 下午
---
[[HOP+]]



## Sample_batch 和 other_agent_batches 时间长短不一
### 代码:
```python
  @override(Policy)
    def postprocess_trajectory(
            self, sample_batch, other_agent_batches=None, episode=None
    ):

        print("Sample batch keys:", sample_batch.keys())
        # for k in sample_batch.keys():
        print(f"{'obs'} shape:", sample_batch['obs'].shape)

        print("other_agent_batches keys:", other_agent_batches.keys())
        print(f"{'obs'} shape:", other_agent_batches[f'player_{1 + 1}'][1]['obs'].shape)
```

### 结果： 
```bash
pid=23440) obs shape: (35, 89)
 pid=23440) Sample batch keys: dict_keys(['player_2'])
 pid=23440) obs shape: (35, 89)
 pid=23440) OMG_AM buffer not ready to sample
 pid=23440) [Learn step 0] Attempting MOA update...
 pid=23440) Buffer size for model 0: 5/200
 pid=23440) Sample batch keys: dict_keys(['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
 pid=23440) obs shape: (7, 89)
 pid=23440) Sample batch keys: dict_keys(['player_2'])
 pid=23440) obs shape: (35, 89)
 pid=23440) OMG_AM buffer not ready to sample
 pid=23440) [Learn step 0] Attempting MOA update...
 pid=23440) Buffer size for model 0: 6/200
 pid=23440) Sample batch keys: dict_keys(['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
 pid=23440) obs shape: (35, 89)
 pid=23440) Sample batch keys: dict_keys(['player_2'])
 pid=23440) obs shape: (35, 89)
 pid=23440) OMG_AM buffer not ready to sample
 pid=23440) [Learn step 0] Attempting MOA update...
 pid=23440) Buffer size for model 0: 7/200
 pid=23440) Sample batch keys: dict_keys(['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
 pid=23440) obs shape: (6, 89)
 pid=23440) Sample batch keys: dict_keys(['player_2'])
 pid=23440) obs shape: (35, 89)
 pid=23440) OMG_AM buffer not ready to sample
 pid=23440) [Learn step 0] Attempting MOA update...
 pid=23440) Buffer size for model 0: 8/200
 pid=23440) Sample batch keys: dict_keys(['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
 pid=23440) obs shape: (5, 89)
 pid=23440) Sample batch keys: dict_keys(['player_2'])
 pid=23440) obs shape: (5, 89)
 pid=23440) OMG_AM buffer not ready to sample
```

### 原因： 捕到猎之后移出地图，不执行 `compute_action()`
````ad-tip

---

## 🔍 **背景设定：Stag Hunt 博弈环境**
- 多个智能体可以选择去“单独抓兔子”或“多人合作抓鹿”。
- 鹿（stag）只能被多人一起围住时捕获。
- 抓到鹿奖励高，但需要多人协作。
- 抓兔子是个体行为，奖励低但稳定。

---

## ✅ 这段代码做的事：处理 **鹿被成功围捕后的环境变化**

我们分段解读：

---

### 🧩1. 识别谁捕鹿了，并找到同一个位置的所有猎人

```python
while len(hunt_stag_players) != 0:
    same_stag_with_zero = [hunt_stag_players[0]]
    zero_stag_pos = tuple(self.player_pos[hunt_stag_players[0]])
```

- `hunt_stag_players`：当前 tick 中执行“捕鹿动作”的智能体列表。
- `same_stag_with_zero`：临时列表，用于记录围捕同一头鹿的玩家。
- `zero_stag_pos`：这个鹿所在的位置。

---

### 🧩2. 找出在同一鹿位置的其他玩家（合围者）

```python
for i in range(len(hunt_stag_players)-1, 0, -1):
    if tuple(self.player_pos[hunt_stag_players[i]]) == zero_stag_pos:
        same_stag_with_zero.append(hunt_stag_players[i])
        hunt_stag_players.pop(i)
hunt_stag_players.pop(0)
```

- 把其他站在 `zero_stag_pos` 的玩家加入围捕组。
- 这些人是“同时捕鹿，站在同一格”的合作者。

---

### 🧩3. 奖励与终止处理

```python
total_strength = np.sum(self.player_strength[same_stag_with_zero])
if len(same_stag_with_zero) != 1:
    for id in same_stag_with_zero:
        self.state[zero_stag_pos[0], zero_stag_pos[1], id] = 0
        self.terminal[id] = 1
```

- 如果只有一个人去捕鹿，不算成功（可能被忽略在其他逻辑里）。
- 多人合作时：
  - 每个参与者从 `state` 中移除；
  - 标记该 agent 已终止（`self.terminal[id] = 1`）；
  - 发放奖励：

```python
if total_strength == 0:
    # 所有人strength为0，均分奖励
    rewards[self.players[id]] += self.stag_reward * (1.0 / len(same_stag_with_zero))
else:
    # 按照每人strength占比发奖励
    rewards[self.players[id]] += self.stag_reward * self.player_strength[id] / total_strength
```

- 强度机制允许设定不同 agent 的能力差异（比如模拟等级、合作能力等）。

---

### 🧩4. 环境状态更新

```python
if self.first_hunt_time == 0:
    self.first_hunt_time = self.time
self.state[zero_stag_pos[0], zero_stag_pos[1], -2] = 0
```

- 记录“首次合作捕鹿”的时间（可能用于学习指标、评估模型社会性等）；
- 把鹿从地图上移除（`state[..., -2] = 0`），说明它被捕了。

---

## ✅ 总结：捕鹿之后环境状态的变化

| 环境元素 | 变化情况 |
|----------|----------|
| `state` | - 鹿位置的 `-2` 通道被清除（鹿消失）<br>- 玩家所在通道（id通道）被清除 |
| `rewards` | 所有成功捕鹿的玩家获得分配奖励（均分或按 strength 分） |
| `terminal` | 这些玩家被标记为终止（可能在环境中消失） |
| `done` | 这些玩家的 `done=True` |
| `first_hunt_time` | 如果是第一次捕鹿，记录时间 |
| `hunt_stag_players` | 清除已处理玩家，防止重复处理 |

---

````




## `other_agent_batches` 的结构

### 结果：两个元祖，policy 和 sample_batch
```bash
 pid=30752) <class 'tuple'>
 pid=30752) 2
 pid=30752) Policy object type: <class 'policy.fixed_policy.NearestStagPolicy'>
 pid=30752) Sample batch1 type: <class 'ray.rllib.policy.sample_batch.SampleBatch'>
```


### 代码： 
```python
        print(type(other_agent_batches['player_2']))  # 应该是 <class 'tuple'>
        print(len(other_agent_batches['player_2']))  # 应该是 2
        policy_obj, sample_batch1 = other_agent_batches['player_2']
        print("Policy object type:", type(policy_obj))
        print("Sample batch1 type:", type(sample_batch1))
```




## episode 的结构






## Problem1: 
- [?] 

### 1_Answers


### 2_Answers



## Problem2: 
- [?] 

### 1_Answers


### 2_Answers



# Limitations
# Future Work
# FootNotes