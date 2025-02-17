---
创建时间: 2024-十二月-17日  星期二, 6:20:23 晚上
created: 2024-12-18T20:35
updated: 2025-02-17-22.
---
[[Git]]

# Questions
因为有
 - 记录鼠标位置
 - recent files
Linter中的yaml每次退出文件格式化修改时间信息
插件，猜想可能会==导致频繁的commit鼠标位置和时间这些对笔记内容无意义的信息。==

因此准备卸载 $\Longrightarrow$ 解决部分问题

然而，还有plugins/workspaces.json 下的这些内容也会随着每次push而改变

# Answers
==使用.gitignore 忽略 workspace.json等文件==。

.obsidian配置文件说明[^1]

| 配置文件                   | 类型  | 说明                        |
| ---------------------- | --- | ------------------------- |
| app.json               | 文件  | 设置-编辑器的配置                 |
| appearance.json        | 文件  | 设置-外观的配置                  |
| command-palette.json   | 文件  | 设置-命令面板-置顶命令              |
| community-plugins.json | 文件  | 已经安装的插件列表                 |
| core-plugins.json      | 文件  | 核心插件开启的列表                 |
| daily-notes.json       | 文件  | 日记模板的配置                   |
| graph.json             | 文件  | 图谱的配置                     |
| hotkeys.json           | 文件  | 设置-快捷键中新建立的快捷键            |
| starred.json           | 文件  | 星标的文件列表                   |
| templates.json         | 文件  | 模板插件配置的模板位置               |
| workspace              | 文件  | 界面的布局、最近编辑文件列表10个，当前激活的窗口 |
| ==workspaces.json==    | 文件  | ==存放的保存的工作区布局==           |
| plugins                | 目录  | 插件的安装位置                   |
| snippets               | 目录  | 一些css片段就会存放在这里            |
| themes                 | 目录  | 主题的存放路径                   |

![[Pasted image 20241217190910.png]]


## GPT_Answers

以下是一个适合你需求的 `.gitignore` 文件内容，它将忽略 `.obsidian` 目录下的 `workspace.json` 和 `workspaces.json` 文件，同时保留其他文件的追踪。

---

### **.gitignore 内容**
```plaintext
# 忽略 .obsidian 目录下的 workspace 和 workspaces 状态文件
.obsidian/workspace.json
.obsidian/workspaces.json
```

---

### **添加到仓库**
1. 将上述内容添加到项目根目录下的 `.gitignore` 文件中。
2. 如果之前已经提交过这些文件，你需要从版本控制中移除它们：

   ```bash
   git rm --cached .obsidian/workspace.json
   git rm --cached .obsidian/workspaces.json
   ```

3. 提交更新的 `.gitignore`：

   ```bash
   git add .gitignore
   git commit -m "Ignore workspace.json and workspaces.json in .obsidian"
   ```

---

### **效果**
- `.obsidian/workspace.json` 和 `.obsidian/workspaces.json` 将不会再被 Git 追踪。
- 其他文件依然会正常被 Git 版本控制。

## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: [ob配置文件夹.obsidian解析说明 - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/495/3)