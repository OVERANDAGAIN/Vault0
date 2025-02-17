---
创建时间: 2025-一月-15日  星期三, 2:10:03 下午
created: 2025-01-15T14:10
updated: ...
---
[[Packages]]


# Sources

- [?] ==windows环境下（未考虑虚拟机下==）：我在pycharm终端里面输入的下面的pip指令会把包安装到哪里？
出现了==Defaulting to user installation==错误，而且虚拟环境包里看不到

# Errors
```bash
Successfully installed importlib-metadata-4.13.0
(HOP_tst) PS F:\HOP> pip install gif
Defaulting to user installation because normal site-packages is not writeable
Collecting gif
  Using cached gif-3.0.0-py3-none-any.whl
Requirement already satisfied: Pillow>=7.1.2 in d:\anaconda\envs\hop_tst\lib\site-packages (from gif) (9.4.0)
Installing collected packages: gif
Successfully installed gif-3.0.0
(HOP_tst) PS F:\HOP> 

```

# Codes

```python

```

# Solutions
网页回答：[解决pip安装库失败报错Defaulting to user installation because normal site-packages is not writeable Requirement](https://cloud.baidu.com/article/2798133)

## Changes

## GPT_Answers
在 PyCharm 的终端中运行 `pip` 安装命令时，包的安装位置取决于当前的 Python 环境和用户权限设置：

### **安装位置解释：**

1. **虚拟环境激活的情况**：
   如果你已经激活了虚拟环境（例如 `(HOP_tst)` 出现在终端提示符中），包会安装到该虚拟环境的 `site-packages` 目录中，例如：
   ```
   D:\anaconda\envs\HOP_tst\Lib\site-packages
   ```

2. **显示 `Defaulting to user installation` 的情况**：
   - 当没有写权限时（例如尝试在系统全局环境安装包），`pip` 会将包安装到用户目录下的 `site-packages`。
   - 默认路径为：
     ```
     C:\Users\<username>\AppData\Roaming\Python\Python<version>\site-packages
     ```
   - 在你的情况中，由于提示 `Defaulting to user installation because normal site-packages is not writeable`，`gif` 包被安装到上述用户路径。

---

### **如何确认安装位置：**

运行以下命令可以确定包的实际安装路径：
```bash
pip show gif
```

输出示例：
```
Name: gif
Version: 3.0.0
Location: C:\Users\<username>\AppData\Roaming\Python\Python37\site-packages
```
`Location` 字段显示的即为包的安装位置。

---

### **解决可能的问题：**

如果你希望将包安装到虚拟环境中而不是用户路径，请尝试以下方法：

1. **确保使用虚拟环境的 `pip`**：
   指定虚拟环境中的 `pip`，例如：
   ```bash
   D:\anaconda\envs\HOP_tst\python.exe -m pip install gif
   ```

2. **提升权限**：
   如果你想安装到系统路径，可以使用管理员权限运行 PyCharm 或终端。

3. **检查 `PYTHONPATH`**：
   确保当前虚拟环境的 `site-packages` 在 `PYTHONPATH` 中，防止运行时找不到安装的包。

尝试这些方法后，如果还有疑问，请随时提问！


## Other_Answers

1. 用管理员模式运行pycharm
2. 把Anaconda\lib下Users权限都设为全部
3. 在虚拟环境中安装(就和安装torch时一样) $\Longrightarrow$ 命令提示符
#to_be_solved [^1]

# FootNotes

[^1]: 如何解决pip虚拟环境安装权限的问题