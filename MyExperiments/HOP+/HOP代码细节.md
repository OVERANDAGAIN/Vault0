---
创建时间: 2025-一月-21日  星期二, 5:46:55 下午
---
[[HOP+]]


# Objectives
# Results
# Insights
# Setup
msh部分：
```bash
msh_code
│
├── algorithm
│   ├── Alpha_Zero_MOA.py
│   ├── direct_Alpha_Zero_MOA.py
│   ├── wol_Alpha_Zero_MOA.py
│   ├── wos_Alpha_Zero_MOA.py
├── model
│   ├── centralized_critic.py
│   ├── direct_moa_model.py
│   ├── mcts_model.py
│   ├── mcts_model_no_mask.py
│   ├── moa_model.py
│   ├── model.py
│   └── social_inf_model.py
│
├── params
│
├── planning
│   ├── __init__.py
│   ├── direct_mcts_moa.py
│   └── mcts_moa.py
│
├── policy
│   ├── __init__.py
│   ├── direct_ToM_Alpha_MOA.py
│   ├── fixed_policy.py
│   ├── LOLA_policy.py
│   ├── pr2q_policy.py
│   ├── prosocial_policy.py
│   ├── social_inf_policy.py
│   ├── ToM_Alpha_MOA.py
│   ├── ToM_heuristic.py
│   ├── wol_ToM_Alpha_MOA.py
│   └── wos_ToM_Alpha_MOA.py
│
├── state_dict
│
├── utils
│   ├── average_cumulative_reward.py
│   ├── average_reward.py
│   ├── average_reward_cb.py
│   ├── prey_ratio.py
│   └── ranked_reward.py
│
├── adaptation_test.py
├── env.py
├── gpu_deeper_model.py
├── train.py
│
├── README.md
└── requirement.txt
```


 ├── mcts_model.py   
  ├── moa_model.py
  └── mcts_moa.py
  ├── ToM_Alpha_MOA.py
  ├── Alpha_Zero_MOA.py
  ├── train.py
  ├── env.py

# Methodology
# Issues & Debugging

## Problem1
- [?] 在训练时的 `config`

### 1_Answers
train.py:
```python
    config['_disable_preprocessor_api']=False
    config['create_env_on_driver']=True
    config['framework']='torch'
    config['num_gpus']=0
    config['num_workers']=6
    config['num_envs_per_worker']=1
    config['rollout_fragment_length']=500
    config['gamma']=0.95
    config['train_batch_size']=3000
    config['sgd_minibatch_size']=1024
    config['num_sgd_iter']=15
    config['lr']=5e-4

```

`num_workers` * `rollout_fragment_length` = `train_batch_size`
$6*500=3000$




### 2_Answers
train.py:

```python
  ToM_config={
        'discount_factor':0.995,
        'gamma':0.95,
        'my_id':1,
        'tree_num':5,
        'Q_temperature':2,
        'evaluation':False}
```

`tree_num` 设置为 $5$ ，与 `num_workers` $6$ 乘积 $30$ 表示了并行的个数。看情况减少
### 3_Answers
train.py:

```python

    config['mcts_config']={
        "puct_coefficient":1,
        "num_simulations": 200,
        "temperature":1.5,
        "dirichlet_epsilon": 0.25,
        "dirichlet_noise": 0.03,
        "argmax_tree_policy": False,
        "add_dirichlet_noise": False
        }
```

`num_simulations` 可以根据上面的`tree_num` 和 `num_workers` 按乘积比例相应减少


### 4_Answers
train.py:

`player_num` `world_height`  `world_width` 也可相应减少。

```python
 config['env_config']={
        "player_num":4,
        "stag_num":1,
        "hare_num":4,
        "world_height":8,
        "world_width":8,
        "time_reward":0,
        "stag_reward":10,
        "hare_reward":1,
        'dynamic_final_time':False,
        'final_time_after_first_hunt':5,
        "final_time":35,
        'render':False,
        'max_block_comp':5,
        'prosocial':False,
        'player_strength':(1,1,1,1)
    }
```







## Problem2
- [?] 如何训练HOP的代码

### Answers
1. 把下面的 `train1-4` 改为 `TOMX`
```python
    def policy_mapping(agent_id, episode, worker, **kwargs):
        if agent_id=='player_1':
            return 'train1'
        elif agent_id=='player_2':
            return 'train2'
        elif agent_id=='player_3':
            return 'train3'
        else:
            return 'train4'
```

```python
policies={  ... 
		  'ToM1':PolicySpec(AlphaZeroPolicyWrapperClass,
        observation_space=observation_space,
        action_space=action_space,
        config=config_list[0]),
        'ToM2':PolicySpec(AlphaZeroPolicyWrapperClass,
        observation_space=observation_space,
        action_space=action_space,
        config=config_list[1]),
        'ToM3':PolicySpec(AlphaZeroPolicyWrapperClass,
        observation_space=observation_space,
        action_space=action_space,
        config=config_list[2]),
        'ToM4':PolicySpec(AlphaZeroPolicyWrapperClass,
        observation_space=observation_space,
        action_space=action_space,
        config=config_list[3]),
   }
```

2. 使用 `tom_trainer`
   ```python
   
    tom_trainer=AlphaZeroTrainer(config)
    #direct_tom_trainer = AlphaZeroTrainer(config)
    # a3c_trainer=a3c.A3CTrainer(a3c_config)
```

3. `save()` 也设置为 `tom`

```python
        if i%1000==0:
            checkpoint=tom_trainer.save()
            #checkpoint_a3c=a3c_trainer.save()
            print("checkpoint saved at", checkpoint)

```


## Problem3
- [?] 其他细节

### Answers
#### 1. `postprocess_trajectory()` 是在policy(?)之后进行的
#### 2. 关于 `goal` : 即 `target_pos` 更改其相关代码即可
   ```python
   
    def get_action(self, obs, time, target_pos):
        with torch.no_grad():
            x=torch.from_numpy(obs['observation']).to(self.device).float().unsqueeze(0)
            action_mask=torch.from_numpy(obs['action_mask']).to(self.device).float().unsqueeze(0)
            time=torch.tensor([[time]]).to(self.device).float()
            target_layer=torch.from_numpy(target_pos).to(self.device).float().unsqueeze(0)

            x = self.shared_layers(x)
            x = torch.cat((x, time, target_layer),dim=1)
            x = self.flatten_layers(x)
            # actor outputs
            logits = self.actor_layers(x)
            inf_mask = torch.clamp(torch.log(action_mask),FLOAT_MIN,FLOAT_MAX)
            priors = nn.Softmax(dim=-1)(logits+inf_mask)

        return priors.squeeze().cpu().numpy()

```



# Limitations
# Future Work
# FootNotes