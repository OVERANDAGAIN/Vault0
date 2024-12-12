[[AlphaGo]]

# Questions
RL vs SL在更新公式方面的区别

# Answers


## GPT_Answers
从**参数更新公式**本身出发，可以更精确地阐述有监督学习和强化学习的区别。

---

### 有监督学习参数更新公式
有监督学习的目标是最小化样本的损失函数 $L(\theta)$，更新公式直接基于梯度计算：

$$\theta \leftarrow \theta - \eta \nabla_\theta L(\theta),$$
其中：
- $\nabla_\theta L(\theta)$ 是通过误差对模型参数 $\theta$ 求导得到的梯度；
- $L(\theta) = \ell(y, f(x; \theta))$，即真实标签 $y$ 和预测值 $f(x; \theta)$ 的差异。

更新过程直接由样本提供的监督信号驱动，优化方向稳定且与训练数据一致。

---

### 强化学习参数更新公式
强化学习通过交互式环境反馈更新参数，其目标是最大化累计奖励 $J(\theta)$，更新公式通常依赖于**值函数**或**策略函数**。

#### 1. **基于值函数的更新**
强化学习中，值函数 $Q(s, a; \theta)$ 是状态-动作对的价值估计，其更新基于贝尔曼公式：

$$Q(s, a) \leftarrow Q(s, a) + \alpha \left[ r + \gamma \max_{a'} Q(s', a'; \theta) - Q(s, a) \right].$$

这反映了强化学习的目标：当前价值靠近未来奖励的估计。

#### 2. **基于策略梯度的更新**
如果采用策略梯度方法，则直接优化策略函数 $\pi(a|s; \theta)$。参数更新公式为：

$$\theta \leftarrow \theta + \eta \mathbb{E} \left[ \nabla_\theta \log \pi(a|s; \theta) \cdot Q(s, a) \right].$$

其中：
- $\nabla_\theta \log \pi(a|s; \theta)$ 是策略的梯度；
- $Q(s, a)$ 是当前动作的预期回报。

这个公式的更新方向来自环境采样的反馈信号，较为噪声化。

---

### 区别总结
1. **目标函数**：
   - **有监督学习**：直接优化损失 $L(\theta)$，以样本为基础；
   - **强化学习**：优化累计奖励 $J(\theta)$，以环境反馈为基础。

2. **更新依据**：
   - **有监督学习**：损失梯度 $\nabla_\theta L(\theta)$。
   - **强化学习**：值函数 $Q(s, a)$ 或策略梯度 $\nabla_\theta \log \pi(a|s; \theta) \cdot Q(s, a)$。

3. **更新方式**：
   - **有监督学习**：基于所有样本独立同分布的梯度更新；
   - **强化学习**：基于环境的动态交互，可能具有高噪声和延迟。

## Other_Answers


# Codes

```python

```
