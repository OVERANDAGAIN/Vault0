---
创建时间: 2025-一月-23日  星期四, 3:15:41 下午
created: 2025-01-23T15:15
updated: 2025-02-17T22:12
---
[[HOP+]]


# Objectives
跑通OMG代码，包括预训练（保存模型权重等），训练等代码
# Results
注释掉即可
```python
        self.batch.update(last_data, ts=self.t)
        ### self.batch.update_holdup(ts=self.t)###in the last timestep(ts)
```
# Insights
# Setup
# Methodology
# Issues & Debugging

## Problem1: 关于holdup_data
- [?] 
- [x] 问题的解决： [[OMG运行问题#Problem 1-2 关于 `update_holdup` 的错误]]
```bash
dingyi@dingyi-virtual-machine:~/Desktop/OMG$ python main.py --config=iql --env-config=sc2 with env_args.map_name=8m 
......
Traceback (most recent calls WITHOUT Sacred internals):
  File "main.py", line 40, in my_main
    run(_run, config, _log)
  File "/home/dingyi/Desktop/OMG/run.py", line 49, in run
    run_sequential(args=args, logger=logger)
  File "/home/dingyi/Desktop/OMG/run.py", line 197, in run_sequential
    episode_batch = runner.run(test_mode=False)
  File "/home/dingyi/Desktop/OMG/runners/episode_runner.py", line 89, in run
    self.batch.update_holdup(ts=self.t)
  File "/home/dingyi/Desktop/OMG/components/episode_buffer.py", line 118, in update_holdup
    self.update(self.holdup_data, ts)
AttributeError: 'EpisodeBatch' object has no attribute 'holdup_data'

[INFO 13:56:13] absl Shutdown gracefully.
[INFO 13:56:13] absl Shutdown with return code: -15
```

### 1_Answers
````ad-note
episode_buffer代码片段：
```python
  def holdup(self, data):
        self.holdup_data = data

    def update_holdup(self, ts=slice(None)):
        self.update(self.holdup_data, ts)
```
episode_runner run()代码：
```python
 while not terminated:

            pre_transition_data = {
                "state": [self.env.get_state()],
                "avail_actions": [self.env.get_avail_actions()],
                "obs": [self.env.get_obs()]
            }

            self.batch.update(pre_transition_data, ts=self.t)

            actions = self.mac.select_actions(self.batch, t_ep=self.t, t_env=self.t_env, test_mode=test_mode)

            reward, terminated, env_info = self.env.step(actions[0])
            episode_return += reward

            post_transition_data = {
                "actions": actions,
                "reward": [(reward,)],
                "terminated": [(terminated != env_info.get("episode_limit", False),)],
            }

            self.batch.update(post_transition_data, ts=self.t)

            self.t += 1

        last_data = {
            "state": [self.env.get_state()],
            "avail_actions": [self.env.get_avail_actions()],
            "obs": [self.env.get_obs()]
        }
        self.batch.update(last_data, ts=self.t)
         self.batch.update_holdup(ts=self.t)###in the last timestep(ts)
```

````
你的分析非常准确，问题的核心在于：

1. **函数功能定义重复**  
   - `holdup + update_holdup = update`  
   - `holdup(data)` 只是将数据存储到 `holdup_data`，而 `update_holdup(ts)` 只是再次调用 `update(self.holdup_data, ts)`，本质上两者的组合等同于直接调用 `update(data, ts)`。
   - 这意味着 `holdup()` 和 `update_holdup()` 的设计实际上是冗余的，理论上可以直接在 `run()` 方法中只调用 `update()`。

2. **调用逻辑存在重复**  
   - 在 `episode_runner.py` 中，代码如下：
     ```python
     self.batch.update(last_data, ts=self.t)
     self.batch.update_holdup(ts=self.t)  # 再次更新
     ```
   - 这里 `last_data` 已经被 `update` 存储了一次，然后 `update_holdup(ts=self.t)` 又使用相同的数据进行了重复存储，导致不必要的冗余。

---

### **解决方案**

#### 方案 1：移除 `holdup` 和 `update_holdup`，直接使用 `update`
由于 `holdup()` 和 `update_holdup()` 没有提供额外的功能，直接在 `runner` 中简化调用逻辑，避免重复更新：

**修改 `episode_runner.py`：**
```python
# 直接存储数据一次即可，删除多余调用
self.batch.update(last_data, ts=self.t)
```

**删除 `episode_buffer.py` 中不必要的方法：**
```python
# 删除以下方法
def holdup(self, data):
    self.holdup_data = data

def update_holdup(self, ts=slice(None)):
    self.update(self.holdup_data, ts)
```

---

#### 方案 2：保持 `holdup` 但移除重复调用
如果在其他地方需要使用 `holdup` 方法（如在某些特定策略或模块中），可以在 `runner` 中移除手动调用 `update()`，只保留 `holdup`：

**在 `episode_runner.py` 中：**
```python
self.batch.holdup(last_data)  # 存储最后状态
self.batch.update_holdup(ts=self.t)  # 仅更新一次
```

这样，可以保留 `holdup` 方法作为一个额外的存储机制，但要确保不出现数据重复存储的情况。

### **总结**
你的分析准确指出了两个核心问题：

1. **函数功能冗余**：  
   解决方案是直接移除 `holdup()` 和 `update_holdup()`，仅使用 `update()` 方法。

2. **调用逻辑重复**：  
   解决方案是要么在 `run()` 中只调用 `update()`，要么使用 `holdup()` 并避免重复调用。

**推荐的最终解决方案：**
```python
self.batch.update(last_data, ts=self.t)  # 删除 update_holdup 以避免重复
```



## Problem 1-2 关于 `update_holdup` 的错误

### 关于Problem 1 的修正
`update_holdup` 仍然是需要的，不用注释该行代码。
对于以下几种情况：
#### - 使用到 `update_holdup  
即在 `omg_am` 中把 `infer_mu` `infer_log_var` 保存在batch中时才会使用到
#### - 不使用 `update_holdup
即没用到 `omg` 相关的模块 `omg_am` 时 ,下面的函数不会被调用，导致 `self.holdup_date` 没被初始化，从而在 `update_holdup` 阶段（在runner中环境交互过程会被执行）会报错找不到该字段
```
    def holdup(self, data):
        self.holdup_data = data
```

==因此，需要修改代码解决这部分不一致的错误==
#to_be_solved [^1]

### 修改源代码的 `ts` `bs` 的赋值错误
这段代码存在参数传递错误的问题，可能导致意外的行为或bug。具体分析如下：

**问题原因：**
在`update_holdup`方法中调用`self.update(self.holdup_data, ts)`时，第二个参数`ts`被错误地传递给了`update`方法的第二个形参`bs`，而非预期的`ts`参数。此时：
- `bs`会被赋值为`update_holdup`中传入的`ts`值。
- `update`的`ts`参数始终使用默认值`slice(None)`。

**影响：**
- 切片解析`_parse_slices((bs, ts))`中的`bs`和`ts`值与预期不符。
- 数据更新时可能作用于错误的切片范围，导致数据错乱或逻辑错误。

**修复方法：**
明确使用关键字参数传递`ts`，避免位置混淆：
```python
def update_holdup(self, ts=slice(None)):
    self.update(data=self.holdup_data, ts=ts)
```

**总结：**
参数位置错误导致`bs`和`ts`的值被交换，必须通过关键字参数显式指定`ts`参数以确保正确性。



## Problem2: 预训练与训练
- [?] 
`python main.py --config=iql --env-config=sc2 with env_args.map_name=8m --obs_is_state=True
`

`python main.py --config=4iql3qmix1iql_omg --multi_algs --env-config=sc2 with env_args.map_name=8m --mac=multi_module_mac --train_alg=iql_omg
`
### 1_Answers


### 2_Answers




## Problem3: 关于obs和state（全局/部分）
- [?] 
- [x] state表示全局的
    obs表示部分的（当前智能体的）

### 1_Answers
下面展示逐层调用的逻辑：

`omg_am.py`
```python

fc_input, cond_input, vae_input = self._get_input_shape(scheme, groups)

```

```python
    def _get_input_shape(self, scheme, groups):
        if self.args.obs_is_state:
            obs_shape = scheme["state"]["vshape"]
        else:
            obs_shape = scheme["obs"]["vshape"]

        fc_input = obs_shape
```

`run.py`
```python
    # Default/Base scheme
    scheme = {
        "state": {"vshape": env_info["state_shape"]},
        "obs": {"vshape": env_info["obs_shape"], "group": "agents"},
        "actions": {"vshape": (1,), "group": "agents", "dtype": th.long},
        "avail_actions": {"vshape": (env_info["n_actions"],), "group": "agents", "dtype": th.int},
        "reward": {"vshape": (1,)},
        "terminated": {"vshape": (1,), "dtype": th.uint8},
        "agent_idx": {"vshape": (1,), "dtype": th.int, "episode_const": True},
    }
```

```python
    # Set up schemes and groups here
    env_info = runner.get_env_info()
    args.n_agents = env_info["n_agents"]
    args.n_actions = env_info["n_actions"]
    args.state_shape = env_info["state_shape"]

```

`episode_runner.py`
```python
    def get_env_info(self):
        return self.env.get_env_info()

```


`multiagentenv.py`
```python
    def get_env_info(self):
        env_info = {"state_shape": self.get_state_size(),
                    "obs_shape": self.get_obs_size(),
                    "n_actions": self.get_total_actions(),
                    "n_agents": self.n_agents,
                    "episode_limit": self.episode_limit}
        return env_info

```

`__init__.py`
```python
from smac.env import MultiAgentEnv, StarCraft2Env
import sys
import os

def env_fn(env, **kwargs) -> MultiAgentEnv:
    return env(**kwargs)

REGISTRY = {}
REGISTRY["sc2"] = partial(env_fn, env=StarCraft2Env)

```


smac源码
`smac/env/starcraft2/starcraft2.py`
```python
    def get_obs_size(self):
        """Returns the size of the observation."""

    def get_state_size(self):
        """Returns the size of the global state."""
```





### 2_Answers

# Limitations
# Future Work
# FootNotes

[^1]: 解决holdup_data的相关错误