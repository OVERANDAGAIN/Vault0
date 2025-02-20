---
created: 2025-02-17T15:50
updated: ...
创建时间: 2025-二月-17日  星期一, 3:50:43 下午
---
[[HOP+]]


# Issues & Debugging

## Problem1: 
- [?] 

### 1_Answers 训练时infer_mu
`episode_buffer` 中关于 `infer_mu` 和 `infer_log_var` 的两处：
- 字典中定义
- `update_holdup` 函数修改

### 2_Answers 预训练时size不匹配
```bash
Traceback (most recent calls WITHOUT Sacred internals):
  File "main.py", line 40, in my_main
    run(_run, config, _log)
  File "/home/dy/Desktop/OMG/run.py", line 49, in run
    run_sequential(args=args, logger=logger)
  File "/home/dy/Desktop/OMG/run.py", line 212, in run_sequential
    learner.train(episode_sample, runner.t_env, episode)
  File "/home/dy/Desktop/OMG/learners/am_learner.py", line 27, in train
    loss = self.am_model.loss_func(batch)
  File "/home/dy/Desktop/OMG/modules/am/omg_am.py", line 405, in loss_func
    recons_loss, kld_loss = self.vae.loss_func(inputs, mask)
  File "/home/dy/Desktop/OMG/modules/am/omg_am.py", line 101, in loss_func
    recon_loss = F.mse_loss(inputs * mask, recons * mask)
RuntimeError: The size of tensor a (2112) must match the size of tensor b (16896) at non-singleton dimension 0



```




## Problem2: 
- [?] 

### 1_Answers


### 2_Answers



# Limitations
# Future Work
# FootNotes