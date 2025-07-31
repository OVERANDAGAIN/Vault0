---
创建时间: 2025-一月-14日  星期二, 10:15:32 上午
created: 2025-01-14T10:15
updated: ...
---
[[CUDA总结]]

# Sources

- [?] conda常用虚拟环境相关指令


# Codes

```bash

# 常用指令

# 查看已有环境列表
conda env list  # 列出所有 Conda 环境

# 激活环境
conda activate 环境名  # 进入指定环境（例如：conda activate myenv）

# 创建新环境
conda create -n myenv python=3.9 -y  # 创建名为 myenv 的环境，并指定 Python 版本为 3.9


# 删除环境
conda remove -n myenv --all  # 删除名为 myenv 的环境

# 查看当前环境中的所有包
conda list  # 列出当前环境中的所有包及版本

# 安装新包
conda install 包名 -y  # 安装指定包（例如：conda install numpy）

# 更新包
conda update 包名 -y  # 更新指定包到最新版本（例如：conda update pandas）

# 卸载包
conda remove 包名 -y  # 删除指定包（例如：conda remove matplotlib）

# 停止激活环境
conda deactivate  # 退出当前激活的环境

# 清理 Conda 缓存
conda clean --all -y  # 删除未使用的包和缓存文件，释放空间

---

# 较常用指令

# 导出当前环境到文件
conda env export > environment.yml  # 将当前环境导出为 environment.yml 文件

# 从文件创建新环境
conda env create -f environment.yml  # 根据 environment.yml 文件创建环境



# 搜索包
conda search 包名  # 搜索指定包（例如：conda search scipy）

# 更新 Conda
conda update conda -y  # 更新 Conda 到最新版本

---

# 少用但有用指令

# 克隆环境
conda create --name myenv_clone --clone myenv  # 克隆 myenv 环境到 myenv_clone

# 查看 Conda 版本
conda --version  # 显示 Conda 当前版本

# 检查包依赖信息
conda info 包名  # 查看指定包的依赖信息（例如：conda info numpy）

# 修复环境依赖
conda install --revision 修复点  # 回退环境到指定修复点

# 查看 GPU 是否可用（适合 PyTorch 用户）
python -c "import torch; print(torch.cuda.is_available())"  # 检查 PyTorch 是否能使用 GPU

```

# Solutions


## Changes


## GPT_Answers


## Other_Answers


# FootNotes
