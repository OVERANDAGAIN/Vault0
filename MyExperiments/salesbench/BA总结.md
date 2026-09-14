---
创建时间: 2026-九月-14日  星期一, 12:57:05 下午
---
我把这篇 **Business Arena: Benchmarking LLM Agents in a Realistic Marketplace** 按你最关心的“**到底怎么做出来的**”来拆，而不是只讲结果。它最值得看的其实不是排行榜，而是它如何把一个真实商业过程压缩成一个可以被 Agent 连续操作 30 天的模拟市场：**一个 LLM 经营卖家店铺，环境里有供应商、脚本竞争卖家和模拟买家；Agent 每天自由做若干操作，然后主动调用 `end_round()`，世界统一向前推进一天，买家购买、竞争对手调价、物流推进、成本扣除、事件发生，再进入下一轮。** 

---

# 一、先把论文里的核心术语翻译清楚

这几个词后面反复出现，先建立概念。

| 论文术语                | 中文                     | 大白话                            |
| ------------------- | ---------------------- | ------------------------------ |
| Business Arena      | 商业竞技场/商业仿真环境           | 给 LLM 开一家跨境店，让它自己经营            |
| Episode             | 一次完整实验                 | 从开店到第 30 天结束的一整局               |
| Pre-opening setup   | 开业前配置                  | 先决定卖什么、买多少初始库存                 |
| Simulated day       | 模拟日                    | 环境的最基本时间步                      |
| `end_round()`       | 结束本日/推进一天              | Agent 说“今天操作完了”，世界才往前走一天       |
| Supplier            | 供应商                    | Agent 从这里进货                    |
| NPC Seller          | 脚本竞争卖家                 | 不是 LLM，而是按固定商业策略自动经营的竞争对手      |
| Buyer               | 买家                     | 在市场中看商品、询价、购买的模拟客户             |
| SKU                 | 商品 SKU                 | 一个具体商品                         |
| MOQ                 | Minimum Order Quantity | 最低起订量                          |
| Lead Time           | 交货周期                   | 买货后多久到                         |
| Listing             | 商品报价/上架信息              | 卖什么、在哪个国家卖、什么价格                |
| Landed Cost         | 落地成本                   | 进货价 + 运费 + 关税 + 合规 + 销售费用      |
| Incoterm            | 国际贸易术语                 | 谁承担运费/关税之类，如 FOB               |
| Sell-through        | 售罄/售出率                 | 买来的货最终卖掉多少                     |
| Inventory Turnover  | 库存周转                   | 钱能不能从库存快速变回现金                  |
| Capital Utilization | 资本利用率                  | 有多少钱真的投入经营                     |
| ROAS / Ad ROI       | 广告回报                   | 广告花的钱有没有赚回来                    |
| RFQ                 | Request for Quotation  | 买家的批量询价                        |
| Compliance          | 合规                     | 某个市场能不能合法销售                    |
| Salvage Value       | 清算残值                   | 最后没卖掉的库存折价算钱                   |
| Stateful Evaluation | 状态化评测                  | 在某一天把整个世界保存，再从同一点尝试别的决策        |
| Mechanism Ablation  | 机制消融                   | 故意“乱买、乱定价、无视事件”等，看环境是否真的惩罚错误策略 |

---

# 二、先用大白话说：这篇论文到底造了一个什么东西？

你可以把它想象成：

> **给 ChatGPT 8 万美元，让它在 Alibaba 风格的跨境 B2B 市场经营 30 天。**

它不是每轮只问：

> “现在有 A、B 两个商品，你选哪个？”

而是给它一个相当开放的经营环境。

Agent 可以自己：

* 看市场；
* 查需求；
* 查 Google Trends；
* 查节日；
* 查关税；
* 找供应商；
* 比 MOQ、质量、价格、交货时间；
* 买货；
* 上架；
* 改价格；
* 设置阶梯价格；
* 投广告；
* 回复买家；
* 处理 RFQ；
* 办认证；
* 贷款；
* 应收账款保理；
* 清仓；
* 甚至自己写 Python 脚本自动经营。

整套接口有 **60 多个工具**。

然后最重要的一点：

**市场不是等 Agent 操作才变化。**

Agent 做完今天的事情之后调用：

```text
end_round()
```

然后环境内部自动发生：

```text
买家购买
竞争卖家调价
竞争卖家补库存
广告产生效果
供应商价格变化
物流向前走
应收账款变化
利息/库存费/固定成本扣除
关税/事件变化
合规事件变化
```

第二天 Agent 再观察结果。

所以它本质上是：

> **Agent action → world transition → delayed feedback → Agent 再决策**

这正是这篇论文最核心的实验设计。

---

# 三、卖方到底是怎么设计的？

这里一定要区分两类卖方。

## 1. 被测试的卖方：LLM Agent

主角只有一家店：

> **LLM 自己经营的一家店。**

论文明确说：

> Business Arena places one agent-operated shop in a marketplace of suppliers, buyers, and competing sellers.

也就是：

```text
                 Supplier
                    ↓
                LLM Shop
              ↙    ↓    ↘
        US buyers EU buyers ...
              ↕
        NPC competitors
```

Agent 要自己完成整条链：

```text
市场调研
   ↓
选商品 / 国家
   ↓
找供应商
   ↓
买库存
   ↓
物流
   ↓
合规
   ↓
定价、上架
   ↓
广告
   ↓
买家购买
   ↓
客服 / RFQ
   ↓
获得现金
   ↓
补货 / 扩张 / 换产品
```

论文第 4 页 Figure 2 正是这个循环：**Choose Products & Markets → Purchase Inventory → Price & List → Sell & Learn → Adapt & Recover → Next Cycle**。

---

# 四、竞争卖家怎么设计？这一部分论文其实做得很具体

这篇论文不是用一群 LLM 互相卖货。

竞争对手主要是：

> **scripted NPC sellers，规则型商家。**

每次实验里一共有：

> **60 个 NPC seller**

其中：

* 10 个 baseline NPC；
* 50 个市场 NPC。

而且规模还不同：

| 商家类型       |  初始资本 |  比例 |
| ---------- | ----: | --: |
| micro      |   $5k | 45% |
| small      |  $25k | 30% |
| mid        |  $80k | 18% |
| large      | $300k |  5% |
| enterprise |   $1M |  2% |

所以市场不是所有竞争者一样有钱，而是模拟现实中的“很多小卖家 + 少数大卖家”。

---

