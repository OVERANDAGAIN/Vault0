---
创建时间: 2025-七月-2日  星期三, 2:26:31 下午
---
[[TongSim]]

# Questions

- [?] 

```python

```

# Answers

## GPT_Answers
当然，下面是你这次成功运行 TongSim 客户端 + Python SDK 控制智能体的 **简洁流程总结**，适合记录到你的笔记中 👇

---

## ✅ TongSim SDK 使用流程简明总结

### 🧱 1. **启动仿真环境**

* 在 `TongSim` 安装目录中运行：

  ```bash
  RunAIBaby.bat
  ```
* 会启动 UE5 窗口，作为仿真服务端，默认监听 gRPC 端口（如 `127.0.0.1:5056`）

---

### 🐍 2. **运行 Python 控制代码**

* 确保你已经安装好 TongSim Python SDK，使用 uv 管理项目

* 示例代码入口：

  ```python
  import tongsim as ts

  with ts.TongSim(grpc_endpoint="127.0.0.1:5056") as ue:
      ue.open_level("SDBP_Map_007")
      agent = ue.spawn_agent("SDBP_Aich_AIBabyV7")
      anims = agent.get_playable_animation_names()
      agent.do_action(ts.action.PlayAnimation(random.choice(anims)))
  ```

* 运行方式（推荐两种）：

  ```bash
  uv run python examples/play_random_anim.py
  ```

  或在 PyCharm 中直接运行 `.py` 文件

---

### 🔄 3. **交互原理概览**

```text
[Python SDK 控制端] → gRPC → [UE5 客户端仿真环境]
       ↓                                ↑
  open_level / spawn_agent        显示场景、响应动作
  do_action / capture_image       播放动画 / 拍图 / 输出感知
```

---

### ✅ 你完成的动作：

* 启动了 UE 客户端 ✔️
* 成功通过 Python 控制加载地图 ✔️
* 创建了智能体 ✔️
* 获取动画列表并随机播放 ✔️

---
![[Pasted image 20250702142757.png]]


![[Pasted image 20250702142807.png]]

## DS_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
