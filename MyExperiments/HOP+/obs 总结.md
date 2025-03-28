---
created: 2025-01-15T12
updated: ...
创建时间: 2025-三月-28日  星期五, 3:33:16 下午
---
[[HOP+]]

# Objectives
HOP 中的 model 都能玩去哪访问对手的 obs 
- moa 相当于对手 policy  的建模
- mymodel  是 MCTS 中的自己的 policy 



#  在 `HOP` 中:
 
## `moa_model` 的四个方法： 使用的都是 自己当前的 `obs` 

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


### `get_action` 在 `mcts_moa` 的` get_child（）`
```python
def get_action(self, obs, time, prey_type):
        return priors.squeeze().cpu().numpy()
```

```python
def get_child(self, action):
	action_prob_dist=self.model_list[player].get_action(all_obs[player],self.state['time'],self.target_prey)

```




### `get_action_prob` 在 `ToM_Alpha_MOA` 的 `compute_actions_from_input_dict()`



```python
def get_action_prob(self, obs, time, action):
	return prob_stag[action].item(),prob_hare[action].item()
```


```python
def compute_actions_from_input_dict(
	ac_prob_stag,ac_prob_hare=self.model_dict[player_name].get_action_prob(exist_player_obs[player_name], time-1, last_action[player_name])
```



## Mymodel 中， 使用的也是自己的 obs 
  
```python
  def get_child(self, action):

            obs=obs_all[f'player_{self.id}']
        return self.children[action]
```



   
```python
 def compute_action(self, node):
        for _ in range(self.num_sims):
            leaf = node.select()
            if leaf.done:
                value = leaf.reward
            else:
                ###mcts_model
                child_priors, value = self.model.compute_priors_and_value(leaf.obs, leaf.state['time'])
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