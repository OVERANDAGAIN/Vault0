---
创建时间: 2025-三月-6日  星期四, 8:30:17 晚上
created: 2025-01-15T12
updated: ...
---
[[HOP+]]


# Objectives
`compute_action()` 计算 `subgoal` 时，需要获取 ：
- 自己的上一步动作 `prev_action`
- 自己的上一步状态 `prev_obs`
- 对手们的上一步动作 `prev_action`

![[Pasted image 20250306203304.png]]



`compute_actions_from_input_dict()` 的输入： 
```python

    @override(Policy)
    def compute_actions_from_input_dict(
        self, input_dict, explore=None, timestep=None, episodes=None, state_batches=None, **kwargs
    ):
```

# Results

## 1. 自己的上一步动作 `prev_action`
### 第一种方法：直接使用 prev_action_batch
```python
	print(prev_action_batch)
```
### 第二种方法：使用 对手们的上一步动作 `prev_action`
见 **3** 。





## 2. 自己的上一步状态 `prev_obs`

### 方法：在 `episodes[n].user_data` 中添加 `hist_obs` 字段
#### 存储
```python
   if time == 0:
		episodes[n].user_data[f"hist_obs{self.my_id}"]=[obs_flatten]
	else:
		episodes[n].user_data[f"hist_obs{self.my_id}"].append(obs_flatten)
```

#### 获取
t=0 无上一个 obs
```python
	time=episodes[n].length
	if time>0:
		print( episodes[n].user_data[f"hist_obs{self.my_id}"][time-1])
```

### 分析
![[Pasted image 20250306204249.png]]

同种颜色验证为： 
- time-1 时刻的 obs
-  `hist_obs[time-1]`   time 时刻的 prev_obs

![[Pasted image 20250306203713.png]]


## 3. 对手们的上一步动作 `prev_action`
````ad-attention
RLlib 中的 设置 `_agent_to_prev_action` 和 `_agent_to_last_action` 需要使用 `_set_last_action()` 但不清楚如何调用这个函数。因为 `compute_action（）` 返回的 `action_batch` 不能直接作为 `self_to_last_action`
>动作可能无效，会强制 “STAY” (4)
>可能不执行动作，prev_action 可能没有（==但是这种情况下prev_action不能使用了，因为无时效性 —— 无意义==）
```python
    def _set_last_action(self, agent_id, action):
        if agent_id in self._agent_to_last_action:
            self._agent_to_prev_action[agent_id] = \
                self._agent_to_last_action[agent_id]
        self._agent_to_last_action[agent_id] = action
```

````

### 修改环境的 `step()` 使 `observation` 包含动作信息。



# Insights
# Setup
# Methodology
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