---
创建时间: 2024-十二月-20日  星期五, 4:31:06 下午
---
#tool_summary 
[开始使用 RLlib — Ray 2.37.0](https://www.aidoczh.com/ray/rllib/rllib-training.html)[^1]
# What
所有 RLlib 实验都使用一个 Algorithm 类来运行，该类包含用于环境交互的策略。通过算法的接口，您可以训练策略、计算动作或存储算法的状态（检查点）。在多智能体训练中，算法同时管理多个策略的查询和优化


# Why



# How
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


# Theroy



# Background



# Related Work




# Methodology




# Results



# Limitations


# FootNotes

[^1]: RLlib中文网址