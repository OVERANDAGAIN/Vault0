---
创建时间: 2026-九月-14日  星期一, 12:59:36 下午
---
可以。这篇我已经按你最关心的方向通读了一遍。先给你一个非常关键的判断：

**这篇 CEO-BENCH 并不是“一个 Buyer Agent 和一个 Seller Agent 对话成交”的设计。**它实际上是：

> **一个 LLM 卖方/CEO Agent + 大量由规则驱动的模拟买方 + 一个随时间演化的市场环境。**

普通消费者基本不由 LLM 扮演，而是根据**价格、质量、预算、满意度等显式机制**决定“买不买、买哪个、续不续费”；只有 Enterprise 客户加入了更像真实销售的**报价—还价—等待—成交/拒绝**过程。这一点对于你现在关心的 buyer/seller、购买机制和长期市场模拟尤其值得看。论文也特意强调客户行为尽量采用 mechanistic rules，而不是让另一个 LLM 当裁判，从而避免“卖方说几句好话，模拟客户就莫名其妙买了”的问题。

论文标题可以翻成：

**CEO-BENCH：智能体能打好一场长期战吗？**

它模拟的是一个订阅制软件公司 NovaMind，Agent 当 CEO，要连续经营 **500 个模拟日**。公司最开始 **0 个客户、100 万美元现金**；最后按剩余现金评分，中途现金跌到 0 以下就破产。

---

# 一、先把这篇论文里的核心术语翻译清楚

| 论文术语                             | 中文理解          | 大白话                     |
| -------------------------------- | ------------- | ----------------------- |
| `Customer Group`                 | 客户群体 / 市场细分   | 工程师、个人用户、企业用户这类不同人群     |
| `Customer`                       | 单个客户          | 每个人都有自己独立预算、需求和敏感度      |
| `Willingness to Pay`             | 支付意愿 / 最高愿付价格 | “最多能接受多少钱”              |
| `Participation Curve`            | 购买参与曲线        | 价格越贵，客户要求的产品质量越高        |
| `Required Quality` \(Q^{req}\)   | 最低可接受质量       | 这个价格下，“至少得值这么多”         |
| `Perceived Quality` \(Q^{perc}\) | 感知质量          | 客户实际上觉得这个产品有多好          |
| `Quality Surplus`                | 质量剩余 / 效用余量   | 实际体验比最低要求高多少            |
| `Acceptable Plan Set`            | 可接受套餐集合       | 哪几个套餐“价格、质量都过关”         |
| `Effective Price`                | 实际支付价格        | 标价减促销、优惠后的价格            |
| `Lead / Prospect`                | 潜在客户          | 被广告拉进来的还没正式付钱的人         |
| `Targeted Ad Spend`              | 定向获客广告        | 针对某一用户群、某一广告渠道投钱        |
| `Acquisition Rate`               | 获客效率          | 投同样的钱能带来多少潜在客户          |
| `Satisfaction`                   | 满意度           | 产品体验是否超过客户预期            |
| `Churn`                          | 流失 / 退订       | 客户不续费了                  |
| `Retention`                      | 留存            | 到下个账期还留下来               |
| `Reputation`                     | 声誉            | 现有客户体验对未来拉新的影响          |
| `Targeted Development`           | 定向产品开发        | 专门为某一类客户提升产品            |
| `Enterprise Deal`                | 企业销售合同        | 和企业客户议价谈合同              |
| `Counter-offer`                  | 还价            | 企业客户不接受你的价格，报一个更低价      |
| `Reservation Price`              | 保留价格 / 最高接受价  | 客户真正愿意付的价格上限            |
| `Partial Observability`          | 部分可观测         | Agent 看不到客户真实想法，只能猜     |
| `Non-stationary Environment`     | 非平稳环境         | 市场、竞争对手、用户偏好一直变化        |
| `next_week()`                    | 时间推进操作        | Agent 做完决策后，让世界真正往后运行一周 |

这里最核心的三个变量，你后面看这篇论文时可以一直抓住：

$$
\text{Price},\quad Q^{req}(Price),\quad Q^{perc}
$$

买不买，基本围绕它们展开。

---

# 二、大白话理解：这个世界到底是怎么搭起来的？

