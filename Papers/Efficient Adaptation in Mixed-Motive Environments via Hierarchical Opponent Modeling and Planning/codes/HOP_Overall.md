---
创建时间: 2024-十二月-13日  星期五, 3:55:06 下午
created: 2024-12-18T20:35
updated: 2024-12-23-14.
---
[[HOP]]



# Codes/Questions

```python
from env import SnowDriftEnv
from model.model import RLModel, MyModel
from policy.fixed_policy import RandomPolicy, NearestDriftPolicy, FixPolicy
from policy.LOLA_policy import LOLAPolicy

from ray.tune.registry import register_env
from ray.rllib.models import ModelCatalog

from algorithm.Alpha_Zero_MOA_relative import AlphaZeroTrainer, DEFAULT_CONFIG, AlphaZeroPolicyWrapperClass
from ray.tune.registry import ENV_CREATOR, _global_registry

# 将 SnowDriftEnv 注册为 RLlib 的自定义环境，环境名称为 Snowdrift。
register_env("Snowdrift", lambda config: SnowDriftEnv(config))
# 将 MyModel 和 RLModel 注册为自定义模型。
ModelCatalog.register_custom_model("MyModel", MyModel)
ModelCatalog.register_custom_model("RLModel", RLModel)

# Trainer
import ray
import ray.rllib.agents.a3c as a3c
from ray.rllib.agents.a3c.a3c_torch_policy import A3CTorchPolicy
from ray.rllib.policy.policy import PolicySpec
from ray.tune.logger import pretty_print
from gym.spaces import Box, Discrete, Dict, Space
import numpy as np
import multiprocessing as mp
import copy
import os
import time
import json
import torch

if __name__ == '__main__':
    ray.init(num_gpus=0)  # 禁用 GPU，仅使用 CPU 运行。
    config = DEFAULT_CONFIG.copy()
    config['env'] = 'Snowdrift'
    config['env_config'] = {
        "player_num": 4,
        "world_height": 8,
        "world_width": 8,
        'drift_num': 6,
        'reward': 6,
        'cost': 4,
        "final_time": 50,
        'render': False,
        'max_block_comp': 0,
        'prosocial': False
    }
    env_creator = _global_registry.get(ENV_CREATOR, config["env"])
    config_dict = {
        'input_channels': config['env_config']["player_num"] + 2,  # +2？
        'world_height': config['env_config']['world_height'],
        'world_width': config['env_config']['world_width'],
    }
    # 定义状态空间为一个字典，包含 observation 和 action_mask。
    # 动作空间为 6 个离散动作，对应上下左右、停留和连接操作。
    observation_space = Dict(dict(observation=Box(low=0, high=1, shape=(
        config['env_config']["player_num"] + 2, config['env_config']["world_height"],
        config['env_config']["world_width"]),
                                                  dtype=np.int8),
                                  action_mask=Box(low=0, high=1, shape=(6,), dtype=np.int8)
                                  ))

    action_space = Discrete(6)  # {UP,DOWN,LEFT,RIGHT,STAY,LINK}
#设置 RLlib 训练配置
    config['_disable_preprocessor_api'] = False
    config['create_env_on_driver'] = True
    config['framework'] = 'torch'
    config['num_gpus'] = 0
    config['num_workers'] = 1
    config['num_envs_per_worker'] = 1
    config['rollout_fragment_length'] = 200
    config['gamma'] = 0.95
    config['train_batch_size'] = 200
    config['sgd_minibatch_size'] = 128
    config['num_sgd_iter'] = 1
    config['lr'] = 5e-4
#多智能体设置
    config['multiagent']['policies_to_train'] = ['ToM1', 'ToM2', 'ToM3', 'ToM4', 'lola1', 'lola2', 'lola3', 'lola4']
    config['model']['custom_model'] = 'MyModel'
    config['model']['custom_model_config'] = config_dict

    fixed_config_dict_list = []
    for id in range(4):
        fixed_config_dict_list.append(copy.deepcopy(config_dict))
        fixed_config_dict_list[-1]['id'] = id + 1

#定义策略映射规则，不同的智能体（player_1 到 player_4）分别使用不同的策略。
    def policy_mapping(agent_id, episode, worker, **kwargs):
        if agent_id == 'player_1':
            return 'train1'
        elif agent_id == 'player_2':
            return 'train2'
        elif agent_id == 'player_3':
            return 'train3'
        else:
            return 'train4'


    config['multiagent']['policy_mapping_fn'] = policy_mapping

    render_env_config = config['env_config'].copy()
    render_env_config['render'] = True

    config['mcts_config'] = {
        "puct_coefficient": 15,
        "num_simulations": 200,
        "temperature": 1.5,
        "dirichlet_epsilon": 0.25,
        "dirichlet_noise": 0.03,
        "argmax_tree_policy": False,
        "add_dirichlet_noise": False
    }

    ToM_config = {
        'discount_factor': 0.98,
        'gamma': 0.95,
        'my_id': 1,
        'tree_num': 5,
        'Q_temperature': 2,
        'evaluation': False}
#配置 ToM 和 LOLA 模型
    ToM_config['env_config'] = config['env_config'].copy()
    ToM_config['env_creator'] = env_creator
    config['ToM_config'] = ToM_config
    ToM_eval_config = copy.deepcopy(config['ToM_config'])
    ToM_eval_config['evaluation'] = True

    config['moa_config'] = {
        'moa_batch_size': 512,
        'moa_update_time': 15,
        'moa_buffer_capacity': 1000,
        'shovel_buffer_capacity': 100,
        'load_dir': None,
        ###'load_dir':'./params/exp20230119_004042_4p',
        'save_dir': f'./params/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p'
    }
    os.makedirs(config['moa_config']['save_dir'])

    config_list = []
    for id in range(4):
        config_list.append(copy.deepcopy(config))
        config_list[-1]['ToM_config']['my_id'] = id + 1

    '''
    config["evaluation_interval"]=1
    config["evaluation_num_episodes"]=3
    config['evaluation_config']={
        'render_env':True,
        'env_config':render_env_config,
        'ToM_config':ToM_eval_config
        }
    '''
    config['lola_config'] = {
        'moa_batch_size': 128,
        'moa_update_time': 15,
        'buffer_capacity': 200,
        'lr': 2e-4,
        'gamma': 0.99,
        'id': 1,
        'env_creator': env_creator,
        'env_num': 25,
        'load_dir': None,
        ###'load_dir':'./params/lola/exp20230123_185154_4p',
        'save_dir': f'./params/lola/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p',
        'train': False,
    }
    os.makedirs(config['lola_config']['save_dir'])

    lola_config = []
    for id in range(4):
        lola_config.append(copy.deepcopy(config))
        lola_config[-1]['lola_config']['id'] = id + 1
#配置和训练器初始化
    a3c_config = a3c.DEFAULT_CONFIG.copy()
    a3c_config['env'] = config['env']
    a3c_config['env_config'] = config['env_config']
    a3c_config['_disable_preprocessor_api'] = config['_disable_preprocessor_api']
    a3c_config['create_env_on_driver'] = config['create_env_on_driver']
    a3c_config['framework'] = config['framework']
    a3c_config['num_gpus'] = 0
    ### a3c_config['num_workers']=8
    ### a3c_config['num_envs_per_worker']=5
    a3c_config['num_workers'] = 6
    a3c_config['num_envs_per_worker'] = 5
    a3c_config['rollout_fragment_length'] = 100
    a3c_config['gamma'] = 0.99
    ###a3c_config['train_batch_size'] = 4000
    a3c_config['train_batch_size'] = 3000
    a3c_config['multiagent']['policies_to_train'] = ['train1', 'train2', 'train3',
                                                     'train4', ]  # 'prosocial1', 'prosocial2', 'prosocial3', 'prosocial4']
    a3c_config['model']['custom_model'] = 'RLModel'
    a3c_config['model']['custom_model_config'] = config_dict
    a3c_config['model']['custom_model_config']['lstm_state_size'] = 256

    a3c_config['multiagent']['policy_mapping_fn'] = policy_mapping
    '''
    a3c_config["evaluation_interval"]=1
    a3c_config["evaluation_num_episodes"]=5
    a3c_config['evaluation_config']={
        'render_env':True,
        'env_config':render_env_config
    }
    '''

    policies = {
        'train1': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'train2': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'train3': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'train4': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'prosocial1': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'prosocial2': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'prosocial3': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'prosocial4': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'random': PolicySpec(RandomPolicy, observation_space, action_space),
        'fix1': PolicySpec(FixPolicy, observation_space, action_space, fixed_config_dict_list[0]),
        'fix2': PolicySpec(FixPolicy, observation_space, action_space, fixed_config_dict_list[1]),
        'fix3': PolicySpec(FixPolicy, observation_space, action_space, fixed_config_dict_list[2]),
        'fix4': PolicySpec(FixPolicy, observation_space, action_space, fixed_config_dict_list[3]),
        'cleaner1': PolicySpec(NearestDriftPolicy, observation_space, action_space, fixed_config_dict_list[0]),
        'cleaner2': PolicySpec(NearestDriftPolicy, observation_space, action_space, fixed_config_dict_list[1]),
        'cleaner3': PolicySpec(NearestDriftPolicy, observation_space, action_space, fixed_config_dict_list[2]),
        'cleaner4': PolicySpec(NearestDriftPolicy, observation_space, action_space, fixed_config_dict_list[3]),
        'lola1': PolicySpec(LOLAPolicy, observation_space, action_space, lola_config[0]),
        'lola2': PolicySpec(LOLAPolicy, observation_space, action_space, lola_config[1]),
        'lola3': PolicySpec(LOLAPolicy, observation_space, action_space, lola_config[2]),
        'lola4': PolicySpec(LOLAPolicy, observation_space, action_space, lola_config[3]),
        'social1': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'social2': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'social3': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'social4': PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config),
        'ToM1': PolicySpec(AlphaZeroPolicyWrapperClass,
                           observation_space=observation_space,
                           action_space=action_space,
                           config=config_list[0]),
        'ToM2': PolicySpec(AlphaZeroPolicyWrapperClass,
                           observation_space=observation_space,
                           action_space=action_space,
                           config=config_list[1]),
        'ToM3': PolicySpec(AlphaZeroPolicyWrapperClass,
                           observation_space=observation_space,
                           action_space=action_space,
                           config=config_list[2]),
        'ToM4': PolicySpec(AlphaZeroPolicyWrapperClass,
                           observation_space=observation_space,
                           action_space=action_space,
                           config=config_list[3]),
    }

    a3c_config['multiagent']['policies'] = policies
    config['multiagent']['policies'] = policies
    '''
    json_config=copy.deepcopy(config)
    json_config['multiagent']=None
    json_config.pop('callbacks')
    json_config.pop('sample_collector')
    json_config['ToM_config']['env_creator']=None
    with open(config['moa_config']['save_dir']+'/config.json','a') as f:
        json.dump(json_config,f)
    '''
    # mp.set_start_method('forkserver')
    # tom_trainer=AlphaZeroTrainer(config)

    a3c_trainer = a3c.A3CTrainer(a3c_config)
    ### a3c_trainer.restore('./checkpoint_010004/checkpoint-10004')

    ###for i in range(4):
    ###  a3c_trainer.get_policy(f'ToM{i+1}').set_weights(torch.load(f'./state_dict/ToM/ToM{i+1}.pth'))

    for i in range(5001):
        result = a3c_trainer.train()
        print(pretty_print(result))
        '''
        for _ in range(4):
            torch.save(tom_trainer.get_policy(f'ToM{i+1}').get_weights(),f'./state_dict/ToM/ToM{i+1}.pth')
        print('AAA')
        '''
        if i % 1000 == 0:
            checkpoint = a3c_trainer.save()
            # checkpoint_a3c=a3c_trainer.save()
            print("checkpoint saved at", checkpoint)

```
![[Pasted image 20241213155801.png|425]]
# Answers


