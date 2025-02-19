---
创建时间: 2025-二月-18日  星期二, 2:57:13 下午
created: 2024-12-20T16
updated: ...
---
[[双系统]]

# Questions

## 本机环境
BIGAI：
```bash
-----------------
System Information
------------------
    Machine name: DESKTOP-80GEA2G
    Machine Id: {27A051EF-D1C1-43F6-BB8B-44D9B384F5C5}
    Operating System: Windows 11 רҵ�� 64-bit (10.0, Build 22631) 
    Language: Chinese (Simplified) 
    System Manufacturer: ASUS
    System Model: System Product Name
    BIOS: 1801 (type: UEFI)
    Processor: 13th Gen Intel(R) Core(TM) i9-13900KF (32 CPUs), ~3.0GHz
---------------
Display Devices
---------------
    Card name: NVIDIA GeForce RTX 4090
    Manufacturer: NVIDIA
    Chip type: NVIDIA GeForce RTX 4090
    DAC type: Integrated RAMDAC
    Device Type: Full Device (POST)
    
```

## 主要参考资料
B站安装双系统全程参考视频（有一些坑下面会提到并解决）： [Windows 和 Ubuntu 双系统的安装和卸载\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1554y1n7zv/?spm_id_from=333.999.0.0&vd_source=6c33cf6826337aad387874b66413aa72)[^1]




- [?] 

```python

```

# Answers 总体步骤
尽管整个过程是在关闭CSM模式下，使用旧显示屏完成的。（因为关闭CSM可能导致显示不出主板logo,BIOS等信息），在安装完 ==显卡驱动== 后才换联想显示屏 才能显示Ubuntu。
>但是还未测试关闭CSM情况下，联想显示屏能否显示并完成整个安装流程（当然，一开始无法进入BIOS，自然无法打开CSM模型，也就是说仍然需要一个旧显示屏maybe非联想）

```ad-seealso

```

## 下载Ubuntu镜像文件 `.iso`
Ubuntu下载地址：[其他Ubuntu系统下载 \| Ubuntu](https://cn.ubuntu.com/download/alternative-downloads)[^2]


## 用U盘制作Ubuntu安装盘
```ad-danger
不能使用 win32diskimager
>应该使用rufus
```

正确方法的地址：[重装系统之----Rufus创建UEFI启动盘\_rufus制作u盘启动盘-CSDN博客](https://blog.csdn.net/CSDN_Admin0/article/details/135101936?spm=1001.2014.3001.5506)[^3]

---

- 无法格式化的，解决方法见： [[U盘写保存无法格式化]][^5]
==本机（BIGAI）为 GPT硬盘格式（不是MBR）==
==选择NTFS==



## 双硬盘双系统分区方法

参考方法CSDN地址： [单、双硬盘装Windows和Ubuntu双系统——准备篇\_单硬盘双系统-CSDN博客](https://blog.csdn.net/beyourself_he/article/details/140281314?spm=1001.2014.3001.5506)[^4]

---

==本机（BIGAI）为 GPT硬盘格式（不是MBR）==
==选择NTFS==


## 安装Ubuntu系统
安装时选择启动顺序时可能会有两个U盘（实际上是一个）加一个windows $\Longrightarrow$ 加起来三个，选择其中一个U盘（第一个部分）移到最上面即可，==但原因尚未知晓==: 类似问题： [制作pe的U盘在BIOS启动选择菜单显示两个UEFI项的浅析\_进pe系统的时候为什么进一次就加uepf-CSDN博客](https://blog.csdn.net/u010059669/article/details/71731624?spm=1001.2014.3001.5506)[^10]
参考CSDN地址（后半段分配存储）： [单、双硬盘装Windows和Ubuntu双系统——安装篇\_双硬盘双系统-CSDN博客](https://blog.csdn.net/beyourself_he/article/details/140296842?spm=1001.2014.3001.5502)[^6]
参考使用（前半段BIOS等设置）： [[安装过程or踩坑#主要参考资料]][^8]

---
刚开始进入时。可能是 `try or install ubuntu` ,与视频或教程中直接出现的 `Ubuntu` 可能不同，问题不大。

首先，进入BIOS方法排雷： [[无法进入BIOS]][^7]

其次，安装最好一开始就选择英文。否则，后面从中文改为英文需要一些操作： [Ubuntu 中文系统转为英文系统 （问题：Gtk-WARNING \*\*: Locale not supported by C library）-CSDN博客](https://blog.csdn.net/chen20170325/article/details/130274232?spm=1001.2014.3001.5506) [^9]其中，最后的 `export` 根据想要的设置，比如 `LC_ALL =  en_US.utf-8`

最后，我最后选择的是第二种方法，即不单独设置 `/home` 挂载区 ，==但两者好坏优劣还未搞清==


## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: B站全程（有一些坑）参考视频
[^2]: Ubuntu镜像下载地址
[^3]: 使用Rufus制作安装盘
[^5]: 无法格式化U盘
[^4]: 硬盘分区方法
[^10]: 安装初始时出现两个U盘
[^6]: 安装Ubuntu过程
[^8]: 主要参考资料
[^7]: 无法进入BIOS解决
[^9]: 中文改英文