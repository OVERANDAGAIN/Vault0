---
创建时间: 2024-十二月-20日  星期五, 4:31:06 下午
created: 2024-12-20T16:31
updated: ...
---
#tool_summary 
[开始使用 RLlib — Ray 2.37.0](https://www.aidoczh.com/ray/rllib/rllib-training.html)[^1]
# What
所有 RLlib 实验都使用一个 Algorithm 类来运行，该类包含用于环境交互的策略。通过算法的接口，您可以训练策略、计算动作或存储算法的状态（检查点）。在多智能体训练中，算法同时管理多个策略的查询和优化


# Why



# 开始使用RLlib
## 基本用法例子
 - Config
	 - PPOconfig()
	 - environment()
	 - env_runners()
 - config.build()
```python
from pprint import pprint

from ray.rllib.algorithms.ppo import PPOConfig

config = (
    PPOConfig()
    .api_stack(
        enable_rl_module_and_learner=True,
        enable_env_runner_and_connector_v2=True,
    )
    .environment("CartPole-v1")
    .env_runners(num_env_runners=1)
)

algo = config.build()

for i in range(10):
    result = algo.train()
    result.pop("config")
    pprint(result)

    if i % 5 == 0:
        checkpoint_dir = algo.save_to_path()
        print(f"Checkpoint saved in directory {checkpoint_dir}")
```

## 检查点
```python
from ray.rllib.algorithms.algorithm import Algorithm
algo = Algorithm.from_checkpoint(checkpoint_path)
```

and so on...

## 配置 RLlib 算法
你可以通过使用所谓的 AlgorithmConfig 对象以模块化的方式配置 RLlib 算法

![[Pasted image 20241220172716.png]]










# 关键概念
在本页中，我们将介绍关键概念，以帮助您理解RLlib的工作原理以及如何使用它。在RLlib中，您使用 Algorithm 来学习如何解决 environments 问题。算法使用 policies 来选择动作。给定一个策略， environment 中的 rollouts 会产生经验的 sample batches （或 trajectories ）。您还可以自定义RL实验的 training_step 。
![[Pasted image 20241220173408.png]]


==动作 -> 奖励 -> 下一状态 -> 训练 -> 重复，直到结束状态，这被称为一个 回合 ，或者在 RLlib 中，称为一个 回滚 。==定义环境的最常见 API 是 Farama-Foundation Gymnasium API，这也是我们在大多数示例中使用的 API。

# Background



# Related Work




# Methodology




# Results



# Limitations


# FootNotes

[^1]: RLlib中文网址