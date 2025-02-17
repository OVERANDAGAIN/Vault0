---
创建时间: 2025-一月-7日  星期二, 10:15:54 上午
created: 2025-01-07T10:15
updated: 2025-02-17-22.
---
[[OMG]]

# Questions

- [?] 如何理解这里hit ratio 的举的例子的含义？

![[Pasted image 20250107101644.png]]
# Answers

即 agent 预测的 $\hat{\mathcal{T}}$ 中的第 $t$ 项在真实的 trajectory 序列里面是否出现。

## GPT_Answers


这段关于 **subgoal hit ratio** 的例子旨在解释如何衡量预测的轨迹与真实轨迹的匹配程度。下面是对其含义的详细分析：

### 1. **定义 subgoal hit ratio**
- **真实轨迹 $\mathcal{T}$**: 对手的实际轨迹，表示为 $\mathcal{T} = (s_0, s_1, \ldots, s_T)$。
- **预测轨迹 $\hat{\mathcal{T}}$**: 从 $t = 0$ 到 $T-1$ 的预测，表示为 $\hat{\mathcal{T}} = (\hat{s}_0, \hat{s}_1, \ldots, \hat{s}_{T-1})$。

**Subgoal hit ratio 的计算公式**:
$$\text{subgoal hit ratio} = \frac{\{ \hat{s}_t \mid \hat{s}_t \in T_t, \, t = 0, 1, \ldots, T-1 \}}{|\mathcal{T}|}$$
其中：
- $T_t$ 表示从时间步 $t$ 开始的对手未来轨迹，即 $T_t = (s_t, s_{t+1}, \ldots, s_T)$。
- 分子表示预测的状态 $\hat{s}_t$ 与 $T_t$ 的交集数量。

### 2. **举例分析**
假设：
- 对手的真实轨迹 $\mathcal{T} = (s_1, s_2, s_3, s_4, s_5)$。
- 每个时间步 $t$ 的对手未来轨迹 $T_t$ 分别为：
  - $T_0 = (s_1, s_2, s_3, s_4, s_5)$
  - $T_1 = (s_2, s_3, s_4, s_5)$
  - $T_2 = (s_3, s_4, s_5)$
  - $T_3 = (s_4, s_5)$
  - $T_4 = (s_5)$
- 代理的预测轨迹为 $\hat{\mathcal{T}} = (s_3, s_1, s_5, s_5)$。

分析每个预测：
- $\hat{s}_0 = s_3 \in T_0 = \{s_1, s_2, s_3, s_4, s_5\}$, 命中。
- $\hat{s}_1 = s_1 \notin T_1 = \{s_2, s_3, s_4, s_5\}$, 未命中。
- $\hat{s}_2 = s_5 \in T_2 = \{s_3, s_4, s_5\}$, 命中。
- $\hat{s}_3 = s_5 \in T_3 = \{s_4, s_5\}$, 命中。

**命中的预测状态为**: $\{s_3, s_5\}$，共有 2 个。

### 3. **计算 subgoal hit ratio**
真实轨迹的长度 $|\mathcal{T}| = 5$。

Subgoal hit ratio:
$$\text{subgoal hit ratio} = \frac{|\{s_3, s_5\}|}{5} = \frac{2}{5} = 0.4$$

### 4. **举例的含义**
这个例子说明了：
1. **子目标的定义**: 代理的预测状态只有在出现在对手的未来轨迹中时才算命中。
2. **匹配程度的衡量**: Subgoal hit ratio 提供了代理预测的准确率的定量评价。
3. **具体实例的验证**: 在此例中，代理的预测 $s_3, s_5$ 符合对手的未来轨迹，因此计算得出命中率为 0.4。

总的来说，subgoal hit ratio 是衡量预测准确性的一个指标，特别适用于时间序列轨迹的场景。

## Other_Answers


# Codes

```python

```


# FootNotes