可以把整个 CEO-BENCH 理解成一个巨大的经营游戏：

**Agent 控制公司 → 市场里有很多模拟客户 → Agent 设置价格、产品、广告等 → 客户按规则反应 → 一周过去 → 数据产生 → Agent 再观察数据、重新决策。**

也就是说，它不是：

> Agent：买吗？
> Customer Agent：我觉得不错，我买。

而是：

> Agent 把 A 套餐定成 20 美元，质量做到 0.65；
> 某个模拟客户预算是 30 美元，而且 20 美元这个价格下最低要求质量是 0.6；
> 因为 0.65 > 0.6，所以这个套餐对他“可接受”。

这是非常重要的设计思想。

论文一共有 **26 个客户群体**，而且不是只模拟群体平均值，而是会在每个 group 里面再采样出独立的 customer。每个人都有不同的预算、最低质量要求、用量、广告敏感度、客服敏感度等等。

所以：

> Group 决定“这个人大概是什么类型”；
> sampling 决定“这个具体的人跟同类还是有区别”。

这一点比直接写：

```text
students: price_sensitivity = 0.8
rich_users: price_sensitivity = 0.2
```

要细得多。

---

# 三、卖方是怎么设计的？

这里的 Seller 本质上就是 **CEO Agent**。

它不是直接控制“客户购买概率”，而是控制公司的经营变量。

Agent 可以干的事情包括价格、套餐、quota、促销、广告预算、开发投入、R&D、服务器容量、客服投入、市场调研、企业销售、社交媒体等。论文给了 **34 个工具**，再加上 **19 张业务数据库表**。

比如：

```python
pricing.set_prices(A=10, B=20, C=35)

marketing.set_targeted_ad_spend(
    targeted_spend={
        "social_media": {"S1": 120},
        "linkedin": {"S3": 100}
    }
)

research.start_research_project(tier=2)

infrastructure.set_capacity_tier(2)
```

Agent 不是点击 UI，而是可以自己写 Python、SQL，然后组合这些 API，甚至写一个自己的经营分析脚本。论文第 8 页 Figure 6 就是在强调这一点：左边查 SQL，中间设置精细策略，右边甚至根据数据库结果自动给客户做 promotion。

因此这里的 Seller Agent 更接近：

> **拥有经营策略空间的公司决策 Agent**

而不是单纯聊天销售。

---

# 四、买方怎么设计？这是这篇最值得细看的地方

普通客户不是 LLM。

每个 customer 有一堆隐藏参数，例如：

$$
c_i=\text{最高愿意支付价格}
$$

还有最低质量：

$$
q_i^{min}
$$

最高质量预期：

$$
q_i^{max}
$$

以及价格敏感程度。

论文把这些变量组合成一个非常核心的：

## Participation Curve：价格—最低质量要求曲线

本质上：

$$
Q_i^{req}(C)
$$

表示：

> 客户 \(i\) 面对价格 \(C\) 时，至少要求多高的产品质量。

价格越高，一般来说：

$$
C \uparrow
\quad\Rightarrow\quad
Q^{req}(C)\uparrow
$$

论文第 21 页 Figure 16 就画了不同客户群的这种曲线。预算用户的曲线比较早就陡升，而 Enterprise 的价格承受区间明显更宽。 

所以买方决策不是：

> 价格低 → 买。

而是：

> **这个产品的质量，对得起这个价格吗？**

这和经济学中的 differentiated-product participation rule 有关系。

---

# 五、具体一次“购买”是怎么发生的？

这是你最关心的部分。

假设公司有三个套餐：

| 套餐 |  价格 | 客户感受到的质量 |
| -- | --: | -------: |
| A  | $15 |     0.52 |
| B  | $40 |     0.70 |
| C  | $80 |     0.82 |

一个客户看到 $15 的产品，可能最低只要求：

$$
Q^{req}(15)=0.45
$$

于是：

$$
0.52-0.45=0.07
$$

这个套餐可以接受。

B 套餐：

$$
Q^{req}(40)=0.60
$$

于是：

$$
0.70-0.60=0.10
$$

也可以接受。

C 套餐可能：

$$
Q^{req}(80)=0.90
$$

但是实际只有：

$$
0.82
$$

