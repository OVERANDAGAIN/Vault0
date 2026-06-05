---
创建时间: 2026-五月-18日  星期一, 5:20:16 下午
---


1. **turn-level reward**：每轮根据用户反馈计算即时 reward。
2. **segment-level reference**：用当前 topic segment 作为语义参照，判断广告是否契合、话题是否偏移。
3. **episode-level objective**：用累计回报和 terminal reward 表达长期目标。


---

# 1. 当前 reward 设计是否满足需求？

可以说：**满足大框架，但还不能直接原样放进 formulation。**

它已经回答了 formulation 中 reward 需要回答的核心问题：

$$r_t = R(s_t, a_t, y_t, u_{t+1})$$

也就是说，Planner 在状态 $s_t$ 下采取动作 $a_t$，Speaker 生成回复 $y_t$，Mock User 产生反馈 $u_{t+1}$，RewardCalculator 根据这些信息计算本轮 reward。

你给的 reward 设计也明确了 reward 不是单一 CTR 或单轮满意度，而是综合：

```text
用户任务价值
对话持续性
广告收益
用户反感
广告过载
话题偏移
terminal outcome
```

这和我们当前的 REC-DIAL 目标是匹配的。

---

# 2. 最大问题：符号需要全部改一下

你现在的 reward 文档里有几个符号和我们 formulation 已经定义过的变量冲突。

| reward 文档中的符号 | 当前含义              | 冲突对象                   | 建议改名               |
| ------------- | ----------------- | ---------------------- | ------------------ |
| $s_t$         | task satisfaction | RL state $s_t$         | $\eta_t^{\text{task}}$    |
| $a_t$         | ad acceptance     | Planner action $a_t$   | $\alpha_t^{\text{ad}}$    |
| $o_t$         | ad overload       | observation $o_t$      | $\omega_t^{\text{ad}}$    |
| $d_t$         | topic deviation   | action 中 $d_t$ 表示是否插广告 | $\Delta_t^{\text{topic}}$ |
| $c_t$         | continuation      | 和 $C_t^{\text{user}}$ 形式接近    | $\kappa_t^{\text{cont}}$  |

所以 reward 最好改写为：

$$r_t = \lambda_{\text{task}} \eta_t^{\text{task}} + \lambda_{\text{cont}} \kappa_t^{\text{cont}} + \lambda_{\text{ad}} \alpha_t^{\text{ad}} - \lambda_{\text{annoy}} \chi_t^{\text{annoy}} - \lambda_{\text{load}} \omega_t^{\text{ad}} - \lambda_{\text{drift}} \Delta_t^{\text{topic}}$$

其中：

| 符号                 | 含义              |
| ------------------ | --------------- |
| $\eta_t^{\text{task}}$    | 任务推进 / 任务满足程度   |
| $\kappa_t^{\text{cont}}$  | 用户继续交互的信号       |
| $\alpha_t^{\text{ad}}$    | 广告接受、点击、兴趣等商业收益 |
| $\chi_t^{\text{annoy}}$   | 用户反感或负反馈        |
| $\omega_t^{\text{ad}}$    | 广告过载 / 广告密度惩罚   |
| $\Delta_t^{\text{topic}}$ | 话题偏移惩罚          |

这样不会和 $s_t, a_t, o_t, d_t$ 冲突。

---

# 3. Reward 输入需要和当前 formulation 对齐

我们当前 transition 定义是：

$$s_t = M(p, H_t)$$

$$a_t = (d_t, j_t, w_t, k_t)$$

$$y_t = \text{Speaker}(s_t, a_t)$$

$$u_{t+1} = \text{UserSim}(H_t, y_t)$$

所以 reward 最好写成：

$$r_t = R(s_t, a_t, y_t, u_{t+1}, H_t)$$

比之前：

$$r_t = R(s_t, a_t, y_t, u_{t+1})$$

多一个 $H_t$，原因是你 reward 里涉及：

```text
最近 k 轮广告数量
当前 topic segment
用户是否持续对话
历史上是否已有广告曝光
```

这些都需要从 $H_t$ 或 episode log 中读取。

如果想保持公式简洁，可以写：

$$r_t = R(s_t, a_t, y_t, u_{t+1})$$

但在文字里说明：$s_t$ 和 $H_t$ 已经包含必要的历史与事件日志。更严谨的版本是加上 $H_t$。

---

# 4. Segment 设计是合理的，但要说明它从哪里来

你引入 topic segment 是有价值的，尤其对：

```text
topic coherence
ad-topic fit
topic drift penalty
```

非常重要。

但是当前主 formulation 里没有显式定义 segment。所以需要补一句：

> topic segment 不作为额外的 RL state 变量，而是由 Monitor 从 $H_t$ 或 $\sigma_t$ 中估计得到，用作 RewardCalculator 的语义参照。

