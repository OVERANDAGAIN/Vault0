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
1. maybe: `python` 和 `torch` 版本之间有依赖关系。`torch` 与 `cuda` 版本之间也有依赖关系。（使用后面提到的pip手动安装时还需要把 `torch` 和 `torchvision` 对应

ref: [torch 与 torchvision 版本选择](https://www.aleshu.com/richcontent-detail/?postAlias=6e3b4f25bd5eaf89026876ddc01a1875&groupAlias=cd4504785c88097900ce5d45aa5d1369)[^3]

| pytorch  | torchvision | python              | cuda                           |
| -------- | ----------- | ------------------- | ------------------------------ |
| 2.2.0    | 0.17.0      | >3.7                | 11.8,12.1                      |
| 2.1.0    | 0.16.0      | >3.7                | 11.8,12.1                      |
| 2.0.0    | >0.14       | >3.7                | 11.7,11.8                      |
| 1.12.0   | 0.12        | 3.7-3.9             | 10.2(==不支持windows==),11.3,11.6 |
| 1.11.0   | 0.12.0      | >=3.6               | 11.3,10.2                      |
| 1.10.0/1 | 0.11.0/2    | >=3.6               | 10.2,11.3                      |
| 1.9.0    | 0.10.0      | >=3.6               | 10.2,11.3                      |
| 1.8.0    | 0.9.0       | >=3.6               | 10.2,11.1                      |
| 1.7.1    | 0.8.2       | >=3.6               | 9.2, 10.1,10.2,11.0            |
| 1.7.0    | 0.8.0       | >=3.6               | 9.2, 10.1,10.2,11.0            |
| 1.6.0    | 0.7.0       | >=3.6               | 9.2, 10.1,10.2                 |
| 1.5.1    | 0.6.1       | >=3.6               | 9.2, 10.1,10.2                 |
| 1.5.0    | 0.6.0       | >=3.6               | 9.2, 10.1,10.2                 |
| 1.4.0    | 0.5.0       | ==2.7, >=3.5, <=3.8 | 9.2, 10.0                      |
| 1.3.1    | 0.4.2       | ==2.7, >=3.5, <=3.7 | 9.2, 10.0                      |
| 1.3.0    | 0.4.1       | ==2.7, >=3.5, <=3.7 | 9.2, 10.0                      |
| 1.2.0    | 0.4.0       | ==2.7, >=3.5, <=3.7 | 9.2, 10.0                      |
| 1.1.0    | 0.3.0       | ==2.7, >=3.5, <=3.7 | 9.0, 10.0                      |
| <1.0.1   | 0.2.2       | ==2.7, >=3.5, <=3.7 | 9.0, 10.0                      |


![[Pasted image 20250114110432.png]]

对于 `python 3.7.11` 安装 1.13.1 以下的 `torch` ，以及与 `torch` 对应的 `cuda` 版本。

>        若输出结果为False的话，就代表引起报错的原因是torch与CUDA的版本不兼容。



2. 重新安装对应的cuda版本
cuda10.2
重新安装参考视频： [Windows 下 CUDA, cudnn, Pytoch 卸载、更新、安装\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1Xb4y1c7E1/?spm_id_from=333.788.top_right_bar_window_history.content.click&vd_source=6c33cf6826337aad387874b66413aa72)[^4]
````ad-caution

安装torch 1.12.1时，官网的命令
```bash
# CUDA 10.2
conda install pytorch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 cudatoolkit=10.2 -c pytorch
# CUDA 11.3
conda install pytorch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 cudatoolkit=11.3 -c pytorch
# CUDA 11.6
conda install pytorch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 cudatoolkit=11.6 -c pytorch -c conda-forge
# CPU Only
conda install pytorch==1.12.1 torchvision==0.13.1 torchaudio==0.12.1 cpuonly -c pytorch
```

仍然是cpu的版本：
```bash

The following packages will be downloaded:

    package                    |            build
    ---------------------------|-----------------
    cudatoolkit-10.2.89        |       h74a9793_1       317.2 MB
    pytorch-1.12.1             |      py3.7_cpu_0       133.7 MB  pytorch
    torchaudio-0.12.1          |         py37_cpu         3.5 MB  pytorch
    torchvision-0.13.1         |         py37_cpu         6.0 MB  pytorch
    ------------------------------------------------------------
                                           Total:       460.4 MB
```
````

#### 解决官网下载仍然是cpu版本的问题

知乎ref: [记录一下安装Pytorch和cuda的踩坑经历](https://zhuanlan.zhihu.com/p/424837529) [^5]

pip包安装地址[download.pytorch.org/whl/torch\_stable.html](https://download.pytorch.org/whl/torch_stable.html)

下载了 `torch-1.10.1+cu102-cp37-cp37m-win_amd64.whl`
- [?] `torchvision-0.11.1+cu102-cp37-cp37m-win_amd64.whl` 与之冲突，使用下面的版本
`torchvision-0.11.2+cu102-cp37-cp37m-win_amd64.whl`

![[Pasted image 20250114152537.png]]
![[Pasted image 20250114152513.png]]
（与上面的图对应）

````ad-abstract

又在网上找了好一段时间，才发现pip可以安装本地的包，也就是说可以先把包下载到本地，然后用`pip install xxxx`来安装，`xxxx`是本地包的存放路径。后来在一个博客里找到了官网的下载库地址.

打开后里面都是一堆链接，如下图所示，我们需要在这里面中找到自己需要的包。
![[Pasted image 20250114143715.png]]

1. 最前面的`cu113`指的是支持11.3版本的cuda，同理`cu101`就是支持10.3版本的cuda。看到的最低的cuda版本是10.0，低于10.0版本cuda对应的pytorch安装包可能存放在其他地方，或者不提供支持了。如果是`cpu`则说明是cpu版本的包，不适配gpu。
2. cuda版本号后的`/`和`%`之间的是包的内容和版本，比如torch-1.10.0就是1.10.0版本的torch，这个很容易理解。
3. 再往后的`2B`没猜出来是什么意思，可能是to B？
4. 紧接着的`cu113`和前面是一个意思，表示支持的cuda版本，`cp3x`则表示支持的Python版本是3.x，如果是由于我安装的是Python 3.9.5，因此我选择的是cp39的包。
5. 最后面的`Linux_x86_64`和`win_amd64`就很简单了，Linux版本就选前一个，Windows版本就选后一个，MacOS的就不知道了，可能也是后一个（不负责任的瞎猜）。

>将torch和torchvision都下载下来后就可以用pip进行安装了，指令就是`pip install D:\DownloadData\MyDownload\torch-1.10.0+cu113-cp39-cp39-win_amd64.whl`，后面的路径换成你下载到的文件夹即可，记得要先装torch再装torchvision，否则pip会自己再下一个torch给你装上去。
````

待解决的问题：为什么官网下载不了GPU版本的torch（事实上之前试的12.6下载成功了，但这个版本却失败了）

#solved [^6]: torch 1.12.0 不支持windows平台，如上表对应关系所示。[[配置与重装_anaconda_python_torch_pycharm#Solution]]



# FootNotes

[^1]: to be solved 关于anaconda创建虚拟环境的位置问题
[^2]: 原因解析
[^3]: 网页说明三者版本之间的对应关系
[^4]: b站关于重新安装cuda的视频（即卸载）
[^5]: 知乎关于安装torch的gpu版本的避坑说明
[^6]: 待解决的问题，如5所示 —— 已解决