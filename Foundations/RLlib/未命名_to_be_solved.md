---
创建时间: 2025-一月-15日  星期三, 9:07:56 晚上
created: 2025-01-15T21:07
updated: ...
---
[[RLlib]]
#to_be_solved 
# Questions

- [?] 
[0065.强化学习框架RLlib介绍 - 随笔分类 - 黎明程序员 - 博客园](https://www.cnblogs.com/itmorn/category/1857609.html)
[Ray客2代\_Augenstern-YaoYao的博客-CSDN博客](https://blog.csdn.net/wenquantongxin/category_12276185.html)

知乎上比较好的总结： [RLlib - 知乎](https://www.zhihu.com/column/c_1149284104754323456)[^2]
# Answers

视频链接： [【学术向】超强的强化学习系统怎么实现？Ray是啥？tune和rllib又是什么？\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1VE411w73P/?spm_id_from=333.337.search-card.all.click&vd_source=6c33cf6826337aad387874b66413aa72)[^1]
Ray:
1. 进程并行：`remote`
2. 进程通信：`ray.get()` 

Tune:调参的工具

RLlib：提供强化学习的抽象
1. Trainer、Policy、Agent
   ![[Pasted image 20250115212736.png]]
   Policy主要帮助实现：`loss_fn`,` postprocess_fn(e.x. gae)`, `model`
   Trainer主要: 定义policy名字， optimizer

```ad-summary
设置一个强化学习算法： 三步
1. 定义 loss_fn
2. 定义 postprocess_fn
3. 定义 optimizer
```

训练：
1. 采样(`worker.sample()`、`ray.get()`、`concat_samples` 
2. Policy更新
3. `ray.put`、`weights` 同步权重



## 相关概念

### **RLlib 训练核心概念整理**  

RLlib 提供了一系列工具，用于抽象化 RL 训练中的常见任务。特别是，如果你想使用各种 `training_step` 方法或实现自己的方法，建议首先熟悉以下概念：  

---

### **样本批次（Sample Batch）**  
`SampleBatch` 和 `MultiAgentBatch` 是我们用于在 RLlib 中存储轨迹数据的两种类型。我们所有的 RLlib 抽象（策略、重放缓冲区等）都操作这两种类型。  

---

### **Rollout Workers（采样执行器）**  
Rollout workers 是一个封装了**策略**（或多智能体情况下的多个策略）和**环境**的抽象。从高层次来看，我们可以通过调用它们的 `sample()` 方法从环境中收集经验，并通过调用它们的 `learn_on_batch()` 方法来训练它们的策略。  

默认情况下，在 RLlib 中，我们创建一组可以用于采样和训练的 `workers`。在 `setup` 过程中，我们会创建一个 `EnvRunnerGroup` 对象，当 RLlib 算法被创建时会调用这个 `setup`。  

- `EnvRunnerGroup` 包含：
  - `local_worker`（本地 worker）：通常用于**训练**。  
  - `remote_workers`（远程 worker）：通常用于**采样**（如果实验配置中的 `num_env_runners > 0`）。  

在 RLlib 中，我们通常使用 `local_worker` 进行训练，使用 `remote_workers` 进行采样。  

---

### **训练操作（Training Operations）**  
这些是改进策略和更新 `workers` 的方法。  

- **基本操作符**：`train_one_step`  
  - **作用**：接收一批经验作为输入，并输出包含指标的 `ResultDict`。  
- **GPU 训练**：`multi_gpu_train_one_step`  
  - **作用**：适用于 GPU 训练。  

这些方法使用回滚工作者的 `learn_on_batch` 方法来完成训练更新。  

---

### **重放缓冲区（Replay Buffers）**  
RLlib 提供了一系列**重放缓冲区**，可用于存储和采样经验。  

## GPT_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^2]: Rllib接单介绍知乎
[^1]: b站介绍Ray_Tune_RLlib