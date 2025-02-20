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


- 当obs_is_state=true时，state的形状是32，89，168
- 而当obs_is_state=false时，他是32，89，8，80（其中的8表示8个agent）

````ad-seealso
在 StarCraft Multi-Agent Challenge（SMAC）环境中，`obs`（观测）和 `state`（状态）分别表示智能体的局部观测信息和全局状态信息。具体而言，`obs` 提供每个智能体在其视野范围内感知到的局部信息，而 `state` 则包含整个环境的全局信息。

在你的描述中，`obs` 的形状为 `[32, 89, 8, 80]`，而 `state` 的形状为 `[32, 89, 168]`。这里的维度含义如下：

- **32**：表示批次大小（batch size），即同时处理的游戏局数量。
- **89**：表示每个游戏局的时间步数（time steps）。
- **8**：表示智能体的数量。
- **80**：表示每个智能体的观测向量长度，即每个智能体的观测特征维度。
- **168**：表示全局状态向量的长度，即整个环境的状态特征维度。

因此，`obs` 的形状 `[32, 89, 8, 80]` 表示在每个时间步，每个智能体都有一个长度为 80 的观测向量。而 `state` 的形状 `[32, 89, 168]` 则表示在每个时间步，整个环境有一个长度为 168 的全局状态向量。

需要注意的是，`obs` 和 `state` 的维度差异主要在于：`obs` 是针对每个智能体的局部观测，因此多了一个智能体数量的维度（即第 3 个维度为 8）；而 `state` 是整个环境的全局状态，对所有智能体共享，因此没有智能体数量的维度。

在 SMAC 环境中，智能体的观测信息通常包括其视野范围内的敌方单位、友方单位以及自身的状态等。全局状态则包含整个地图上所有单位和环境的完整信息。由于全局状态涵盖的信息更全面，其特征维度（如 168）通常大于单个智能体的观测特征维度（如 80）。

因此，`obs` 和 `state` 的维度差异反映了局部观测与全局状态之间的信息量和范围的不同。 
````

# Limitations
# Future Work
# FootNotes