所以 C 不可接受。

于是：

$$
A_i=\{A,B\}
$$

然后消费者不是简单选最便宜的，而是在这些“合格套餐”中选择：

$$
p_i^*
=
\arg\max_p
\left[
Q^{perc}_{i,p}
-
Q^{req}_i(C_{i,p}^{eff})
\right]
$$

也就是：

> **选“实际体验超过我最低要求最多”的那个套餐。**

论文明确把这叫做 surplus，也就是余量。

所以刚才：

A 的 surplus：

$$
0.07
$$

B 的 surplus：

$$
0.10
$$

最后选 B。

如果：

$$
A_i=\emptyset
$$

也就是所有套餐都不合格，那么：

> **取消订阅 / 不买。**

这是一个非常干净的 buyer decision rule。

---

# 六、这里“价格”还不是标价，而是 Effective Price

例如原价：

$$
P=40
$$

Agent 给这个客户群优惠 $5，又给新用户优惠 $10：

$$
C^{eff}=40-5-10=25
$$

客户用的是 $25 对应的购买要求，而不是 $40。

论文把 global promotion、group promotion、customer promotion、group-plan promotion、first-bill promotion 都加在一起。

所以：

> Seller 可以通过降价提高购买率；

但是：

> 降价会直接降低收入。

这就产生真正的 trade-off，而不是“优惠永远是好事”。

---

# 七、广告是怎么把人带进购买流程的？

这部分也特别适合你现在关心的 SalesBench。

Agent 并不是说：

> 我投广告 → purchase probability +20%。

它把广告拆成了：

$$
\text{Channel} \times \text{Customer Group}
$$

例如：

> LinkedIn × 企业客户
> Social Media × 学生
> Search × 工程师

不同：

$$
(c,g)
$$

组合有不同的隐藏广告效率：

$$
L_{c,g}
$$

Agent **不知道真实值**。

所以它需要先少量试投，然后观察：

> 花了多少钱 → 来多少客户 → 哪个 channel ROI 高。

论文专门用这个指标测试 Agent 是否真的能“学出”隐藏的广告渠道效率。

完整的新客户强度大致是：

$$
\lambda_{g,t}
=
R_{g,t}
D_{g,t}
C_t
M_{g,t}
A_{g,t}
Z_t
\left(
\sum_c
x_{c,g,t}L_{c,g,t}
+
\text{referral}
\right)
$$

翻成人话就是：

> 你花多少钱投广告
> × 这个渠道适不适合这个人群
> × 当前品牌口碑
> × 市场还剩多少人
> × 当前经济好不好
> × 季节因素
> × 社交媒体反应
> × 有没有需求爆发
>
> * 老客户带新客户

最后得到：

$$
\lambda
$$

然后实际来的潜在客户数量：

$$
n_{g,t}\sim \text{Poisson}(\lambda_{g,t})
$$

也就是加一点随机性。

这比简单写：

```python
purchase_prob = similarity * 0.5 + price * 0.5
```

复杂很多，而且非常关键的一点是：

**广告主要决定“谁进来”，价格和质量决定“进来以后买不买以及留不留下”。**

把 acquisition 和 conversion/retention 分开了。

---

# 八、买完之后也不是结束，而是长期循环

这也是 CEO-BENCH 和普通销售 benchmark 差异最大的地方。

客户买完之后每天还会产生：

$$
Usage
$$

而使用量会消耗算力。

如果客户很多：

$$
Usage > Capacity
$$

系统发生 overload。

接着：

$$
Q^{perc}\downarrow
$$

满意度降低。

然后：

$$
S_i
=
\lambda S_{i,t-1}
+
(1-\lambda)\tilde S_{i,t}
$$

也就是说，满意度还有**记忆**，不是今天出事故明天完全忘掉。

接着低满意度会：

> 增加 support ticket → 降低 reputation → 影响新用户获取 → 增加 churn。

所以一个很典型的链条是：

**疯狂打广告**

→ 客户暴涨

→ 使用量暴涨

→ 服务器容量不足

→ overload

→ 体验下降

→ 满意度下降

→ 用户退订

→ 社交媒体骂

→ 品牌口碑下降

→ 广告获客也变差。

这就是论文所谓的：

