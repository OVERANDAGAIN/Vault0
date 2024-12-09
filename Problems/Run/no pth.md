
# Sources
HOP

# Errors
```bash
D:\anaconda\envs\HOP\python.exe E:\HOP\msg_code\train.py 
2024-12-09 11:15:42,481	WARNING deprecation.py:46 -- DeprecationWarning: `ray.rllib.utils.torch_ops.[...]` has been deprecated. Use `ray.rllib.utils.torch_utils.[...]` instead. This will raise an error in the future!
2024-12-09 11:15:51,572	INFO services.py:1340 -- View the Ray dashboard at http://127.0.0.1:8265
2024-12-09 11:16:02,339	WARNING logger.py:326 -- Could not instantiate JsonLogger: Circular reference detected.
2024-12-09 11:16:02,384	INFO trainer.py:745 -- Current log_level is WARN. For more information, set 'log_level': 'INFO' / 'DEBUG' or use the -v and -vv flags.
2024-12-09 11:16:02,644	WARNING catalog.py:545 -- Custom ModelV2 should accept all custom options as **kwargs, instead of expecting them in config['custom_model_config']!
Traceback (most recent call last):
  File "E:\HOP\msg_code\train.py", line 250, in <module>
    a3c_trainer=a3c.A3CTrainer(a3c_config)
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
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\rollout_worker.py", line 591, in __init__
    seed=seed)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\evaluation\rollout_worker.py", line 1552, in _build_policy_map
    conf, merged_conf)
  File "D:\anaconda\envs\HOP\lib\site-packages\ray\rllib\policy\policy_map.py", line 144, in create_policy
    merged_config)
  File "E:\HOP\msg_code\algorithm\Alpha_Zero_MOA_relative.py", line 161, in __init__
    TorchCategorical,
  File "E:\HOP\msg_code\policy\ToM_relative.py", line 80, in __init__
    self.model_list[i].load_state_dict(torch.load(config['moa_config']['load_dir']+f'/player_{self.my_id}_to_{self.model_id_list[i]+1}.pth'))
  File "D:\anaconda\envs\HOP\lib\site-packages\torch\serialization.py", line 771, in load
    with _open_file_like(f, 'rb') as opened_file:
  File "D:\anaconda\envs\HOP\lib\site-packages\torch\serialization.py", line 270, in _open_file_like
    return _open_file(name_or_buffer, mode)
  File "D:\anaconda\envs\HOP\lib\site-packages\torch\serialization.py", line 251, in __init__
    super(_open_file, self).__init__(open(name, mode))
FileNotFoundError: [Errno 2] No such file or directory: './params/exp20230119_004042_4p/player_1_to_2.pth'

进程已结束，退出代码为 1

```

# Codes
E:\HOP\msg_code\policy\ToM_relative.py
```python
if config['moa_config']['load_dir'] is not None:  
    for i in range(self.player_num-1):  
        self.model_list[i].load_state_dict(torch.load(config['moa_config']['load_dir']+f'/player_{self.my_id}_to_{self.model_id_list[i]+1}.pth'))
```

E:\HOP\msg_code\train.py
```python
config['moa_config']={  
    'moa_batch_size':512,  
    'moa_update_time':15,  
    'moa_buffer_capacity':1000,  
    'shovel_buffer_capacity':100,  
    #'load_dir':None,  
    'load_dir':'./params/exp20230119_004042_4p',  
    'save_dir':f'./params/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p'  
}
```

E:\HOP\msg_code\train.py
```python
config['lola_config']={  
    'moa_batch_size':128,  
    'moa_update_time':15,  
    'buffer_capacity':200,  
    'lr':2e-4,  
    'gamma': 0.99,  
    'id': 1,  
    'env_creator':env_creator,  
    'env_num':25,  
    # 'load_dir':None,  
    'load_dir':'./params/lola/exp20230123_185154_4p',  
    'save_dir':f'./params/lola/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p',  
    'train':False,  
}
```

# Solutions
![[Pasted image 20241209114444.png]]

据你上传的图片，这些可能是训练过程中生成的实验文件夹。文件夹的命名格式如 `exp20241209_xxxxxx_4p`，可能包含训练过程中保存的模型文件等。

结合之前的问题，当前 `ToM_relative.py` 的代码尝试加载的路径为：

```plaintext
./params/exp20230119_004042_4p/player_1_to_2.pth
```

但你的实际路径已经发生变化，生成的文件夹是：

- `exp20241209_110515_4p`
- `exp20241209_111213_4p`
- `exp20241209_111602_4p`

## change
```python
config['moa_config']={  
    'moa_batch_size':512,  
    'moa_update_time':15,  
    'moa_buffer_capacity':1000,  
    'shovel_buffer_capacity':100,  
    'load_dir':None,  
    ###'load_dir':'./params/exp20230119_004042_4p',  
    'save_dir':f'./params/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p'  
}  
os.makedirs(config['moa_config']['save_dir'])
```

```python
config['lola_config']={  
    'moa_batch_size':128,  
    'moa_update_time':15,  
    'buffer_capacity':200,  
    'lr':2e-4,  
    'gamma': 0.99,  
    'id': 1,  
    'env_creator':env_creator,  
    'env_num':25,  
    'load_dir':None,  
    ###'load_dir':'./params/lola/exp20230123_185154_4p',  
    'save_dir':f'./params/lola/exp{time.strftime("%Y%m%d_%H%M%S")}_{config["env_config"]["player_num"]}p',  
    'train':False,  
}  
os.makedirs(config['lola_config']['save_dir'])
```

### GPT_解决方法

1. **检查生成路径与配置是否一致**： 确保训练过程中生成的模型文件路径，与加载模型时的路径一致。如果生成的文件夹名称是动态的（时间戳），你需要调整代码中 `config['moa_config']['load_dir']` 的配置。
    
2. **设置路径为最新的文件夹**： 修改 `ToM_relative.py` 中的加载逻辑，将路径指向最新的文件夹。例如：
    
    ```python
    config['moa_config']['load_dir'] = './params/exp20241209_110515_4p'
    ```
    
    这样，代码会从 `exp20241209_110515_4p` 文件夹中加载模型。
    
3. **动态加载最近的文件夹**： 如果需要自动加载最新的文件夹，可以在代码中实现逻辑找到最新的实验文件夹：
    
    ```python
    import os
    
    # 找到最新的文件夹
    base_dir = './params'
    latest_dir = max([os.path.join(base_dir, d) for d in os.listdir(base_dir) if d.startswith('exp')], key=os.path.getmtime)
    config['moa_config']['load_dir'] = latest_dir
    ```
    
4. **确认生成文件是否完整**：
    
    - 打开生成的文件夹，检查是否有文件如 `player_1_to_2.pth`。如果文件名不同，则需要在 `ToM_relative.py` 中同步修改文件名规则。
    - 如果文件不存在，请检查训练逻辑是否正确保存了模型。
5. **运行测试**： 修改路径后，重新运行 `train.py`，观察是否能成功加载模型文件。
    

如果以上方法仍未解决问题，可以进一步提供 `train.py` 和 `ToM_relative.py` 的关键代码片段，我会帮助你详细排查问题。