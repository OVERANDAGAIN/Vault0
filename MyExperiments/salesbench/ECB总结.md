---
创建时间: 2026-九月-14日  星期一, 12:56:52 下午
---
可以。这篇我建议不要按“从摘要一路翻译到结论”的方式读，而是按你现在做 SalesBench 最关心的机制来拆：**角色是谁、买卖双方怎么实现、一次购买怎么发生、一天怎么推进、环境如何结算、长期记忆和重复交易怎么进入系统，最后再回到论文整体贡献。**

先给你一个最重要的判断：

> **E-Commerce Bench 不是“买方 LLM Agent vs 卖方 LLM Agent”的双智能体销售模拟。**
> 真正被评测的 LLM 只有一个——**商家 Merchant Agent**。它在上游是“买方”，向供应商采购；在下游是“卖方”，向消费者卖货。
> 上游供应商的**经济决策由规则/确定性 negotiation kernel 控制**，LLM 只负责把决定说成人话；下游消费者甚至不是一个个 Agent，而是一个**确定性的需求函数**，直接算每天买多少。

这点和你现在关心的“buyer/seller 如何设计”特别关键。

---

# 一、先把论文里的核心术语弄清楚

| 论文术语                             | 中文                         | 在这篇论文里到底是什么                              |
| -------------------------------- | -------------------------- | ---------------------------------------- |
| Continuing Long-Horizon Task     | 持续型长时程任务                   | 不是完成一个任务就结束，而是连续经营 365 天，看最后赚多少钱         |
| Merchant Agent                   | 商家 Agent                   | 被测试的 LLM，本质是老板/运营人员                      |
| Supplier                         | 供应商                        | 商家采购商品的上游卖方                              |
| Customer / Demand Model          | 消费者/需求模型                   | **不是 LLM Buyer**，是公式计算每天销量               |
| Deterministic Negotiation Kernel | 确定性谈判内核                    | 真正决定供应商报价、让步、接受还是退出的程序                   |
| NPC Renderer                     | NPC 文本渲染器                  | 一个 LLM，把 kernel 的“116.74 元、拒绝/接受”包装成自然语言 |
| Reservation Price / Cost Floor   | 保留价/成本底价                   | 供应商最低能接受的价格，对 Agent 隐藏                   |
| Opening Quote                    | 初始报价                       | 供应商第一次开价                                 |
| ZOPA                             | Zone of Possible Agreement | 买卖双方存在成交可能的价格区间                          |
| Concession                       | 让步                         | 谈判中逐渐降低/提高报价                             |
| Walk-away                        | 退出谈判                       | 供应商认为报价太低，直接终止                           |
| Repeated Bargaining              | 重复谈判                       | 同一个供应商、同一个商品，一年中反复采购                     |
| Three-Account Settlement         | 三账户结算                      | Bank、Escrow、Platform Wallet 三套钱          |
| Demand Elasticity                | 需求价格弹性                     | 价格改变会导致销量怎样变化                            |
| Reputation                       | 店铺信誉                       | 影响实际需求                                   |
| Dynamic Events                   | 动态事件                       | 暴风雪、缺货、经济下行、促销等                          |
| Persistent Memory                | 持久记忆                       | Agent 可以主动存 20 条长期信息                     |
| Context Eviction                 | 上下文淘汰                      | 超过 120k token 后删除旧对话                     |
| CSE+                             | 成交条件下的谈判剩余获取率              | 看你把供应商压到多低                               |
| BadSpend%                        | 欺诈采购占比                     | 花给诈骗供应商的钱占所有采购多少钱                        |
| AnchorRegret / AnchorRatio       | 重复采购价格锚定指标                 | 看第二次买的时候有没有记住以前谈到的低价                     |

论文的整体目标其实一句话就能概括：

**给 LLM 10 万元，让它自己经营一家甚至四家淘宝式店铺一年，通过选品、谈判、采购、定价、发货、退货和资金管理，最后看资产剩多少。**

---

