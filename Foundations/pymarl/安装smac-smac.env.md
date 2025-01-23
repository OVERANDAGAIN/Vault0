---
创建时间: 2025-一月-22日  星期三, 10:07:04 晚上
---
[[pymarl]]

# Questions

- [?] 安装了smac却显示没有 `smac.env` 模块

爆红错误：
```python
from smac.env import MultiAgentEnv, StarCraft2Env
```

```bash
(myenv) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ python main.py --config=4iql3qmix1iql_omg --multi_algs --env-config=sc2 with env_args.map_name=8m
Traceback (most recent call last):
  File "main.py", line 17, in <module>
    from run import run
  File "/home/dingyi/Desktop/OMG/run.py", line 14, in <module>
    from runners import REGISTRY as r_REGISTRY
  File "/home/dingyi/Desktop/OMG/runners/__init__.py", line 3, in <module>
    from .episode_runner import EpisodeRunner
  File "/home/dingyi/Desktop/OMG/runners/episode_runner.py", line 1, in <module>
    from envs import REGISTRY as env_REGISTRY
  File "/home/dingyi/Desktop/OMG/envs/__init__.py", line 2, in <module>
    from smac.env import MultiAgentEnv, StarCraft2Env
ModuleNotFoundError: No module named 'smac.env'

(myenv) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ pip show smac
Name: smac
Version: 0.13.1
Summary: SMAC3, a Python implementation of 'Sequential Model-based Algorithm Configuration'.
Home-page: 
Author: Marius Lindauer, Matthias Feurer, Katharina Eggensperger, Joshua Marben,  \
Author-email: "fh@cs.uni-freiburg.de"
License: 3-clause BSD
Location: /home/dingyi/anaconda3/envs/myenv/lib/python3.8/site-packages
Requires: ConfigSpace, dask, distributed, joblib, lazy-import, numpy, psutil, pynisher, pyrfr, scikit-learn, scipy
Required-by: 

```

# Answers
知乎配置pymarl教程： [Pymarl虚拟环境安装步骤（Windows/Ubuntu）](https://zhuanlan.zhihu.com/p/542727892)

## GPT_Answers
### 一、安装StarCraft II

1. Windows

直接在官网下载安装最新版就好
sc2.blizzard.cn/landing

2. Ubuntu

在Ubuntu系统下，安装SC2.4.6.2.69232版本的SC2环境。具体步骤是先安装下面的压缩包，然后解压到用户名文件夹中。`home/admin`
blzdistsc2-a.akamaihd.net/Linux/SC2.4.6.2.69232.zip

### 二、创建pymarl虚拟环境

1. 创建虚拟环境

2. 安装pytorch
   直接在pytorch官网上根据电脑情况找相应的安装语句

3. 安装下面这些pymarl运行所依赖的包


```
pip install sacred numpy scipy matplotlib seaborn pyyaml pygame pytest probscale imageio snakeviz tensorboard-logger
```


这一堆包安装完之后会有两个包需要改成低版本，一个是pyyaml，还有一个是protobuf

```

pip uninstall pyyaml
pip install pyyaml==3.13
pip uninstall protobuf
pip install protobuf==3.19.1
```


### 三、安装SMAC


```
pip install git+https://github.com/oxwhirl/smac.git
```

最终的路径在： ``

### 四、添加环境变量

    Windows

在Windows里，增加SC2PATH变量，值为Starcraft II安装的位置，

2. Ubuntu

在Ubuntu中，用命令行添加SC2PATH变量，首先用vim打开bashrc：

`vim ~/.bashrc`

在最后一行添加环境变量，键和值同样分别是SC2PATH和StarCraft II在Ubuntu系统中用户名文件夹下的位置

`export SC2PATH=~/StarCraftII/`
```ad-note
这里就已经隐含了 /home/admin 的位置
```
（P.S 打开bashrc之后，先按i键进入insert模式，然后在最后一行输入上面的代码，随后按Esc键退出，之后按Shift+：，然后输入wq加回车退出）

添加完环境变量后更新环境

 `source ~/.bashrc`

然后将安装的ScarcraftII游戏文件夹复制到src的3dparty文件夹下。

### 五、添加地图

1. Windows

先下载下面的SMAC_MAPS压缩包，然后解压到StarCraft II下的Maps文件夹中（没有就自己建立）。
github.com/oxwhirl/smac/releases/download/v0.1-beta1/SMAC_Maps.zip

2. Ubuntu

也要下载地图。~~Ubuntu在下载SC2环境时就自带了地图，所以不需要额外操作。~~
[GitHub - oxwhirl/smac: SMAC: The StarCraft Multi-Agent Challenge](https://github.com/oxwhirl/smac)[^1]
[GitHub - oxwhirl/pymarl: Python Multi-Agent Reinforcement Learning framework](https://github.com/oxwhirl/pymarl)[^2]

### 六、测试SMAC环境

`python -m smac.examples.random_agents`

此时命令行会出现以下信息，windows还会弹出游戏界面

## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: SMAC地址
[^2]: PYMARL地址