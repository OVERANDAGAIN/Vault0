---
创建时间: 2025-一月-21日  星期二, 5:46:55 下午
created: 2025-02-12T15:58
updated: 2025-02-17T17:47
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
  ├── env.py
  ├── train.py

# Methodology
# Issues & Debugging

## Problem1: 在训练时的 `config
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







## Problem2: 如何训练HOP的代码
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


## Problem3: 其他细节
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




## Problem4： 关于Alpha_Zero_MOA的逻辑（重写Trainer部分函数)

### Answers
在执行 `tom_trainer = AlphaZeroTrainer(config)` 之后，`AlphaZeroTrainer` 类的初始化过程主要依赖于 RLlib 框架中的训练器（Trainer）机制。

1. **初始化父类构造函数**：
   `AlphaZeroTrainer` 继承自 `Trainer` 类，在执行 `tom_trainer = AlphaZeroTrainer(config)` 时，实际上是调用了 `Trainer` 类的构造函数（如果有的话）。`Trainer` 类的构造函数会处理传入的 `config` 参数，并初始化与训练相关的其他内容。

2. **调用 `get_default_config` 方法**：
   `AlphaZeroTrainer` 重写了 `get_default_config` 类方法，返回了 `DEFAULT_CONFIG` 配置。这意味着，如果你没有传入配置（`config`），则会使用 `DEFAULT_CONFIG` 中定义的默认配置。

   ```python
   @classmethod
   @override(Trainer)
   def get_default_config(cls) -> TrainerConfigDict:
       return DEFAULT_CONFIG
   ```

   这部分代码确保了 `AlphaZeroTrainer` 有一个默认配置，这对于训练过程至关重要。

3. **获取默认策略类**：
   `AlphaZeroTrainer` 重写了 `get_default_policy_class` 方法，指定了训练中将使用的默认策略类。这里它返回的是 `AlphaZeroPolicyWrapperClass`，这意味着在训练过程中，会使用 `AlphaZeroPolicyWrapperClass` 作为策略（Policy）。

   ```python
   @override(Trainer)
   def get_default_policy_class(self, config: TrainerConfigDict) -> Type[Policy]:
       return AlphaZeroPolicyWrapperClass
   ```

4. **定义执行计划（`execution_plan`）**：
   `AlphaZeroTrainer` 还重写了 `execution_plan` 方法。这个方法负责定义如何执行训练过程，包括数据采集、训练和评估等步骤。

   - `rollouts = ParallelRollouts(workers, mode="bulk_sync")`：初始化并启动并行的回合采集器，表示会并行进行多个环境的滚动。
   - 接下来，根据 `simple_optimizer` 的值，定义了不同的训练流程：
     - 如果 `simple_optimizer` 为 `True`，则使用 `TrainOneStep` 对每个训练步进行梯度更新。
     - 否则，使用 `Replay` 和 `StoreToReplayBuffer` 组件来处理回放缓冲区，进行更复杂的训练流程。
```ad-tip
`simple_optimizer=TRUE`
>使用 `TrainOneStep` 对每个训练步进行梯度更新
```
   - 最后，`StandardMetricsReporting(train_op, workers, config)` 负责在训练过程中报告标准的评估指标。

   通过 `execution_plan`，可以看到这个训练器是如何在多个 worker（即多个环境实例）中并行处理回合，并通过不同的方式（基于回放缓冲区或简单的优化器）进行训练。

   ```python
   @staticmethod
   @override(Trainer)
   def execution_plan(workers: WorkerSet, config: TrainerConfigDict, **kwargs) -> LocalIterator[dict]:
       # Rollout and training logic...
   ```

5. **配置管理与训练**：
   在 `AlphaZeroTrainer` 初始化过程中，配置参数（例如 `train_batch_size`、`learning_starts` 等）会影响执行计划的具体行为。`config` 参数可能包含诸如训练批次大小、优化器设置、回放缓冲区大小等信息，这些都会在训练过程中被使用。

总结一下，`tom_trainer = AlphaZeroTrainer(config)` 的初始化过程大致包括以下步骤：
- 通过继承 RLlib 的 `Trainer` 类，初始化了配置、策略类和执行计划。
- 根据配置选择不同的训练模式（简单优化器或回放缓冲区）。
- 设置回合采集、训练步骤以及训练过程中的度量报告。

这类结构化的初始化流程使得训练过程可以在 RLlib 框架中统一管理，并且能够灵活地配置和扩展不同的算法和策略。


## Problem5 关于 `ToM_Alpha_MOA` 的逻辑



### Answers_1 关于 `def compute_actions_from_input_dict(）` 

#### 


## Problem6 关于项目组织 `moa` `mcts` `mcts_moa` 等
### Answer
根据你上传的图像，HOP 算法的架构中确实有 **两个神经网络（NN）**，分别在 **对手建模模块（Opponent Modeling Module）** 和 **规划模块（Planning Module）** 中。

### 1. **第一个神经网络（Goal-conditioned Policy）**
- 在 **对手建模模块** 中，目标条件策略（Goal-conditioned Policy）部分通过神经网络进行建模。该神经网络接收 ==**状态（s）**、**动作（a）** 和 **目标（g）**==，输出的是 ==**动作的概率分布**==，即 $P(a|s, g)$。
  
- **`MOAModel`** 与该神经网络对应。它通过 **目标条件策略** 来推测对手的行为，并为对手的每个可能目标生成相应的动作概率分布。

### 2. **第二个神经网络（Planning Module）**
- 在 **规划模块** 中，神经网络被用于生成 **动作（a）** 和 **状态（s）** 之间的 ==**策略（π）**==，即 $\pi(a|s)$，并==估计状态值（value）==。该模块的作用是根据 **对手建模模块** 生成的信念（对对手目标的推测）来选择最优行动。
  
- **`MCTSModel`** 与该神经网络对应。它在 **规划模块** 中用来通过 **蒙特卡洛树搜索（MCTS）** 模拟不同的行动计划并选择最优策略。

### 结论：
是的，可以认为 **`MOAModel`** 和 **`MCTSModel`** 分别对应于图中 **两个神经网络** 的角色：

- **`MOAModel`** 对应 **Goal-conditioned Policy** 网络，用于生成目标条件下的动作概率分布，并推测对手行为。
- **`MCTSModel`** 对应 **Planning Module** 网络，用于生成基于环境状态的动作选择策略，并进行价值评估。

这两个网络分别处理对手建模和行动规划任务，结合起来帮助焦点智能体做出最优决策。


# Limitations
# Future Work
# FootNotes