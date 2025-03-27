---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-27日  星期四, 4:37:45 下午
---
[[HOP+]]

# 总结
当然可以！下面我将从**字段（keys）视角**出发，系统总结 `sample_batch`、`other_agent_batches` 和 `episode` 三者的结构和主要用途，帮助你彻底理清它们之间的区别与联系。

---

## ✅ 总览表：三者结构对比（字段为主）

| **维度** | **sample_batch（本 agent）** | **other_agent_batches（他人）** | **episode（全局对象）** |
|----------|-----------------------------|-----------------------------|----------------------------|
| 类型 | `dict` 或 `SampleBatch` | `Dict[str, Tuple[Policy, SampleBatch]]` | `Episode` 对象 |
| 数据粒度 | 当前 agent 的时间序列 | 每个他人 agent 的时间序列 | 当前 episode 全部交互过程 |
| 来源 | 本 agent rollout | 他人 agent rollout | 环境交互完整信息 |
| 常用字段（核心） | ✅ `obs`<br>✅ `actions`<br>✅ `rewards`<br>✅ `dones`<br>✅ `new_obs`<br>✅ `prev_actions`<br>✅ `subgoal` | ✅ `obs`<br>✅ `actions`<br>✅ `rewards`<br>（结构与 sample_batch 相同） | ✅ `user_data`（自定义字段）<br>✅ `_agent_reward_history`<br>✅ `_agent_to_last_action`<br>✅ `.length()`<br>✅ `.last_observation_for()` |
| 子目标位置 | `sample_batch["subgoal"]` | `batch["subgoal"]`（每个 agent） | `episode.user_data[f"subgoal{self.my_id}"]`（list） |
| 访问方式 | 直接字典访问 | `other_agent_batches[f'player_{id}'][1]['obs']` | 通过属性，如 `episode.user_data[...]` |
| 是否含多 agent | ❌（单 agent） | ✅（按 agent 分开） | ✅（多 agent 全局） |

---

## 🧩 各自字段详细说明

---

### 📦 1. `sample_batch`（当前 agent 的 rollout 数据）

```python
sample_batch.keys()
```

典型字段（单 agent）：

| 字段 | 含义 | 示例 shape |
|------|------|------------|
| `obs` | 当前观察 | `(T, obs_dim)` |
| `new_obs` | 下一个观察 | `(T, obs_dim)` |
| `actions` | 执行动作（离散/连续） | `(T,)` |
| `prev_actions` | 上一步动作 | `(T,)` |
| `rewards` | 每步奖励 | `(T,)` |
| `dones` | 每步是否 episode 终止 | `(T,)` |
| `subgoal` ✅ | 子目标（自定义添加） | `(T, subgoal_dim)` |
| `agent_index`, `t`, `eps_id`, `unroll_id` | 元信息 | `(T,)` |

---

### 📦 2. `other_agent_batches`（他人 agent 的 rollout 数据）

结构如下：

```python
{
  "player_1": (PolicyObj, SampleBatch),
  "player_2": (PolicyObj, SampleBatch),
  ...
}
```

字段与 `sample_batch` 相同，内容表示他人的轨迹数据。

你可这样获取：

```python
other_agent_batches[f"player_{id}"][1]["obs"]
```

字段与上表一致，如 `obs`、`actions`、`subgoal` 等。

---

### 🧠 3. `episode`（Episode 对象，全局状态记录）

这是最复杂、也最灵活的结构。

```python
type(episode) == <class 'ray.rllib.evaluation.episode.Episode'>
```

---

#### 🔑 重要字段

| 字段 | 类型 | 说明 |
|------|------|------|
| `user_data` ✅ | `dict` | 自定义记录结构，支持存 subgoal、obs、策略等序列（如 `subgoal1`） |
| `_agent_reward_history` ✅ | `dict[str -> List[float]]` | 每个 agent 的奖励轨迹 |
| `_agent_to_last_action` ✅ | `dict[str -> int]` | 每个 agent 最后一次动作 |
| `.length` | `int` | 当前 episode 长度 |
| `.last_observation_for(agent_id)` | 方法 | 获取某 agent 的最后观察 |
| `.get_agents()` | 方法 | 获取所有 agent id |
| `.add_extra_batch()` | 方法 | 添加额外 batch 信息 |

---


# HOP batch 分析
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

