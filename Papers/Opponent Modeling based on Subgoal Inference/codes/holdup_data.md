---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-27日  星期四, 12:46:31 下午
---
[[omg_overall]]



# Codes/Questions

- [?] 


```python

```


# Answers
## (8,64)

```python
   def update_holdup(self, ts=slice(None)):
        # self.update(self.holdup_data, ts)
        # 明确指定批次维度的默认值，并正确传递 ts
        self.update(self.holdup_data, ts=ts)
```


![[Pasted image 20250327124741.png]]



### (1,121,8,64)
![[Pasted image 20250327124945.png]]


## episode_barch

![[Pasted image 20250327125156.png]]


```bash
有信息的时间步（非零）共 1 个，索引如下：
[48]
无信息的时间步（全 0）共 120 个，索引如下：
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]

```


```python
 episode_batch = runner.run(test_mode=False)
            infer_mu = episode_batch['infer_mu']
            # 去掉 batch 维（如果是1），得到 [121, 8, 64]
            infer_mu = infer_mu[0]

            # 对每个时间步 t，判断是否全为0
            # nonzero_mask = th.any(infer_mu != 0, dim=(1, 2))  # shape: [121]
            nonzero_mask = (infer_mu != 0).any(dim=2).any(dim=1)
            # 输出哪些时间步是非零的
            # nonzero_steps = th.nonzero(nonzero_mask).squeeze().tolist()
            # zero_steps = th.nonzero(~nonzero_mask).squeeze().tolist()
            # nonzero_steps = to_list(th.nonzero(nonzero_mask).squeeze())
            # zero_steps = to_list(th.nonzero(~nonzero_mask).squeeze())
            nonzero_steps = th.nonzero(nonzero_mask).view(-1).tolist()
            zero_steps = th.nonzero(~nonzero_mask).view(-1).tolist()

            print(f"有信息的时间步（非零）共 {len(nonzero_steps)} 个，索引如下：\n{nonzero_steps}")
            print(f"无信息的时间步（全 0）共 {len(zero_steps)} 个，索引如下：\n{zero_steps}")
```










## Overall_Answers


## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
