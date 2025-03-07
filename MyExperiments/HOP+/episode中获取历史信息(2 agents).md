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
见 **3** 。把actions 存在obs里面





## 2. 自己的上一步状态 `prev_obs`

### 方法：在 `episodes[n].user_data` 中添加 `hist_obs` 字段
####  在 `compute_acitons_from_inputs_dict()` 中存储
```python
   if time == 0:
		episodes[n].user_data[f"hist_obs{self.my_id}"]=[obs_flatten]
	else:
		episodes[n].user_data[f"hist_obs{self.my_id}"].append(obs_flatten)
```

#### 获取
time=0 时无上一个 obs
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
### 预分析
````ad-attention
RLlib 中的 设置 `_agent_to_prev_action` 和 `_agent_to_last_action` 需要使用 `_set_last_action()` 但不清楚如何调用这个函数。并且因为 `compute_action（）` 返回的 `action_batch` 不能直接作为 `self_to_last_action`
>动作可能无效，会强制 “STAY” (4)
>狩猎之后，猎人猎物退出，可能不执行动作，prev_action 可能没有（==但是这种情况下prev_action无时效性，始终为6 ==）
```python
    def _set_last_action(self, agent_id, action):
        if agent_id in self._agent_to_last_action:
            self._agent_to_prev_action[agent_id] = \
                self._agent_to_last_action[agent_id]
        self._agent_to_last_action[agent_id] = action
```

````

### 方法：修改环境的 `step()` 使 `observation` 包含动作信息。

#### env.py 中的 `init() `
```python
        self.prev_actions = {}  # 新增：存储所有 Agent 的上一步动作



		self.observation_space=Dict(dict(observation=Box(low=0,high=1,shape=(self.height,self.width,self.player_num+3),dtype=np.int8),
		action_mask=Box(low=0,high=1,shape=(7,),dtype=np.int8), #{UP,DOWN,LEFT,RIGHT,STAY,STAG,HARE}

		actions=Box(low=0,high=6,shape=(self.player_num,),dtype=np.int8)#### add actions
						))
```


#### env.py 中的 `reset()`
```python
self.prev_actions = {player: 4 for player in self.players}  # 初始动作为 STAY (4)

```



#### env.py 中的 `step()`
```python
# 保存当前动作到 prev_actions（修正后的动作）
for player in avail_players:
	self.prev_actions[player] = avail_players[player]

```

#### env.py 中的 `__obs__()`
```python
    def __obs__(self,playerids):

        return {self.players[id]:{
            'observation':self.__obs_state__(id),
            'action_mask':self.__actionmask__(id),
            'actions': self.__actions__(id)
        }for id in playerids}

```

#### env.py 中的 `__action__()`
```python

    def __actions__(self,id):
        player = self.players[id]
        # 获取其他 Agent 的上一步动作
        other_actions = [
            self.prev_actions[other_player]
            for other_player in self.players
            # if other_player != player
        ]
        return np.array(other_actions, dtype=np.int8)
```

#### train.py 中的 修改
```python
    observation_space=Dict(dict(observation=Box(low=0,high=1,shape=(config['env_config']["world_height"],config['env_config']["world_width"],config['env_config']["player_num"]+3),dtype=np.int8),
                            action_mask=Box(low=0,high=1,shape=(7,),dtype=np.int8), #{UP,DOWN,LEFT,RIGHT,STAY,STAG,HARE}
                                actions=Box(low=0, high=6, shape=(config['env_config']["player_num"],), dtype=np.int8)  #### add actions

                                ))
```

####  修改相关的`obs_flatten` 处理 （因为多了 n_agents 个数据）
```python

```

![[Pasted image 20250307110527.png]]

### 获取
[7:9] 因为这里定义的是两个agent
```python
 def compute_actions_from_input_dict(
        self, input_dict, explore=None, timestep=None, episodes=None, state_batches=None, **kwargs
    ):
        with torch.no_grad():
            obs_batch=input_dict['obs']
            for n in range(len(obs_batch)):
                obs_flatten=obs_batch[n]
                actions=obs_flatten[7:9]
                if self.my_id== 2 or 1:
                    print("actions",actions)
```

### 结果分析
- `actions` 表示所有玩家上一步的动作
- `action： 6` 表示捕猎到猎物，该玩家和该猎物退出环境 ，`prev_action 始终 6 ` （如紫色所示）

```ad-warning
time=0 时， actions : [4,4,] 可能需要处理，使其变为 0 
```

![[Pasted image 20250307104404.png]]


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