# 二、大白话理解：这个世界里到底有哪些“人”

我建议你把图 3，也就是论文第 7 页的架构图，理解成三层角色。

## 1. 中间这个 LLM：商家 Agent

它既不是纯买方，也不是纯卖方。

它要做完整经营：

**市场调研 → 找供应商 → 谈价 → 进货 → 开店 → 上架 → 定价 → 等消费者购买 → 发货 → 处理退货 → 收钱 → 再进货。**

论文提供了 18 个工具完成这些事情。

所以它更像：

> “你现在是淘宝店老板，给你 10 万块钱，你自己搞一年。”

而不是传统 SalesBench：

> “一个 salesman 跟一个 user 聊天，看能不能把东西卖出去。”

---

# 三、最值得你注意的：这里实际上有“三个市场角色”

## A. 上游：Merchant Agent 是买方

Agent 要从 supplier 那里进货。

比如：

> 我想买 50 件 SKU-X，我出 ¥102。

然后供应商可能说：

> ¥131.44 不行更低。

Agent：

> 我们上次 ¥103.11 成交，还是按这个来。

Supplier：

> 最低 ¥118.92。

最后 Agent 接受 ¥116.74。

论文第 40 页给了一个真实运行案例，最有意思的是：这个 Agent **明明记得自己过去 ¥103.11 买过，结果这次最后 ¥116.74 又买了**。作者把这种现象专门当作 long-horizon learning failure。

这就是为什么他们要研究：

**Agent 有没有从过去的交易经验中真正学会。**

---

# 四、供应商到底怎么设计？这是这篇最重要的技术点之一

这个部分是你最值得借鉴的。

供应商其实被拆成：

$$
\boxed{\text{Supplier}
=
\text{Negotiation Kernel}
+
\text{LLM Renderer}}
$$

也就是：

**“脑子是规则，嘴巴是 LLM。”**

论文明确说，所有价格、让步、接受和退出决策都是 kernel 做的；LLM 只负责把结果说出来。

---

## 第一层：Deterministic Negotiation Kernel

假设供应商的真实最低价格：

$$
c = 100
$$

第一次报价：

$$
p_0 = 150
$$

Agent 出：

$$
105
$$

供应商不会让 LLM 自己想：

> “105 合不合理呢？”

而是先进入一套数学规则。

### 1. 判断接受不接受

核心变量是：

$$
\bar{\delta}_k=
\frac{p_k-r_B}{R}
$$

其中：

* \(p_k\)：买家这一轮报价
* \(r_B\)：供应商最低接受价
* \(R\)：价格区间

大白话就是：

> **你现在的报价距离我的最低价还有多远？**

然后通过 logistic 函数算接受概率：

$$
P(\text{accept})
=
\sigma(
\text{报价好不好}
+
\text{供应商紧不紧急}
+
\text{谈了多久}
+
\text{买家过去怎么让价}
)
$$

完整实现位于附录 D.1。

一个很有意思的机制是：

> **买方让价太快，反而不会得到好处。**

论文专门设定了：

**如果 Agent 很快从 80 → 100 → 120，那么供应商会觉得“你还有空间”，于是自己让得更少。**

---

## 2. 供应商什么时候退出？

只有满足两个条件才可能 walk away：

第一，Agent 报价低于供应商底价。

第二，谈判已经过了“中点”。

论文设置：

$$
K=10
$$

到了：

$$
k\ge5
$$

供应商才开始可能直接离场。

所以不是：

> “最多谈 10 轮，第 10 轮结束。”

而是：

> “10 是 deadline pressure 的尺度。”

实际上他们实验里：

**66% 的谈判三轮消息左右就结束，最长 kernel 没超过第 7 轮。**

---

# 五、卖方怎么生成下一次报价？

这个机制非常值得你留意。

Supplier counter-offer 大致是：

$$
p^B_k
=
p^B_{k-1}
-
\lambda_B
(p^B_{k-1}-r_B)
$$

意思很简单。

假设：

