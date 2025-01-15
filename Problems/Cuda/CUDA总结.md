---
创建时间: 2025-一月-14日  星期二, 12:42:59 下午
---
#problems 

# Sources

- [?] 


# Solutions
1. ~~安装CUDA 10.2 ( python3.7.11 )（可以在应用-程序里卸载旧的cuda相关程序)，以及 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA` 可以卸载后在手动删除残余文件夹~~
2. ~~安装**cudnn 8.5.0 for CUDA 10.2**,解压后把文件拷贝到cuda目录(可直接改名为cudnn以简化)~~
1. 安装CUDA 11.8 ( python3.7.11 )（可以在应用-程序里卸载旧的cuda相关程序)，以及 `C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA` 可以卸载后在手动删除残余文件夹
   `nvcc --version` 查看CUDA版本
2. 安装**cudnn 8.9.7 for CUDA 11.X**,解压后把文件拷贝到cuda目录(可直接改名为cudnn以简化)
3. 安装anaconda,pycharm,python等。
4. 管理员下的命令提示符在 `conda init cmd.exe` 之后可进行虚拟环境创建，使用把torch和torchvision包下载到本地再pip安装的过程。
   
   ~~1.10.1的torch + 0.11.2的torchvision + 10.2的CUDA + 3.7.11的python~~
   ==1.10.1的torch== + ==0.11.2的torchvision== + ==11.8的CUDA== + ==3.7.11的python==

>具体在安装项目环境时，是否可以直接一步代码到位？？？无需再本地下载CUDA，再在虚拟环境中安装torch

## Changes


## GPT_Answers


## Other_Answers


# FootNotes
