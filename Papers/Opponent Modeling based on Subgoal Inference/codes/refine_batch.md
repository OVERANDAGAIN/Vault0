---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-4日  星期二, 4:07:08 下午
---
[[omg_overall]]



# Codes/Questions

- [?] 关于batch由于 `refine_batch()` 发生维度改变


```python
        batch = self._refine_batch(batch)

```

原batch： 
![[Pasted image 20250304160811.png]]
![[Pasted image 20250304163808.png]]



无 group: `state` `reward` `terminated`                   `filled`
有 group: `obs` `actions` `avail_actions`             `actions_onehot` 
`infer_mu` `infer_log_var` 

- ==`agent_idx` 在`refine_batch()` 中不做处理==

 
`infer_mu` `infer_log_var` 的初始化： 
```python
scheme.update({
    "infer_mu": {"vshape": (8, 64), "dtype": th.float32, "group": "agents"},
    "infer_log_var": {"vshape": (8, 64), "dtype": th.float32, "group": "agents"}
})

```

# Answers

## Overall_Answers


## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