供应商当前报价：

$$
150
$$

底价：

$$
100
$$

如果：

$$
\lambda=0.2
$$

那么：

$$
150-0.2(150-100)
=140
$$

下一轮报价就大约变成：

$$
140
$$

问题变成：

> **\(\lambda\) 是怎么决定的？**

它会根据供应商 personality 和**买方最近让价速度**变化。

最关键的是：

$$
\lambda_B
=
\lambda_0
+\lambda_1 \cdot urgency
-\lambda_2\cdot buyer\_concession
+\cdots
$$

所以：

### 买家越主动让价：

$$
buyer\_concession \uparrow
$$

导致：

$$
\lambda_B \downarrow
$$

也就是：

> **你越着急涨价，我越不着急降价。**

论文就是故意这样设计“策略性对手”的。

这已经明显不是一个简单：

```text
supplier_price -= fixed_delta
```

的规则了。

它是：

**根据对方策略动态响应的 rule-based opponent。**

---

# 六、Supplier Persona 怎么来的？

诚实供应商一共有 6 类行为模板：

| Supplier 类型 | 大致特点     |
| ----------- | -------- |
| Expressive  | 比较友好，容易让 |
| Candid      | 正常友好     |
| Stochastic  | 行为有一定随机性 |
| Taciturn    | 不爱说、强硬   |
| Strategic   | 更策略性     |
| Adversarial | 最难谈      |

它们的区别不是简单一句 system prompt：

> “你是一个强硬卖家。”

而是真正修改 kernel 参数，例如：

* urgency
* stance
* acceptance
* reciprocity
* concession strength
* price noise

论文 Table 8 给出了所有参数。

这一点对你正在想的 SalesBench 很重要：

> **Persona 不一定只是 Prompt Persona。**
>
> 更实质的做法是：
>
> $$
> Persona \rightarrow 行为参数 \rightarrow 决策结果
> $$
>
> 然后 LLM 再负责语言表达。

---

# 七、第二层：LLM Supplier Renderer 到底干嘛？

Kernel 已经决定：

```text
counter-offer
price = 118.92
sentiment = neutral
```

才把这些传给一个 LLM。

LLM 的任务只是写：

> “感谢您的长期合作。不过考虑到当前成本，我目前能提供的最低价格是 ¥118.92，希望您理解……”

它不能决定：

> “那我心情好，给你 ¥105 吧。”

论文甚至做了强制验证。

如果 Renderer 嘴里说了一个错误价格，也不会成交，因为实际交易必须匹配 kernel 的 standing quote。

Supplier prompt 里直接写：

> Pricing engine 已经确定了结果，必须使用这些 exact prices and decisions，不得修改。

所以真正架构是：

$$
\text{Agent message}
\rightarrow
\text{parser}
\rightarrow
\text{kernel}
\rightarrow
\text{decision}
\rightarrow
\text{LLM verbalization}
$$

这也是作者非常强调的**可复现性**设计。

---

# 八、Agent 怎么真的“买东西”？

这一部分实际上非常工程化。

Agent 给供应商发 chatbox 消息时，普通文字本身**不会产生经济行为**。

它必须同时附带结构化 action，例如：

```text
offer
SKU = X
price = 105
quantity = 30
```

论文形式类似：

```json
{
  "action": "offer",
  "sku_id": "...",
  "price": 105,
  "quantity": 30
}
```

支持：

$$
offer,\ accept,\ reject
$$

三类动作。

而 accept 还有一个很严格的条件：

> **价格必须等于供应商最近一次正式报价。**

不能供应商说 ¥118.92，你直接发：

> accept ¥100

然后靠 LLM 文本“骗”过去。

一旦成交：

$$
Purchase\ Cost
=
price\times quantity
$$

会**立即从 Bank Account 扣款**，然后创建 purchase order。

---

# 九、一个完整的采购流程，按一步一步来看

假设今天 1 月 3 日。

### Step A：市场调查

Agent：

```text
market_search
```

查看：

