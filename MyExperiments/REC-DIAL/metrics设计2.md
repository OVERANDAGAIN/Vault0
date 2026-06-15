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


$$a_t = (b_t^{\mathrm{ad}}, j_t^{\mathrm{ad}}, b_t^{\mathrm{topic}}, k_t^{\mathrm{topic}})$$

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
| $a_t$ | Planner action | planner log |
| $b_t^{\mathrm{ad}}$ | 当前 step 是否插入广告 | planner action |
| $j_t^{\mathrm{ad}}$ | 当前 step 选择的广告 ID | planner action / ad metadata |
| $b_t^{\mathrm{topic}}$ | 当前 step 是否切换 topic | planner action |
| $k_t^{\mathrm{topic}}$ | 当前 step 选择的目标 topic | planner action |
| $z_t^{\mathrm{ad}}$ | 当前 step 的广告事件 | event log |
| $\mathrm{out}_t^{\mathrm{ad}}$ | 广告反馈结果，如 clicked / accepted / ignored / rejected | simulator / user event |
| $q_{t+1}$ | 用户对当前系统回复的下一轮反馈 | simulator / real user log |
| $\mathrm{done}_t$ | 当前 step 后 episode 是否结束 | environment |
| $\mathrm{exit_reason}$ | episode 结束原因 | environment / simulator / annotation |


---

# 二、设计独立 Metrics

为了避免指标过多，REC-DIAL 的 metrics 可以分成四个部分：

```text
1. User-side outcome
2. Business-side outcome
3. Ad burden / interruption
4. Trade-off / Pareto-style evaluation
```

前三类给出可计算指标，第四类用于分析用户价值和商业价值之间的平衡。

---

## 1. User-side outcome

这一类主要回答：

> 系统是否真正帮助用户完成任务？
> 用户是否因为低质量回复、广告或话题偏移而提前失败？

用户侧指标不应简单等同于 session length。对话越长不一定越好，因为任务完成后自然结束是正向结果，而拖长对话可能反而代表低效率。

---

### 1.1 Task Success Rate



对 $N$ 个 episodes：

$$\mathrm{TaskSuccessRate}
=
\frac{1}{N}
\sum_{i=1}^{N}
\mathbb{I}(\mathrm{exit_reason}_i = \mathrm{task_completed})$$

它衡量系统是否最终完成了用户任务，而不是只看用户是否继续聊天。

---

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

---

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

这里的 Revenue 基于用户广告反馈结果，而不是 reward 中的商业收益项。

如果当前实验阶段没有真实 click / acceptance，只能先使用 simulator 的广告反馈事件。

---

### 2.2 Revenue Density

$$\mathrm{RevenueDensity}
=
\frac{\mathrm{Revenue}}{T}$$

Revenue Density 更适合对话场景，因为它避免策略仅通过延长对话长度来提高总收益。


---

## 3. Ad burden / interruption

这一类主要回答：

> 广告是否过密？
> 是否反复展示同类广告？
> 是否对对话造成过强干扰？

这些指标直接从 action log 和 ad event log 中计算，不依赖 reward。

---

### 3.1 Ad Exposure Rate

$$\mathrm{AdExposureRate}
=
\frac{1}{T}
\sum_{t=0}^{T-1}
b_t^{\mathrm{ad}}$$

该指标表示每个 episode 中广告出现的比例。

它不是越高越好。过高的 Ad Exposure Rate 可能意味着系统过度商业化，容易造成用户反感。

---

### 3.2 Average Ad Gap

设广告出现的 step 集合为：

$$\mathcal{T}_{\mathrm{ad}}
=
\{t \mid b_t^{\mathrm{ad}} = 1\}$$

如果广告出现次数不少于 2，则定义相邻广告间隔：

$$\mathrm{Gap}_m
=
t_{m+1}^{\mathrm{ad}} - t_m^{\mathrm{ad}}$$

Average Ad Gap 为：

$$\mathrm{AvgAdGap}
=
\frac{1}{|\mathcal{T}_{\mathrm{ad}}| - 1}
\sum_{m=1}^{|\mathcal{T}_{\mathrm{ad}}| - 1}
\mathrm{Gap}_m$$

AvgAdGap 越小，说明广告越密集。若一个 episode 中广告出现少于 2 次，该指标可以记为 N/A。



---

## 4. Trade-off / Pareto-style evaluation

REC-DIAL 不是单目标任务。它同时追求：

```text
用户价值最大化；
商业价值最大化；
广告负担和用户摩擦最小化。
```

因此，不建议把所有指标强行合成一个单一总分。更合适的方式是使用 Pareto-style evaluation 来分析不同 policy 之间的 trade-off。

对于一个 policy $\pi$，可以定义评价向量：

$$\mathbf{m}(\pi)
=
(
\mathrm{TaskSuccessRate}(\pi),
\mathrm{RevenueDensity}(\pi),
-\mathrm{FrictionRate}(\pi)
)$$

其中：

```text
TaskSuccessRate 越高越好；
RevenueDensity 越高越好；
FrictionRate 越低越好。
```

