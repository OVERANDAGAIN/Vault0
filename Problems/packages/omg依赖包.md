---
创建时间: 2025-一月-22日  星期三, 10:14:11 晚上
created: 2025-01-22T22:14
updated: ...
---
[[Packages]]


# Sources

- [?] 对于下面的 `requirements.txt` 的内容，直接在 `windows` 上安装会出现问题，因为其中包含了linux的包。
> 然而，在虚拟机 ubuntu 中安装了 Anaconda 之后==，不能直接执行==他所说的requirement指令 `conda create --name <env> --file <this file>`

- [x]  仍然是问大模型解决，没法一步requirement到位（可能是作者打包的问题，不仅安装不了，还有无数版本冲突）。其总的就是创建虚拟环境后（不通过requirement的，只指定python版本），再分别安装conda包和pip包
      
# Errors
```bash
(base) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ conda config --append channels conda-forge
Warning: 'conda-forge' already in 'channels' list, moving to the bottom
(base) dingyi@dingyi-virtual-machine:~/Desktop/OMG$ conda create --name omg --file requirements.txt
Channels:
 - defaults
 - conda-forge
Platform: linux-64
Collecting package metadata (repodata.json): done
Solving environment: failed

PackagesNotFoundError: The following packages are not available from current channels:
```

无比较好的解决办法[^1]
#to_be_solved [^2]


# Codes

```python
# This file may be used to create an environment using:
# $ conda create --name <env> --file <this file>
# platform: linux-64
_libgcc_mutex=0.1=main
_openmp_mutex=5.1=1_gnu
absl-py=1.4.0=pypi_0
appdirs=1.4.4=pypi_0
ca-certificates=2023.01.10=h06a4308_0
certifi=2022.12.7=pypi_0
charset-normalizer=3.1.0=pypi_0
click=8.1.3=pypi_0
cloudpickle=1.3.0=pypi_0
colorama=0.4.6=pypi_0
contourpy=1.0.7=pypi_0
cycler=0.11.0=pypi_0
deepdiff=6.3.0=pypi_0
dm-env=1.6=pypi_0
dm-env-rpc=1.1.5=pypi_0
dm-tree=0.1.8=pypi_0
docker-pycreds=0.4.0=pypi_0
docopt=0.6.2=pypi_0
enum34=1.1.10=pypi_0
exceptiongroup=1.1.1=pypi_0
fonttools=4.39.3=pypi_0
future=0.18.3=pypi_0
gitdb=4.0.10=pypi_0
gitpython=3.1.31=pypi_0
googleapis-common-protos=1.59.0=pypi_0
grpcio=1.54.0=pypi_0
gym=0.17.2=pypi_0
idna=3.4=pypi_0
imageio=2.28.0=pypi_0
immutabledict=2.2.4=pypi_0
importlib-resources=5.12.0=pypi_0
iniconfig=2.0.0=pypi_0
jsonpickle=3.0.1=pypi_0
kiwisolver=1.4.4=pypi_0
lbforaging=1.1.1=pypi_0
ld_impl_linux-64=2.38=h1181459_1
libffi=3.4.2=h6a678d5_6
libgcc-ng=11.2.0=h1234567_1
libgomp=11.2.0=h1234567_1
libstdcxx-ng=11.2.0=h1234567_1
matplotlib=3.0.0=pypi_0
mock=5.0.2=pypi_0
mpyq=0.2.5=pypi_0
munch=2.5.0=pypi_0
ncurses=6.4=h6a678d5_0
numpy=1.18.5=pypi_0
openssl=1.1.1t=h7f8727e_0
ordered-set=4.1.0=pypi_0
packaging=23.1=pypi_0
pandas=1.1.1=pypi_0
pathtools=0.1.2=pypi_0
pillow=9.5.0=pypi_0
pip=23.0.1=py38h06a4308_0
pluggy=1.0.0=pypi_0
portpicker=1.5.2=pypi_0
probscale=0.2.5=pypi_0
protobuf=3.19.5=pypi_0
psutil=5.9.5=pypi_0
py-cpuinfo=9.0.0=pypi_0
pygame=2.3.0=pypi_0
pyglet=1.5.0=pypi_0
pyparsing=3.0.9=pypi_0
pysc2=4.0.0=pypi_0
pytest=7.3.1=pypi_0
python=3.8.16=h7a1cb2a_3
python-dateutil=2.8.2=pypi_0
pytz=2023.3=pypi_0
pyyaml=3.13=pypi_0
readline=8.2=h5eee18b_0
requests=2.29.0=pypi_0
s2clientprotocol=5.0.11.90136.0=pypi_0
s2protocol=5.0.11.90136.0=pypi_0
sacred=0.8.4=pypi_0
scipy=1.4.1=pypi_0
seaborn=0.10.1=pypi_0
sentry-sdk=1.21.1=pypi_0
setproctitle=1.3.2=pypi_0
setuptools=66.0.0=py38h06a4308_0
six=1.16.0=pypi_0
sk-video=1.1.10=pypi_0
smac=1.0.0=pypi_0
smmap=5.0.0=pypi_0
snakeviz=2.2.0=pypi_0
sqlite=3.41.2=h5eee18b_0
tensorboard-logger=0.1.0=pypi_0
tensorboardx=2.0=pypi_0
tk=8.6.12=h1ccaba5_0
tomli=2.0.1=pypi_0
torch=1.8.1+cu101=pypi_0
torchaudio=0.8.1=pypi_0
torchvision=0.9.1+cu101=pypi_0
tornado=6.3.1=pypi_0
typing-extensions=4.5.0=pypi_0
tzdata=2023.3=pypi_0
urllib3=1.26.15=pypi_0
wandb=0.15.0=pypi_0
websocket-client=1.5.1=pypi_0
wheel=0.38.4=py38h06a4308_0
wrapt=1.15.0=pypi_0
xz=5.2.10=h5eee18b_1
zipp=3.15.0=pypi_0
zlib=1.2.13=h5eee18b_0

```