* 哪类店市场比较大
* category 大致销量
* margin 是 low / moderate / high

但拿不到真正 demand 参数。

---

### Step B：看商品

```text
list_products
```

得到：

* SKU
* reference price
* size 等

---

### Step C：找供应商

```text
supplier_search
```

这里只告诉：

* supplier name
* 联系方式
* category

**不给：**

* 底价
* 信誉
* honest/fraud
* supplier personality

这些必须自己试。

---

### Step D：开始谈

Agent：

> 50 个，我出 ¥100。

Kernel：

> counter ¥130。

Agent：

> ¥105。

Kernel：

> ¥118。

Agent：

> accept ¥118。

---

### Step E：立即扣采购款

比如：

$$
118\times50
=
¥5900
$$

Bank：

$$
100000\rightarrow94100
$$

但**货还没来**。

---

### Step F：几天以后到货

Purchase Order 有 delivery lead time。

到货以后进入 Warehouse。

此时才能：

```text
publish_to_store
```

把商品放进店铺。

---

### Step G：设售价

```text
set_prices
```

例如：

采购：

$$
118
$$

市场 reference price：

$$
200
$$

Agent 可以卖：

$$
190,\ 200,\ 220,\dots
$$

价格不只是决定利润，还影响需求和退货率。

---

# 十、下游“Buyer”怎么设计？这里千万不要理解错

这是这篇论文与你现在 SalesBench 思路**差异最大**的地方。

这里不存在：

> Buyer A：收入 ¥8000，喜欢性能。
> Buyer B：学生，对价格敏感。
> Buyer C：苹果粉丝。
> 然后他们逐个和销售 Agent 对话。

完全没有。

论文甚至在系统说明里明确写：

> **There is no real "user".**

消费者购买是一个**总量需求模型**。

---

# 十一、消费者到底怎么买？

每天每个商品有一个 expected demand：

可以把论文公式简化成：

$$
Demand
=
BaseDemand
\times
PriceEffect
\times
Weekend
\times
Promotion
\times
Seasonality
\times
MarketEvent
\times
Reputation
\times
Saturation
$$

论文正式模型就是这类乘法结构。

---

## 举个最直观的例子

本来某商品每天基础销量：

$$
10
$$

价格很好：

$$
\times2.8
$$

周末：

$$
\times1.3
$$

参加促销：

$$
\times3.5
$$

11 月旺季：

$$
\times1.55
$$

信誉：

$$
\times0.65
$$

表面上可能变成：

$$
10\times2.8\times1.3\times3.5\times1.55\times0.65
\approx128
$$

但市场容量有限。

再乘 category saturation：

$$
\times0.13
$$

store saturation：

$$
\times0.56
$$

最后实际：

$$
\approx9
$$

论文 Figure 7 就给了这样一个例子：原本 compounded demand 128.2，最后只卖 9 个。

---

# 十二、这里的 Buyer 本质上是什么？

一句话：

> **不是“谁决定买”，而是“市场今天产生多少订单”。**

所以：

$$
Buyer\ Agent
$$

在这篇论文中实际上被替换成：

$$
Aggregate\ Demand\ Simulator
$$

这对你很重要。

如果你的 SalesBench 是：

> 不同 persona、收入、消费习惯 → 不同购买行为

那么这篇论文**不能直接提供 user agent 的生成方法**。

但它能提供另一个非常强的思路：

> **把经济结果从 LLM buyer 中剥离出来，用规则保证评测稳定性。**

---

# 十三、消费者“买了”之后也不是马上拿到钱

它有一个很完整的交易生命周期。

这个我觉得非常适合你用来理解论文 Figure 6。

有三个账户：

$$
\boxed{Bank}
$$

$$
\boxed{Escrow}
$$

$$
\boxed{Platform\ Wallet}
$$

---

## 第一步：消费者下单

这时候：

**商家还没拿到钱。**

---

## 第二步：商家必须发货

Agent 调：

```text
ship_orders
```

