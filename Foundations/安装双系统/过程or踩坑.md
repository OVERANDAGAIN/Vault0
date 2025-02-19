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

## 下载Ubuntu镜像文件 `.iso`
Ubuntu下载地址：[其他Ubuntu系统下载 \| Ubuntu](https://cn.ubuntu.com/download/alternative-downloads)[^2]


## 用U盘制作Ubuntu安装盘
```ad-danger
不能使用 win32diskimager
>应该使用rufus
```

正确方法的地址：[重装系统之----Rufus创建UEFI启动盘\_rufus制作u盘启动盘-CSDN博客](https://blog.csdn.net/CSDN_Admin0/article/details/135101936?spm=1001.2014.3001.5506)[^3]
- 无法格式化的，解决方法见： [[U盘写保存无法格式化]]

## 双硬盘双系统分区方法

参考方法知乎地址： [单、双硬盘装Windows和Ubuntu双系统——准备篇\_单硬盘双系统-CSDN博客](https://blog.csdn.net/beyourself_he/article/details/140281314?spm=1001.2014.3001.5506)[^4]



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
[^4]: 硬盘分区方法