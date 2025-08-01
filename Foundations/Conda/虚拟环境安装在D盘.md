---
创建时间: 2025-八月-1日  星期五, 12:02:57 中午
---
[[Conda]]


# 解决solved:
[[配置与重装_anaconda_python_torch_pycharm#to_be_solved]]

1. 管理员运行 `anaconda prompt`

2. 检查配置文件 `.condarc`

```bash
conda config --show
```

发现包含如下内容：

```yaml
envs_dirs:
  - D:\anaconda\envs
  - C:\Users\admin\.conda\envs
  - C:\Users\admin\AppData\Local\conda\conda\envs
```

说明 conda 优先尝试在 `D:\anaconda\envs` 创建环境



---
---


# Conda 创建环境默认安装到了 C 盘 `.conda\envs` 的问题排查与解决笔记

- [?] 

```python

```



## 🧩 问题描述

在使用 `conda create -n posg39 python=3.9` 创建环境时，发现环境被安装到了：

```plaintext
C:\Users\admin\.conda\envs\posg39
```

但预期应该是在 Anaconda 安装目录下的：

```plaintext
D:\anaconda\envs\posg39
```

---

## 🔍 问题排查过程

### 1. 查看当前环境路径分布

```bash
conda env list
```

结果发现多个环境在 `D:\anaconda\envs\`，但新建环境却在 `.conda\envs\`。

---


你已经在 `Anaconda Prompt` 中运行了 `conda create`，**base 环境也确实是 `D:\anaconda`**，但 conda 仍然把新环境安装到了 `C:\Users\admin\.conda\envs\`，这确实令人困惑。

---

### ✅ 修改默认环境路径为 D:\anaconda\envs

你可以将默认环境目录设置为你的 anaconda 路径：

```bash
conda config --remove-key envs_dirs
conda config --append envs_dirs D:\anaconda\envs
```

这两步做了什么：

* 第一步删除 `.condarc` 中之前设置的路径；
* 第二步显式地设置你想要的路径（`D:\anaconda\envs`）为默认创建位置。

> `.condarc` 文件默认在 `C:\Users\admin\.condarc`，你也可以直接编辑它。

---










### 2. 检查配置文件 `.condarc`

```bash
conda config --show
```

发现包含如下内容：

```yaml
envs_dirs:
  - D:\anaconda\envs
  - C:\Users\admin\.conda\envs
  - C:\Users\admin\AppData\Local\conda\conda\envs
```

说明 conda 优先尝试在 `D:\anaconda\envs` 创建环境。

---

### 3. 推测原因：**权限不足**

由于 conda 创建环境时发现 `D:\anaconda\envs` 没有足够权限写入（如非管理员运行），自动 fallback 到下一个路径 `C:\Users\admin\.conda\envs`。

---

## ✅ 最终解决方法

### ✅ 方法一：以管理员身份运行 `Anaconda Prompt`

1. 打开开始菜单 → 右键 “Anaconda Prompt” → **选择“以管理员身份运行”**
2. 再次创建环境：

   ```bash
   conda create -n posg39 python=3.9
   ```
3. 验证结果：

   ```bash
   conda env list
   ```

   成功安装到 `D:\anaconda\envs\posg39`。

---

### ✅ 方法二（可选）：显式设置默认路径

为了让 conda 永远优先使用 D 盘：

```bash
conda config --set envs_dirs D:\anaconda\envs
```

---

## 📝 总结表格

| 检查项           | 状态                        | 操作建议                      |
| ------------- | ------------------------- | ------------------------- |
| `.condarc` 配置 | 已设置 `D:\anaconda\envs` 优先 | 无需修改                      |
| 环境安装位置        | 落在了 `.conda\envs`         | 权限不足导致 fallback           |
| 是否解决          | ✅ 已解决                     | 通过管理员运行 `Anaconda Prompt` |

## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