如果两天不发：

> 自动取消订单。

而且影响 reputation。

---

## 第三步：发货以后

销售额扣除平台 2% commission，进入：

$$
Escrow
$$

但还不能花。

---

## 第四步：消费者可能退货

退货率由：

$$
NaturalReturn
+
SupplierDefect
+
Price
+
ShippingSpeed
$$

共同决定。

比如价格卖到 reference 的 1.3 倍：

> 退货率乘 1.5。

慢速运输：

> 再乘 1.3。

---

## 第五步：9 天后结算

Escrow：

$$
\rightarrow Platform\ Wallet
$$

但注意：

**Wallet 里的钱仍然不能直接采购。**

---

## 第六步：Agent 必须手动：

```text
withdraw
```

才有：

$$
Platform\ Wallet
\rightarrow Bank
$$

论文甚至发现：

> 有些 Agent 钱明明在 wallet 里，却忘记 withdraw，最后 Bank 连续负数破产。

这就是 long-horizon operation 的一部分。

---

# 十四、所以一笔钱完整走一圈其实是：

$$
\text{Bank}
$$

先出去采购：

$$
\downarrow
$$

Supplier

然后：

$$
Inventory
$$

消费者购买：

$$
\downarrow
$$

发货：

$$
Escrow
$$

9 天：

$$
\downarrow
$$

Platform Wallet

手动：

$$
\downarrow
$$

Bank

然后再次进货。

这叫：

> **working capital cycle**

也就是现金周转。

论文故意让：

**支出现在发生，收入很久以后才能拿回来。**

于是“赚不赚钱”和“会不会现金流断裂”变成两个不同问题。

---

# 十五、你问的“一步推进”，这篇设计得非常清楚

这里不是：

```text
Agent action
→ environment
→ next timestep
```

这种简单 RL step。

而是：

$$
\boxed{\text{一个 Model Turn}}
$$

里面可以发多个 tool calls。

论文第 8 页 Figure 4 是这里最关键的图。

流程是：

$$
LLM
\rightarrow
\{tool_1,tool_2,\dots\}
$$

然后：

$$
tool_1\rightarrow tool_2\rightarrow tool_3
$$

**按顺序执行。**

---

# 十六、时间不是“一个 action = 一天”

每个工具花不同模拟时间。

例如：

| 动作                |   模拟时间 |
| ----------------- | -----: |
| 查余额               | 10 min |
| 查 warehouse       | 10 min |
| 查商品               | 10 min |
| 搜供应商              | 10 min |
| 设置价格              | 10 min |
| 发货                | 20 min |
| 上架商品              | 20 min |
| market research   | 30 min |
| 跟供应商发一次消息         | 30 min |
| 开店                | 60 min |
| wait_for_next_day |  0 min |

完整的 18 个工具和时间成本在 Table 3。

每天工作时间：

$$
08:00\rightarrow18:00
$$

也就是：

$$
600\text{ min/day}
$$

所以：

> 调研也是有机会成本的。

你花 30 分钟 market_search，就少 30 分钟谈判/发货。

---

# 十七、什么叫“推进一天”？

如果时间跨过 18:00：

$$
18:00
\rightarrow
次日08:00
$$

或者 Agent 主动调用：

```text
wait_for_next_day
```

就触发：

$$
\boxed{Daily\ Settlement}
$$

论文在 Appendix C 甚至明确写了每天结算的 **13 个顺序步骤**。

简化下来就是：

$$
\text{扣运营费}
$$

→

$$
\text{扣仓储费}
$$

→

$$
\text{计算昨天销售}
$$

→

$$
\text{取消超时订单}
$$

→

$$
\text{处理退货}
$$

→

$$
\text{Escrow结算}
$$

→

$$
\text{采购商品到货}
$$

→

$$
\text{事件更新}
$$

→

$$
\text{信誉更新}
$$

→

$$
\text{检查是否连续负资产}
$$

→

记录当天状态。

非常关键的一点是：

### 今天的销售，明天才算。