可以形式化为：

$$z_t = Z(H_t)$$

或者：

$$z_t = Z(\sigma_t, \ell_t^K)$$

其中 $z_t$ 表示当前 topic segment 的语义表示。

然后 topic deviation 可以写成：

$$\Delta_t^{\text{topic}} = 1 - \cos(\text{embed}(y_t), z_t)$$

但这里还需要一个细节：**如果 Planner 本轮选择了换话题，也就是 $w_t=1$，那么不能简单把所有偏离当前 segment 的回复都当作负面。**

否则 Planner 只要换话题，就会天然受到 topic deviation penalty。

更合理的是：

$$\Delta_t^{\text{topic}} =
\begin{cases}
1 - \cos(\text{embed}(y_t), z_t), & w_t = 0 \\
1 - \cos(\text{embed}(k_t), \text{embed}(g_t, P_t^+, C_t^{\text{user}})), & w_t = 1
\end{cases}$$

含义是：

```text
如果不换话题，则惩罚当前回复偏离当前 segment；
如果换话题，则评价新 topic 是否仍然和用户目标、偏好、约束相关。
```

不用一开始写得这么复杂，但这个逻辑需要在文档里说明。

---

# 5. 广告密度惩罚可以保留，但符号要改

你现在写的是：

$$o_t = \alpha_1 \cdot \mathbf{1}[\text{ad}_t] + \alpha_2 \cdot \sum_{i=t-k}^{t-1} \mathbf{1}[\text{ad}_i]$$

建议改成：

$$\omega_t^{\text{ad}} = \beta_1 \mathbf{1}[d_t=1] + \beta_2 \sum_{i=\max(0,t-K)}^{t-1} \mathbf{1}[d_i=1]$$

其中：

| 符号                | 含义                    |
| ----------------- | --------------------- |
| $d_t$             | Planner action 中是否插广告 |
| $\omega_t^{\text{ad}}$   | 广告过载惩罚                |
| $K$               | 统计最近广告曝光的窗口大小         |
| $\beta_1, \beta_2$ | 广告密度惩罚内部权重            |

这和我们当前 action 定义完全对应，因为 Planner 的动作里本来就有：

$$d_t \in \{0,1\}$$

表示是否插广告。

---

# 6. 广告接受度需要和 $d_t, j_t$ 绑定

广告收益项不应该在没有插广告时也计算。

所以：

$$\alpha_t^{\text{ad}} = 0,\quad \text{if } d_t = 0$$

当 $d_t = 1$ 时：

$$\alpha_t^{\text{ad}} = A(j_t, y_t, u_{t+1}, H_t)$$

其中 $A(\cdot)$ 可以根据以下信号估计：

```text
用户点击广告；
用户接受广告；
用户追问广告；
用户表达兴趣；
用户没有反感但继续互动。
```

如果没有真实 click signal，那么可以先用 LLM judge / classifier 估计。文档里要明确这是 **proxy reward**，不是直接观测 reward。

---

# 7. Reward model 的边界必须写清楚

你文档里有一句很关键：

> 奖励组成部分无法直接观测到，而是通过利用用户反馈信号所学习到的奖励模型来进行估算。

这句话是合理的，但要补充一个训练边界：

> Reward model should be fixed or offline-calibrated during Planner RL training.

也就是说，RewardCalculator / reward model 不应该和 Planner 一起在线更新。否则 reward function 会变，RL 环境会非平稳。

可以写成：

$$\hat{r}_t = R_{\phi}(s_t, a_t, y_t, u_{t+1}, H_t)$$

其中 $\phi$ 是 reward model 参数。
在 Planner RL 阶段，$\phi$ 固定，优化的是：

$$\theta$$

即 Planner policy 参数。

如果要更规范：

$$\theta^* = \arg\max_{\theta} \mathbb{E}_{\pi_{\theta}, R_{\phi}} \left[ \sum_{t=0}^{T-1} \gamma^t r_t + r_{\text{terminal}} \right]$$

其中 $R_{\phi}$ 是固定的 reward estimator。

---

# 8. Terminal reward 设计是必要的，而且写得合理

你现在的 terminal reward：

$$r_{\text{terminal}} =
\begin{cases}
+R_{\text{success}}, & \text{任务完成} \\
-R_{\text{annoy}}, & \text{因广告反感退出} \\
-R_{\text{fail}}, & \text{任务未完成退出} \\
0, & \text{中性结束}
\end{cases}$$

这个很重要，建议保留。

它解决了一个问题：不能把所有结束都当成坏事。

例如：

```text
用户任务完成后自然结束：正向
用户因广告反感退出：强负向
用户未完成就退出：负向
用户中性离开：中性
```

这和我们的 episode-level objective 是一致的。

---

# 9. 对话长度控制也满足需求

