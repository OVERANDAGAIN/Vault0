---
创建时间: 2025-九月-23日  星期二, 6:59:09 晚上
---
[[HOP+迁移至cleanrl]]


# Objectives
# Results
# Insights
# Setup
# Methodology
当然可以！这里把“从 WM/PPO 一步规划 → 回到 MCTS”所做的修改，按文件和函数粒度给你**精炼对照表**。你可以把这份清单当成变更记录（changelog）。

# 改动总览（保持外部接口不变）

* **类名/接口不变**：仍然是 `HOPPlusPolicy(config, env_creator, model_core, device)`；`get_action(...) -> (action, logprob, entropy, value)`；`train(agent_trajectories, agent_ids)`。
* **核心变化**：`get_action()` 的动作决策从“世界模型 + 一步蒙特卡洛打分”切换为“**MCTS（多棵树、Q 平均、温度采样）**”，并复用你旧工程的 `Node/RootParentNode/MCTS`。

---

# A) `hop_plus_policy.py`（或你命名的 `HOP_policy_MCTS.py`）

## 1) 头部 import

* ✅ 新增：兼容导入旧版 MCTS

```python
from planning.mcts_moa import Node, RootParentNode, MCTS  # 兜底路径
```

## 2) `__init__` 增补（不破坏已有字段）

* ✅ 回填/对齐 ToM/MCTS 超参：

  * `self.discount_factor`（若缺则用 `gamma`）
  * `self.tree_num` / `self.Q_temp`
* ✅ 本地环境副本（MCTS 用于 `set_state`、`__actionmask__`）：

  * `self.env_config = config['env_config'].copy()`
  * `self.env = env_creator(self.env_config); self.env.reset()`
* ✅ 构建 MCTS：

  * `self.mcts = MCTS(self.model, config.get('mcts_config', {...}), config['ToM_config'].get('evaluation', False))`
* ✅ 运行期缓存与计时（对齐旧 AlphaZero 统计）：

  * `self._recurrent_state = {}`、`self._hist_obs = {}`、`self._mcts_policies = {}`
  * `self.timer_t1_total/t2_total/t3_total`、`self.action_compute_time_sum/count`

> 可选：把 `self.use_world_model = False`（避免误用 WM，但不必删除 WM 相关成员）

## 3) 补回两个旧接口方法（外部若调用可无缝）

* ✅ `get_initial_state(self)`：返回与旧版相同长度的 list（玩家/猎物位置信息 + 附加位）。
* ✅ `set_env_states(self, obs, state, time)`：把当前观测与“旋转到我方索引 0”的位姿信息打包成 `state_dict`，供 `env.set_state(...)` 和 MCTS 使用。

## 4) `get_action()` 的**动作决策**替换为 MCTS（关键）

* ✅ 保留前半段**原样**：解析 `obs_flat`、收集 `pre_actions`、计算 `subgoal`（`model_goal.cal_subgoal(...)`），并记录到 `_logs`，这些用于训练/OMG 不变。
* ❌ **删除**：基于 `world_model` 的“一步规划 + 采样 K 次对手动作 + 估计 V(o\_{t+1})”的打分循环。
* ✅ **新增**（MCTS 流）：

  1. 组装 `new_state`：先写入每个玩家坐标（无则 `-1, -1`）。
  2. **t=0**：扫描鹿/兔通道，写入所有猎物坐标，追加 `[first_hunt_time=0, stag_num, hare_num]`。
     **t>0**：从历史里取“上一时刻 recurrent state 的最后一个”（**bugfix**）

     ```python
     key = (env_id or -1, self.my_id)
     hist = self._recurrent_state.get(key, [])
     prev_state = hist[-1] if len(hist) > 0 else self.get_initial_state()
     ```

     然后把上一帧“猎物与附加信息区域”拼接进 `new_state`，对照当前 `obs_cur` 把消失的猎物置 `-1`（并在第一次捕猎时写 `first_hunt_time`）。
  3. 构建 `original_obs = {"observation": obs_cur.numpy(), "action_mask": action_mask.numpy()}` 并：

     ```python
     self.state_dict = self.set_env_states(original_obs["observation"], new_state, cur_t)
     self.env.set_state(self.state_dict)
     ```
  4. 若无猎物（鹿/兔通道全空），在合法动作中随机；否则：

     * 创建 `tree_num` 个根节点 `Node(...)`，**注意**：

       * `target_prey = subgoal_my.squeeze(0).float()`（**bugfix：传 torch.Tensor，不是 numpy**）
       * 传入 `model_list / model_id_list / model_goal / r2_buffer / gamma`，与旧版一致。
     * `tree_num==1`：`mcts.compute_action(node)` 直接取结果。
       `tree_num>1`：对每棵树得到的 `Q_value` **求平均**，再做 `mcts_policy = softmax(Q * Q_temp)` 并**按分布采样**动作（和你旧逻辑一致）。
     * 把 `mcts_policy` 转成 tensor 供后续计算熵。
  5. 维护历史缓存（对齐旧 `episodes.user_data`）：

     * `self._recurrent_state[key].append(new_state)`
     * `self._hist_obs[key].append(obs_flat.cpu().numpy())`
     * `self._mcts_policies[key].append(mcts_policy.cpu().numpy())`
  6. **训练侧输出保持不变**：用你现在的 `model_core` 前向出 `logprob / value`；**熵**用 `mcts_policy` 在**有效动作集合**上计算（与之前一致）。

> 这一步实现了“外部完全不用改，内部改走 MCTS”。

## 5) 运行中出现并修掉的两个小坑（你已经按我建议修了）

* ✅ **`target_prey` 类型**：必须传 `torch.Tensor`，不能传 numpy（否则下游 `unsqueeze` 报错）。
* ✅ **`prev_state` 的读取**：用 `hist[-1]` 而不是把整个列表当成 state；历史为空时用 `get_initial_state()`（否则 `IndexError`）。

---

# 哪些保持不变？

* `HOPPlusPolicy` 的**外部接口/方法名/返回值**。
* 你的 **OMG / MOA** 训练与缓冲写入逻辑、`train()` 的数据通路。
* Rollout 主循环的 `Transition`、日志统计与 TensorBoard 写法。

---

# 最后自检清单（跑前 10s 对照）

* [ ] `Node/RootParentNode/MCTS` 能正确 import（路径 OK）。
* [ ] `cfg_by_agent[aid]['ToM_config']` 里有 `tree_num`、`Q_temperature`、`evaluation`。
* [ ] `cfg_by_agent[aid]['mcts_config']` 存在（或策略内有兜底）。
* [ ] `get_action()` 里 **没有** 再走 world model 的一步规划循环。
* [ ] `Node(... target_prey= subgoal_my.squeeze(0).float())`（不是 numpy）。
* [ ] `cur_t>0` 时 `prev_state = hist[-1] if hist else get_initial_state()`。
* [ ] 无猎物时在合法动作上随机；有猎物时多棵树平均 Q + 温度 softmax 采样。

这就是从“WM+PPO 一步规划”切回“老的 MCTS 管线”的全部改动点。需要我把关键改段打成一个小 patch/diff 文件也行，直接给你一键套用。

# Issues & Debugging

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