论文写得非常明确：

> sales for yesterday

也就是：

$$
Action_t
\rightarrow
Sales_{t+1}
$$

所以环境有**一天延迟**。

这比“定价后立即返回销量”真实得多。

---

# 十八、整个实验环境的规模

这个 Benchmark 实际非常大：

| 项目                 |          设置 |
| ------------------ | ----------: |
| 模拟时间               |       365 天 |
| 初始资金               |    ¥100,000 |
| Store Type         |          12 |
| 同时经营 Store         |          ≤4 |
| Product Categories |          60 |
| SKU                |       6,886 |
| Suppliers          |         576 |
| Honest suppliers   |         424 |
| Fraud suppliers    |         152 |
| Promotions         |           8 |
| Market events      |          10 |
| Tools              |          18 |
| 每天时间               |     600 min |
| Context            | 128k tokens |
| Persistent Memory  |  20 entries |
| 最大模型 turn          |        4000 |

这些商品和供应商数据是基于真实电商平台数据构造/脱敏的。

供应商、商品、calendar 都被冻结，因此不同模型面对的是同一个世界。

---

# 十九、动态市场怎么实现？

它没有要求 LLM 自己凭空演戏。

比如一年中固定有：

* Winter Storm
* Factory Fire
* Flu Outbreak
* Logistics Hub Shutdown
* Heatwave
* Product Recall
* Typhoon
* Economic Downturn
* Raw Material Shortage
* Cold Wave

这些事件会真实改变：

$$
Demand
$$

或者：

$$
Supplier\ Lead\ Time
$$

例如台风：

某些商品：

$$
Demand\times 2.5
$$

另外一些：

$$
Demand\times0.2
$$

配送：

$$
LeadTime\times3
$$

这些事件都按固定 calendar 发生。

---

# 二十、诈骗供应商的设计也很有意思

576 个 supplier 里：

$$
152
$$

个是 fraudulent。

不是简单 system prompt：

> “你是骗子，请骗人。”

而是分成 5 种明确的**经济机制**。

### Pre-deal fraud

钱在成交之前就被骗：

**VIP membership fee**

> 先交 ¥1000，以后给你 3 折。

实际上永远不给。

**Future discount**

> 这次贵一点，下次给你 2～4 折。

下次根本不存在。

**Fake urgency**

> “今天最后一批”“马上涨价”“另外三个买家等着”。

同时 kernel 的底价真的被提高。

### Post-deal fraud

成交时价格看起来完全正常。

**Quantity bait**

你买：

$$
100
$$

实际只发：

$$
60\sim70
$$

但收你 100 个的钱。

**Quality downgrade**

数量没问题，但产品质量有问题，导致退货率显著上升。

这个设计值得你注意：

> **Fraud 不是一个 label，而是一个可产生经济后果的 behavior mechanism。**

这和 user persona 的设计逻辑很类似。

---

# 二十一、长时程 learning 怎么测？

这篇论文有个特别好的设计。

比如：

第一次从供应商 S 买 SKU X：

$$
¥110
$$

第二次：

$$
¥102
$$

第三次：

如果 Agent 是个正常经营者，应该知道：

> “我已经 ¥102 买过了。”

下一次初始 anchor 应该：

$$
\le102
$$

而不是：

$$
120
$$

于是论文定义：

### AnchorRegret

如果：

$$
历史最好价=100
$$

这次：

$$
120
$$

就产生 regret。

进一步和随机打乱这些历史价格后的情况比较，得到：

$$
AnchorRatio
$$

如果：

$$
AnchorRatio<1
$$

说明：

> 随着时间推移确实越来越会谈价。

如果：

$$
>1
$$

说明：

> 顺序反而让你越来越贵。



结果非常有意思：

**18 个模型里只有两个在这项上明显优于随机顺序。**

Qwen3.8-Max-Preview 最好。

---

# 二十二、Memory 怎么进入这个问题？

它故意让上下文不可能保存一年。

Context：