你文档里提到三种机制：

```text
discount factor
maximum turn length
terminal reward
```

这三者是合理的。

它能避免 Planner 通过“拖长对话”获得更高累计 reward。

在 formulation 里可以写成：

$$T \leq T_{\max}$$

$$J(\theta) = \mathbb{E}_{\pi_{\theta}} \left[ \sum_{t=0}^{T-1} \gamma^t r_t + r_{\text{terminal}} \right]$$

其中：

$$\gamma \in [0,1]$$

用于折扣未来收益。

---

# 10. 建议整合成当前 formulation 的 Reward 部分

你可以把 reward 部分标准化为下面这个版本。

---

## Reward Function

At each agent decision turn $t$, after the Planner selects $a_t$, the Speaker generates $y_t$, and the Mock User returns $u_{t+1}$, the RewardCalculator computes an immediate scalar reward:

$$r_t = R(s_t, a_t, y_t, u_{t+1}, H_t)$$

We decompose $r_t$ into user value, business value, and constraint penalties:

$$r_t = \lambda_{\text{task}} \eta_t^{\text{task}} + \lambda_{\text{cont}} \kappa_t^{\text{cont}} + \lambda_{\text{ad}} \alpha_t^{\text{ad}} - \lambda_{\text{annoy}} \chi_t^{\text{annoy}} - \lambda_{\text{load}} \omega_t^{\text{ad}} - \lambda_{\text{drift}} \Delta_t^{\text{topic}}$$

where:

| Term               | Meaning                            | Signal type                  |
| ------------------ | ---------------------------------- | ---------------------------- |
| $\eta_t^{\text{task}}$    | task progress / task satisfaction  | semantic proxy               |
| $\kappa_t^{\text{cont}}$  | continuation / retention proxy     | behavioral signal            |
| $\alpha_t^{\text{ad}}$    | ad acceptance / ad interest        | event or semantic proxy      |
| $\chi_t^{\text{annoy}}$   | user annoyance / negative feedback | semantic or affective proxy  |
| $\omega_t^{\text{ad}}$    | ad overload penalty                | rule-based structural signal |
| $\Delta_t^{\text{topic}}$ | topic drift penalty                | semantic structure signal    |

其中：

$$\omega_t^{\text{ad}} = \beta_1 \mathbf{1}[d_t=1] + \beta_2 \sum_{i=\max(0,t-K)}^{t-1} \mathbf{1}[d_i=1]$$

话题偏移基于当前 topic segment 表示 $z_t$ 计算：

$$z_t = Z(H_t)$$

$$\Delta_t^{\text{topic}} = 1 - \cos(\text{embed}(y_t), z_t)$$

如果本轮 Planner 明确选择换话题，即 $w_t=1$，则 $\Delta_t^{\text{topic}}$ 应评价新 topic $k_t$ 与用户目标和偏好的匹配程度，而不是简单惩罚偏离旧 segment。

---

## Terminal Reward

Episode-level return is defined as:

$$G = \sum_{t=0}^{T-1} \gamma^t r_t + r_{\text{terminal}}$$

where:

$$r_{\text{terminal}} =
\begin{cases}
+R_{\text{success}}, & \text{task completed} \\
-R_{\text{annoy}}, & \text{exit due to ad annoyance} \\
-R_{\text{fail}}, & \text{exit before task completion} \\
0, & \text{neutral ending}
\end{cases}$$

The Planner objective is:

$$J(\theta) = \mathbb{E}_{\pi_{\theta}} \left[ \sum_{t=0}^{T-1} \gamma^t r_t + r_{\text{terminal}} \right]$$

---

# 11. 还需要补的内容

现在 reward 文档已经足够支撑 formulation，但还需要补四个细节，才能进入实现或实验设计。

第一，**每个 proxy 的具体标注或模型来源**。例如 $\eta_t^{\text{task}}$、$\chi_t^{\text{annoy}}$、$\alpha_t^{\text{ad}}$ 是 LLM judge、BERT classifier，还是 rule-based。需要后续定。

第二，**reward model 是否固定**。建议在 Planner RL 阶段固定 RewardCalculator / reward model，避免 reward drift。

第三，**各项 reward 的范围归一化**。最好都归一到 $[0,1]$ 或 $[-1,1]$，否则 $\lambda$ 很难调。

第四，**topic segment $z_t$ 的生成方式**。需要说明它来自 Monitor 对 $H_t$ 的分段，还是来自 $\sigma_t$ 中的当前 topic summary。这个不一定要现在实现很复杂，但 formulation 里要有定义。

总结：你的 reward 文档大方向是满足的，但需要做符号清理和 formulation 对齐。最重要的改动是不要再用 $s_t, a_t, o_t, d_t$ 表示 reward 子项，因为这些已经在 RL formulation 中有固定含义。