# Solutions

## Changes

## DeepSeek_Answers

### **1. 创建Conda环境**
由于依赖中包含特定系统库（如libgcc等），建议先通过Conda安装这些基础依赖：
```bash
conda create -n myenv python=3.8.16
conda activate myenv
```

### **下一步操作步骤**

#### **1. 激活环境并安装系统级依赖**
```bash
conda activate myenv

# 安装原依赖列表中明确指定的系统包
conda install _openmp_mutex=5.1=1_gnu ld_impl_linux-64=2.38=h1181459_1 libffi=3.4.2=h6a678d5_6 libgcc-ng=11.2.0=h1234567_1 libstdcxx-ng=11.2.0=h1234567_1 ncurses=6.4=h6a678d5_0 readline=8.2=h5eee18b_0 sqlite=3.41.2=h5eee18b_0 tk=8.6.12=h1ccaba5_0 xz=5.2.10=h5eee18b_1 zlib=1.2.13=h5eee18b_0
```

**注意**：如果版本冲突，可以尝试：
- 使用 `conda-forge` 频道指定版本（例如 `conda install -c conda-forge libgcc-ng=11.2.0`）。
- 如果无法完全匹配原列表版本，优先保证 PyTorch 和 CUDA 的兼容性。

---

#### **2. 安装 PyTorch（适配 RTX 4090）**
由于原依赖中的 `torch==1.8.1+cu101` 不兼容 RTX 4090（需 CUDA ≥11.8），**必须升级 PyTorch**：
```bash
pip uninstall torch torchvision torchaudio  # 移除旧版本（如有）
pip install torch==2.0.1+cu118 torchvision==0.15.2+cu118 torchaudio==2.0.2 --index-url https://download.pytorch.org/whl/cu118
```

---

