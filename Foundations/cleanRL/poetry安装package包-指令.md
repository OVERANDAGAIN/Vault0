---
创建时间: 2025-七月-3日  星期四, 8:55:07 晚上
---
[[cleanRL]]

# Questions

- [?] 

```python

```

# Answers

>对于toml中已经声明的包，用 poetry install
>未声明的包，用 poetry add


如果你需要安装例如 `pettingzoo` 所需的所有包，执行：

```bash
poetry install --extras "pettingzoo"
```

![[Pasted image 20250703211426.png]]
---

```ad-tip
经过一系列cmake ，zlib等配置，安装完成（询问gpt即可）
```

![[Pasted image 20250703214237.png]]

# ✅ Poetry optional 依赖未安装的原因与解决方案

---

## ❗ 问题起点：为什么我运行了 `poetry install`，但 `SuperSuit` 等依赖没有被安装？

在已有的 `pyproject.toml` 中，我发现很多依赖（例如 `SuperSuit`, `PettingZoo`, `mujoco`, `jax` 等）并没有随着 `poetry install` 一起被安装。

例如：

```bash
poetry add SuperSuit
```

输出提示：

```bash
The following packages are already present in the pyproject.toml and will be skipped:
  - SuperSuit
```

但我运行代码时报：

```text
ModuleNotFoundError: No module named 'supersuit'
```

---

## 🔍 根本原因分析：

1. 这些包在 `.toml` 中被定义为了 **optional = true**
2. 它们仅属于某个 extras 分组（如 `pettingzoo`）
3. 默认执行 `poetry install` 时 **不会安装任何 optional 依赖**
4. `poetry add 包名` 只能添加新依赖，不能“激活” optional 依赖

---

## ✅ 正确的解决方法（官方推荐方式）

### ✅ 方法 1：启用 extras 分组进行安装

如果你需要安装例如 `pettingzoo` 所需的所有包，执行：

```bash
poetry install --extras "pettingzoo"
```

安装内容包括：

* `SuperSuit`
* `PettingZoo`
* `multi-agent-ale-py`

因为在 `.toml` 中有：

```toml
[tool.poetry.extras]
pettingzoo = ["PettingZoo", "SuperSuit", "multi-agent-ale-py"]
```

---

### ✅ 方法 2：一次安装多个 extras 分组（比如 mujoco + jax）

```bash
poetry install --extras "pettingzoo,jax,mujoco"
```

---

### ✅ 方法 3：一次性安装所有 optional 包（开发者常用）

```bash
poetry install --all-extras
```

---

### ✅ 说明 4
这样未来运行 `poetry install` 就会默认安装它，无需额外参数。

```
ale-py = {version = "0.8.1", optional = true}
AutoROM = {extras = ["accept-rom-license"], version = "~0.4.2", optional = true}
opencv-python = {version = "^4.6.0.66", optional = true}
procgen = {version = "^0.10.7", optional = true}
pytest = {version = "^7.1.3", optional = true}
mujoco = {version = "<=2.3.3", optional = true}
imageio = {version = "^2.14.1", optional = true}
mkdocs-material = {version = "^8.4.3", optional = true}
markdown-include = {version = "^0.7.0", optional = true}
openrlbenchmark = {version = "^0.1.1b4", optional = true}
jax = {version = "0.4.8", optional = true}
jaxlib = {version = "0.4.7", optional = true}
flax = {version = "0.6.8", optional = true}
optuna = {version = "^3.0.1", optional = true}
optuna-dashboard = {version = "^0.7.2", optional = true}
envpool = {version = "^0.6.4", optional = true}
PettingZoo = {version = "1.18.1", optional = true}
SuperSuit = {version = "3.4.0", optional = true}
multi-agent-ale-py = {version = "0.1.11", optional = true}
boto3 = {version = "^1.24.70", optional = true}
awscli = {version = "^1.31.0", optional = true}
shimmy = {version = ">=1.1.0", optional = true}
dm-control = {version = ">=1.0.10", optional = true}
h5py = {version = ">=3.7.0", optional = true}
optax = {version = "0.1.4", optional = true}
chex = {version = "0.1.5", optional = true}
numpy = ">=1.21.6"
```


---

## ✅ 如何查看有哪些 extras 可选？


>可以直接打开vscode看toml文件的

```
[tool.poetry.extras]
```

输出示例：

```
[tool.poetry.extras]
atari = ["ale-py", "AutoROM", "opencv-python", "shimmy"]
procgen = ["procgen"]
plot = ["pandas", "seaborn"]
pytest = ["pytest"]
mujoco = ["mujoco", "imageio"]
jax = ["jax", "jaxlib", "flax"]
docs = ["mkdocs-material", "markdown-include", "openrlbenchmark"]
envpool = ["envpool"]
optuna = ["optuna", "optuna-dashboard"]
pettingzoo = ["PettingZoo", "SuperSuit", "multi-agent-ale-py"]
cloud = ["boto3", "awscli"]
dm_control = ["shimmy", "mujoco", "dm-control", "h5py"]

```

---

📌 **结论一句话**：

> `poetry install` 不装 optional 包是设计行为，使用 `--with 分组名` 安装 extras 才能正确引入 optional 依赖！

---


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
