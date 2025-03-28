---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-28日  星期五, 3:33:16 下午
---
[[HOP+]]


# Objectives
 在 `HOP` 中，:
## `moa_model` 的四个方法： 

### `forward` `value_function` 在 `alpha_zero_loss（）` 

```python
def forward(self, obs_flatten, time, prey_type):
        return priors
def value_function(self):
        return self._value_out
```

```python
def alpha_zero_loss(policy, model, dist_class, train_batch):
    model_out = model.forward(input_dict, None, [1], train_batch['t'].unsqueeze(1))
    logits, _= model_out
    values = model.value_function()
```


### get_action 在 mcts_moa 的 get_child（）
```python
def get_action(self, obs, time, prey_type):
        return priors.squeeze().cpu().numpy()
```

```python
def get_child(self, action):
	action_prob_dist=self.model_list[player].get_action(all_obs[player],self.state['time'],self.target_prey)

```


```python
def get_action_prob(self, obs, time, action):
	return prob_stag[action].item(),prob_hare[action].item()
```



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