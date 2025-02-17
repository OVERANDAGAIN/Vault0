---
创建时间: 2025-一月-14日  星期二, 12:42:59 下午
created: 2025-01-14T12:42
updated: ...
---
#problems 

# Sources

- [?] 


# Solutions
- ~~安装CUDA 10.2 ( python3.7.11 )（可以在应用-程序里卸载旧的cuda相关程序)，以及 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA` 可以卸载后在手动删除残余文件夹~~
- ~~安装**cudnn 8.5.0 for CUDA 10.2**,解压后把文件拷贝到cuda目录(可直接改名为cudnn以简化)~~
-  ~~安装CUDA 11.8 ( python3.7.11 )（可以在应用-程序里卸载旧的cuda相关程序)，以及 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA` 可以卸载后在手动删除残余文件夹~~
   - ~~`nvcc --version` 查看CUDA版本~~
- ~~安装**cudnn 8.9.7 for CUDA 11.X**,解压后把文件拷贝到cuda目录(可直接改名为cudnn以简化)~~
   
1. 安装CUDA 11.7 ( python3.7.11 )（可以在应用-程序里卸载旧的cuda相关程序)，以及 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA` 可以卸载后在手动删除残余文件夹
   `nvcc --version` 查看CUDA版本
2. 安装**cudnn 8.9.7 for CUDA 11.X**,解压后把文件拷贝到cuda目录(可直接改名为cudnn以简化)[^2]
```ad-summary
只要包里面有python与CUDA对应版本的包，就可以使用官方指令下载
>包地址：pip包安装地址[download.pytorch.org/whl/torch\_stable.html](https://download.pytorch.org/whl/torch_stable.html)
>
>`conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia`
>
>不一定必须用手动pip的方法
```
3. 安装anaconda,pycharm,python等。
4. 管理员下的命令提示符在 `conda init cmd.exe` 之后可进行虚拟环境创建，使用把torch和torchvision包下载到本地再pip安装的过程。
   
   ~~1.10.1的torch + 0.11.2的torchvision + 10.2的CUDA + 3.7.11的python~~
 ```ad-note
下为示范，4090 ,3.7.11 仍是11.7

   <u>==1.10.1的torch== + ==0.11.2的torchvision==</u> + ==11.8的CUDA== + ==3.7.11的python
   `Or:`
   <u>指令自动选择的torch与torchtoolkit版本</u> + ==11.8的CUDA== + ==3.7.11的python
```


`conda install pytorch torchvision torchaudio pytorch-cuda=11.7 -c pytorch -c nvidia`


>Q: 具体在安装项目环境时，是否可以直接一步代码到位？？？无需再本地下载CUDA，再在虚拟环境中安装torch

```ad-success
可以的，每个虚拟环境CUDA版本相互独立，与本机CUDA版本也独立
```

## Changes


## GPT_Answers


## Other_Answers


# FootNotes

[^2]: pip包地址