---
创建时间: 2025-三月-17日  星期一, 7:36:42 晚上
created: 2025-01-15T12
updated: ...
---
[[HOP+]]


# Objectives
件描述 2025.3.17 ： 
[[2025-03-17]]


# Issues & Debugging
上面的这个呈现一定的周期变化，可不可能是因为每次都是从头开始训练的？也就是说我在训练的过程中，不仅需要 save_models，还需要load?比如下面的基于RLlib的代码：每次在 learn_on_batch里面才会寻训练保存vae: 

```python
  def learn_on_batch(self, samples):
                load(model, self.save_dir + f'/{name}_in_{self.player.my_player_name}.pth')
				#vae train
				#moa train
                #save vae
                self.learner.save_models(self.save_dir)
                #save moa
                torch.save(model.state_dict(), self.save_dir + f'/{name}_in_{self.player.my_player_name}.pth')
           #policy train
            self.player.update()

```


## Problem1: 
- [?] 

### 1_Answers
### **周期性 Loss 激增可能由重新初始化 VAE 训练导致**
从你的代码来看，你 **每次在 `learn_on_batch()` 里训练 VAE，并在训练结束后保存模型**：
```python
# 在 learn_on_batch() 内训练后保存 VAE
self.learner.save_models(self.save_dir)
```
但如果你 **每次训练时没有加载 VAE 的参数**，那么 **下一次调用 `learn_on_batch()` 时，VAE 可能会重新初始化**，导致 loss **从头开始下降**，形成类似周期性的震荡。

---

## **✅ 解决方案：每次训练前加载 VAE**
### **1️⃣ 训练前加载已保存的 VAE**
你目前的代码 **只在训练后保存模型**，但 **没有在下一轮训练前加载模型**。导致的问题：
- 每次 `learn_on_batch()` 训练时，VAE 可能是 **新初始化的**，没有利用之前训练好的参数。
- 这样 **每次 VAE 训练都会从头开始，导致 loss 先暴涨再下降**，形成你看到的 **周期性剧烈震荡**。

## **✅ 解决方案分析**
| **问题** | **原因** | **解决方案** |
|---------|---------|-------------|
| **Loss 周期性暴涨** | 每次 `learn_on_batch()` 可能是 **从零开始训练 VAE**，导致 loss 重新初始化 | **每次训练前先 `load_models()` 以继续训练** |
| **VAE 训练不能持续优化** | 训练后保存 VAE，但下一次训练没有加载之前的模型 | **确保 `save_models()` 之后，下次训练前 `load_models()`** |
| **每次 loss 先高后低** | 可能是 VAE 被重新初始化，每次都从零学起 | **加载已有模型，防止 loss 重新初始化** |

### 2_Answers





# Limitations
# Future Work
# FootNotes