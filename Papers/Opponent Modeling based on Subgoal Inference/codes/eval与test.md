---
创建时间: 2025-二月-8日  星期六, 10:39:05 上午
created: 2025-02-08T10:39
updated: 2025-02-17-22.
---
[[omg_overall]]



# Codes/Questions

- [?] 


```python
 evaluate_sequential(args, runner, logger)和runner.run(test=true)有什么区别
```


# Answers

## Overall_Answers
### **区别总结**：  
`evaluate_sequential(args, runner, logger)` 与 `runner.run(test_mode=True)` 都用于测试，但它们的作用范围和调用逻辑不同。  

---

### **1. `evaluate_sequential(args, runner, logger)`**
#### **功能**：  
- **整体测试流程**的入口函数。
- 会多次调用 `runner.run(test_mode=True)` 来执行一系列测试任务，执行完后可能会保存回放（Replay）等结果。  
- 适合独立测试阶段，不再进行训练。

#### **代码逻辑**：
```python
def evaluate_sequential(args, runner, logger):
    for _ in range(args.test_nepisode):  # 测试多个 episode
        runner.run(test_mode=True)

    if args.save_replay:  # 如果指定保存回放，则调用保存方法
        runner.save_replay()

    runner.close_env()
```

#### **调用场景**：
- **在整个训练结束**或单独运行测试时调用。
- 例如在 `run()` 函数中调用 `evaluate_sequential` 时，直接退出训练：
```python
if args.evaluate or args.save_replay:
    evaluate_sequential(args, runner, logger)
    return
```

---

### **2. `runner.run(test_mode=True)`**
#### **功能**：  
- **单次测试运行**。  
- 在训练过程中，用于周期性测试，测试结束后会返回一个批次（batch）的结果。

#### **代码逻辑**：
```python
def run(self, test_mode=False):
    self.reset()

    terminated = False
    episode_return = 0
    self.mac.init_hidden(batch_size=self.batch_size)

    while not terminated:  # 单次 episode 测试
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

    return self.batch
```

#### **调用场景**：
- **在训练过程中**，定期测试模型的性能。  
- 在 `run_sequential()` 中，会按照一定间隔调用 `runner.run(test_mode=True)`：
```python
if (runner.t_env - last_test_T) / args.test_interval >= 1.0:
    for _ in range(n_test_runs):
        runner.run(test_mode=True)
```

---

### **关键区别**

| **对比点**           | **evaluate_sequential()**                | **runner.run(test_mode=True)**            |
|----------------------|-------------------------------------------|-------------------------------------------|
| 调用位置             | 独立测试（不再训练）                      | 训练过程中定期测试                        |
| 测试次数             | 多次运行，取决于 `args.test_nepisode`      | 单次运行一个 episode                      |
| 是否保存回放         | 支持 `args.save_replay`                   | 不涉及回放保存                            |
| 返回值               | 无返回值                                  | 返回一个 `EpisodeBatch`                   |
| 调用方式             | 在 `run()` 函数中，若 `--evaluate=True`   | 在 `run_sequential()` 的训练中周期调用    |

---

### **总结**：
- **`evaluate_sequential()`**：用于**独立测试**阶段，会循环调用 `runner.run(test_mode=True)` 多次，并支持保存测试回放。  
- **`runner.run(test_mode=True)`**：在**训练期间**，周期性地测试模型性能，返回单次测试结果，不保存回放。

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