# 五、NPC 卖家的策略不是随机，而是 10 种商业人格

这个设计非常值得你关注。

作者写了 **10 种 seller archetype**。

### Price Leader

规则：

> 价格 = 市场竞争者中位数 × 95%

节日高峰甚至降到 92%。

就是：

> “我永远比市场主流便宜一点。”

---

### Follower

看三个最便宜的竞争者：

$$
P=\mathrm{avg}(P_{top3})\times1.02
$$

也就是：

> “跟着最低价走，但稍贵一点。”

---

### Liquidator

平时：

$$
P=0.78\times P_{\text{median}}
$$

节日快结束：

$$
P=0.70\times P_{\text{target}}
$$

典型清仓卖家。

---

### Opportunist

如果最近销售需求 > baseline 的 1.2 倍：

> 提价。

节日前还大量备货。

---

### Premium

直接：

$$
P=3\times Cost
$$

强调高价高利润。

---

### Wholesale

$$
P=1.3\times Cost
$$

库存非常大，靠走量。

---

### Event Sniper

平时：

$$
1.65\times Cost
$$

节日高峰：

$$
2.5\times Cost
$$

就是专门抓节日行情。

---

还有：

* Cross-border seller；
* New entrant；
* Dormant seller。

所以整个市场中的竞争价格，本质上是这些不同规则型商家共同产生的。

这一点对构造市场 benchmark 很重要：

> **不是先人为生成一条“市场价格曲线”，而是让异质 seller policy 自己产生市场价格。**

---

# 六、这些 NPC 每天怎么推进？

每个 NPC 每天执行固定循环：

### Step 1：重新定价

根据：

* 自己 archetype；
* 节日；
* 竞争者价格。

---

### Step 2：检查库存

如果低于库存阈值：

> 自动找指定层级供应商补货。

---

### Step 3：设置广告

广告预算约为商品价格的：

$$
0.6\%\sim2.5\%
$$

节日期间乘：

$$
1.8
$$

---

### Step 4：部分卖家做促销

例如：

* liquidator 在节日结束时清仓；
* event sniper 在高峰促销。

---

大中型 NPC 现金不足的时候还会借短期贷款。

所以每次 `end_round()` 后：

> **竞争者也真的会重新计算自己的经营动作。**

这就导致你今天看到的价格，到明天可能已经不一样了。

---

# 七、供应商是怎么设计的？

这篇文章这一块也相当具体。

供应商库：

> **831 个供应商，965 个 offer，覆盖 135 个 SKU。**

数据来自 Alibaba.com 商家数据，保留：

* supplier country；
* unit cost；
* MOQ；
* stock；
* lead time；
* advertised quality。

但是真实身份等被匿名化。

Agent 不是直接收到：

> “最佳供应商 = A。”

而是自己调用：

```text
get_supplier_catalog()
```

按照：

```text
price
quality
MOQ
lead time
availability
```

自己筛选和排序。

这点很重要，因为它避免 benchmark 偷偷替 Agent 做了决策。

---

# 八、供应商还有“骗人”的情况

它不是一个完全透明的商品表。

某些供应商：

* 宣传的质量比实际高；
* 承诺的交货时间比实际短。

这些问题：

> **买之前不一定知道。**

只有真实下单、收到货之后，Agent 才知道。

所以 Agent 需要：

```text
supplier A:
第一次买：delay
第二次买：quality mismatch

→ 以后换 supplier B
```

这实际上是在测：

> **counterparty learning / supplier reputation memory**

而不是只测“谁便宜买谁”。

---

# 九、进货价格也不是固定的

供应商价格：

$$
c_{skt}=c^0_{sk}\times m^{world}_{skt}
$$

其中：

* \(c^0\)：真实数据校准的基础成本；
* \(m^{world}\)：世界状态修正。

例如受：

* 季节；
* 宏观条件；
* 产能压力；
* 市场事件；

影响。

也就是说：

> 第 3 天最便宜的供应商，到第 15 天可能已经不是最优供应商。

这逼 Agent 反复 sourcing，而不是开局查一次就完了。

---

# 十、购买，也就是 Agent 从供应商进货，究竟怎么做？

Agent 有：

```text
get_supplier_catalog()
get_supplier_flags()
buy_supplier()
```

基本过程就是：

```text
需求判断
 ↓
选 SKU
 ↓
查 supplier offers
 ↓
比较
 price
 MOQ
 stock
 quality
 lead time
 ↓
选择 supplier
 ↓
确定 quantity
 ↓
buy_supplier()
 ↓
现金减少 / 形成应付
 ↓
物流运输
 ↓
未来某天库存到店
```

但这里有一个特殊处理：

### Day 0 初始库存

为了避免：

> 刚开店必须白等物流几天，

setup 阶段购买的 inventory：

> **Day 0 直接可用。**

也就是第一次开店可以立即销售。

之后的补货则受正常：

> lead time / logistics

影响。

---

# 十一、卖出去之前，真正的成本不是进货价

这是论文设计里非常关键的一层。

Agent 必须考虑：

$$
C_{\text{landed}}
=
C_{\text{supplier}}
+C_{\text{freight}}
+C_{\text{tariff}}
+C_{\text{compliance}}
+C_{\text{selling}}
$$

也就是：

> 供应商 $40 卖给你，并不意味着卖 $50 就赚钱。

可能：

```text
purchase      $40
freight        $8
tariff         $7
platform fee   $5
insurance      $2
----------------
real cost      $62
```

这时 $50 卖出就是赔钱。

论文甚至展示了失败 Agent：

> 明明知道不同国家成本不同，却给所有国家设置同一个价格，结果 142 个订单中有 98 个低于 landed cost。

---

# 十二、商品怎么上架和定价？

Agent 可以：

```text
list_product_on()
update_listing()
set_price_tiers()
```

有两种主要方式：

### 固定价格

```text
SKU-A
US: $100
EU: $120
Brazil: $90
```

### 数量阶梯价格

例如：

```text
1–10:   $100
11–50:   $92
50+:     $85
```

系统之后会：

> 根据 buyer 的购买数量匹配对应价格。

这意味着价格策略不是 benchmark 固定给的，而是 Agent 自己建立的。

---

# 十三、买家到底是怎么设计的？

这一点我要特别区分：

## 论文对 buyer 的“行为接口”讲得很清楚

Buyer 会：

* 在各 seller offer 中选择；
* 产生购买；
* 发 inquiry；
* 发 RFQ；
* 有自己的需求和偏好；
* 对商品信息、价格、履约条件做响应。

