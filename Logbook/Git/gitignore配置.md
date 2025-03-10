---
created: 2025-01-07T15
updated: ...
创建时间: 2025-三月-10日  星期一, 8:55:23 晚上
---
[[Git]]

# Questions

- [?] 编写如下的 `.gitignore` 文件后 `push` 操作仍然上传不必要的文件

```python
# 忽略 IDE 配置文件
.idea/
# 忽略所有 __pycache__ 目录及其中的文件
**/__pycache__/
*.pyc
*.pyo
# 忽略 msh_code/params/ 内的所有文件，但保留文件夹
msh_code/params/*
msg_code/params/*

```
# Answers

## 查看哪些文件已经被添加到暂存区
在运行 `git add .` 之后，你可以使用以下命令查看哪些文件已经被添加到暂存区（即即将提交的文件）：  

### 方法 1：使用 `git status`
```sh
git status
```
**输出示例：**
```sh
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   example.txt
        modified:   script.py
```
- `new file` 表示新添加的文件
- `modified` 表示已修改的文件
- `deleted` 表示被删除的文件

### 方法 2：使用 `git diff --cached`
如果你想查看 **已经添加到暂存区的具体更改**，可以使用：
```sh
git diff --cached
```
这将显示所有已暂存但尚未提交的更改。

### 方法 3：使用 `git ls-files --stage`
如果你想精确查看哪些文件已经进入暂存区：
```sh
git ls-files --stage
```
它会列出所有被 Git 追踪的文件及其状态。

如果你发现有文件不应该被添加，你可以使用以下命令撤销暂存：
```sh
git reset <file>
```
或者撤销所有暂存：
```sh
git reset
```

这些方法可以帮助你在提交前检查哪些文件已经被 Git 记录！ 🚀

## DS_Answers


## Other_Answers


# Codes

```python

```



# FootNotes