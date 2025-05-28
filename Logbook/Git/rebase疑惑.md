---
created: 2024-12-20T16
updated: ...
创建时间: 2025-五月-28日  星期三, 3:42:28 下午
---
[[Git]]


联系 [[Git Commit本质]] 可能还是混淆了 **提交所代表的完整项目状态** 与 **Git 底层高效存储所使用的内容复用机制**
>虽然每次 commit 表示的是整个项目的快照，但 Git 底层并不会复制所有文件，而是通过指向 parent 中相同内容的对象来节省空间。
>Rebase 改变了 parent-child 的结构，因此也改变了 child 相对于 parent 的 diff 表现，虽然文件内容可能没变，commit hash 和结构已经不同。

# Questions

- [?] 

```python

```

# Answers

## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