> interconnected world dynamics。

它刻意不让某一个变量可以独立 hill-climb。

---

# 九、续费 / 流失又是怎么设计的？

这个其实也是一次“重新购买”。

到 billing day，客户重新看：

> 现在价格是多少？
> 产品现在质量怎么样？
> 有没有更好的 plan？

然后重新计算：

$$
A_i
$$

如果：

$$
A_i=\emptyset
$$

→ voluntary churn。

如果另外一个套餐 surplus 更高：

→ upgrade / downgrade。

否则：

→ stay。

所以同一个消费者可以经历：

**A 套餐 → B 套餐 → A 套餐 → cancel**

而不是购买以后永久绑定。

除此之外，论文又额外加了：

$$
Z^{invol}\sim Bernoulli(\mu)
$$

也就是**非自愿流失**。

比如：

> 企业预算被冻结、公司倒闭、采购负责人换了。

这种事情不是 Seller 做得不好造成的。

因此：

$$
\text{Churn}
=
\text{controllable churn}
+
\text{exogenous churn}
$$

论文专门强调了这一点。

这个设计挺好，因为不会出现：

> “所有退订一定说明策略错了。”

---

# 十、Enterprise 买方是另外一套：真正出现谈判

普通客户：

> 看价格 → 看质量 → 买 / 不买。

企业客户则更接近你说的 Buyer/Seller interaction。

Seller Agent 可以发：

```text
Plan B: $X
Plan C: $Y
...
```

一个 enterprise customer 最多比较 \(K_{offer}\) 个报价。

首先还是算：

$$
S_i^{offer}
=
Q_i^{perc}
-
Q_i^{req}(C)
$$

如果：

$$
S_i^{offer}>0
$$

就可以直接接受。

如果你的报价太高，它不会直接拒绝，而是先算一个：

$$
C_i^{max}
$$

也就是：

> **这个产品现在的质量，最多值多少钱。**

这是 buyer 的 reservation price。

但客户不会第一次就告诉你：

> “其实我最高能付 $100。”

它会报：

> $65。

下一次：

> $75。

再下一次：

> $85。

数学形式是：

$$
C^{counter}_{i,r}
=
C_i^{max}
-
\gamma_\alpha^r
(C_i^{max}-f_i C_i^{max})
$$

随着谈判轮数 \(r\) 增大：

$$
C^{counter}
\rightarrow C^{max}
$$

也就是：

> 买方逐渐让步。

如果谈判超过最大轮数：

> 买方停止回复。

而且回复不是立即发生：

$$
d_{reply}\sim D^{reply}
$$

可能等几天。

宏观经济好的时候：

> deal velocity 更快；

经济差：

> 谈判周期变长。

这个 Enterprise negotiation 是整篇论文里最接近你所说的：

> Buyer-Seller interaction。

---

# 十一、你特别问的“一步推进”到底怎么做

这是这篇论文一个很重要的工程设计。

Agent 并不是：

> action → environment 马上推进一天。

而是采用：

## “一周一次决策周期”

论文明确说：

> 在每个 simulated week 内，Agent 可以不限次数地调用工具；做完以后，再推进世界。

真正控制时间的是：

```python
next_week()
```

API 里明确把 `next_week` 定义成：

> advances the simulator。

所以可以理解成：

```text
Week t

Agent:
    查询数据库
    看 social media
    算 churn
    算 CAC
    调价格
    调广告
    调 R&D
    调容量
    谈 enterprise deal
    写 memo

              ↓

         next_week()

              ↓

Simulator:
    世界真正运行 7 天
    用户使用产品
    产生 revenue
    产生 compute cost
    广告带来用户
    用户选择套餐
    客户续费 / 流失
    satisfaction 更新
    reputation 更新
    competitor 可能行动
    macro economy 变化
    R&D 可能完成
    enterprise 可能回复

              ↓

Week t+1

Agent 再看新数据
```

这里有一个需要注意的细节：

**论文详细给出了各个 daily mechanism，但没有在正文中写一个完整的、严格有序的“daily update pseudocode”。**

上面这个顺序是我根据各个变量之间的依赖关系帮你梳理出来的，不应该把它理解成作者原文规定的唯一执行顺序。

---

