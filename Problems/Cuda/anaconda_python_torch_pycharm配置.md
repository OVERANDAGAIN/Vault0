---
创建时间: 2025-一月-13日  星期一, 9:18:18 晚上
---
#problems 


# Sources

- [?] anaconda_python_torch_pycharm配置


# Errors
```bash

```

# Codes

```python

```

# Solutions

视频方法：

[2024最新cuda、cudnn、anaconda、pycharm安装教程——深度学习环境配置【附：安装包】\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1WYvKeMELZ/?spm_id_from=333.788.videopod.sections&vd_source=6c33cf6826337aad387874b66413aa72)


[手把手系列第一期-手把手带你跑通代码-创建conda环境-pycharm加载环境--以Informer举例-调参数-换数据集-文件结构目录\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1hZquY1E2p/?spm_id_from=333.337.search-card.all.click&vd_source=6c33cf6826337aad387874b66413aa72)


![[Pasted image 20250113211833.png]]

## Changes

管理员下的命令提示符（不是powershell) 或者是 anaconda Prompt
````ad-caution
在**管理员**下的**命令提示符**中，需要进行初始化。
![[Pasted image 20250113222958.png]]

然而，在anaconda prompt中直接conda create 时，创建的环境是在C盘下的。而不是在 D:\anaconda\envs\HOP 下的，因此 这里是一个问题
![[Pasted image 20250113223535.png]]
````

如何创建虚拟环境使其在指定位置 $\Longrightarrow$ 如D:\anaconda\envs\HOP 中，而不是C盘中的 .conda? 因为使用anaconda prompt会出现这种问题。[^1]
#to_be_solved

1. `conda create` 创建环境 `python=` 指定 `python` 版本
   
![[Pasted image 20250113215510.png]]

2. `conda activate` 激活环境
   
![[Pasted image 20250113215532.png]]

3. 在激活的环境中安装 `torch` （去 `torch` 官网中查看相应版本的安装指令）与测试。

![[Pasted image 20250113215606.png]]
![[Pasted image 20250113215624.png]]


## GPT_Answers


## Other_Answers


# FootNotes

[^1]: to be solved 关于anaconda创建虚拟环境的位置问题