---
创建时间: 2024-十二月-18日  星期三, 8:35:22 晚上
created: 2024-12-18T20:35
updated: 2025-02-17-22.
---
[[Git]]

# Questions
想要显示更多种类的无序列表时：

[PKMer\_Obsidian 样式：标题&列表&图片美化 CSS](https://pkmer.cn/Pkmer-Docs/10-obsidian/obsidian%E5%A4%96%E8%A7%82/css-%E7%89%87%E6%AE%B5/obsidian%E6%A0%B7%E5%BC%8F-%E6%A0%87%E9%A2%98-%E5%88%97%E8%A1%A8-%E5%9B%BE%E7%89%87%E7%BE%8E%E5%8C%96/)

```ad-danger
该CSS对引用、脚注内容产生影响：包括顺序错乱、内容缺失等。
```


```css
/* 对引用进行设计 */
blockquote {
    border-left: 4px solid #4caf50!important; /* 鲜明的绿色边界 */
    background-color: #e8f5e9!important; /* 浅绿色背景 */
    color: #2e7d32!important; /* 引用文本的深绿色 */
    padding: 13px; /* 内边距 */
    margin: 16px 0; /* 外边距 */
 }
 
 /* 对粗体文字设置橙色文字和淡色背景*/
 b, strong {
     color: rgba(255,69,0,1); /* 橙红色 */;
 background-color: #f0f0f0; /* 淡灰色背景 */
     padding: 2px 4px; /* 加点内边距让背景更明显 */
     border-radius: 2px; /* 可选：为背景添加圆角 */
 }
 

```


# Answers

1. 使用：[^1]
```bash
git reset --hard commit号
```

```ad-note
此时再推到远程仓库用git push 会报错，需要用git push -f强推上去才可以。
```
reset 会覆盖中间的所有commit记录

2. 没有使用：
```bash
git revert -n (版本号)
```

```ad-note
因为，这里可能会出现冲突，那么需要手动修改冲突的文件。
```
to_be_solved:==如何处理冲突==。[^2]

revert不会覆盖中间的记录，但是需要解决冲突。

3. 查看版本号
   使用``git log`` 出现最近几次的commit记录，再按``enter`` 即可展示更久之前的记录。

## GPT_Answers


## Other_Answers


# Codes

```python

```



# FootNotes

[^1]: [GIT回退到指定版本的两种方法（reset/revert） - 何苦-\> - 博客园](https://www.cnblogs.com/fuqian/p/17187457.html)
[^2]: #to_be_solved 