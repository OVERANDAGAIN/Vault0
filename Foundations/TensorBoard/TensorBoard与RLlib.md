---
created: 2024-12-20T16
updated: ...
创建时间: 2025-四月-16日  星期三, 4:56:09 下午
---
[[

# Questions

- [?] 注意到 RLlib 和 TensorBoard 都保存了类似下面的文件：


路径：`C:\Users\admin\ray_results\AlphaZeroTrainer_StagHunt_2025-04-11_10-31-42du7qshpn` 
![[Pasted image 20250416165716.png]]

合理猜想：可以直接查看这个文件的内容，RLlib直接集成了TensorBoard的功能
```python

```

# Answers

## GPT_Answers
查看方法：

### 未配置 `TensorBoard` 环境变量
`C:\Users\admin\ray_results\AlphaZeroTrainer_StagHunt_2025-04-11_10-31-42du7qshpn` 为 路径名

```bash
python -m tensorboard.main --logdir="C:\Users\admin\ray_results\AlphaZeroTrainer_StagHunt_2025-04-11_10-31-42du7qshpn"

```

### 配置了 `TensorBoard` 环境变量
```bash
tensorboard --logdir="C:\Users\admin\ray_results\AlphaZeroTrainer_StagHunt_2025-04-11_10-31-42du7qshpn"

```

## 结果展示
![[Pasted image 20250416170043.png]]

# Codes

```python

```


# FootNotes
