---
created: 2024-12-20T16
updated: ...
创建时间: 2025-七月-1日  星期二, 10:50:32 上午
---
#tool_summary 

# What
```bash
D:\IDMdownload\PDF-XChange+Editor+Plus+9.0.350.0+Multilingual
```
# Why
某些PDF稿子会有行号，导致翻译软件翻译时会把数字翻译进去。

![[Pasted image 20250701105300.png]]



# How
知乎中提供的一种解决方案[删除pdf(论文)的行号](https://zhuanlan.zhihu.com/p/469248606)[^1]
同上：上面的知乎回答引用的B站方法：[85.Word中添加行号及pdf文件中行号的去除\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV12y4y1W7j3/?vd_source=6c33cf6826337aad387874b66413aa72)
以上提到的下载链接：[百度网盘 请输入提取码](https://pan.baidu.com/s/1cP8N8AAkfLIexEAmZXrJjg)(已保存至网盘-300+MB)
提取码： rq6o


```ad-tip
网上搜索到的方法一般就是几个步骤：裁剪掉行号-仍有隐藏行号-覆盖行号或想办法删除裁剪掉的东西
```
# Theroy
# Background
# Related Work
# Methodology
安装及破解方法：[PDF-XChange\_Editor\_Plus\_9.0.350.0 · 语雀](https://www.yuque.com/yuzhuyi/ggw37n/yihbrx#)

使用方法： 使用工具中的裁剪，并勾选删除裁剪的内容

```ad-note
组织-裁剪
拖动裁剪线
勾选“删除裁剪框区域以外的内容”
```

![[Pasted image 20250701112903.png]]

# Results
# 裁剪后的尺寸问题
![[Pasted image 20250701113708.png]]

如图，裁剪后，页面直接变得少了一块。
为了解决此：
```ad-important
直接在裁剪时，右边也设置和左边一样的裁剪长度，这里是36.2mm
>记住原来的大小 143.5+36.2*2=215.9mm

再使用“调整大小”调整回原来的大小（由于是左右都补一点，因此上面的步骤中我们两边都裁剪了。

![[Pasted image 20250701114029.png]]
```

## 结果展示
### 无行号的PDF
![[Pasted image 20250701114150.png]]

### 前后大小差距不大 0.04MB
![[Pasted image 20250701114311.png]]

![[Pasted image 20250701114322.png]]


### 书签未丢失，且能正常框选
![[Pasted image 20250701114500.png]]

# FootNotes

[^1]: 知乎解决此的链接