---
created: 2025-02-17T15:50
updated: ...
创建时间: 2025-二月-17日  星期一, 3:50:43 下午
---
[[HOP+]]


# Issues & Debugging

## Problem1: 
- [?] 

## 1_Answers 训练时infer_mu
`episode_buffer` 中关于 `infer_mu` 和 `infer_log_var` 的两处：
- 字典中定义
- `update_holdup` 函数修改

## 2_Answers 预训练时size不匹配
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

修改 `build_vae_inputs` 时 `obs_is_state == True`  时 `obs` 没有 `n_agents` 维度，因此会与 `mask` 不一致。修改如下：

```python
    ### solve the n_agents problem
    def _build_vae_inputs(self, batch):
        if self.args.obs_is_state:
            obs = batch["state"][:, :-1]
        else:
            obs = batch["obs"][:, :-1]

        # print(f"[DEBUG] Raw obs shape: {obs.shape}")

        # 扩展 obs 为 [batch_size, max_t, n_agents, state_dim]，保持与 n_agents 一致
        if self.args.obs_is_state:
            if len(obs.shape) == 3:  # 形状为 [batch_size, max_t, state_dim]
                obs = obs.unsqueeze(2).repeat(1, 1, self.n_agents, 1)  # 扩展为 [batch_size, max_t, n_agents, state_dim]
        # print(f"[DEBUG] Expanded obs shape (if needed): {obs.shape}")

        # 处理 mask
        terminated = batch["terminated"][:, :-1].float()
        mask = batch["filled"][:, :-1].float()
        mask[:, 1:] = mask[:, 1:] * (1 - terminated[:, :-1])

        # 扩展 mask 为 [batch_size, max_t, n_agents, 1]
        mask = mask.unsqueeze(2).repeat(1, 1, self.n_agents, 1)
        # mask = mask.unsqueeze(2).repeat(1, 1, 1)

        # print(f"[DEBUG] Mask shape after expansion: {mask.shape}")

        # 重新展平 obs 和 mask
        reshaped_obs = obs.reshape(-1, obs.shape[-1])  # [batch_size * max_t * n_agents, state_dim]
        reshaped_mask = mask.reshape(-1, 1)  # [batch_size * max_t * n_agents, 1]

        # print(f"[DEBUG] Reshaped obs shape: {reshaped_obs.shape}")
        # print(f"[DEBUG] Reshaped mask shape: {reshaped_mask.shape}")

        return reshaped_obs, reshaped_mask

```


## Problem2: obs_is_state 引发的 obs 与 state 维度不匹配
- [?] 
```bash
根据我刚才发给你的代码，你认为下面的80，168不匹配的问题最有可能出现在哪里？？？？其中，input_shape=80   ;a        self._hidden_dim = 128
        self._subgoal_dim = 64
        self.output_type = "embedding"

        # Set up network layers
        self.fc = nn.Linear(fc_input, self._hidden_dim // 4)
        self.cond_rnn = RNN(cond_input, self._hidden_dim // 4 * 3).....Traceback (most recent calls WITHOUT Sacred internals):
  File "main.py", line 40, in my_main
    run(_run, config, _log)
  File "/home/dy/Desktop/OMG/run.py", line 49, in run
    run_sequential(args=args, logger=logger)
  File "/home/dy/Desktop/OMG/run.py", line 135, in run_sequential
    learner.load_models(init_param_path)
  File "/home/dy/Desktop/OMG/learners/omg_learner.py", line 147, in load_models
    self.mac.load_models(path)
  File "/home/dy/Desktop/OMG/controllers/om_controller.py", line 92, in load_models
    am.load_models(os.path.join(path, alg))
  File "/home/dy/Desktop/OMG/modules/am/omg_am.py", line 466, in load_models
    self.vae.load_state_dict(th.load("{}/vae.th".format(path), map_location=lambda storage, loc: storage))
  File "/home/dy/anaconda3/envs/myenv/lib/python3.8/site-packages/torch/nn/modules/module.py", line 2041, in load_state_dict
    raise RuntimeError('Error(s) in loading state_dict for {}:\n\t{}'.format(
RuntimeError: Error(s) in loading state_dict for VanillaVAE:
        size mismatch for encoder.0.0.weight: copying a param with shape torch.Size([128, 168]) from checkpoint, the shape in current model is torch.Size([128, 80]).
        size mismatch for decoder_output.weight: copying a param with shape torch.Size([168, 128]) from checkpoint, the shape in current model is torch.Size([80, 128]).
        size mismatch for decoder_output.bias: copying a param with shape torch.Size([168]) from checkpoint, the shape in current model is torch.Size([80]).
```

具体如下 168 与 80  的差异
![[Pasted image 20250220175653.png]]





# Limitations
# Future Work
# FootNotes