# 十二、为什么要让 Agent “先做很多动作，再 next_week”？

因为它想测试的是：

> **policy / strategy**

而不是：

> 每一步环境反馈以后立刻反应。

比如 Agent 可以先同时决定：

$$
Price
$$

$$
Ads
$$

$$
Development
$$

$$
Capacity
$$

然后：

```python
next_week()
```

相当于告诉模拟器：

> “这就是我这一周的公司政策，去跑吧。”

然后下一周再看：

> 发生了什么。

这特别像真实经营。

---

# 十三、而且 action 的结果有不同时间尺度

这是 CEO-BENCH 很核心的一点。

有些东西：

**立刻生效**

例如：

> 广告支出、开发支出、服务器成本。

有些东西：

**几天以后才看到**

例如：

> 广告来的客户。

有些：

**几周以后才看到**

例如：

> R&D。

甚至一些坏策略：

> 当前看着没有问题，一个月后续费日集中爆 churn。

所以：

$$
Cost_t
$$

可能现在就扣掉，

但是：

$$
Revenue_{t+k}
$$

以后才来。

论文明确把这种 delayed consequence 当作 benchmark 的核心设计之一。

---

# 十四、环境并不会站着等 Agent，它自己也在变化

这篇论文另外一个很值得看的设计就是：

**world 本身有 autonomous dynamics。**

主要有三类。

第一类是 competitor。

Competitor 会 periodically 提升市场质量标准。

而且还会看你变强：

> 你做了大量 global R&D；

竞争对手也会更快 catch up。

所以：

$$
\text{your quality}\uparrow
$$

并不意味着你的优势永久存在。

反而：

$$
\text{competitor pressure}\uparrow
$$

而 targeted development 更难被竞争对手复制。

第二类是 macro economy。

作者用一个带周期项的 Ornstein–Uhlenbeck process 模拟宏观经济：

$$
PMI_{t+1}
=
PMI_t+
\eta(\mu_t-PMI_t)+
\sigma\epsilon_t
$$

于是：

> 有经济扩张期，也有收缩期，而且带随机噪声。

Agent 还不能直接看到真正 PMI，只能看到有延迟的公开数据。

第三类是 customer preference drift。

随着时间发展：

> 愿意付多少钱、需要多高质量，也会慢慢变。

因此昨天的最优策略：

> 不一定是今天的最优策略。

---

# 十五、Agent 到底能看到多少信息？

这个 benchmark 是 **Partially Observable**。

它故意不给 Agent：

> 真实 satisfaction
> 真实 willingness to pay
> 真实 customer threshold
> competitor schedule
> 真实 macro state。

Agent只能看：

> database
> subscription
> churn
> support tickets
> revenue
> social media
> market research。



也就是说 Agent 必须自己反推：

> 为什么这一批客户突然走了？

可能是：

> price 高了？

也可能：

> product quality 不够？

也可能：

> competitor 抬高 expectation？

也可能：

> outage？

也可能：

> macro economy？

这就变成了一个：

$$
Observation
\rightarrow
Latent\ State\ Inference
\rightarrow
Decision
$$

问题。

---

# 十六、实验环境是怎么跑的？

正式 experiment 里：

**每个模型经营 500 天。**

初始：

$$
Cash=\$1M
$$

每个模型跑：

$$
3\ runs
$$

环境 random seed：

$$
42
$$

模型全部开最大 reasoning effort。

他们测试了 Claude Fable 5、GPT-5.6 Sol、Claude Opus 4.8、GPT-5.5、Gemini、Qwen、GLM、Kimi、DeepSeek、Grok 等。

Agent 运行在一个 Linux workspace 中，可以：

> bash
> read-file
> edit-file
> Python
> SQL。

但这里还有一个很有意思的设计：

**每一周开始时，他们会清掉之前的 action history。**

只留下：

> system prompt
>
> * 一个 Agent 可以自己编辑的 memory file。



所以 Agent 如果想跨越 500 天记住：

> 我测试过 $79 不行；

它最好自己写 memo。

这也是为什么论文里展示了大量 Agent 写的：

```text
If conversion > 30%:
    scale ads
else:
    lower price
```

这种策略笔记。

---

# 十七、最后到底在测什么？

这篇文章其实不太在意：