论文明确说：

> buyers choose among all available sellers.

也就是说买家不是只面对被测 Agent，而是会在：

```text
LLM seller
NPC seller 1
NPC seller 2
...
```

之间选择。

---

## 但论文没有给出一个明确的“Buyer 购买效用函数”

这一点反而很重要。

这篇论文并没有像：

$$
P(buy)=
\sigma(
w_1 price+
w_2 quality+
w_3 preference
)
$$

这样把 Buyer 的最终 purchase rule 完整写出来。

至少本文公开描述的重点不是：

> “buyer agent 是什么模型？”

而是：

> **构造一个 demand-driven marketplace，由 buyer 在所有 offer 中产生交易。**

论文明确公开的是需求信号、卖家竞争、客服询价、RFQ、conversion 等机制，而**Buyer 最终在候选商品间做购买选择的内部打分公式没有详细披露**。

如果你是为了自己设计 SalesBench，这里需要记一个很大的区别：

> Business Arena 对 seller architecture 写得非常细，但 buyer decision engine 的公开程度明显低很多。

---

# 十四、Buyer 有哪些显式交互？

论文给 seller 的 buyer 工具主要有：

```text
get_inquiries()
reply_inquiry()

get_rfqs()
respond_rfq()
```

还有售后：

```text
get_return_requests()
respond_to_return()

dispute_return()
resolve_dispute()
```

所以 Buyer 至少不只是一个：

> “每天随机买几个商品”

的需求发生器。

它还会出现：

### Inquiry

例如：

> 有库存吗？
> MOQ 是多少？
> 什么时候能送到？
> 商品质量是多少？

---

### RFQ

Buyer：

> 我要 500 件，你多少钱？

Agent 可以：

* 接受；
* 报价；
* 谈条件；
* 拒绝。

论文把它看作：

> Cooperation & Competition

即卖家需要在成交和利润之间权衡。

---

# 十五、Buyer 的“偏好”怎么体现？

论文虽然没给具体 utility equation，但从 Customer Service 机制能看到设计意图。

Agent 需要：

> infer buyer preferences

然后提供：

> factual, decision-relevant product information。

他们测：

### Buyer conversion

$$
\frac{\text{询问后成交}}{\text{被回复询问}}
$$

以及：

### Factual reply quality

回答是否：

> 有依据、没有编造。

论文甚至发现一个很有意思的结果：

GLM-5.2：

> 31/31 inquiry 全回复，conversion 80.65%。

Gemini 3.1 Pro：

> 27/32，conversion 48.15%。

原因不是回复速度，而是前者回答了具体购买问题，后者大量模板化回答。

---

# 十六、真正的“购买发生”应该怎么理解？

整个机制可以理解成：

```text
潜在需求
  ↓
Buyer arrives
  ↓
看市场所有 listings
  ↓
价格 / 商品 / 市场 / 供货条件
  ↓
可能：
 ├─ 直接购买
 ├─ 发 inquiry
 ├─ 发 RFQ
 └─ 不购买
  ↓
seller reply / offer
  ↓
purchase / reject
```

但是：

> **论文没有公开给出 purchase probability 的完整数学函数。**

所以如果你之后要照它实现一个 SalesBench，我不会建议把这一块直接当成“论文已经解决了”，反而应该标记为：

> **需要自己进一步设计的关键模块。**

---

# 十七、你问的“一步推进”到底怎么设计？这篇最值得学的就是这个

这里不是传统 RL：

$$
s_t,a_t,r_t,s_{t+1}
$$

每一个动作推进一次环境。

而是更接近：

## Agent 在一天内可以做很多动作

比如 Day 7：

```text
get_state()
get_orders()
get_trends()
get_competition()

update_listing()
set_ad_budget()
buy_supplier()

reply_inquiry()
apply_certification()

write a repricing.py
execute repricing.py
```

这些全部发生在：

> **同一个 Day 7。**

环境不会因为每个工具调用都推进一天。

---

# 十八、什么时候真正推进时间？

只有：

```text
end_round()
```

才推进。

论文写得非常明确：

> when it decides that a day’s work is complete, it calls end_round, which advances the world by exactly one day.

于是：

$$
Day_t
\overset{\text{many agent actions}}{\longrightarrow}
end\_round()
\overset{\text{world update}}{\longrightarrow}
Day_{t+1}
$$



这和很多 benchmark 区别非常大。

---

# 十九、`end_round()` 内部发生什么？

可以把它理解成：

```python
def end_round():

    buyers_make_decisions()

    npc_sellers_reprice()
    npc_sellers_restock()
    npc_sellers_update_ads()

    supplier_prices_update()

    shipments_progress()

    demand_changes()

    tariffs_and_events_update()

    operating_costs_deduct()

    loan_interest_accrues()

    inventory_costs_accrue()

    inquiries_and_rfqs_arrive()

    day += 1
```

这是我根据论文机制做的结构化表达，不是论文源码。

论文原话概括的是：

> buyers purchase, competitors update operations, shipments progress, financial costs are deducted, new market signals appear. 

---

# 二十、为什么这种“按天推进”很聪明？

因为商业行为的 feedback 是 delayed。

例如：

### Day 3

Agent：

> “这个产品看起来需求高，我买 1000 件。”

当下并不知道这个决策好不好。

---

### Day 5

货还没到。

---

### Day 8

货到了。

---

### Day 10

销量不行。

---

### Day 12

竞争对手降价。

---

### Day 15

Agent 降价。

---

### Day 20

库存终于清掉。

所以：

> Day 3 的 action，可能到 Day 20 才能真正知道好坏。

这也是论文后来做 stateful checkpoint 的原因。

它发现：

> 每天选“当前最好分支”，不一定得到最终最好结果。

五天才 fork 一次反而表现更好，因为：

> 一天时间根本不足以观察采购、物流、需求和库存周转的后果。

这个结论对你的 benchmark 设计其实非常值得借鉴。

---

# 二十一、环境到底有多长？

一个 episode：

> **30 个模拟日。**

而且不是：

```text
Day1 prompt
Day2 prompt
Day3 prompt
...
```

系统不会每天给它重新发 prompt。

Agent 从一开始：

> **continuous autonomous execution**

一直运行。

它自己决定：

* 什么时候看状态；
* 什么时候操作；
* 什么时候写脚本；
* 什么时候结束今天。

所以更像真实 agent，而不是 30 道连续题。