```bash
pid=24884) --- Episode Debug ---
 pid=24884) Type: <class 'ray.rllib.evaluation.episode.Episode'>
 pid=24884) Dir: ['__class__', '__delattr__', '__dict__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__le__', '__lt__', '__module__', '__ne__', '__new__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', '__weakref__', '_add_agent_rewards', '_agent_index', '_agent_reward_history', '_agent_to_index', '_agent_to_last_action', '_agent_to_last_done', '_agent_to_last_extra_action_outs', '_agent_to_last_info', '_agent_to_last_obs', '_agent_to_last_raw_obs', '_agent_to_policy', '_agent_to_prev_action', '_agent_to_rnn_state', '_next_agent_index', '_policies', '_policy_mapping_fn', '_set_last_action', '_set_last_done', '_set_last_extra_action_outs', '_set_last_info', '_set_last_observation', '_set_last_raw_obs', '_set_rnn_state', 'add_extra_batch', 'agent_rewards', 'batch_builder', 'custom_metrics', 'env_id', 'episode_id', 'get_agents', 'hist_data', 'last_action_for', 'last_done_for', 'last_extra_action_outs_for', 'last_info_for', 'last_observation_for', 'last_pi_info_for', 'last_raw_obs_for', 'last_reward_for', 'length', 'media', 'new_batch_builder', 'policy_for', 'policy_map', 'policy_mapping_fn', 'prev_action_for', 'prev_reward_for', 'rnn_state_for', 'soft_reset', 'total_reward', 'user_data', 'worker']
 pid=24884) User data keys: ['initial_state', 'mcts_policies1', 'recurrent_state1', 'subgoal1', 'hist_obs1']
 pid=24884) Reward history keys: dict_keys(['player_1', 'player_2'])
 pid=24884) Last actions: {'player_1': 6, 'player_2': 4}
```






# OMG episode_batch 分析

## 结果: 时长都是固定36（ `max_t` +1 ) ，与 HOP 的多变不同

```python
 pid=5900) EpisodeBatch keys: dict_keys(['state', 'obs', 'actions', 'avail_actions', 'reward', 'time', 'terminated', 'actions_onehot', 'filled', 'infer_mu', 'infer_log_var'])
 pid=5900) state: shape = torch.Size([1, 36, 4, 4, 5]), type = <class 'torch.Tensor'>
 pid=5900) obs: shape = torch.Size([1, 36, 2, 4, 4, 5]), type = <class 'torch.Tensor'>
 pid=5900) actions: shape = torch.Size([1, 36, 2, 1]), type = <class 'torch.Tensor'>
 pid=5900) avail_actions: shape = torch.Size([1, 36, 2, 7]), type = <class 'torch.Tensor'>
 pid=5900) reward: shape = torch.Size([1, 36, 1]), type = <class 'torch.Tensor'>
 pid=5900) time: shape = torch.Size([1, 36, 1]), type = <class 'torch.Tensor'>
 pid=5900) terminated: shape = torch.Size([1, 36, 1]), type = <class 'torch.Tensor'>
 pid=5900) actions_onehot: shape = torch.Size([1, 36, 2, 7]), type = <class 'torch.Tensor'>
 pid=5900) filled: shape = torch.Size([1, 36, 1]), type = <class 'torch.Tensor'>
 pid=5900) infer_mu: shape = torch.Size([1, 36, 2, 16]), type = <class 'torch.Tensor'>
 pid=5900) infer_log_var: shape = torch.Size([1, 36, 2, 16]), type = <class 'torch.Tensor'>
```

## 具体数据 filled terminated infer_mu
```bash
 pid=23400) Filled: [1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 0]
 pid=23400) Terminated: [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0]
 pid=23400) Time steps where infer_mu is all zero: 34
```

```python
        filled = episode_batch.data.transition_data["filled"].squeeze().cpu().numpy()  # shape: (36,)
        terminated = episode_batch.data.transition_data["terminated"].squeeze().cpu().numpy()  # shape: (36,)

        print("Filled:", filled)
        print("Terminated:", terminated)

        infer_mu = episode_batch.data.transition_data["infer_mu"].squeeze()  # shape: (36, 2, 16)
        zero_mask = ~ (infer_mu == 0).all(dim=-1).all(dim=-1)  # shape: (36,), 每个时间步是否全为0
        print("Time steps where infer_mu is all zero:", torch.nonzero(zero_mask).squeeze().tolist())
```







# FootNotes