> “模型会不会调用 API”。

因为大部分模型 API 都会调。

它真正想测的是四样东西：

**长期规划、信息获取、适应变化、协调多个决策。**

例如一个好 Agent 得同时想：

$$
Price
\leftrightarrow
Demand
$$

$$
Demand
\leftrightarrow
Capacity
$$

$$
Capacity
\leftrightarrow
Quality
$$

$$
Quality
\leftrightarrow
Retention
$$

$$
Retention
\leftrightarrow
Cash
$$

以及：

$$
R\&D_t
\rightarrow
Quality_{t+k}
$$

这就是为什么一个局部看起来很正确的动作，也可能最终把公司搞破产。

---

# 十八、论文从头到尾的逻辑，我帮你串一次

整篇文章其实是这么讲的。

传统 Agent benchmark 一般是：

> 给任务 → 做 → 很快得到反馈 → 完成。

作者认为这离真实世界还很远。

真实经营更像：

> 今天做一个决策，三个月后才知道对不对，而且期间市场还变了。

所以他们提出：

## CEO-BENCH

让 Agent 连续经营一家 startup 500 天。

为了让这个 benchmark 不变成简单游戏，他们做了几个关键设计：

**第一，客户不是一个 aggregate demand curve，而是 individual customers。**

**第二，客户购买主要由明确经济规则驱动，而不是 LLM judge。**

**第三，价格、产品、广告、运维、市场、企业销售全部互相耦合。**

**第四，真实状态隐藏，只给间接观测。**

**第五，投资效果有 delay。**

**第六，competitor、macro economy、customer preference 自己变化。**

**第七，Agent 可以写程序、SQL、自动化策略，而不是只能做固定 action。**

于是最终就形成一个真正的长时间：

$$
Observe
\rightarrow
Infer
\rightarrow
Plan
\rightarrow
Act
\rightarrow
Wait
\rightarrow
Observe
$$

循环。

---

# 十九、最后结果也很有意思

最简单的一个 rule-based strategy：

> 固定价格
> 固定目标人群
> 固定开发预算
> 固定广告预算
> 根据 usage 调容量

最后能做到：

$$
\$15.76M
$$

甚至超过所有 LLM Agent。

作者的意思并不是：

> LLM 不聪明。

而是：

> **LLM 很容易做出一个局部合理决策，但非常难连续几十轮保持一套一致、可修正的长期策略。**

论文实验里只有少数模型最佳轨迹最后高于初始的 $1M，而且所有模型都没有超过 rule-based baseline。

---

# 二十、如果站在你现在关心的 buyer/seller benchmark 角度，这篇最值得抽出来的是这套结构

我会把它压缩成：

$$
\boxed{
Seller\ Policy
\rightarrow
Exposure
\rightarrow
Buyer\ Decision
\rightarrow
Post\text{-}purchase\ Experience
\rightarrow
Retention
\rightarrow
Market\ Feedback
}
$$

其中：

$$
Seller\ Policy
=
\{price, quality, promotion, ads, capacity,\dots\}
$$

广告先决定：

$$
\text{谁来看}
$$

然后 participation curve 决定：

$$
\text{看了以后买不买}
$$

plan surplus 决定：

$$
\text{买哪个}
$$

之后 satisfaction / usage / support 决定：

$$
\text{下个月还买不买}
$$

reputation 和 network 再决定：

$$
\text{未来还有多少新人来}
$$

于是整个 marketplace 就闭环了：

$$
Seller
\rightarrow Buyer
\rightarrow Outcome
\rightarrow Market
\rightarrow Seller
$$

我认为这篇对你现在最重要的一点，不是它用了多少个工具，而是它给出了一个非常清楚的原则：

> **Buyer 的行为最好建立在可解释、稳定的 latent preference + decision rule 上；LLM Seller 再去学习、推断和利用这些隐藏规律。**

而不是让 LLM 同时既当卖方、又当买方、又当裁判。

如果往你现在的 SalesBench 方向继续看，这篇其实已经能抽象出一套很有参考价值的 **「用户生成 → 商品曝光 → 购买决策 → 购买后反馈 → 下一步市场推进」底层 simulator 框架**。这会比单纯继续看论文总结更有用。