---

# 二十二、需求是怎么构造的？

它没有直接给 Agent：

```text
Demand = 382
```

而是制造：

> **latent demand + noisy public signals**

Agent只能看证据。

例如：

### Base demand

基础需求。

---

### Google Trends

历史趋势。

Agent需要自己判断：

> increasing / declining。

---

### Calendar

知道节日即将发生。

---

### Events

某些事件是真的；

某些是 rumor。

所以 Agent 必须：

> cross-check evidence。

这也是论文强调：

> evidence exists, but agent must decide what to inspect and what to trust. 

---

# 二十三、30 天为什么可以模拟一年？

作者把：

> **30 simulated days 映射成一个 real-world year。**

然后把节日压缩进去。

例如：

* 春节；
* 618；
* 双十一；
* Black Friday；
* Christmas；
* Ramadan；
* Super Bowl；
* Halloween。

这样 Day 1 到 Day 30 里会快速经历：

> 淡季 → 节日临近 → 峰值 → 结束。

不同品类需求会相应上涨。

---

# 二十四、竞争市场为什么会动态变化？

变化有好几层：

```text
latent demand
supplier cost
competitor price
inventory
advertising
tariff
shipping
festival
market event
compliance rules
```

因此一个最优策略：

> Day 5 有效

可能：

> Day 15 已经过时。

这就是论文所说的：

> changing market。

---

# 二十五、广告怎么设计？

Agent：

```text
get_ad_status()
set_ad_budget()
```

广告不是直接：

> “付 $100 → 得 10 个订单。”

作者强调 full-funnel ROI。

正确策略：

```text
small test
 ↓
observe conversion
 ↓
observe contribution profit
 ↓
scale / stop
```

消融实验中：

* 小额试投：21.45× incremental net worth / ad dollar；
* ROI gate：6.53×；
* blind spending：4.94×。

也就是说：

> 广告不是固定 bonus，而是需要试验—反馈—调整。

---

# 二十六、财务系统也不是简单 cash

最终评分：

$$
FinalAssets
=
cash
+0.97\times escrow
+0.97\times receivables
+0.85\times inventory
-payables
-loans
$$

也就是：

> 最后囤一堆货不能假装它们都值原价。

库存只算：

$$
85\%
$$

应收款：

$$
97\%
$$

这避免 Agent 用“没完成的交易”刷分。

---

# 二十七、每天还会扣钱

实验中的 mid-scale shop：

固定：

$$
\$200/day
$$

加：

$$
0.5\%\times \text{inventory value}
$$

库存越多：

> 持有成本越高。

所以 Agent 不能：

> “我不知道买啥，那我什么都不做。”

因为不经营也会持续亏钱。

---

# 二十八、还有贷款、保理和清仓

### Loan

利率：

$$
0.15\%/day
$$

逾期：

> 2.5× 利率。

---

### Factoring

提前把应收款换成现金。

折价：

$$
5\%-18\%
$$

---

### Liquidation

库存立即变现：

$$
85\%\times cost
$$

所以如果买错了：

> 可以止损，但不能无成本撤销错误。

这个设计很合理。

---

# 二十九、Compliance 是怎么做的？

不同：

```text
product × country
```

会要求不同认证。

Agent 需要：

```text
get_certifications()
get_compliance_status()
apply_certification()
```

并且认证：

> 不是立即批准，有 processing time。

所以你 Day 1 就要考虑：

> “我要 Day 10 在美国卖，那现在就要申请。”

如果没有 permit 还卖：

$$
F_k
=
\max(500,0.15\times order\ value)
\times\min(k,5)
$$

连续违法会快速升级罚款。

这实际上测试的不是知识，而是：

> **long-horizon execution reliability。**

---

# 三十、实验环境本身怎么搭的？

每次 run：

> 一个全新的 isolated sandbox。

使用：

> **OpenClaw runtime**

Agent 是：

> unprivileged user。

可以：

```text
read
write
edit
exec
process
```

也就是说它可以：

> 自己写代码。

但不能访问：

* simulator source；
* database；
* hidden state。

只能通过公开工具操作市场。

---

# 三十一、这里还有一个很重要的设计：Agent 可以自己写“经营程序”

这不是单纯 LLM：

> 每一步都 reasoning → tool call。

它还可以直接写：

```python
repricer.py
supplier_filter.py
ad_manager.py
inventory_monitor.py
```

然后长期执行。

论文举的 GPT-5.6 Sol 就自己写 sourcing program：

```text
过滤低质量 supplier
比较 route margin
做 9-SKU portfolio
保留 cash reserve
```

Gemini 3.1 Pro 则自己写 route-aware repricer：

```text
supplier cost
+ freight
+ tariff
+ competition
→ country-specific price
```

而且设：

> 15% margin floor。

所以这个 benchmark 实际上测试了：

> **LLM reasoning + tool use + code-writing + long-term memory + business policy。**

---

# 三十二、作者认为理想 Agent 应该是什么结构？

附录给出了一个非常值得看的“Expert-designed Strategy”。

整体其实可以抽象成：

```text
Observable Evidence
     ↓
Memory
     ↓
Belief State
     ↓
Capital & Portfolio Planner
     ↓
┌───────────────┐
│ sourcing      │
│ pricing       │
│ compliance    │
│ ads           │
│ customer      │
│ finance       │
└───────────────┘
     ↓
Market outcome
     ↓
Memory update
     ↓
Next cycle
```

论文第 27 页 Figure 13 就是这个架构。

这个其实特别像你之前关心的那种：

> **belief → planning → action → feedback**

而不是直接：

> prompt → 买 / 不买。

---

# 三十三、从“文章结构”重新给你梳理整篇论文

如果按作者自己的论证逻辑，其实是下面五步。

## 第一层：为什么需要这个 benchmark？

作者认为已有 Agent benchmark 通常：

```text
任务固定
世界固定
答案明确
即时反馈
```

但真实 business 是：

```text
信息不完整
反馈延迟
市场变化
决策互相耦合
没有唯一答案
```

所以需要一个 long-horizon marketplace。

---

# 第二层：怎么构造一个“像商业”的世界？

作者引入：

```text
real supplier offers
real MOQ
real lead time
real tariff structure
real demand signals
festivals
dynamic supplier prices
NPC competitors
buyers
advertising
shipping
compliance
financial costs
```

核心不是绝对拟真，而是保留四种困难：

### 1. Incomplete information

看不到真实 demand。

