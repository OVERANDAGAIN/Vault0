---
created: 2024-12-18T20
updated: ...
创建时间: 2025-二月-26日  星期三, 5:41:45 下午
---
[[omg_overall]]



# Codes/Questions

- [?] 


```python

```


# Answers



## Overall_Answers


#### 关于am_model的注册
1. `args.am_model` 只会在 `am_leaner` 中使用
2. `alg_args.am_model` 在 `om_controller` 中使用

`loss_func` 
1. 只 `base_am` 和 `omg_am` 中被定义
2. 只在 `am_learner` 中被调用
3.  `omg_learner` 中使用的是 `omg_loss_func` 


- `omg_am` 中的 `loss_func` 才是关于 `VAE` 的逻辑
- `base_am` 中则不是


>关于预训练：
>设置 `am_model` 为 `omg_am` 。以使用它的 `loss_func` 
>使用 `am_leaner` 以调用 `loss_func`

#### 关于learner的注册
使用 `args.leaner` 去选择


#### runner和controller暂时没有绝对影响
## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
