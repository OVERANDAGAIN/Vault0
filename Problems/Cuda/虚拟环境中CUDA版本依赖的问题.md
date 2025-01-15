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
   ~~因此选择下载CUDA11.8以适配4090 与 3.7.11。~~
   因此选择下载CUDA12.1以适配4090 与 3.7.11。（11.8也不适配，根据官网的指令自动下载了cpu的版本torch1.13.1。也许是由于显卡与python版本的问题）


`conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia`


```ad-tip
~~在这里，不再使用本机配置CUDA与cudnn，conda虚拟环境配置torch和torchvision的方法。~~
>而是直接在conda虚拟环境（选择好python版本）中直接安装torch和torchtoolkit(我猜想这个就包含了cuda和cudnn)，因此只需一条指令即可 
>~~`conda install pytorch torchvision torchaudio pytorch-cuda=11.8 -c pytorch -c nvidia`~~
`conda install pytorch torchvision torchaudio pytorch-cuda=12.1 -c pytorch -c nvidia`
>
```


```ad-caution
未进入虚拟环境就执行了上面的命令，GPT说会安装到base环境中？ 
>本机的CUDA环境确实没变，因此确实可能安装到了base默认环境里面去。
```

#to_be_solved 关于base环境包的安装-未进入虚拟环境就安装包的后果[^1]


```ad-failure
以上使用官网指令无一例外都下载的是cpu版本，很大可能是因为python版本的问题。
>如果一定使用python3.7.11，还是使用手动pip的方式。
```










## Changes


## GPT_Answers


## Other_Answers


# FootNotes

[^1]: 未进入虚拟环境就安装包会安装到base下？