### 2. Delayed consequences

今天进货，未来才知道对不对。

### 3. Changing world

竞争价格、需求、关税都会变。

### 4. Persistent obligations

合规、客服、成本不能忽略。

---

# 第三层：Agent 怎么和这个世界交互？

给它：

> 60+ tools。

每天：

```text
Observe
↓
Reason
↓
Act
↓
Act
↓
Act
↓
end_round()
↓
World evolves
↓
Observe
```

连续 30 天。

这就是 benchmark 的真正 interaction protocol。

---

# 第四层：怎么证明最终赚钱不是 simulator hack？

作者做机制消融。

例如：

### 商品选择

正确：

> demand evidence + cost + sales

比：

> blind bulk buying

多赚：

> +$63.6k。

---

### Pricing

完整成本定价：

> +$50.3k

vs near-cost price：

> -$58.1k。

---

### Market event

验证信息：

> +$6.6k

vs ignore event：

> -$17.3k。



所以作者想证明：

> benchmark 奖励的是“正确经营机制”，不是 exploit。

---

# 第五层：最后怎么评价一个 Agent？

总指标：

$$
Final\ Net\ Worth
$$

但他们认为只看这个不够。

所以拆成：

### Operate

* arena calls；
* world checks；
* tool failures。

### Deploy

* capital utilization；
* holding cost。

### Sell

* sell-through；
* order margin；
* route cost；
* ad ROI；
* market share。

### Interact

* buyer conversion；
* factual replies；
* RFQ success。

### Rules

* compliance fines。

也就是：

> **结果指标 + 能力指标 + action-level attribution。** 

---

# 三十四、如果把整篇论文压缩成一个“机制图”

我建议你脑子里记这个：

```text
               REAL-WORLD DATA
            Alibaba / tariffs /
         trends / season / festivals
                    │
                    ▼
              MARKET STATE
                    │
   ┌────────────────┼─────────────────┐
   │                │                 │
Suppliers       NPC sellers         Buyers
dynamic cost     10 strategies      demand
MOQ              reprice            inquiry
quality           restock            RFQ
lead time         ads                purchase
   │                │                 │
   └────────────── Marketplace ───────┘
                    ▲
                    │
               LLM SELLER
                    │
        ┌───────────┼───────────┐
        │           │           │
     research    sourcing     pricing
        │           │           │
      ads       inventory   compliance
        │           │           │
      service     finance     recovery
        └───────────┼───────────┘
                    │
               end_round()
                    │
                    ▼
              ADVANCE 1 DAY
                    │
                    ▼
      purchases / competition / shipping
       costs / events / supplier change
                    │
                    ▼
                NEXT DAY
```

这基本就是整篇 Business Arena。

---

# 三十五、对于你特别关心的“买方—卖方—购买—一步推进”，最后给一个非常简洁的结论

### Seller

分两层：

> **1 个 LLM seller + 60 个 scripted NPC competitor sellers。**

NPC 通过不同 pricing / restocking / ads 规则制造竞争市场。

### Supplier

831 个供应商、965 个真实数据校准 offer、135 SKU；价格、MOQ、质量、lead time、可靠性都影响采购。

### Buyer

Buyer 在市场所有 seller offer 中进行选择，并产生：

> purchase / inquiry / RFQ / returns。

但**论文没有公开完整 buyer purchase utility / probability formula**，这一块是全文相比 seller 机制更不透明的地方。

### Purchase

LLM 先判断需求 → 搜 supplier → 比成本/MOQ/质量/lead time → `buy_supplier()` → 物流 → 入库 → 分国家上架 → 买家购买。

### One-step progression

**一个 step 不是一次 tool call。**

而是：

> **一天 = 一个 environment step。**

Agent 在一天内可以无限制地观察和调用若干工具，最后自己调用：

```text
end_round()
```

世界才统一：

> 前进一天。

这是这篇论文最值得借鉴的长程交互设计。

### Experimental environment

> 30 天连续自主运行 + OpenClaw isolated sandbox + 60+ business tools + 可写脚本 + 动态供应商/竞争者/需求/物流/关税/成本/合规 + $80k 初始资金。

实验本身是在这样的长期、动态市场里看 Agent 最后还能剩多少钱。

---

如果从你现在关注的 **SalesBench / 买方卖方交互 benchmark** 角度来看，这篇文章最值得拿走的其实有三件东西：**“一天一个宏观 step”、异质规则卖家制造竞争市场、belief→portfolio→execution→feedback 的完整闭环**；而它相对最值得继续追问的反而是 **buyer 内部购买决策是如何生成的**，因为这部分论文没有像 seller 那样给出足够细的规则。



——-=-

我把能找到的官方材料都查了一遍，包括 **arXiv HTML、官方项目站、公开 GitHub、Trajectory/Market Replay 页面**。先把最重要的结论纠正清楚：

**目前公开材料能够明确证明“60 个竞争卖家是 rule/scripted NPC”，但不能同样明确证明 buyer 和 supplier 是哪种具体实现。** 从整个系统结构看，buyer 和 supplier **极大概率也是 simulator/backend 中的程序化角色，而不是另外调用 LLM 的 agent**；但作者没有公开 buyer/supplier 的核心代码、prompt 或完整 rule，所以这部分不能像 NPC seller 那样下 100% 的结论。

而且你的疑惑确实来自论文的一个信息缺口：**他们把卖家 Agent 能调用什么工具写出来了，却没有公开这些工具的 JSON schema，也没有公开 buyer 如何生成 inquiry、如何接受 RFQ、supplier 如何决定 quote 的具体函数。**

---

## 1. 我先查了代码：目前其实没有把 simulator 开源出来

官方 GitHub 现在是公开的，但仓库根目录实际上只有：

```text
assets/
paper/
LICENSE
README.md
```

一共只有 5 个 commit。没有类似：

```text
environment/
buyer.py
supplier.py
npc.py
tools/
server/
simulator/
```

这样的实现代码。README 也明确写的是如果想跑自己的模型，需要联系作者，他们“evaluate models on request”。所以这个 GitHub 目前更准确地说是**论文/项目展示仓库，而不是 Benchmark 源码仓库**。([GitHub][1])