$$
128k
$$

到：

$$
120k
$$

就触发 eviction。

然后开始从最早的 tool-call groups 删除，直到释放大约：

$$
60k
$$

token。

但 Agent 有一个额外：

$$
Persistent\ Memory
$$

最多：

$$
20\ entries
$$

它可以主动写：

> Ridge Express
> SKU X
> 历史最低价 ¥103.11
> 不要再接受 > ¥105

这种信息不会被 context eviction 删除。

所以 Benchmark 实际测试的是：

> **你会不会意识到什么值得长期记忆。**

而不是系统自动帮你总结。

---

# 二十三、实验怎么跑？

论文测试：

$$
18\ models
$$

每个：

$$
5\ episodes
$$

共：

$$
90\ runs
$$

每次都是完整 365 天。

所有模型：

* 同一个 world
* 同 18 个 tools
* 同 context 限制
* 同 memory
* provider 默认 sampling
* 能开 reasoning 的尽量开启较高 reasoning

最多：

$$
4000 turns
$$

但实际上没有一个正常 run 因 4000 turns 截断。

破产规则则是：

$$
Bank<0
$$

连续：

$$
10\ days
$$

直接结束。

---

# 二十四、论文到底评什么？不是只有“赚多少钱”

Primary Score：

$$
End\ Assets
=
Bank+Wallet+Escrow
$$



然后拆成六种能力：

| 能力              | 看什么               |
| --------------- | ----------------- |
| Profit          | 年终资产              |
| Negotiation     | 有没有压低供应商价格        |
| Fraud Avoidance | 有没有花钱给诈骗供应商       |
| Solvency        | 现金流有没有崩           |
| Efficiency      | 每次 tool call 赚多少钱 |
| Execution       | 定价、发货、退货管理        |
| Learning        | 重复采购有没有越来越会谈      |



这就是文章另一个核心观点：

> **最终 profit 很高，不代表这个 Agent 每一项都好。**

---

# 二十五、文章最后发现了什么？

资产最好的 GPT-5.6 Sol：

$$
¥100,000
\rightarrow
¥1,431,425
$$

大概：

$$
14.3\times
$$

但它在 fraud avoidance 是：

$$
16/18
$$

非常差。

Claude Opus 4.7：

谈判能力最好、fraud avoidance 也最好，但最终 profit 只排中间。

Qwen3.8-Max-Preview：

open-weight 第一，而且是 long-horizon learning 最强。

这就是为什么作者认为不能只看一个最终 reward。

---

# 二十六、现在站在“论文作者视角”，整篇文章的逻辑其实很清晰

你可以把整篇论文压缩成下面这条逻辑链。

### 问题一：现有 long-horizon business benchmark 不够真实

有些有供应商谈判，但是：

> Supplier 也是 LLM。

于是每一次：

* 报价不同
* 是否接受不同
* 可以被 prompt injection / persuasion 影响

最后你不知道：

> 是被测 Agent 好，还是 NPC 随机配合它了。

作者在 Introduction 就把这个当核心问题。

---

### 问题二：完全 rule-based 又太假

如果 Supplier 只返回：

```text
price=118
decision=reject
```

谈判就失去了语言、欺诈、说服等现实因素。

于是他们的答案是：

$$
\boxed{
规则负责经济
+
LLM负责语言
}
$$

也就是：

$$
Kernel + Renderer
$$

---

### 问题三：单次谈判太短

真实商业经营不是：

> “谈一次价格就结束。”

而是：

$$
第一次采购
\rightarrow
销售
\rightarrow
第二次补货
\rightarrow
重新谈
\rightarrow
第三次补货
\rightarrow\dots
$$

于是同一个：

$$
Supplier+SKU
$$

会不断重新开启 negotiation session。

这样才能问：

> “Agent 有没有记住过去价格？”



---

### 问题四：只谈价也不是经营

所以又加入：

$$
采购
+
库存
+
销售
+
定价
+
退货
+
现金流
+
信誉
+
事件
+
促销
$$

