---
创建时间: 2024-十二月-12日  星期四, 3:53:04 下午
修改时间: 2024-十二月-13日  星期五, 3:32:00 下午
---
[[AlphaGo]]

# Questions
RL vs SL在更新公式方面的区别

# Answers
[Site Unreachable](https://www.zhihu.com/question/361099606/answer/1853785280?utm_psn=1850573945666932736)

《Reinforcement Learning: An Introduction》的第一章提到过强化学习和监督学习的区别，我觉得解释得很清晰：

    Reinforcement Learning is different from supervised learning, the kind of learning studied in most current research in the field of machine learning. Supervised learning is learning from a training set of labeled examples provided by a knowledgable external supervisor. Each example is a description of a situation together with a specification—the label—of the correct action the system should take to that situation, which is often to identify a category to which the situation belongs. The object of this kind of learning is for the system to extrapolate, or generalize, its response so that it acts correctly in situations not present in the training set. This is an important kind learning, but alone it is not adequate for learning from interaction. In interactive problems it is often impractical to obtain examples of desired behavior that are both correct and representative of all the situations in which the agent has to act. In uncharted territory—where one would expect learning to be most beneficial—an agent must be able to learn from its own experience.

这段话使用强化学习的术语来表述监督学习：每个样本（如图片）是situation（也就是state），样本的label是针对该situation应该采取的正确的action。但是仅有监督学习是难以被用于学习与环境的交互，原因有三点：

    难以获得在与环境的交互中针对环境的situation应该采取的正确behavior（action）;
    难以获得在与环境的交互中足够多的具有代表性的situation-behavior对（即样本）;
    对于从未涉及过的领域，样本是很难获得的，agent只能根据自己的经历来学习如何与环境互动，即自己产生样本来让自己学习。

以教智能体打游戏为例。分别用监督学习和强化学习去打游戏，核心区别就在于监督学习是试图让智能体复制数据集的行为（从预先提供的样本中学习），而强化学习是让智能体在与环境的交互中逐渐变强（自己产生样本来让自己学习）。具体表现如下：1）监督学习需要为每一帧游戏画面标注尽可能好的操作作为label，因为label的表现就是它的上限。但如果是用强化学习来教智能体打游戏，那就不必完美的操作作为标签，强化学习可以通过reward去鼓励好的操作、惩罚不好的操作，这从policy gradient方法和监督学习更新的梯度就可以看出。2）监督学习需要预先准备好大量“游戏画面-操作”样本作为训练集，如第1点所说，为了让这些样本足够正确，必须由优秀的玩家产生，如果是由正在学习的智能体产生的话并无意义，这只会让其表现原地踏步甚至恶化。强化学习具有针对action的奖惩机制，因此可以自己给自己产生样本，逐渐让自己变强。


**总结**

本文选取了两个学习任务：学习识别图片中是否有猫 和 学习如何打赢乒乓球 来比较直观的阐述了传统的有监督学习和强化学习的一些区别。 主要包括了几个方面：两者的训练样本产生机制和样本分布不同，有监督学习的样本是独立同分布的，强化学习的样本是序列采样的，有明确的先后关系；两者的优化目标不同，有监督学习是样本间学习目标是独立的，只对一个固定的即时误差（奖励）负责，强化学习的样本学习目标来自当前序列的累积奖励反馈，学习的目标是对于一个序列的累积奖励负责。在进行一定抽象的情况下，有监督学习可以看做是一种特殊的强化学习，强化学习是一种更高阶更泛化的机器学习范式。

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

## Other_Answers


# Codes

```python

```
