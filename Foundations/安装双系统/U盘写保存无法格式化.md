---
created: 2025-02-17T20:17
updated: ...
创建时间: 2025-二月-17日  星期一, 8:17:17 晚上
---
[[双系统]]

# Questions

- [?] 

```python

```

# Answers
B站视频教程地址： [制作Ubuntu安装盘\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1554y1n7zv?spm_id_from=333.788.videopod.episodes&vd_source=6c33cf6826337aad387874b66413aa72&p=4)[^2]
```ad-danger
不能使用 win32diskimager
>应该使用rufus
```
## 制作U盘时，写保护无法格式化
win32diskimage会给U盘加上写保护，最终导致无法格式化
### 使用Rufus重新制作
在格式化之后：
- [x] 不要使用视频中的软件，使用Rufus
Rufus教程地址：[重装系统之----Rufus创建UEFI启动盘\_rufus制作u盘启动盘-CSDN博客](https://blog.csdn.net/CSDN_Admin0/article/details/135101936?spm=1001.2014.3001.5506)[^1]
比较新的电脑，选择GPT,NTFS
### 重新格式化方法
U盘无法格式化因为写有保护的这样做
win + r 
cmd
输入diskpart
     list disk
     select disk 对应磁盘编号
     输入clean
     输入creat partition primary
     **输入active（非MBR磁盘不可用）$\Longleftrightarrow$ 暂未解决
     输入format fs=fat32 quick（搬自csdn）**
     
就可以格式化了，==随后一楼说用rufus==，具体教程csdn上也有。
然后更改时区那点，要先联网，然后根据一楼和弹幕的提示输入相关指令就可以了


## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^2]: 双系统B站教程地址
[^1]: Rufus教程地址