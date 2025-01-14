---
创建时间: 2025-一月-13日  星期一, 9:18:18 晚上
---
#problems 


# Sources

- [?] anaconda_python_torch_pycharm配置

- [?] 安装了torch之后显示仍然 `torch.is_available() = false ` （安装的是cpu版本的pytorch，只有200MB左右， GPU版的才有1G左右）
![[Pasted image 20250114100814.png]]

# Errors
```bash

```

# Codes

```python

```

# Solutions

## 1_Answers

视频方法：

[2024最新cuda、cudnn、anaconda、pycharm安装教程——深度学习环境配置【附：安装包】\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1WYvKeMELZ/?spm_id_from=333.788.videopod.sections&vd_source=6c33cf6826337aad387874b66413aa72)


[手把手系列第一期-手把手带你跑通代码-创建conda环境-pycharm加载环境--以Informer举例-调参数-换数据集-文件结构目录\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1hZquY1E2p/?spm_id_from=333.337.search-card.all.click&vd_source=6c33cf6826337aad387874b66413aa72)


![[Pasted image 20250113211833.png]]

### 具体操作

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



## 2_Answers

输入 `conda list` 后，发现pytorch是以 cpu 结尾的。说明安装的不是GPU版本的。

原因ref: [2024.12.1最新解决torch.cuda.is\_available()返回false方法建议\_cuda is available命令-CSDN博客](https://blog.csdn.net/weixin_55010329/article/details/144176801?spm=1001.2014.3001.5506)[^2]
```ad-seealso
会出现false，实际有俩个问题：

1. 官网下载的win版pytorch，选择是cuda11.8，12.1，12.4，这三个版本指的是pytorch它要运行的最低的cuda版本。实际在安装完nvidia某版本驱动后，就已经指定了你cuda的版本，cmd打开控制台使用NVIDIA-smi查看。然而，能看到cuda版本，不是说你已经安装了cuda，怎么安装看后文链接。

2. 官网用conda下载pytorch完成后，它（官网）让你觉得你下载的就是gpu对应的pytorch，实际跟着土堆之前的视频安装的大多是**cpu对应的pytorch**。这时候你打开anaconda prompt，输入conda activate pytorch进入pytorch环境，然后再输入conda list，看pytorch后的build channel 是不是**py3.6_cpu（带有这个cpu字眼的**）。如果是，那你安装的就是cpu对应的pytorch。怎么**安装gpu对应的pytorch**，看后文链接。
   >（而且通过下载的pytorch的大小也可用看出，翻到前面用官网那条指令下载pytorch之后输出的结果，里面有写pytorch大小，200M多点的就是cpu版本，1G多的才是gpu版本，且conda list后显示应该是有带cuda字眼的）
```

### Solution
1. maybe: `python` 和 `torch` 版本之间有依赖关系。`torch` 与 `cuda` 版本之间也有依赖关系。

ref: [torch 与 torchvision 版本选择](https://www.aleshu.com/richcontent-detail/?postAlias=6e3b4f25bd5eaf89026876ddc01a1875&groupAlias=cd4504785c88097900ce5d45aa5d1369)[^3]

![[Pasted image 20250114110416.png]]


![[Pasted image 20250114110432.png]]

对于 `python 3.7.11` 安装 1.13.1 以下的 `torch` ，以及与 `torch` 对应的 `cuda` 版本。

>        若输出结果为False的话，就代表引起报错的原因是torch与CUDA的版本不兼容。



2. 重新安装对应的cuda版本
cuda10.2


# FootNotes

[^1]: to be solved 关于anaconda创建虚拟环境的位置问题
[^2]: 原因解析
[^3]: 网页说明三者版本之间的对应关系