## GPT_Answers
为了理清算法逻辑并搞清楚 `train.py` 中的具体调用过程，你可以按照以下步骤逐步分析整个流程。以下是一个清晰的步骤框架：

---

### **1. 理解主文件 `train.py` 的结构**
`train.py` 是整个训练过程的入口文件，主要逻辑如下：
1. **初始化和配置：**
   - 配置环境、模型、自定义算法（如 MOA 和 LOLA），包括 `config` 的设置。
2. **定义多智能体策略：**
   - 使用 `PolicySpec` 定义智能体的策略，例如 `train1`、`lola1` 等。
3. **创建 Trainer：**
   - 初始化训练器（如 `A3CTrainer`），传入所有配置。
4. **训练循环：**
   - 执行训练 (`trainer.train()`)。
   - 定期保存训练检查点 (`trainer.save()`)。

**关键点：** 确保理解 `config` 中的每个参数的意义，因为这些参数会影响后续调用的模块和方法。

---

### **2. 分析主逻辑调用的核心模块**

#### **Step 1：注册自定义环境**
```python
register_env("Snowdrift", lambda config: SnowDriftEnv(config))
```
- **调用模块：**
  - `env.py` 中的 `SnowDriftEnv`。
- **作用：**
  - 注册自定义环境 `SnowDriftEnv`，这是一个多智能体的马尔可夫博弈环境。
  - 分析 `SnowDriftEnv` 中的 `__init__` 和 `step` 方法，理解每一步状态如何转移、奖励如何分配。