让一次错误决策在未来继续产生后果。

这才形成真正 long horizon。

---

# 二十七、如果站在你现在 SalesBench 的角度，我认为最值得拿走的是这四点

第一点是**把角色拆成“行为逻辑”和“语言表现”**。

它不是：

$$
Seller=LLM Prompt
$$

而是：

$$
Seller
=
Economic\ Policy
+
Language\ Persona
$$

这一点非常适合迁移到 Buyer：

$$
Buyer
=
Purchase\ Policy
+
Persona\ Dialogue
$$

比如你的 buyer 可以内部先算：

$$
utility
=
0.4\times preference
+
0.3\times price
+
0.2\times budget
+
0.1\times trust
$$

先决定：

$$
buy/reject/counter
$$

再让 LLM 说：

> “这个价格还是有点高，如果能便宜一点我会考虑。”

这比单纯 prompt 一个“月收入 8000 的用户”强很多。

---

第二点是**长期状态必须真的影响后面行为**。

这篇不是只保存：

```text
user said X
```

而是保存真正会影响决策的东西：

$$
historical\ best\ price
$$

$$
supplier\ reliability
$$

$$
inventory
$$

$$
cash
$$

$$
reputation
$$

所以它测试的是：

> 过去经验有没有变成后续政策。

---

第三点是**step 应该是经济生命周期，而不是一轮对话**。

如果你以后设计 SalesBench，可以非常认真考虑：

$$
conversation\ turn
\neq
environment\ step
$$

一次真正的环境 step 可以包括：

$$
Agent Action
\rightarrow
Buyer Response
\rightarrow
Purchase
\rightarrow
Inventory
\rightarrow
Revenue
\rightarrow
Market State Update
$$

这篇论文在这一点上做得非常成熟。

---

第四点恰好是它**没有解决的地方**：

它没有真正的消费者 Agent。

所以如果你的目标是：

> 不同收入、偏好、历史、社会影响 → 个体 user 决策 → 是否购买 → 价格 negotiation

那么你正在研究的问题，其实比 E-Commerce Bench 的消费者端更细。

E-Commerce Bench 的消费者是：

$$
\boxed{
price
+season
+promotion
+event
+reputation
\rightarrow
demand
}
$$

而你们想做的可能是：

$$
\boxed{
persona
+need
+budget
+social\ history
+seller\ dialogue
+price
\rightarrow
purchase\ decision
}
$$

**这就是这篇与你们 SalesBench 最值得区分的一条线。**

---

另外有一个实现层面的细节值得你留心：作者追求 deterministic benchmark，但并非所有东西都完全零随机。需求的整数化有固定 seed，谈判中的概率决策也是固定 seed；然而 Supplier Renderer 的语言仍采用 LLM 默认采样，因此**经济决策可复现，语言表述不完全可复现**，作者也承认 fraud detection 会因此带一些 renderer sampling noise。

还有一个很有意思的 benchmark 瑕疵：附录明确承认，supplier email 的编号后缀事实上**泄漏了 honest/fraudulent label**，理论上 Agent 可以利用这个规律筛诈骗供应商。作者检查了这一问题，但它确实说明 benchmark 设计时必须非常警惕 side channel。

如果把这篇压成一句最适合你现在调研汇报的话，我会写成：

> **E-Commerce Bench 的核心不是用 LLM 同时模拟买卖双方，而是让 LLM 负责长期经营决策，将供应商的经济行为固化为可复现的谈判 kernel、消费者购买固化为多因素需求模型，再通过工具调用和日级结算把采购、销售、库存、现金流和重复谈判串成 365 天的闭环。**

你后面这批 SalesBench 相关论文也可以统一按这个模板读：**Buyer 怎么实现 → Seller 怎么实现 → Interaction 怎么推进 → Purchase 怎么决定 → Market state 怎么变化 → Reward 怎么算 → 长期历史怎么进入下一次决策**。这样几篇论文会非常容易横向比较。
