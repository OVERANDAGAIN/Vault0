---
创建时间: 2025-一月-13日  星期一, 8:23:09 晚上
created: 2025-01-13T20:23
updated: ...
---
[[CUDA总结]]

# Sources

- [?] 下面是运行HOP代码时遇到的问题（windows环境）
==cuda环境配置未成功==，首先需要完成 `conda` 相关环境的配置，见： [[配置与重装_anaconda_python_torch_pycharm]][^2]

# Errors
```bash
D:\anaconda\envs\HOP\python.exe F:\HOP\msg_code\train.py 
2025-01-13 19:05:30,342	WARNING deprecation.py:46 -- DeprecationWarning: ray.rllib.utils.torch_ops.[...] has been deprecated. Use ray.rllib.utils.torch_utils.[...] instead. This will raise an error in the future!
2025-01-13 19:05:35,714	INFO services.py:1340 -- View the Ray dashboard at http://127.0.0.1:8265
2025-01-13 19:05:45,503	WARNING logger.py:326 -- Could not instantiate JsonLogger: Circular reference detected.
2025-01-13 19:05:45,527	INFO trainer.py:745 -- Current log_level is WARN. For more information, set 'log_level': 'INFO' / 'DEBUG' or use the -v and -vv flags.
Traceback (most recent call last):
  File "F:\HOP\msg_code\train.py", line 257, in <module>
    a3c_trainer = a3c.A3CTrainer(a3c_config)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 103, in __init__
    remote_checkpoint_dir, sync_function_tpl)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 662, in __init__
    sync_function_tpl)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\tune\trainable.py", line 121, in __init__
    self.setup(copy.deepcopy(self.config))
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 113, in setup
    super().setup(config)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 764, in setup
    self._init(self.config, self.env_creator)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer_template.py", line 141, in _init
    num_workers=self.config["num_workers"])
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\agents\trainer.py", line 1733, in _make_workers
    logdir=self.logdir)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\worker_set.py", line 118, in __init__
    spaces=spaces,
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\worker_set.py", line 489, in _make_worker
    spaces=spaces,
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\rollout_worker.py", line 575, in __init__
    HOWTO_CHANGE_CONFIG)
RuntimeError: Found 0 GPUs on your machine (GPU devices found: [])! If your machine
    does not have any GPUs, you should set the config keys num_gpus and
    num_gpus_per_worker to 0 (they may be set to 1 by default for your
    particular RL algorithm).
To change the config for the rllib train|rollout command, use
  --config={'[key]': '[value]'} on the command line.
To change the config for tune.run() in a script: Modify the python dict
  passed to tune.run(config=[...]).
To change the config for an RLlib Trainer instance: Modify the python dict
  passed to the Trainer's constructor, e.g. PPOTrainer(config=[...]).
```

# Codes

```python

```

# Solutions
参考视频：[^1][2024最新cuda与cudnn安装教程【深度学习环境配置 \| 安装包】\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV116eBefETi/?spm_id_from=333.337.search-card.all.click&vd_source=6c33cf6826337aad387874b66413aa72)
## 事前准备：
`nvidai-smi` 看到最高限制cuda版本为12.7。 官网上最高可以下载12.6的版本（向下兼容）。
![[Pasted image 20250113203959.png]]
## 具体操作
1. 安装cuda-tookit
   网址： [CUDA Toolkit - Free Tools and Training \| NVIDIA Developer](https://developer.nvidia.com/cuda-toolkit)
   [CUDA Toolkit Archive \| NVIDIA Developer](https://developer.nvidia.com/cuda-toolkit-archive)
   安装的这个12.6（4090）
```ad-caution
后续由于cuda torch python 三者版本匹配的问题重新卸载安装了
```
   
 ```ad-help
期间可能出现visual studio相关报错提示：
- 从报错信息提供的链接直接下载visual studio(b站视频提供的解决方案)
- 在csdn等处进行一系列操作（在具体安装哪些包时，取消勾选有关选项，最终也可安装成功）
```

![[Pasted image 20250113203243.png]]
```bash
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.6\bin
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v12.6\libnvvp
```
安装完成后，保存在这两个路径里面（同时系统变量 `PATH` 自动生成这两个路径的引用。
2. 安装cudnn
   网址： [cuDNN Archive \| NVIDIA Developer](https://developer.nvidia.com/rdp/cudnn-archive)
   安装的是这个（4090时）
![[Pasted image 20250113203041.png]]

3. 把`cudnn`解压并剪切到 `cuda-toolkit` 目录中（这里把文件名改成了`cudnn`
   ![[Pasted image 20250113203457.png]]
4. 测试（使用 `cuda-toolkit` 自带的测试程序）
   ![[Pasted image 20250113203607.png]]
   ![[Pasted image 20250113203622.png]]
两个都出现 `pass` 说明成功！
![[Pasted image 20250113203744.png]]
![[Pasted image 20250113203710.png]]

# TESTS
## 代码 `tst` 测试（在配置完 `conda` 环境后，否则仍然检测不到GPU）（环境版本为随便配置的，并非HOP的依赖环境）
1. 测试1
```python
import ray
ray.init()
print(ray.available_resources())  # 查看资源信息
```

```bash
D:\anaconda\envs\HOP\python.exe F:\HOP\msg_code\tst.py 
2025-01-13 20:22:07,344	INFO services.py:1340 -- View the Ray dashboard at http://127.0.0.1:8265
{'memory': 26319519744.0, 'object_store_memory': 13159759872.0, 'CPU': 32.0, 'node:127.0.0.1': 1.0, 'GPU': 1.0}

进程已结束，退出代码为 0

```

2. 测试2
```python
import torch

print("PyTorch CUDA available:", torch.cuda.is_available())  # 检查 CUDA 是否可用
if torch.cuda.is_available():
    print("GPU Name:", torch.cuda.get_device_name(0))  # 显示第一个 GPU 的名称
    print("CUDA Version:", torch.version.cuda)  # 检查 CUDA 版本
    print("PyTorch Version:", torch.__version__)  # 检查 PyTorch 版本
```

```bash
D:\anaconda\envs\pytorchtst\python.exe F:\HOP\msg_code\tst.py 
PyTorch CUDA available: True
GPU Name: NVIDIA GeForce RTX 4090
CUDA Version: 12.4
PyTorch Version: 2.5.1

```

3. 测试3
```python
import torch

print("PyTorch detected GPU count:", torch.cuda.device_count())  # 显示 GPU 数量
for i in range(torch.cuda.device_count()):
    print(f"GPU {i}: {torch.cuda.get_device_name(i)}")
```

```bash
D:\anaconda\envs\pytorchtst\python.exe F:\HOP\msg_code\tst.py 
PyTorch detected GPU count: 1
GPU 0: NVIDIA GeForce RTX 4090

进程已结束，退出代码为 0
```


## GPT_Answers


## Other_Answers


# FootNotes

[^2]: 安装conda相关环境
[^1]: 参考b站的cuda环境配置视频