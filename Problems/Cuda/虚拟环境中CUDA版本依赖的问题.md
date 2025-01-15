---
创建时间: 2025-一月-14日  星期二, 5:02:20 下午
---
[[CUDA总结]]

# Sources

- [?] 虚拟环境中CUDA版本依赖的问题

关联：[[4090与CUDA不匹配]]
[[多版本CUDA_to_be_solved]]


预解决方案： GPT回答(在虚拟环境中安装CUDA)（大大减少操作复杂度，方便创建不同环境的工程） 或者 重新安装本机CUDA

# Solutions
1. 首先，CUDA版本与Python 3.7.11 对应 [[配置与重装_anaconda_python_torch_pycharm#Solution]]
   因此选择下载CUDA11.8以适配4090 与 3.7.11。
```ad-tip
在这里，不再使用本机配置CUDA与cudnn，conda虚拟环境配置torch和torchvision的方法。
>而是直接在conda虚拟环境（选择好python版本）中直接安装torch和torchtoolkit(我猜想这个就包含了cuda和cudnn)，因此只需一条指令即可 
>`conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia`
```



## Changes


## GPT_Answers


## Other_Answers


# FootNotes