#### **3. 安装剩余 Python 依赖**
将原列表中所有 `pypi_0` 的包保存到 `requirements_pypi.txt` 并安装：
```bash
# 生成 requirements_pypi.txt
echo "absl-py==1.4.0
appdirs==1.4.4
certifi==2022.12.7
charset-normalizer==3.1.0
click==8.1.3
cloudpickle==1.3.0
colorama==0.4.6
contourpy==1.0.7
cycler==0.11.0
deepdiff==6.3.0
dm-env==1.6
dm-env-rpc==1.1.5
dm-tree==0.1.8
docker-pycreds==0.4.0
docopt==0.6.2
enum34==1.1.10
exceptiongroup==1.1.1
fonttools==4.39.3
future==0.18.3
gitdb==4.0.10
gitpython==3.1.31
googleapis-common-protos==1.59.0
grpcio==1.54.0
gym==0.17.2
idna==3.4
imageio==2.28.0
immutabledict==2.2.4
importlib-resources==5.12.0
iniconfig==2.0.0
jsonpickle==3.0.1
kiwisolver==1.4.4
lbforaging==1.1.1
matplotlib==3.0.0
mock==5.0.2
mpyq==0.2.5
munch==2.5.0
numpy==1.18.5
ordered-set==4.1.0
packaging==23.1
pandas==1.1.1
pathtools==0.1.2
pillow==9.5.0
pluggy==1.0.0
portpicker==1.5.2
probscale==0.2.5
protobuf==3.19.5
psutil==5.9.5
py-cpuinfo==9.0.0
pygame==2.3.0
pyglet==1.5.0
pyparsing==3.0.9
pysc2==4.0.0
pytest==7.3.1
python-dateutil==2.8.2
pytz==2023.3
pyyaml==3.13
requests==2.29.0
s2clientprotocol==5.0.11.90136.0
s2protocol==5.0.11.90136.0
sacred==0.8.4
scipy==1.4.1
seaborn==0.10.1
sentry-sdk==1.21.1
setproctitle==1.3.2
six==1.16.0
sk-video==1.1.10
smac==1.0.0
smmap==5.0.0
snakeviz==2.2.0
tensorboard-logger==0.1.0
tensorboardx==2.0
tomli==2.0.1
tornado==6.3.1
typing-extensions==4.5.0
tzdata==2023.3
urllib3==1.26.15
wandb==0.15.0
websocket-client==1.5.1
wrapt==1.15.0
zipp==3.15.0" > requirements_pypi.txt

# 安装依赖
pip install -r requirements_pypi.txt
```


````ad-caution
两个冲突
### **依赖冲突分析**
报错指出 `scipy==1.4.1` 与以下包存在版本冲突：
- `gym==0.17.2`（依赖任意 `scipy` 版本）
- `seaborn==0.10.1`（依赖 `scipy>=1.0.1`）
- `sk-video==1.1.10`（依赖任意 `scipy` 版本）
- `smac==1.0.0`（依赖 `scipy>=1.7.0`）

核心矛盾是 **`smac 1.0.0` 要求 `scipy≥1.7.0`，但你的依赖列表指定了 `scipy=1.4.1`**。

---

### **解决方案**

#### **选项 1：升级 `scipy`（推荐）**
修改 `requirements_pypi.txt` 中的 `scipy` 版本以满足 `smac` 的要求：
```diff
- scipy==1.4.1
+ scipy>=1.7.0
```
然后重新安装：
```bash
pip install -r requirements_pypi.txt
```
此方案可能需要同步调整其他包的版本（如 `numpy`），但兼容性更好。



---

### **问题分析**
`matplotlib` 编译失败通常是因为缺少系统级依赖库（如 `libfreetype`、`libpng` 等）或 Python 开发头文件。你的环境可能缺少以下关键组件：

1. **系统库缺失**：`libfreetype-dev`, `libpng-dev`, `pkg-config` 等。
2. **Python 开发工具链缺失**：`python3-dev` 或编译器（`gcc`/`g++`）。
3. **Conda/Pip 混合安装冲突**：`matplotlib` 的依赖未完全通过 Conda 安装。

---

### **解决方案步骤**

#### **1. 安装系统级依赖**
在 Ubuntu 上运行以下命令：
```bash
sudo apt-get update
sudo apt-get install -y libfreetype6-dev libpng-dev pkg-config libjpeg-dev libpq-dev python3-dev
```

````




## Other_Answers



# FootNotes

[^1]: 怎么解决conda安装不了依赖包的问题_Channels
[^2]: to_be_solved如何解决上面的问题