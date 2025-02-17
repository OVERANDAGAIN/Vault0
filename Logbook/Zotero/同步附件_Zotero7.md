---
创建时间: 2024-十二月-31日  星期二, 11:51:52 中午
created: 2024-12-31T11:51
updated: 2025-02-17-22.
---
[[Zotero]]
# Questions
- Zotero的free版本仅有300MB存储
- Onedrive教育版有100G,但有回收风险
- Onedrive个人版有5G，近几年使用尚可。

- [?] Zotfile仅能在Zotero6中使用。Zotero7使用Attanger进行同步。


# Answers

Attanger 仓库地址:[^1]
[GitHub - MuiseDestiny/zotero-attanger: Attachment Manager for Zotero](https://github.com/MuiseDestiny/zotero-attanger)


## 配置步骤

1. 存储的文件按类型分类：==(已弃用)==
   >考虑到很多6的用户在存储文件时喜欢子目录按照期刊分类，我试了一下怎么设置子目录路径：{{publicationTitle}}/{{year}}，会按照期刊然后年份存储在你的网盘里。具体操作和效果见图片

2. 文件（如PDF）重命名：
	```text
	{{ year suffix="_" }}{{ title truncate="200" }}{{ authors max="1"  name="given-family" prefix="_"  }}{{publisher prefix="_" }}
	```

3. Attager配置：
	参考：[zotero7配置attanger，并进行同步数据的路径配置\_zotero7 attanger-CSDN博客](https://blog.csdn.net/weixin_44628096/article/details/144493607?spm=1001.2014.3001.5506)[^2]
	
	1. ”同步“取消”文件同步“==（使用OneDrive时）==
	2. “高级”设置“已连接附件的根目录”(Onedrive目录) $\Longrightarrow$ A
	3. "高级"中“数据存储位置为”Zotero"（本机X路径） $\Longrightarrow$ B
	4. "Attanger"中“源路径”设置为 Zotero/storage $\Longrightarrow$ B/storage
	5. “Attanger”中“附加类型”设置为“链接”
	6. “Attanger”中“靶路径”设置为A（OneDrive目录）
	7. “Attanger”设置“自动删除移动后为空的文件夹” ==（似乎没用，需要使用下面的删除插件）==
	8. 对于另一台设备：本机Y的路径B $\Longrightarrow$ $Y_{B}$ 可以与$X_{B}$ 不同。但是A要相同==（似乎是这样）==


5. 删除条目时同步删除附件：[^3]
   使用另一个插件 $\Longrightarrow$ 
   [GitHub - redleafnew/delitemwithatt: Remove attachment(s) when delete the item(s) or collection in Zotero and JurisM.](https://github.com/redleafnew/delitemwithatt)


哔哩哔哩作者参考：[Zotero Attanger - Attachment Manager 实现 ZotFile 核心功能\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV1x64y1J7Rv/?vd_source=6c33cf6826337aad387874b66413aa72)[^4]



## GPT_Answers


## Other_Answers


# Codes

```python

```



# FootNotes

[^1]: Attanger地址
[^2]: 配置Attanger参考
[^3]: 删除附件插件
[^4]: 作者视频