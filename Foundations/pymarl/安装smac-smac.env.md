---
创建时间: 2025-一月-22日  星期三, 10:07:04 晚上
---
[[pymarl]]

# Questions

- [?] 安装了smac却显示没有 `smac.env` 模块

爆红错误：
```python
from smac.env import MultiAgentEnv, StarCraft2Env
```

```bash
(myenv) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ python main.py --config=4iql3qmix1iql_omg --multi_algs --env-config=sc2 with env_args.map_name=8m
Traceback (most recent call last):
  File "main.py", line 17, in <module>
    from run import run
  File "/home/dingyi/Desktop/OMG/run.py", line 14, in <module>
    from runners import REGISTRY as r_REGISTRY
  File "/home/dingyi/Desktop/OMG/runners/__init__.py", line 3, in <module>
    from .episode_runner import EpisodeRunner
  File "/home/dingyi/Desktop/OMG/runners/episode_runner.py", line 1, in <module>
    from envs import REGISTRY as env_REGISTRY
  File "/home/dingyi/Desktop/OMG/envs/__init__.py", line 2, in <module>
    from smac.env import MultiAgentEnv, StarCraft2Env
ModuleNotFoundError: No module named 'smac.env'

(myenv) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ pip show smac
Name: smac
Version: 0.13.1
Summary: SMAC3, a Python implementation of 'Sequential Model-based Algorithm Configuration'.
Home-page: 
Author: Marius Lindauer, Matthias Feurer, Katharina Eggensperger, Joshua Marben,  \
Author-email: "fh@cs.uni-freiburg.de"
License: 3-clause BSD
Location: /home/dingyi/anaconda3/envs/myenv/lib/python3.8/site-packages
Requires: ConfigSpace, dask, distributed, joblib, lazy-import, numpy, psutil, pynisher, pyrfr, scikit-learn, scipy
Required-by: 

```

# Answers
知乎配置pymarl教程： [Pymarl虚拟环境安装步骤（Windows/Ubuntu）](https://zhuanlan.zhihu.com/p/542727892)

## GPT_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
