---
created: 2024-12-18T20:35
updated: 2025-01-15T14:11
---
[[Packages]]

# Sources

codes of HOP


# Errors
```bash
D:\anaconda\envs\HOP\python.exe E:\HOP\msg_code\train.py 
Traceback (most recent call last):
  File "E:\HOP\msg_code\train.py", line 1, in <module>
    from env import SnowDriftEnv
  File "E:\HOP\msg_code\env.py", line 3, in <module>
    from ray.rllib.env.multi_agent_env import MultiAgentEnv
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\__init__.py", line 5, in <module>
    from ray.rllib.env.base_env import BaseEnv
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\env\__init__.py", line 1, in <module>
    from ray.rllib.env.base_env import BaseEnv
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\env\base_env.py", line 4, in <module>
    from ray.rllib.env.external_env import ExternalEnv
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\env\external_env.py", line 2, in <module>
    import gym
  File "D:\anaconda\envs\HOP\lib\site-packages\gym\__init__.py", line 13, in <module>
    from gym.envs import make, spec, register
  File "D:\anaconda\envs\HOP\lib\site-packages\gym\envs\__init__.py", line 10, in <module>
    _load_env_plugins()
  File "D:\anaconda\envs\HOP\lib\site-packages\gym\envs\registration.py", line 250, in load_env_plugins
    for plugin in metadata.entry_points().get(entry_point, []):
AttributeError: 'EntryPoints' object has no attribute 'get'
```

# Codes
E:\HOP\msg_code\train.py
```python
import re  
import sys  
import copy  
import importlib  
import contextlib  
  
if sys.version_info < (3, 8):  
    import importlib_metadata as metadata  
else:  
    import importlib.metadata as metadata
```

```python
entry_point="gym.envs"):  
    # Load third-party environments  
    for plugin in metadata.entry_points().get(entry_point, []):
```

# Solutions
1. 需要注意的是，在 Python 3.8 之前，这个模块是作为一个单独的 `importlib_metadata` 包来提供的，需要使用 `pip` 安装。但在 Python 3.8 之后，这个模块被纳入了标准库，可以直接使
   [python3.7与importlib.metadata - CSDN文库](https://wenku.csdn.net/answer/16bce34d561246c4998cc587ced6065f)
2.  将版本降到5.0以下，如4.13.0  ``pip install importlib-metadata==4.13.0``  或  ``pip install importlib-metadata<5``
   [AttributeError: 'EntryPoints' objects has no attribute 'get'的解决办法 - Z哎呀 - 博客园](https://www.cnblogs.com/aiyablog/p/17720208.html)

