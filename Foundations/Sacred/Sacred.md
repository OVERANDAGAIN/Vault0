---
创建时间: 2025-一月-7日  星期二, 4:29:51 下午
created: 2025-01-07T16:29
updated: 2025-01-07T17
---
#tool_summary 

# What
## Gpt_answer
### **1. 简单介绍 Sacred**

**Sacred** 是一个实验管理工具，用于帮助研究人员组织、记录和复现实验过程。其核心特点包括：
1. **配置管理**：允许研究人员轻松加载和修改实验配置（例如超参数）。
2. **结果追踪**：自动保存实验的输出、配置和元数据到文件系统或数据库中（如 MongoDB）。
3. **易于复现**：通过记录完整的实验配置和代码依赖，确保实验结果可以复现。
4. **日志管理**：集成日志记录功能，便于追踪实验进展。

在 Sacred 中：
- ==**`Experiment`**== 对象是核心入口，用于定义和管理实验。
- **配置（Config）** 是实验的参数，可以通过 ==YAML 文件==或代码动态加载。
- **观察者（==Observers==）** 用于保存实验的输出和记录（如文件系统、数据库等）。

## detailed_refs

>最近找到一个名为 Sacred 的工具，用于记录实验的配置、组织、日志和复现。我今天测试了一下，Sacred 主要的工作在于将每次实验的输入 - 过程 - 输出保存到数据库中，并利用 Web 将历史实验数据进行了可视化，方便我们查看历史实验，并进行参数配置和实验结果的比较。

[README/envs/tools/scared.md at main · FelixFu520/README · GitHub](https://github.com/FelixFu520/README/blob/main/envs/tools/scared.md)

1. Experiment 类是 Sacred 框架的核心类. Sacred 是一个辅助实验的框架, 因此在实验代码的最开始, 我们首先要定义一个 ==Experiment 的实例==

2. Sacred 提供了三种定义配置的方法:
	- Config Scope
	- 字典
	- 配置文件(json, pickle 和 ==yaml== )config


3. 在 Sacred 中运行实验时, 文件名后面的第一个参数为要运行的命令. 待更新的参数跟在 with 参数后面, 并用 key=value 的格式传入。==run程序运行指令==
```powershell
1 python config_demo.py print_config with foo.bar=baobab
```

4. Sacred 会自动为==捕获函数== (captured functions) 注入需要的参数, 捕获函数指的是
	- @ex.main
	- @ex.automain
	- @ex.capture
	- @ex.command


5. 观察器==observer==
   Sacred 提供了非常丰富的观察器用于记录实验数据, 包括 MongoDB, ==FileStorage==, TinyDB, SQL, S3, Slack, Telegram, Neptune等
6. ==Command-Line== Interface (命令行接口): 你可以获得一个非常强大的命令行接口用于修改参数和运行实验的变体

7. 自己需要写的映射函数
   Sacred 的 `_config` 默认返回的是一个字典, 调用参数时需要大量的` [""] `符号, 因此我实现了一个映射的功能, 把字典的键值对映射为了成员变量, 可以直接通过 . 来调用. 这个映射支持字典的嵌套映射.
```python
class Map(ReadOnlyDict):
    __getattr__ = dict.__getitem__
    __setattr__ = dict.__setitem__
    __delattr__ = dict.__delitem__

    def __init__(self, obj, **kwargs):
        new_dict = {}
        if isinstance(obj, dict):
            for k, v in obj.items():
                if isinstance(v, dict):
                    new_dict[k] = Map(v)
                else:
                    new_dict[k] = v
        else:
            raise TypeError(f"`obj` must be a dict, got {type(obj)}")
        super(Map, self).__init__(new_dict, **kwargs)
```

particularly，in OMG ：
```python

def recursive_dict_update(d, u):
    for k, v in u.items():
        if isinstance(v, collections.Mapping):
            d[k] = recursive_dict_update(d.get(k, {}), v)
        else:
            d[k] = v
    return d

    config_dict = recursive_dict_update(config_dict, env_config)
    config_dict = recursive_dict_update(config_dict, alg_config)
    config_dict = recursive_dict_update(config_dict, other_arg_config)
```

# Why



# How



# Theroy



# Background



# Related Work




# Methodology




# Results



# Limitations


# FootNotes
