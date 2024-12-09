
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

