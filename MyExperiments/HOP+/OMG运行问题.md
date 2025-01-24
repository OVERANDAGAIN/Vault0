---
创建时间: 2025-一月-23日  星期四, 3:15:41 下午
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





## Problem2: 预训练与训练
- [?] 
`python main.py --config=iql --env-config=sc2 with env_args.map_name=8m --obs_is_state=True
`

`python main.py --config=4iql3qmix1iql_omg --multi_algs --env-config=sc2 with env_args.map_name=8m --mac=multi_module_mac --train_alg=iql_omg
`
### 1_Answers


### 2_Answers




## Problem3
- [?] 

### 1_Answers


### 2_Answers

# Limitations
# Future Work
# FootNotes