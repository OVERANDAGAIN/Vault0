---
created: 2024-12-18T20:35
updated: 2025-01-14T17
---
[[HOP初运行]]
# Sources
HOP

# Errors
```bash
D:\anaconda\envs\HOP\python.exe E:\HOP\msg_code\train.py 2024-12-09 11:04:52,944 WARNING deprecation.py:46 -- DeprecationWarning: `ray.rllib.utils.torch_ops.[...]` has been deprecated. Use `ray.rllib.utils.torch_utils.[...]` instead. This will raise an error in the future! 2024-12-09 11:05:03,887 INFO services.py:1340 -- View the Ray dashboard at http://127.0.0.1:8265 2024-12-09 11:05:15,989 WARNING logger.py:326 -- Could not instantiate JsonLogger: Circular reference detected. 2024-12-09 11:05:16,042 INFO trainer.py:745 -- Current log_level is WARN. For more information, set 'log_level': 'INFO' / 'DEBUG' or use the -v and -vv flags. Traceback (most recent call last): File "E:\HOP\msg_code\train.py", line 250, in <module> a3c_trainer=a3c.A3CTrainer(a3c_config) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 103, in __init__ remote_checkpoint_dir, sync_function_tpl) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 662, in __init__ sync_function_tpl) File "D:\anaconda\envs\HOP\lib\site-packages\ray\tune\trainable.py", line 121, in __init__ self.setup(copy.deepcopy(self.config)) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 113, in setup super().setup(config) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 764, in setup self._init(self.config, self.env_creator) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 141, in _init num_workers=self.config["num_workers"]) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 1733, in _make_workers logdir=self.logdir) File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\worker_set.py", line 118, in __init__ spaces=spaces, File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\worker_set.py", line 489, in _make_worker spaces=spaces, File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\rollout_worker.py", line 575, in __init__ HOWTO_CHANGE_CONFIG) RuntimeError: Found 0 GPUs on your machine (GPU devices found: [])! If your machine does not have any GPUs, you should set the config keys `num_gpus` and `num_gpus_per_worker` to 0 (they may be set to 1 by default for your particular RL algorithm). To change the config for the `rllib train|rollout` command, use `--config={'[key]': '[value]'}` on the command line. To change the config for `tune.run()` in a script: Modify the python dict passed to `tune.run(config=[...])`. To change the config for an RLlib Trainer instance: Modify the python dict passed to the Trainer's constructor, e.g. `PPOTrainer(config=[...])`.
```

# Codes
msg_code/train.py:62
```python
config['num_gpus']=1
```

# Solutions
## Changes
```python
a3c_config = {
    # 其他配置项...
    "num_gpus": 0,  # 设置为 0 表示不使用 GPU
    "num_gpus_per_worker": 0,  # 每个 worker 的 GPU 数设置为 0
    "num_workers": 1  # 设置 worker 数量为 1（根据你的需求调整）
}
```

## GPT_Answers
从上述日志中可以看出，报错是由于你的机器未检测到 GPU，而当前的配置中可能要求使用 GPU（`num_gpus` 或 `num_gpus_per_worker` 配置未设置为 0）。
### **关键问题**

1. **主要错误**：
    - **错误类型**：`RuntimeError`
    - **描述**：找不到 GPU 设备，但配置中可能要求至少有 1 个 GPU。
    - **解决方法**：
        - 如果你的机器没有 GPU，则需要显式设置 `num_gpus=0` 和 `num_gpus_per_worker=0`。
        - 如果你的机器有 GPU，但未正确检测到，需要检查 CUDA 驱动和 Ray 的 GPU 设置。

---
### **解决方法**

确保在 `a3c_config` 中明确指定 `num_gpus=0` 和 `num_gpus_per_worker=0`：

## Other_Answers