[[Encounters]]

# Musings
![[Pasted image 20250715172752.png]]

[\[AUTOML23\] A Tutorial on MetaReinforcement Learning - YouTube](https://www.youtube.com/watch?v=XUQ9jLOZqGc)[^1] 视频的 47:00 处
# What
- [?] 

`hint` 提示 `agent` 向上走能达到 `goal`
但是 `agent` 在尝试过 `goal` 和 `death` 后才知道 `hint` 是有用的




# Why

当然可以，以下是对你提供内容的语言组织与解释，可用于笔记或文档中：

---

在 [AUTOML 2023 的 Meta Reinforcement Learning 教程](https://www.youtube.com/watch?v=...)(视频47:00处) 中，讲者用一个“**Chicken-or-Egg（先有鸡还是先有蛋）**”的例子来说明 **探索（exploration）中的信息悖论**。

如下图所示，agent 站在 A 点：

|           |   |
| --------- | - |
| **Hint**  | A |
| **Goal**  |   |
| **Death** |   |

* **Hint** 提示 agent 向上走会到达 **Goal**；
* 但问题在于：agent 只有在尝试了 **Goal** 和 **Death**（也就是左右两个方向）之后，**才知道 Hint 是有用的**。

这构成了一个探索困境：

> agent 在不知道 hint 有效性的前提下，**没有理由优先去看 hint**，但若不看 hint，永远无法知道它的价值。

这种结构常出现在 meta-RL 中，用于研究 agent 如何在长期学习中逐步识别哪些线索是可靠的。它体现了**知识的获得本身依赖于探索的结果**，是一种典型的元学习挑战。

# How



# Codes

```python

```



# FootNotes

[^1]: youtube视频网站