若 policy $\pi_A$ 满足：

$$\mathrm{TaskSuccessRate}(\pi_A)
\geq
\mathrm{TaskSuccessRate}(\pi_B)$$

$$\mathrm{RevenueDensity}(\pi_A)
\geq
\mathrm{RevenueDensity}(\pi_B)$$

$$\mathrm{FrictionRate}(\pi_A)
\leq
\mathrm{FrictionRate}(\pi_B)$$

并且至少一个不等式严格成立，则称 $\pi_A$ Pareto-dominates $\pi_B$。

也就是说，$\pi_A$ 在用户任务、商业收益和用户摩擦上整体不差，并且至少一个维度更好。

实际汇报时可以画两类 Pareto-style 图：

```text
RevenueDensity vs TaskSuccessRate
RevenueDensity vs FrictionRate
```

第一张图看商业收益和任务完成之间的 trade-off。
第二张图看商业收益是否以更高用户摩擦为代价。

---

# 三、Behavioral metrics 的解释边界

Behavioral metrics 更接近真实用户反馈，但解释上仍需谨慎。

例如：

```text
用户继续对话，不一定代表满意；
用户未点击广告，也不一定代表反感；
用户提前结束，也不一定代表失败；
用户修正系统，通常表示存在目标偏移或理解错误。
```

因此 behavioral metrics 更适合作为 outcome proxy，而不是直接作为 latent satisfaction。

这些行为信号可以通过以下方式识别：

```text
规则匹配；
外部 classifier；
LLM judge；
human annotation。
```

但不建议直接使用训练 reward model 的内部分数作为 evaluation metric。

---

# 四、Judge-based metrics（辅助层）

有些关键维度无法仅通过行为直接观测，例如：

```text
广告是否自然；
广告是否破坏原任务；
当前回复是否推进用户目标；
回复是否保持 topic coherence；
广告是否与当前 topic context 匹配。
```

这类指标可以通过：

```text
LLM judge；
pairwise evaluator；
external classifier；
human annotation。
```

进行估计。

但更合适的定位是：

> Judge-based metrics 用于 diagnostic，而不是 primary evaluation。

否则 metrics 可能重新退化为 reward proxy。

可以保留的 judge-based diagnostic 包括：

```text
Task Helpfulness
Ad Naturalness
Topic Coherence
Ad-Topic Fit
```

这些指标用于解释 policy 为什么好或坏，而不是替代主要指标。

---

# 五、Human calibration

完全客观的评价在开放式对话中通常不存在，因此最终需要小规模人工校准。

如果有真人实验，可通过 survey / Likert scale 对 latent states 做近似观测：

$$\mathrm{score} \in \{1, 2, 3, 4, 5\}$$

例如：

```text
任务是否被解决？
广告是否自然？
是否愿意继续使用？
是否感到被打扰？
```

Human calibration 的作用不是替代前述指标，而是用于：

```text
校准 rule precision；
检查 behavioral proxy 是否偏移；
控制 LLM judge bias；
验证 Pareto trade-off 是否符合真实用户感受。
```

---

# 六、最终指标汇总

正式实验中不需要报告过多指标。核心指标可以收敛为：

| 类别 | 核心指标 | 作用 |
| --- | --- | --- |
| User-side outcome | Task Success Rate | 用户任务是否完成 |
| User-side outcome | Early Failure Rate | 是否出现未完成任务的提前失败 |
| User-side outcome | Friction Rate | 用户显式摩擦程度 |
| Business-side outcome | Revenue Density | 单位对话长度下的广告收益 |
| Business-side outcome | Ad Acceptance Rate | 展示广告中被接受 / 点击的比例 |
| Ad burden | Ad Exposure Rate | 广告出现频率 |
| Ad burden | Avg Ad Gap | 广告间隔是否过短 |
| Ad burden | Repeated Ad Rate | 是否反复展示同一广告 |
| Trade-off | Pareto front | 用户价值与商业价值的平衡 |

其中，主表可以优先报告：

```text
Task Success Rate
Revenue Density
Ad Acceptance Rate
Friction Rate
Ad Exposure Rate
```

Pareto-style evaluation 单独作为 trade-off 分析：

```text
RevenueDensity vs TaskSuccessRate
RevenueDensity vs FrictionRate
```

---

# 七、Evidence hierarchy

核心上，这里的重点不是构造“另一套 reward”，而是建立一个 evidence hierarchy：

### Rule-based

最稳定、最可复现，但语义有限。

### Behavioral

更接近真实用户反馈，但存在解释歧义。

### Judge-based

覆盖语义质量，但主观性更高。

### Human calibration

作为最终校准层，控制整体偏差。

$$\mathrm{Rule}
\rightarrow
\mathrm{Behavioral}
\rightarrow
\mathrm{Judge}
\rightarrow
\mathrm{Human\ Calibration}$$

这样做的目标不是追求绝对客观，而是在可扩展性、独立性与语义覆盖之间取得相对更稳的平衡。