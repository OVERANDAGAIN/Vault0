---
创建时间: 2025-七月-4日  星期五, 12:29:47 中午
---
[[cleanRL]]

# Questions

- [?] 
参考CSDN博客 方法一： [成功了！\|\| Poetry安装pytorch \|\| 整理自github项目Poetry下的issue\_poetry pytorch-CSDN博客](https://blog.csdn.net/raw_inputhello/article/details/132103805)[^1]


```python

```

# Answers

## GPT_Answers

---

## ✅ 最终推荐步骤（适配你系统：4090 + Windows + Poetry + CUDA 11.8 + Python 3.8）

---

### 📄 1. 修改你的 `pyproject.toml`（PyTorch 相关内容）

```toml
[tool.poetry.dependencies]
python = "3.8.20"

torch = { url = "https://download.pytorch.org/whl/cu118/torch-2.1.0%2Bcu118-cp38-cp38-win_amd64.whl" }
torchvision = { url = "https://download.pytorch.org/whl/cu118/torchvision-0.16.0%2Bcu118-cp38-cp38-win_amd64.whl" }
torchaudio = { url = "https://download.pytorch.org/whl/cu118/torchaudio-2.1.0%2Bcu118-cp38-cp38-win_amd64.whl" }

```

---

### ✅ 3. 安装项目常规依赖

```bash
poetry lock
poetry install
```

此时 lock 文件不会被 PyTorch wheel 卡住。

---

### ✅ 5. 验证 CUDA 可用性

```bash
poetry run python -c "import torch; print(torch.__version__, torch.cuda.is_available(), torch.cuda.get_device_name(0))"
```

---
## 结果

![[Pasted image 20250704123230.png]]


## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: CSDN关于poetry与Cuda