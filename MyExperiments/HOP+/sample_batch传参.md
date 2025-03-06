---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-6日  星期四, 10:55:18 上午
---
[[


# Objectives
- 基于 `RLlib`  的项目，在一系列 `compute_action()` `compute_action_from_dict()` `postprocess_trajectory()`  ` learn_on_batch()` 中传递 `Sample_batch` 的自定义的字段
`
# Results

## `def postprocess_trajectory(self, sample_batch, other_agent_batches=None, episode=None):` 中 **print** 的信息：
```python
        sample_batch[f'subgoal_self------------'] = sample_batch['state_out_0'].copy()

                print(other_agent_batches[name][1]['state_out_0'])

```


## `def learn_on_batch(self, samples):` 中获得的 `subgoal` :

![[Pasted image 20250306110046.png]]





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