---
创建时间: 2026-六月-15日  星期一, 6:08:07 晚上
---

# Metrics

**Metrics 不能直接依赖我们自定义的 reward。**

如果 metrics 继续使用 `total_reward / discounted_return / avg_task_reward / avg_ad_penalty` 这类内部变量，本质上仍然是在用方法自己的目标函数评价自己，缺乏独立性。

> metrics 的输入应尽可能来自可观测交互结果，而不是 reward decomposition。
> 即只使用 episode log、广告事件、用户行为事件与退出信息。


---

# 一、Metrics 的原始输入

一个 episode 可抽象为：

$$\mathcal{E}
=
\{(q_t, y_t, a_t, z_t^{\mathrm{ad}}, q_{t+1}, \mathrm{done}_t)\}_{t=0}^{T-1}$$


其中



$$a_t \in \mathcal{A}$$


$$z_t^{\mathrm{ad}}
=
(\mathbb{1}_t^{\mathrm{ad}}, j_t^{\mathrm{ad}}, \mathrm{out}_t^{\mathrm{ad}})$$

$$\mathbb{1}_t^{\mathrm{ad}} = b_t^{\mathrm{ad}}$$

其中：

| 变量 | 含义 | 来源 |
| --- | --- | --- |
| $T$ | episode 的实际 decision step 数 | episode log |
| $q_t$ | 第 $t$ 个 decision step 开始时的用户输入 | simulator / real user log |
| $y_t$ | 第 $t$ 个 decision step 的系统回复 | agent log |
| $a_t$ | Planner 输出的一维离散动作 | planner log |
| $z_t^{\mathrm{ad}}$ | 当前 step 的广告事件 | event log |
| $\mathbb{1}_t^{\mathrm{ad}}$ | 当前 step 是否展示广告 | derived from $a_t$ / event log |
| $j_t^{\mathrm{ad}}$ | 当前 step 展示的广告 ID；如果没有广告，则为 $-1$ | event log |
| $\mathrm{out}_t^{\mathrm{ad}}$ | 广告反馈结果，如 clicked / accepted / ignored / rejected / none | simulator / user event |
| $q_{t+1}$ | 用户对当前系统回复的下一轮反馈 | simulator / real user log |
| $\mathrm{done}_t$ | 当前 step 后 episode 是否结束 | environment |
| $\mathrm{exit_reason}$ | episode 结束原因 | environment / simulator / annotation |


---

# 二、独立 Metrics

 metrics 可以分成四个部分：

```text
1. User-side outcome
2. Business-side outcome
3. Ad burden / interruption
4. Trade-off / Pareto-style evaluation
```

前三类给出可计算指标，第四类用于分析用户价值和商业价值之间的平衡。



## 1. User-side outcome

这一类主要回答：

> 系统是否真正帮助用户完成任务？
> 用户是否因为低质量回复、广告或话题偏移而提前失败？

用户侧指标不应简单等同于 session length。对话越长不一定越好，因为任务完成后自然结束是正向结果，而拖长对话可能反而代表低效率。

### 1.1 Task Success Rate



对 $N$ 个 episodes：

$$\mathrm{TaskSuccessRate}
=
\frac{1}{N}
\sum_{i=1}^{N}
\mathbb{I}(\mathrm{exit_reason}_i = \mathrm{task_completed})$$

它衡量系统是否最终完成了用户任务，而不是只看用户是否继续聊天。

### 1.2 Early Failure Rate

Early Failure Rate 用于衡量用户是否在任务未完成时提前失败退出。


对 $N$ 个 episodes：

$$\mathrm{EarlyFailureRate}
=
\frac{1}{N}
\sum_{i=1}^{N}
\mathrm{EarlyFailure}_i$$
用于判断用户是否提前结束，而不直接假设退出原因。

---

## 2. Business-side outcome

这一类主要回答：

> 广告是否产生了有效商业价值？
> 商业收益是否只是通过增加广告数量堆出来的？

### 2.1 Revenue

若每个广告 $j$ 对应一个价值函数 $v(j)$，则可以定义实际广告收益为：

$$\mathrm{Revenue}
=
\sum_{t=0}^{T-1}
\mathbb{I}
(
\mathrm{out}_t^{\mathrm{ad}} \in \{\mathrm{clicked}, \mathrm{accepted}\}
)
\cdot
v(j_t^{\mathrm{ad}})$$


如果当前实验阶段没有真实 click / acceptance，只能先使用 simulator 的广告反馈事件。

### 2.2 Revenue Density

$$\mathrm{RevenueDensity}
=
\frac{\mathrm{Revenue}}{T}$$

Revenue Density 更适合对话场景，因为它避免策略仅通过延长对话长度来提高总收益。


---

## 3. Ad burden 

这一类主要回答：

> 广告是否过密？
> 是否对对话造成过强干扰？


### 3.1 Ad Exposure Rate

$$\mathrm{AdExposureRate}
=
\frac{1}{T}
\sum_{t=0}^{T-1}
b_t^{\mathrm{ad}}$$

该指标表示每个 episode 中广告出现的比例。

它不是越高越好。过高的 Ad Exposure Rate 可能意味着系统过度商业化，容易造成用户反感。


---

## 4. Trade-off / Pareto-style evaluation

REC-DIAL 不是单目标任务。它同时追求：

```text
用户价值最大化；
商业价值最大化；
```

使用 Pareto-style evaluation 来分析不同 policy 之间的 trade-off。

对于一个 policy $\pi$，可以定义评价向量：

$$\mathbf{m}(\pi)
=
(
\mathrm{TaskSuccessRate}(\pi),
\mathrm{RevenueDensity}(\pi)
)$$

其中：

```text
TaskSuccessRate 越高越好；
RevenueDensity 越高越好；
```

若 policy $\pi_A$ 满足：

$$\mathrm{TaskSuccessRate}(\pi_A)
\geq
\mathrm{TaskSuccessRate}(\pi_B)$$

$$\mathrm{RevenueDensity}(\pi_A)
\geq
\mathrm{RevenueDensity}(\pi_B)$$


并且至少一个不等式严格成立，则称 $\pi_A$ Pareto-dominates $\pi_B$。



## 5. Human calibration

完全客观的评价在开放式对话中通常不存在，因此最终需要小规模人工校准。

如果有真人实验，可通过 survey / Likert scale 对 latent states 做近似观测：

$$\text{score} \in \{1,2,3,4,5\}$$

例如：

* 任务是否被解决？
* 广告是否自然？
* 是否愿意继续使用？
* 是否感到被打扰？

Human calibration 的作用不是替代前述指标，而是用于：

* 校准 rule precision
* 检查 behavioral proxy 是否偏移
* 控制 LLM judge bias




>metrics 更注重 商业上的 客观的指标