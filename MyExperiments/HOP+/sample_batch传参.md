---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-6日  星期四, 10:55:18 上午
---
[[HOP+]]


# Objectives
- 基于 `RLlib`  的项目，在一系列 `compute_action()` `compute_action_from_dict()` `postprocess_trajectory()`  ` learn_on_batch()` 中传递 `Sample_batch` 的自定义的字段
`
# Results

## `def postprocess_trajectory(self, sample_batch, other_agent_batches=None, episode=None):` 中 **print** 的信息：

### 两种 `batch` 里面的格式类似
```python
        
    print(sample_batch['state_out_0'])
        
	print(other_agent_batches[name][1]['state_out_0'])

```


```bash
(RolloutWorker pid=1144881) 🔹 sample_batch before processing:
(RolloutWorker pid=1144881) SampleBatch(2: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't', 'state_in_0', 'state_out_0'])
(RolloutWorker pid=1144881) 🔹 other_agent_batches:
(RolloutWorker pid=1144881) {'player_2': (LOLAPolicy, SampleBatch(4: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't', 'state_in_0', 'state_out_0']))}
```


### 添加Sample_batch额外信息后：
```python
 sample_batch[f'subgoal_self------------'] = sample_batch['state_out_0'].copy()
        if self.train:
            for name in self.player.opponent_model_name_list:
                sample_batch[f'obs_{name}'] = other_agent_batches[name][1]['obs'].copy()
                sample_batch[f'actions_{name}'] = other_agent_batches[name][1]['actions'].copy()
                # sample_batch[f'subgoal_{name}'] = other_agent_batches[name][1]['state_out_0'].copy()

        print("🔹 sample_batch after processing:")
        print(sample_batch)
```

```bash
(RolloutWorker pid=1144881) 🔹 sample_batch after processing:
(RolloutWorker pid=1144881) SampleBatch(2: [略......略， 'subgoal_self------------', 'obs_player_2', 'actions_player_2'])
```


## `def learn_on_batch(self, samples):` 中获得的 `subgoal` :

![[Pasted image 20250306110046.png]]


# Insights
# Setup
# Methodology

## 1. `compute_action`() 中添加信息到 `recurrent_state` 里面

```python

    def compute_actions(self,obs_batch,*args,**kwargs):
		略。。。
        new_state_batches = []

        subgoal = torch.rand(64,)  # 创建一个包含从 0 到 63 的 subgoal

        # 将 PyTorch 张量转换为 NumPy 数组
        subgoal_numpy = subgoal.numpy()

        #确保 new_state_batches 维度匹配 obs_batch.shape[0]
        for _ in range(obs_batch.shape[0]):
            new_state_batches.append(subgoal_numpy)  # 添加到 new_state_batches
        new_state_batches = np.expand_dims(new_state_batches, axis=0)  # 变成 (1,1, 64)

        return act_batch, new_state_batches,{}

```

````ad-warning
由于 `new_state_batches` 中只会保留第一列的信息。因此 `new_state_batches` ：
>1. (64,)
>2. (1,64)
>都会导致 `state_out_0` 只包含 一个数据 ：
![[Pasted image 20250306112102.png]]
>- (1,1,64) 即可！（如上所示）
````



## 2. `def postprocess_trajectory()` 添加到 `Sample_batch`
```python
 @override(Policy)
    def postprocess_trajectory(
        self, sample_batch, other_agent_batches=None, episode=None
    ):
     

        sample_batch[f'subgoal_self------------'] = sample_batch['state_out_0'].copy()
       
        if self.train:
            for name in self.player.opponent_model_name_list:
                sample_batch[f'obs_{name}'] = other_agent_batches[name][1]['obs'].copy()
                sample_batch[f'actions_{name}'] = other_agent_batches[name][1]['actions'].copy()
                # sample_batch[f'subgoal_{name}'] = other_agent_batches[name][1]['state_out_0'].copy()

        return sample_batch
```

## 3.  `learn_on_batch()` 中收到更新后的 `Sample_batch`

![[Pasted image 20250306112535.png]]


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