- **分析目标：**
  - 检查 `SnowDriftEnv` 内是否有与 HOP 算法相关的环境逻辑，比如奖励计算或目标分布。

---

#### **Step 2：注册自定义模型**
```python
ModelCatalog.register_custom_model("MyModel", MyModel)
ModelCatalog.register_custom_model("RLModel", RLModel)
```
- **调用模块：**
  - `model/model.py` 中的 `MyModel` 和 `RLModel`。
- **作用：**
  - 定义神经网络模型，用于多智能体的策略学习。
  - 检查这两个模型的结构：
    - **`forward` 方法：** 如何处理输入（观测值和动作掩码）？
    - **`output`：** 输出是否包括策略分布和价值估计？
- **分析目标：**
  - 理解模型与 HOP 算法的关系，比如是否存在目标条件化（goal-conditioned）的特性。

---

#### **Step 3：定义和注册策略**
```python
PolicySpec(A3CTorchPolicy, observation_space, action_space, a3c_config)
```
- **调用模块：**
  - `policy/fixed_policy.py` 中的 `RandomPolicy`、`NearestDriftPolicy` 和 `FixPolicy`。
  - `policy/LOLA_policy.py` 中的 `LOLAPolicy`。
  - `algorithm/Alpha_Zero_MOA_relative.py` 中的 `AlphaZeroPolicyWrapperClass`。