[Business Arena 官方 GitHub](https://github.com/Accio-org/BusinessArena?utm_source=chatgpt.com)

因此我们目前**没法直接打开 `get_rfqs()` 的 Python 实现**来看：

```python
def get_rfqs(...):
    ...
```

这就是为什么论文中很多细节会让你觉得“断了一层”。

---

# 2. 有没有额外 Supplementary Material？

我没找到独立发布的一套：

> API specification / environment documentation / buyer policy appendix / simulator source

当前 arXiv 的 34 页版本本身已经把 Appendix A–M 包在论文里了。

其中 Appendix A 给出的只是**工具名字和功能映射**，例如：

```text
get_inquiries()
reply_inquiry()
get_rfqs()
respond_rfq()

get_supplier_relations()
request_quote()
get_supplier_quotes()
respond_quote()
```

作者明确说这些是 **typed MCP calls**，Agent 通过它们和 Arena 后端交互；同一套能力也可以从 scriptable API 调用。([arXiv][2])

但没有继续给：

```text
arguments
return schema
buyer generation logic
acceptance formula
quote formula
```

所以目前没有发现你想要的那种完整 supplement。

---

# 3. 不过官方还有一个比论文更有价值的东西：Trajectory + Market Replay

这个其实非常值得注意。

官方项目站说，他们公开了三层信息：

* leaderboard；
* **agent trajectory**；
* **market replay**。

Trajectory 可以看某次 run 中：

> 模型“想了什么、看到了什么、调用了什么工具”。

Market Replay 则同步展示：

> Seller side 的 listing / inventory / order / customers
> Buyer side 的 products / prices / availability / conversations

也就是说，**他们确实保存了实际运行时 buyer-seller 交互轨迹**，只是这些数据目前通过网页动态展示，没有作为代码/API schema 发布。([GitHub][1])

官方 Market Replay 页面也明确写：

> Seller decisions and their buyer-facing effects stay synchronized.

buyer 视角会显示：

> products, prices, availability, and conversations. ([business-arena.site.accio.ai][3])

[Business Arena 官方项目页](https://business-arena.site.accio.ai/?utm_source=chatgpt.com)

[Market Replay](https://business-arena.site.accio.ai/market-replay.html?utm_source=chatgpt.com)

这个信息很重要，因为它至少说明：

**Buyer 不是论文里纯粹抽象成一个最终销量数字，它确实存在 buyer-facing storefront 和 conversation state。**

但网站目前没有把动态 run 内部的 tool payload 索引出来，所以我通过公开搜索还不能直接拿到一条真实的：

```text
get_rfqs() -> {...}
```

记录。

---

# 4. 现在我们可以比较确定地给四类角色“定身份”了

| 主体            | 目前能确定的实现                                                          | 是否 LLM                                                  |
| ------------- | ----------------------------------------------------------------- | ------------------------------------------------------- |
| 被测 Seller     | OpenClaw 中运行的被测试模型                                                | **是，明确是 LLM**                                           |
| 60 个竞争 Seller | 10 类 scripted NPC，固定 deterministic behavior loop                  | **明确不是 LLM**                                            |
| Supplier      | Arena 后端里的 supplier offers + dynamic state + relationship/quote机制 | **没有任何证据显示是 LLM；非常像程序化 simulator**                      |
| Buyer         | Arena 后端里的购买、Inquiry、RFQ、Return 等市场参与者                            | **没有任何证据显示是 LLM；非常像程序化 simulator，但具体 buyer policy 未公开** |

这里我要特别修正我之前的表达：

> **不能直接说“buyer 是 rule-based”作为论文明确事实。**

论文**明确用了 “scripted sellers” 描述竞争卖家**，但没有找到同样一句：

> “buyers are scripted agents”

或者：

> “buyers are LLM agents”。

所以对 Buyer 最准确的说法是：

> **它是 simulator 内的 autonomous buyer actor；公开材料没有披露其决策函数。**

---

# 5. 为什么我现在比较确信 Buyer 大概率不是 LLM？

这个不是作者明确的一句话，而是从系统证据推出来的。

论文说，在 `end_round()` 后：

> arena autonomously advances the rest of the market，buyers make purchasing decisions，competitors update operations……

也就是说 buyer purchasing 是**世界状态推进的一部分**，而不是 Seller 给另一个 LLM 发 prompt 后等待回复。([arXiv][2])

更关键的是，他们对真正的 LLM Seller 会详细说明：

```text
OpenClaw runtime
model family
reasoning effort
token usage
API spending
```

甚至官网专门统计：

> Mean tokens used over a 30-day run
> business P&L per API dollar

但 Buyer 和 Supplier 完全没有：

```text
buyer model = ?
buyer prompt = ?
buyer token consumption = ?
supplier model = ?
```

的记录。官方 benchmark 只记录正在被评估的 Seller LLM 的 token/API 花费。([business-arena.site.accio.ai][4])

因此从架构上更合理的是：

```text
             LLM
          Seller Agent
               │
          typed tools
               │
               ▼
        ┌──────────────┐
        │ Arena Backend│
        │              │
        │ Buyers       │
        │ Suppliers    │
        │ NPC Sellers  │
        │ Demand       │
        │ Logistics    │
        └──────────────┘
```

而不是：

```text
Seller LLM → Buyer LLM → Supplier LLM → ...
```

如果真是后一种，这篇论文的实验成本、复现性、模型设定都会完全不同，作者几乎不可能不说明。

---

# 6. Supplier 更加明显不像 LLM

Supplier 这一边论文给出的机制非常数学化。

一个 supplier offer 包括：

```text
country
unit cost
MOQ
stock
lead time
advertised quality
```

总共有：

> 831 supplier，965 offers，135 SKU。([arXiv][2])

而供应商价格甚至明确按照：

$$
c_{skt}=c^0_{sk}\times m^{world}_{skt}
$$

更新。

也就是说 supplier price 是：

> Alibaba 数据 anchor × 世界状态 multiplier。

同时某些 supplier：

* 质量宣传过高；
* lead time 宣传过短；

真实结果在订单完成后才暴露。([arXiv][2])

这个实现风格明显是：

```text
database entity
+
hidden state
+
transition rules
```

而不是：

> “让一个供应商 LLM 自己想今天卖多少钱”。

---

# 7. 那 `request_quote()` 是怎么回事？Rule supplier 怎么能“谈判”？

这其实是你最关键的疑问。

**“有 negotiation”不等于“另一边必须是 LLM”。**

完全可以是一个 state machine。

举个抽象例子：

```text
Supplier A
base_price = 20
relationship_level = 2
buyer_order_volume = 1000
inventory_pressure = high
```

Seller 调：

```text
request_quote(Supplier A, SKU X, quantity=1000)
```

环境内部计算：

```text
base = $20
volume discount = -5%
relationship discount = -3%
stock pressure discount = -2%

new quote = $18
```

然后把一个结构化 quote 返回给 LLM。

LLM：

```text
get_supplier_quotes()
```

看到：

```text
Supplier A
SKU X
quantity ...
offered terms ...
expiry ...
```

再：

```text
respond_quote(...)
```

接受/拒绝/回应。

这就是一个“谈判”。

**根本不要求 Supplier 能自然语言推理。**

---

但是请注意：

上面这个具体折扣公式是我为了说明机制举的例子。

**论文并没有公开它到底按 volume、relationship、inventory 的什么权重算。**

官方只说：

> Supplier relationships and negotiation: learn counterparty behavior, request better terms, and decide whether to accept supplier offers. ([arXiv][2])

所以我们现在知道：

```text
存在 supplier relation state
存在 request quote
存在 supplier quote
存在 respond quote
```

但不知道：

```text
quote = f(什么变量)
```

这是未公开部分。

---

# 8. Buyer 这边也应该用同样思路理解

我现在认为最接近真实实现的理解不是：

> Buyer LLM 自由聊天。

而是：

> **Buyer 是有隐藏需求/偏好/交易状态的 simulator entity，能产生结构化 market events；Seller LLM 用工具读这些事件并写回复。**

整个过程大概是：

```text
Buyer internal state
    │
    ├── 普通购买需求
    │
    ├── Inquiry
    │
    └── RFQ
           │
           ▼
       Arena DB
           │
      get_inquiries()
      get_rfqs()
           │
           ▼
       Seller LLM
           │
      reply_inquiry()
      respond_rfq()
           │
           ▼
       Arena Backend
           │
      buyer evaluates
           │
     ┌─────┴─────┐
   purchase     reject
```

这个“buyer evaluates”到底是什么公式：

> **没有公开。**

---

# 9. `Inquiry` 现在能比之前解释得更准确一点

论文把 Customer Service 明确拆成：

> infer buyer needs + answer factual questions。

官方 README 对 customer service outcome 的分类甚至直接写了：

```text
Converted
Incomplete
Unanswered
Materially false
```

也就是说 Inquiry 至少不是一句随便生成的聊天，它会被后端追踪成一个业务对象，并最终被判定：

> 回答完整不完整、是不是事实错误、有没有转化。([GitHub][1])

从论文实例来看，buyer 会问：

> 商品和商业条款相关的具体问题。

模型回复时需要查：

* product；
* inventory；
* fulfillment；
* commercial terms。

所以更像：

```text
Buyer need:
"我关心 X / Y / Z"

Inquiry:
"这个产品能否满足 X？
交付条件 Y 是什么？"

Seller response:
"..."

Evaluator / buyer mechanism:
Does response address buyer decision criteria?
Is it factually supported?
→ conversion?
```

而不是纯开放式聊天。

---

# 10. Inquiry 到 Purchase 的关系也能确定

论文对 `buyer conversion` 定义很清楚：

> answered inquiries that result in purchases 的比例。

所以至少系统里明确存在这样一个状态链：

```text
Inquiry created
      ↓
Seller answered
      ↓
Buyer / environment processes reply
      ↓
Purchase or no purchase
```

也就是说：

> **“回复得好”本身不直接算成功，最终确实要转成 purchase。**

这是一个非常关键的设计。论文也把 Buyer conversion 当正式指标。([arXiv][2])

---

# 11. RFQ 则比 Inquiry 更像“结构化议价”

论文原话是：

> Customer service and buyer negotiation
> … negotiate bulk transactions …

对应：

```text
get_rfqs()
respond_rfq()
```

([arXiv][2])

所以合理的状态应该是：

```text
Buyer wants bulk order
        ↓
      RFQ
        ↓
get_rfqs()
        ↓
Seller constructs terms
        ↓
respond_rfq()
        ↓
Buyer evaluates
      ↙      ↘
 accepted   not accepted
    ↓
  Order
```

并且论文的 RFQ Success 定义就是：

> received RFQs that produce accepted orders。

这证明 RFQ 的终态确实有：

```text
accepted → order
```

而不只是“LLM 说了一句话就算完成”。

---

# 12. 但这里有一个我现在仍然不能替作者补的关键细节

论文用了：

> “accept, counter, or walk away”

这样的语言描述 negotiation。([arXiv][2])

但公开资料没有说明 RFQ 到底是：

### 方案 A：一次性报价

```text
Buyer RFQ
↓
Seller quote
↓
accept / reject
```

还是：

### 方案 B：真正多轮 counteroffer

```text
Buyer $80
↓
Seller $95
↓
Buyer $85
↓
Seller $90
↓
accept
```

`respond_rfq()` 的 exact schema 没公开，因此**我现在不会再把它说成一定支持自由多轮议价**。

论文的“negotiation”很可能只是：

> **结构化 offer/counter decision process**

而不一定是 LLM↔LLM 多轮自然语言 negotiation。

这个区别对你们 SalesBench 非常重要。

---

# 13. 普通 Purchase 和 RFQ Purchase 也是两条路

这里可以再明确一点。

## 普通 Buyer purchase

Seller 做：

```text
list_product_on()
update_listing()
set_price_tiers()
```

然后论文明确说：

> market matches each buyer against the applicable offer. ([arXiv][2])

所以：

```text
Seller listing
     ↓
Buyer demand arrives
     ↓
Market matches offer
     ↓
Purchase
     ↓
get_orders()
```

这里 Seller 没有：

```text
sell_to_buyer()
```

这样的工具。

**Seller 不能强迫成交。**

---

## RFQ Purchase

则多了一层：

```text
Buyer RFQ
 ↓
Seller response
 ↓
accepted
 ↓
order
```

所以它是更偏 B2B 的大宗订单入口。

---

# 14. 那 60 个竞争 Seller 和 Buyer 又怎么连接？

这块是明确的。

60 个 NPC Seller 每天：

```text
rule → reprice
rule → restock
rule → set ads
rule → promotion
```

LLM Seller 也：

```text
set price
set inventory
set ads
```

于是 Buyer 面对的是：

```text
                 Buyer
                   │
     ┌─────────────┼─────────────┐
     ▼             ▼             ▼
  LLM shop      NPC shop 1    NPC shop 2...
 $95 / stock     $91            $103
```

论文直接说：

> buyers choose among all available sellers.

所以 Buyer 才是把 LLM 和那些 rule seller **耦合起来的市场机制**。

不是：

```text
LLM seller ↔ NPC seller 聊天
```

而是：

```text
LLM seller ─┐
NPC seller ─┼── offers → buyer decision → orders
NPC seller ─┘
```

---

# 15. Supplier 也不是直接“跟 LLM 说话”

从 Agent 视角感觉像：

> “我问供应商 → 供应商回复”。

但技术上更可能是：

```text
LLM
 ↓
request_quote()
 ↓
Arena server
 ↓
supplier state/rules
 ↓
quote object stored
 ↓
get_supplier_quotes()
 ↓
LLM sees result
```

所以所谓“交流”，本质上是：

> **LLM ↔ API ↔ simulator state**

而不是：

> LLM ↔ 另一个语言模型。

这句话基本可以作为你理解 Business Arena 的核心。

---

# 16. 为什么作者要这样做，而不是 Buyer/Supplier 全用 LLM？

虽然作者没专门解释这一点，但从 benchmark 设计上非常好理解。

如果 Buyer 也是 LLM：

```text
Seller GPT
↓
Buyer GPT/Claude/...
↓
随机生成回复
```

那一次实验结果会同时依赖：

* Seller LLM；
* Buyer LLM；
* Buyer sampling；
* Buyer prompt；
* Buyer model version；
* token budget。

这样你很难知道：

> 到底测出来的是 Seller 强，还是 Buyer 这次比较好说话。

而 Business Arena追求 matched/repeated world，甚至 10 次 run 来比较模型，所以程序化 buyer / supplier 状态机更符合它的可控评测目标。

这部分是**我的 benchmark 设计推断，不是论文直接声明**。

---

# 17. 所以现在可以把整套底层结构改写得更准确

你之前可能脑补的是：

```text
            Buyer LLM
                ↑
                │ chat
                ↓
Supplier LLM ← Seller LLM → 60 seller agents
```

这基本不是它。

更应该理解成：

```text
                       Seller LLM
                           │
                     tool / MCP call
                           │
                           ▼
                 ┌──────────────────┐
                 │  Business Arena  │
                 │    Backend       │
                 │                  │
                 │ Buyer state      │
                 │ Supplier state   │
                 │ Demand model     │
                 │ Order system     │
                 │ RFQ system       │
                 │ Inquiry system   │
                 │ Logistics        │
                 │ Finance          │
                 │                  │
                 │ 60 scripted NPC  │
                 └──────────────────┘
                           │
                      end_round()
                           │
                           ▼
                   update world
```

**LLM 是“唯一被评测、会自主 reasoning 的经营主体”；其他角色主要构成它所处的 simulation world。**

这至少是目前公开材料最一致的解释。

---

# 18. 但我们现在仍然缺四个你真正想看的函数

我认为如果从你现在 SalesBench 的角度读，这篇论文剩下最关键的未知量就是：

**① Buyer purchase policy**

到底是不是类似：

$$
U_{buyer,seller}
=
f(price, quality, availability, preference,\ldots)
$$

再 softmax / sample？

**作者没公开。**

**② Inquiry generator**

Buyer 什么情况下询问，而不是直接买？

询问什么问题？

Buyer preference 如何映射到 question？

**没公开。**

**③ RFQ acceptance / negotiation**

什么情况下发 RFQ？

Seller 报多少钱 Buyer 会接受？

有没有多轮 counteroffer？

**没公开。**

**④ Supplier quotation mechanism**

`request_quote()` 后，关系历史、购买量等到底怎么改变新报价？

**没公开。**

所以你现在感觉：

> “工具我看到了，但另一头到底是谁在接？”

这个疑问是对的。

**论文实际上把 tool surface 公开了，但没有把 counterparty transition function 公开。**

---

# 19. 有一个第三方页面甚至把 Buyer 叫 NPC，但我不建议把它当证明

我搜索过程中看到有第三方论文解读把 buyer 直接描述成 “NPC buyer”。

但那不是作者的正式 implementation documentation，而且很多这类论文聚合页本身是 AI 自动摘要，所以我不愿意拿它当证据说：

> “作者明确声明 Buyer 是 rule。”

目前能靠官方材料确定的还是：

> **Competing sellers = scripted NPC，明确。**

> **Buyer/Supplier = simulator participants，具体内部 policy 未公开。**

这个区分最好保留。

---

# 20. 我觉得这篇论文现在应该这样评价

如果你是纯看论文结果，它已经写得很丰富。

但如果你是想：

> **“我要照着复现/借鉴 buyer–seller interaction mechanism”**

那它目前实际上是**不够透明的**。

它公开得比较充分的是：

```text
Seller action space
market lifecycle
NPC competitor strategy
supplier attributes
demand grounding
finance/logistics/compliance
```

但你最关心的：

```text
Buyer generation
Buyer decision
Buyer query
RFQ protocol
Supplier negotiation
```

只是给了：

> 接口名称 + 行为描述，

没有给：

> **真实 transition function。**

并且公开 GitHub 现在也没有 simulator 源码补这个缺口。([GitHub][1])

---

所以就你现在这个问题，我会把 **Business Arena** 暂时记成这样：

> **Seller-centric business benchmark。**

> LLM 负责 Seller；竞争 Seller 明确由规则驱动；Buyer/Supplier 位于环境后端，通过结构化事件和 MCP 工具与 Seller 交互。Buyer 可以 purchase、Inquiry、RFQ，Supplier 可以 offer/quote，但公开版本没有披露这些 counterparty 的具体生成/接受算法，因此不能把它当成一篇已经完整解决“语言如何影响 buyer purchase”的论文。

尤其对你们想做的那种 **SalesBench——销售者说什么、开什么价、客户为什么买** 来说，**Business Arena 最重要的 buyer-side 这一层反而恰恰没有公开到足够细。**

这也意味着它跟你之前提到的 MarketBench 那种“明确告诉你语言如何映射到用户兴趣/购买结果”的工作，技术关注点其实不太一样。

[1]: https://github.com/Accio-org/BusinessArena "GitHub - Accio-org/BusinessArena: Long-horizon arena for end-to-end business agents · GitHub"
[2]: https://arxiv.org/html/2608.08621v1 "Business Arena: Benchmarking LLM Agents in a Realistic Marketplace"
[3]: https://business-arena.site.accio.ai/market-replay.html "Business Arena · Market replay"
[4]: https://business-arena.site.accio.ai/ "Business Arena"
