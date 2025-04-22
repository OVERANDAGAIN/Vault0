---
created: 2024-12-20T16
updated: ...
---
[[Overleaf]]

# Questions

- [?] 

```python

```

# Answers
![[Pasted image 20250422223015.png]]

![[Pasted image 20250422223030.png]]

## GPT_Answers
你在 Overleaf 中遇到的这个错误信息提示：

```
Fatal Package whu-thesis Error: whu-thesis does not support pdftex, please use XeLaTeX or LuaLaTeX instead.
```

### 原因分析：
`whu-thesis` 模板不支持 `pdfLaTeX` 编译方式，只支持 `XeLaTeX` 或 `LuaLaTeX`。

你当前项目的编译器设置为默认的 `pdfLaTeX`，因此报错。

---

### 解决方法：

**步骤如下：**

1. 打开你的 Overleaf 项目。
2. 点击界面顶部菜单栏的 `Menu` 按钮（一般在左上角）。
3. 下拉找到 **"Compiler"**（编译器）设置项。
4. 将编译器从默认的 `pdfLaTeX` 改为 `XeLaTeX`（或者 `LuaLaTeX`，推荐 `XeLaTeX`）。
5. 然后点击 `Recompile`（重新编译）按钮即可。

---

### 补充说明：
使用 XeLaTeX 编译的好处还包括对中文和系统字体的良好支持，`whu-thesis` 是武汉大学的毕业论文模板，往往依赖 XeLaTeX 来正确处理中文内容和字体设置。

---

如果你还有 `.tex` 代码里出现中文乱码或字体错误问题，可以继续告诉我，我可以帮你看中文支持是否设置得当。

## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