- **作用：**
  - 定义策略类型（随机策略、LOLA 策略、AlphaZero 策略等）。
  - 检查每种策略如何与环境交互，以及是否实现了 HOP 算法中的公式（如目标采样）。
- **分析目标：**
  - 区分这些策略的主要逻辑（如随机 vs LOLA vs AlphaZero）。
  - 检查策略是否实现了目标推断（goal inference）或规划模块。

---

#### **Step 4：初始化 Trainer**
```python
a3c_trainer = a3c.A3CTrainer(a3c_config)
```
- **调用模块：**
  - `ray.rllib.agents.a3c` 中的 `A3CTrainer`。
- **作用：**
  - 初始化 A3C 算法的训练器，传入自定义环境、模型和策略。
  - 检查 `A3CTrainer` 内部调用的关键方法（如 `compute_actions` 和 `learn_on_batch`）。
- **分析目标：**
  - 检查是否有涉及 HOP 算法的额外逻辑（如目标条件化的值函数计算）。
  - 确定 `train_batch_size` 和 `rollout_fragment_length` 的设置对训练的影响。

---

#### **Step 5：训练循环**
```python
for i in range(5001):
    result = a3c_trainer.train()
    print(pretty_print(result))
    if i % 1000 == 0:
        checkpoint = a3c_trainer.save()
```
- **调用模块：**
  - `ray.rllib` 的 `Trainer.train` 方法。
- **作用：**
  - 执行单次训练，包括从环境收集样本、优化神经网络参数、更新策略。
- **分析目标：**
  - 理解 `train` 方法的工作流：
    1. **采样：** 从环境中采集 `rollout_fragment_length` 个样本。
    2. **训练：** 使用采样的批量数据更新策略。
    3. **保存：** 定期保存模型参数。

---

#### **Step 6：保存模型**
```python
torch.save(tom_trainer.get_policy(f'ToM{i+1}').get_weights(), f'./state_dict/ToM/ToM{i+1}.pth')
```
- **调用模块：**
  - `torch.save` 和 `get_policy` 方法。
- **作用：**
  - 保存当前训练的策略权重。
- **分析目标：**
  - 确保所有策略（如 `ToM1` 到 `ToM4`）的权重都能正确保存。
  - 检查权重文件是否用于恢复训练或评估。

---

### **3. 入手分析的建议步骤**

1. **从环境（`env.py`）入手：**
   - 理解 `SnowDriftEnv` 如何实现状态转移和奖励分配。
   - 检查是否实现了与 HOP 算法相关的模块（如目标采样或目标更新）。

2. **分析模型结构（`model/model.py`）：**
   - 确定 `MyModel` 和 `RLModel` 的输入和输出。
   - 检查模型是否支持目标条件化的输入（goal-conditioned input）。

3. **策略实现（`policy/`）：**
   - 重点关注 `LOLA_policy.py` 和 `Alpha_Zero_MOA_relative.py`。
   - 检查 `LOLAPolicy` 和 `AlphaZeroPolicyWrapperClass` 是否包含与 HOP 算法相关的逻辑。

4. **跟踪训练过程：**
   - 在 `a3c_trainer.train()` 处打断点，跟踪采样、优化和更新的流程。
   - 检查 `rollout_fragment_length` 和 `train_batch_size` 如何影响训练效率。

5. **检查保存和加载：**
   - 确保 `torch.save` 和 `trainer.save()` 的路径正确。
   - 理解保存的模型如何用于恢复训练或评估。

---

### **4. 总结**
要全面理解 `train.py` 的逻辑，需要同时关注环境（`SnowDriftEnv`）、模型（`MyModel`/`RLModel`）和策略（如 `LOLA` 或 `AlphaZero`）。从调用关系上，建议先从环境开始，再依次分析模型、策略和训练流程。通过逐步跟踪关键模块，可以明确 HOP 算法如何在代码中实现。

## Other_Answers

