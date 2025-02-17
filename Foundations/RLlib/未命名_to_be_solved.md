---
创建时间: 2025-一月-15日  星期三, 9:07:56 晚上
created: 2025-01-15T21:07
updated: 2025-02-06T14
---
[[RLlib]]
#to_be_solved 
# Questions

- [?] 
[0065.强化学习框架RLlib介绍 - 随笔分类 - 黎明程序员 - 博客园](https://www.cnblogs.com/itmorn/category/1857609.html)
[Ray客2代\_Augenstern-YaoYao的博客-CSDN博客](https://blog.csdn.net/wenquantongxin/category_12276185.html)
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







## GPT_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: b站介绍Ray_Tune_RLlib