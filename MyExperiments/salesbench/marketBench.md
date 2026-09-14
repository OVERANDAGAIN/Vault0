---
创建时间: 2026-九月-14日  星期一, 1:10:44 下午
---
我把这篇 **Market-Bench: Benchmarking Large Language Models on Economic and Trade Competition** 按你关心的“到底怎么跑”来拆，而不是重点讲它最后哪个模型分数最高。

先给一句最核心的判断：

> **这篇论文不是“LLM 买家和 LLM 卖家自由聊天做生意”。它实际上是“LLM 商家 + 规则供应商 + 规则消费者”的市场仿真。**
> LLM 真正负责的是：**进货报价 → 商品定价 → 写广告语**；消费者本身不调用 LLM，而是通过 **persona–广告语语义匹配先筛商家，再从筛中的商家里买最低价**。

这也是理解整篇论文最重要的一点。

---

# 一、先把论文里的术语翻译清楚

| 论文术语                           | 中文               | 实际含义                           |
| ------------------------------ | ---------------- | ------------------------------ |
| Market-Bench                   | 市场基准             | 一个多商家竞争的经济仿真 benchmark         |
| Retailer Agent                 | 零售商 Agent        | **真正由 LLM 扮演的角色**              |
| Supplier                       | 上游供应商            | 规则程序，不是 LLM                    |
| Buyer                          | 消费者              | 规则生成的模拟消费者，不是 LLM              |
| Procurement                    | 采购 / 进货          | LLM 商家向供应商竞拍库存                 |
| Multi-Unit First-Price Auction | 多单位第一价格拍卖        | 报多少就按多少价格付款                    |
| Reserve Price                  | 保留价 / 底价         | 供应商规定不能低于这个价                   |
| Bid Shading                    | 压价竞标             | 不直接出最高愿付价，而在中标率和成本之间权衡         |
| Retail Stage                   | 零售阶段             | 商家拿库存出来卖                       |
| Persona                        | 用户画像             | 隐藏的消费者偏好文本                     |
| Persona-Gated Attention, PGA   | Persona 门控注意机制   | 广告语决定消费者“看不看得到你”               |
| Consideration Set              | 考虑集合             | 一个消费者真正会比较的商家集合                |
| Slogan Sensitivity \(\lambda\) | 广告语敏感度           | 用户多在意文案                        |
| Buyer Patience \(\rho\)        | 用户耐心             | 用户愿意看多少家店                      |
| Semantic Temperature \(\tau\)  | 语义温度             | 控制语义差异被放大的程度                   |
| Stockout                       | 缺货               | 顾客想买但你库存没了                     |
| Fill Rate                      | 需求满足率            | 落到你这里的需求，有多少真正卖出               |
| Bid Efficiency                 | 采购效率             | 报了多少货、拿到多少、成本多高                |
| MMS                            | Mean Match Score | 广告语与消费者 persona 的平均语义匹配度       |
| Closed-loop Economy            | 闭环经济             | 进货影响库存，库存影响销售，销售影响现金，现金影响下一轮进货 |

论文把环境建模为一个 **Partially Observable Markov Game，部分可观测马尔可夫博弈**：商家知道自己的钱、库存、供应报价和市场历史，但**不知道消费者真实 persona**。

---

# 二、先用大白话把整个系统讲明白

可以把它想成：

> 有 20 个 AI 商家，每人开局有 22500 元。
> 市场里有一个统一批发商。
> 每轮先抢货，再卖货。
> 谁进货能力差，就没东西卖；
> 谁价格太高，就卖不出去；
> 谁广告文案不符合消费者口味，甚至连进入消费者比价列表的资格都没有。

而这里最大的特色就是：

**“广告语不是拿来让另一个 LLM 阅读并决定购买的。”**

而是：

```text
LLM 写广告语
      ↓
Embedding
      ↓
跟隐藏 Persona 算 cosine similarity
      ↓
决定这个商家被消费者看到的概率
      ↓
消费者看到若干商家
      ↓
在这些商家里挑最低价
      ↓
购买
```

这就是整篇文章所谓的：

> **language → economic payoff**

自然语言通过一个数学机制进入经济系统。

---

# 三、买方、卖方到底分别是谁？

这里特别容易被 Figure 2 搞混。

论文里其实有三个角色。

## 1. 上游 Supplier：规则程序

它拥有商品，然后每轮发布：

$$
O_S(t)=\{(x,Q_x(t),P_{base}(x))\}
$$

也就是：

```text
商品 x
库存数量 Q
底价 Pbase
```

例如：

```text
item1: 200 件，底价 50
item3: 133 件，底价 150
item8: 50 件，底价 2000
```

供应商自己**没有 LLM 决策**。

程序就是：

```text
收集所有商家报价
→ 按单价从高到低排序
→ 高价者优先获得商品
→ 同价随机打破平局
→ 按商家自己报的价格付款
```

也就是标准的 **multi-unit first-price auction**。

附录给出的结算也非常直接：

$$
a_{i,x}=\min(q_{i,x}, remaining)
$$

前提是：

$$
p^{bid}_{i,x}\geq P_{base}(x)
$$

然后从最高报价开始贪心分货。

所以：

> **Supplier = 环境规则，不是 Agent。**

---

# 四、真正的 LLM 是谁？

真正调用 LLM 的，是 **20 个 retailer agents**。

这 20 个模型，在整个系统中身份是不变的，只是不同阶段角色不同：

```text
上游采购阶段：
LLM retailer = 买家

下游销售阶段：
LLM retailer = 卖家
```

所以 Figure 2 左边画成“LLM Buyer”，右边又画成“LLM Seller”，容易让人误以为是两组 Agent。

其实：

> **是同一批 Agent。**

论文实验里每个 LLM retailer 都同时负责：

1. 采购数量
2. 采购报价
3. 零售定价
4. 广告 slogan



---

# 五、第一阶段：LLM 到底怎么“进货”？

这是文章很值得看的地方，因为它不是一句“让 Agent 自己决策”。

它给 LLM 一个严格的 JSON 接口。

系统 Prompt 大意是：

> 你是一个零售商，现在参加一个多轮密封报价拍卖。
> 只能输出合法 JSON。

输出：

```json
{
  "bids": {
    "item1": {
      "qty": 110,
      "price": 51
    },
    "item2": {
      "qty": 110,
      "price": 51
    }
  }
}
```

也就是说，对每件商品：

$$
b_{i,x}=(q_{i,x},p^{bid}_{i,x})
$$

LLM 自己决定：

> “我要多少件 + 每件愿意出多少钱。”

而且必须满足总预算：

$$
\sum_xq_{i,x}p^{bid}_{i,x}\leq Funds_i
$$

超预算的报价直接判非法。

论文甚至直接把 Prompt 放到了附录里，规定：

* 只能买 supplier offer 里的商品；
* qty、price 必须为非负整数；
* 不能超过现有资金；
* 不能低于底价；
* 必须输出严格 JSON。

例如 Gemini 2.5 Pro 的实际输出：

```text
item1: 110 件 × 51
item2: 110 件 × 51
item3: 75 件 × 151
```



---

# 六、为什么一轮采购里面又有“两轮 bidding”？

实验默认：

> **每一个 market step 中，有 2 轮 bidding。**

第一轮所有 LLM 平行报价。

然后环境会给下一轮看到“上一轮结果”，再让它们重新报价。算法写得很明确：

```text
for each step:
    for bidding round r = 1 ... Rmax:
        构造 bidding state
        加入上一轮结果
        所有 LLM 并行出价
        检查预算
```

最后才真正结算 final bids。

所以它有一点：

> **观察竞争 → 调整报价**

的味道。

但注意，这依然不是商家之间聊天。

不是：

> A：“我出 100。”
>
> B：“那我 105。”

而是系统把上一轮市场结果作为 structured state 再交给各个 LLM。

---

# 七、第二阶段：LLM 怎么卖东西？

采购结束以后：

```text
Funds -= 采购成本
Inventory += 赢得的商品
```

然后进入 Retail Stage。

LLM 再调用一次。

这次它要输出：

```json
{
  "prices": {
    "item4": 200,
    "item6": 1000
  },
  "slogan": "Luxury and value, redefined!"
}
```

也就是说：

> **LLM 的销售动作 = 商品价格 + 一句营销文案。**



论文明确规定：

> 你不知道 buyer persona，要通过 market history 自己推测。

而 slogan 最多 25 个词。

所以 seller 不是直接回答消费者的询问。

它更像：

> “根据过去销量判断消费者喜欢什么，然后本轮重新标价 + 换广告词。”

---

# 八、消费者 Buyer 是怎么设计的？

这是最关键的。

## Buyer 不是 LLM

论文的 simulation algorithm 中：

```text
LLM 调用：
商家 bidding
商家 pricing + slogan

然后：
Generate buyers
compute attention weights
sample consideration set
purchase
```

Buyer 阶段没有 LLM call。

所以消费者应该理解为：

> **synthetic / logical buyers。**

Figure 2 本身也把它写成了 **Logical Buyers**。

---

# 九、Buyer 的 Persona 怎么构造？

每个消费者有一个隐藏 persona：

$$
Persona_j
$$

默认消费者分成四类：

| 用户 Tribe |  比例 | slogan sensitivity \(\lambda\) | 偏好                  |
| -------- | --: | -----------------------------: | ------------------- |
| Thrifty  | 40% |                            0.2 | 价格                  |
| Ethical  | 30% |                            0.8 | green / fair / eco  |
| Hype     | 20% |                            0.9 | exclusive / limited |
| Quality  | 10% |                            0.5 | quality / craft     |



比如：

### Thrifty

类似：

> 我很在意价格、便宜、划算。

### Ethical

类似：

> 我在意环保、公平、绿色消费。

### Hype

类似：

> 我喜欢限定款、稀缺、潮流。

### Quality

类似：

> 我看重做工、品质、工艺。

但是这些文本 **seller 看不到**。

商家只能通过：

> 什么广告词卖得多、什么价格卖得好

来间接猜测。

---

# 十、真正的购买机制：先“看见”，再“买”

这一段就是整篇论文最值得你记住的地方。

作者把消费者决策拆成：

$$
\boxed{Attention\rightarrow Purchase}
$$

也就是：

> **先决定你看哪些商家，再决定在哪一家买。**



---

## 第一层：Persona-Gated Attention

对于 buyer \(j\) 和 seller \(i\)：

把：

```text
seller 的 slogan
buyer 的 persona
```

分别做 embedding。

这里实际使用：

> **Qwen3-Embedding-8B**



计算：

$$
Sim(i,j)
=
\cos(E(Slogan_i),E(Persona_j))
$$

然后：

$$
w_{ij}
=
\exp\left(
\frac{\lambda_j Sim(i,j)}{\tau}
\right)
$$



大白话：

> **你的广告语越符合这个用户的性格，你越容易被他看到。**

---

# 十一、这个机制有个很漂亮的细节：不同 Buyer 对广告的敏感度不同

例如：

### Thrifty

$$
\lambda=0.2
$$

所以即使 slogan 匹配度高：

> 影响也不大。

因为他没那么吃广告这一套。

---

### Hype

$$
\lambda=0.9
$$

所以：

> “Exclusive limited release!”

和 Hype persona 非常匹配的话，权重会被明显放大。

因此不同人：

> **广告文案的作用大小本身也是不同的。**

---

# 十二、然后不是直接选最高匹配的 Seller

这点也很重要。

作者不是：

$$
seller=\arg\max Sim
$$

而是按照：

$$
w_{ij}
$$

**概率采样**若干 seller，构成：

$$
V_j
$$

即 consideration set。

集合大小为：

$$
|V_j|
=
\min(|A|,\max(1,\lceil\rho_jK_{max}\rceil))
$$



默认：

$$
\rho=0.6
$$

$$
K_{max}=20
$$

所以：

$$
|V_j|=\lceil0.6\times20\rceil=12
$$

也就是：

> **20 家商店，普通消费者大约只看 12 家。**

这 12 家不是随机平均抽，而是广告越符合 persona，被抽中的概率越高。

---

# 十三、真正“购买”的规则反而非常简单

Buyer 进入考虑集合以后：

> **不再让 LLM 判断“我喜欢哪个”。**

直接比价格。

对某个商品 \(x\)：

```text
Vj 中有哪些商家：
    卖这个商品？
    有库存？
    报了价格？
```

筛出来以后：

$$
\boxed{\text{选择价格最低的 seller}}
$$

不断购买，直到：

```text
自己的需求满足
或者
商家库存耗尽
```



所以它本质是：

$$
\boxed{
\text{Persona/Slogan 决定“进不进候选集”}
+
\text{价格决定“候选集里买谁”}
}
$$

这个拆分非常关键。

---

# 十四、举一个非常具体的例子

假设现在有三家店：

```text
A:
价格 = 100
广告 = "Cheap deals for smart shoppers!"

B:
价格 = 90
广告 = "Exclusive limited-edition luxury!"

C:
价格 = 80
广告 = "Eco-friendly products for a better world."
```

来了一个 Hype 用户：

```text
Persona:
喜欢 exclusive / limited / trendy
lambda = 0.9
```

embedding 得到：

```text
A similarity = 0.2
B similarity = 0.9
C similarity = 0.1
```

那么：

$$
w_B \gg w_A,w_C
$$

所以 B 很容易被抽进他的 consideration set。

但是假设最终抽出来：

```text
{A, B}
```

那么购买阶段：

```text
A = 100
B = 90
```

他买 B。

---

但假设抽出来的是：

```text
{B, C}
```

那么：

```text
B = 90
C = 80
```

即使 B 的广告更符合他的 Hype Persona：

> **最终仍然买 C。**

因为广告只负责：

> **visibility / consideration**

而价格负责：

> **conversion。**

这是这篇论文最核心的机制设计。

---

# 十五、所以它没有传统意义上的 buyer–seller “交流”

这个区别我建议你特别记住。

这里根本不存在：

```text
Buyer: 这个多少钱？
Seller: 100。
Buyer: 太贵了，能便宜吗？
Seller: 90。
Buyer: 买了。
```

也不存在：

```text
询问
议价
推荐
拒绝
再次说服
成交
```

而是：

```text
Seller 一次性：
价格 + slogan

↓

环境自动把 slogan 与 Buyer persona 算 embedding

↓

环境自动筛商家

↓

规则选择最低价

↓

成交
```

所以它是：

> **“市场行为 simulation”**

而不是：

> **“sales conversation simulation”。**

---

# 十六、那“多轮”体现在哪里？

多轮并不指一对 Buyer–Seller 之间聊很多轮。

多轮指的是：

$$
t=0,1,\dots,T-1
$$

整个市场不断循环。

每个 step 是一整个：

```text
进货
↓
卖货
↓
观察结果
↓
下一次再进货
```

---

# 十七、一步 step 到底怎么推进？

论文 Appendix A 把完整算法直接写出来了。可以重新整理成下面这个流程。

## Step 0：初始化

每个 Agent：

```text
Funds = 22500
Inventory = 0
```



---

## Step t.1：Supplier 发布本轮货物

比如：

```text
item1: 200 × $50
item2: 200 × $50
item3: 133 × $150
...
item8: 50 × $2000
```

---

## Step t.2：采购第 1 轮

20 个 LLM **并行**看到：

```text
当前资金
当前库存
供应商报价
市场历史
```

然后输出：

```text
我要哪些商品
每个多少件
愿意出多少钱
```

---

## Step t.3：采购第 2 轮

环境把上一轮 bidding 结果放进 state。

20 个 LLM 再调整一次。

---

## Step t.4：拍卖真正结算

每个 item：

```text
报价从高到低排序
↓
超过底价才有效
↓
优先分给高价者
↓
库存分完为止
```

然后：

```text
Funds -= 采购成本
Inventory += 商品
```



---

# 十八、Step t.5：20 个商家重新定价 + 写广告

每个 LLM 并行输出：

```json
{
 "prices": {...},
 "slogan": "..."
}
```

此时它可以看到之前的市场历史，因此理论上可以：

```text
看到某类文案卖得好
→ 下轮模仿

看到价格太高卖不出去
→ 降价

看到库存积压
→ 降价

看到某商品抢不到
→ 下轮加价采购
```

这就是闭环。

---

# 十九、Step t.6：生成 200 个消费者

默认：

> \(k=200\)

每轮市场生成一批 synthetic buyers。

给每个人：

```text
一个 persona
一个 λ
一个 ρ
一个购买需求
```

Seller 不知道 persona。

---

# 二十、Step t.7：每个 Buyer 执行购买

对每个 Buyer：

### 1. 算所有 seller 的

$$
Sim(Slogan_i,Persona_j)
$$

### 2. 得到

$$
w_{ij}
$$

### 3. 按权重抽取约 12 家商家

### 4. 看哪些店：

```text
有这个商品
有库存
有价格
```

### 5. 按最低价格购买

### 6. 库存同步减少，seller 钱增加

这一步完全是程序执行。

---

# 二十一、Step t.8：轮末更新

最后：

```text
计算 holding cost
检查 bankruptcy
记录销量
记录价格
记录 slogan
记录资金
记录库存
记录利润
```

然后：

$$
t\rightarrow t+1
$$

进入下一整个 market cycle。

所以可以画成：

```text
                 ┌───────────────┐
                 │ Supplier Offer│
                 └───────┬───────┘
                         ↓
              ┌───────────────────┐
              │ 20 LLMs bid       │
              │ qty + bid price   │
              └─────────┬─────────┘
                        ↓
                 第一轮 bidding
                        ↓
                 第二轮 bidding
                        ↓
                Auction Settlement
                        ↓
                  获得 Inventory
                        ↓
              ┌───────────────────┐
              │ 20 LLMs           │
              │ Retail Price      │
              │ + Slogan          │
              └─────────┬─────────┘
                        ↓
              Generate 200 Buyers
                        ↓
              Persona-Slogan Match
                        ↓
              Consideration Set
                        ↓
               Lowest Price Wins
                        ↓
                  Transactions
                        ↓
            Funds / Inventory update
                        ↓
                Market History
                        │
                        └────→ 下一 step
```

这就是 Figure 2 和 Appendix A 的真正含义。 

---

# 二十二、实验环境具体是多少？

这篇的实验参数给得比较完整。

默认实验：

| 参数                      |                     数值 |
| ----------------------- | ---------------------: |
| LLM retailer 数          |                 **20** |
| Step 数                  |                  **6** |
| 每 step bidding rounds   |                  **2** |
| Buyer 数                 |                **200** |
| 初始资金                    |     **22,500 / agent** |
| 商品种类                    |                  **8** |
| 总供应                     |             **1000 件** |
| 商品 base price           |            **50–2000** |
| demand/supply 参数        |               **0.95** |
| buyer patience \(\rho\) |                **0.6** |
| \(K_{max}\)             |                 **20** |
| Embedding               | **Qwen3-Embedding-8B** |
| semantic temperature    |                **1.0** |
| LLM temperature         |                **0.0** |
| 输出格式                    |               **JSON** |
| holding cost            |                  **0** |



---

# 二十三、商品也分层

供应结构：

| Item  | 类型        |  数量 | Base Price |
| ----- | --------- | --: | ---------: |
| item1 | Commodity | 200 |         50 |
| item2 | Commodity | 200 |         50 |
| item3 | Standard  | 133 |        150 |
| item4 | Standard  | 133 |        150 |
| item5 | Standard  | 134 |        150 |
| item6 | Luxury    |  75 |        800 |
| item7 | Luxury    |  75 |        800 |
| item8 | Veblen    |  50 |       2000 |



可以理解为：

```text
便宜大众货
↓
普通商品
↓
奢侈品
↓
昂贵炫耀性商品
```

不同模型要决定自己的资金应该投到哪一档。

---

# 二十四、资金是怎么设的？

供应商全部商品的 base-price 总价值：

$$
300,000
$$

有 20 个 Agent。

他们设：

$$
\alpha=1.5
$$

于是：

$$
K_{init}
=
1.5\times\frac{300000}{20}
=
22500
$$

所以总 Agent 资金为：

$$
22500\times20=450000
$$

比商品 base value 高一些。



---

# 二十五、Demand 怎么控制？

他们设总 supplier supply：

$$
S=\sum_xQ_x
$$

Buyer 总需求：

$$
D=rS
$$

默认：

$$
r=0.95
$$

因此按总 1000 件算：

$$
D\approx950
$$

论文把这个参数用来控制 scarcity。

这里其实值得注意：

> 市场并不是简单“需求无限大，所以谁有货谁赢”。

商品仍然存在 sell-through 和定价问题。

---

# 二十六、Buyer 设计其实很简化

论文自己在 Limitations 里承认：

目前 Buyer：

* persona 是合成的；
* persona 分布固定；
* **single-item purchases**；
* **没有过去交互记忆**；
* 不会学习；
* 没有 repeat customer 行为。

所以严格来说，Buyer 不算一个完整的“用户 Agent”。

更准确地说：

> **它是一个带 Persona 的 stochastic demand rule。**

---

# 二十七、商家到底能看到什么？

Seller 并不能直接拿到：

```text
Thrifty 40%
Ethical 30%
Hype 20%
Quality 10%
```

理论上实验 Agent 不知道这些隐藏参数。

每 step 能看到的主要是：

```text
自己的 Funds
自己的 Inventory
Supplier offers
公共市场历史
    - posted prices
    - slogans
    - realized sales
```

然后自己推断消费者偏好。

所以作者想测的是：

> 你能不能从“卖出了什么”反推消费者喜欢什么。

---

# 二十八、这也是为什么它需要多 step

如果只跑一次：

```text
没有历史
→ 根本无所谓 infer persona
```

但第 1 step 以后可以观察：

```text
某类 slogan
+
某种价格
+
某些商品
→ 销量高
```

然后调整策略。

论文观察到，大多数 Agent 的 slogan 在 **step 0 → step 1** 变化最大，后面迅速稳定。

甚至最后大家的广告逐渐变得相似。

---

# 二十九、这里有一个很有意思的现象：LLM 并没有真的学会细分用户

作者本来可能期待：

```text
商家 A 专门做 Ethical
商家 B 专门做 Hype
商家 C 专门做 Quality
```

形成不同 niche。

但实验发现：

> 大家很快开始模仿有效广告，最后 slogan embedding 越来越集中。

作者称之为：

> **generic slogan optimum / safe mimicry equilibrium**

也就是：

> “大家发现某类安全广告语还不错，于是全都往那个方向写。”

而不是形成真正差异化定位。

---

# 三十、那这篇到底在测 LLM 什么能力？

其实分成三个互相耦合的问题。

## 第一：采购

$$
\text{我应该买什么？买多少？出多少钱？}
$$

出价低：

> 抢不到货。

出价高：

> 虽然抢到了，但利润空间被吃光。

---

## 第二：定价

$$
\text{进货成本是 }C
$$

卖：

$$
P
$$

价格太高：

> 消费者从别家买。

价格太低：

> 有销量，但利润薄。

---

## 第三：营销

$$
Slogan
$$

影响：

$$
P(\text{进入消费者 consideration set})
$$

如果连 consideration set 都进不了：

> 再便宜也没用。

论文明确强调：

> 一个低价 seller，如果没有被采样进入 \(V_j\)，一样完全卖不出去。

所以它测试的是一个完整链：

$$
\boxed{
采购能力
\rightarrow
库存
\rightarrow
营销曝光
\rightarrow
价格竞争
\rightarrow
销量
\rightarrow
现金
\rightarrow
下一轮采购
}
$$

---

# 三十一、为什么最后形成 winner-take-most？

这篇结果里真正值得看的不只是 Gemini 第一。

它发现：

> **早期采购成功会产生雪球效应。**

逻辑是：

```text
第一轮竞拍做得好
↓
有库存
↓
能卖东西
↓
有收入
↓
下一轮资金更充足
↓
继续抢到库存
```

反过来：

```text
第一轮没抢到货
↓
没东西卖
↓
没有收入
↓
下一轮更难竞争
```

采购效率与利润、Fill Rate 有很强关系。

所以真正的瓶颈甚至首先不是 slogan：

> **先得有货。**

作者发现 slogan match 和 profit 的 Spearman 相关只有：

$$
\rho=0.16
$$

比较弱。

---

# 三十二、如果从“文章设计”的角度梳理，它可以压缩为四层

## 第一层：环境

作者造了一个：

> **闭环供应链市场。**

```text
Supplier
↓
Retailer
↓
Consumer
```

Retailer 是 LLM。

---

## 第二层：LLM Action

LLM 一共只控制四种变量：

$$
\boxed{
quantity,\ bid\ price,\ retail\ price,\ slogan
}
$$

也就是：

```text
进多少货
多少钱抢货
多少钱卖
怎么宣传
```

---

## 第三层：环境规则

其余的都不是 LLM。

### Supplier：

```text
first-price auction
```

### Buyer attention：

$$
P(i\in V_j)
\propto
\exp(\lambda_jSim(i,j)/\tau)
$$

### Buyer purchase：

$$
\arg\min_i Price_i
$$

### Dynamics：

```text
库存 + 钱 + 历史
不断更新
```

---

## 第四层：评价

最后看：

### Economic

* Profit
* Net Profit Margin
* Risk-Adjusted Return

### Operational

* Stockout
* BidEfficiency
* OSI
* FillRate
* IEI

### Semantic

* Slogan–Persona Match

论文一共报告 9 个指标。

---

# 三十三、我认为这篇你最应该抓住的，不是实验结果，而是这三个设计思想

### ① 把自然语言变成真正影响经济结果的变量

不是让 judge 打：

> “这个广告 8/10。”

而是：

$$
slogan
\rightarrow
embedding
\rightarrow
attention probability
\rightarrow
market access
\rightarrow
sale
$$

因此语言的好坏最终体现为：

> **钱。**

这是这篇设计最干净的一点。

---

### ② 把“广告”和“价格”的作用拆开

非常值得借鉴：

$$
\boxed{
广告决定被考虑
}
$$

$$
\boxed{
价格决定考虑以后买谁
}
$$

因此不会把：

```text
价格
广告
persona
```

硬塞进一个神秘的大分数：

$$
score=0.4a+0.3b+\cdots
$$

而是给每个变量一个明确经济意义。

---

### ③ 用闭环让错误真正积累

很多 benchmark：

```text
这一题错了
→ 少 1 分
```

Market-Bench：

```text
采购报价错
→ 没库存
→ 没销量
→ 没现金
→ 下一轮更买不到
→ 市场淘汰
```

所以早期错误会沿着经济链传播。

作者自己也强调，这种 hard constraint 会导致格式错误甚至直接让 Agent 被市场排除。

---

# 三十四、最后把论文压缩成一个“机制卡片”

**Agent**

> 20 个 LLM Retailers

**Supplier**

> Rule-based

**Consumers**

> Rule-based synthetic buyers with latent persona

**LLM Input**

> Funds + Inventory + Supplier Offer + Market History

**LLM Action**

$$
\boxed{
Bid(q,p)+RetailPrice+Slogan
}
$$

**Procurement**

$$
\boxed{
First\ Price\ Multi\ Unit\ Auction
}
$$

**Consumer attention**

$$
Sim_{ij}
=
\cos(E(Slogan_i),E(Persona_j))
$$

$$
w_{ij}
=
e^{\lambda_jSim_{ij}/\tau}
$$

$$
V_j\sim w_{ij}
$$

**Purchase**

$$
\boxed{
\text{lowest price among visible sellers with inventory}
}
$$

**One Step**

```text
Supplier offer
→ Bid round 1
→ Bid round 2
→ Auction settle
→ Retail price + slogan
→ Generate buyers
→ Persona-gated attention
→ Lowest-price purchases
→ Update money/inventory
→ Record history
```

**Default Environment**

```text
20 sellers
8 products
1000 supply
200 buyers
6 market steps
2 bidding rounds/step
$22,500 initial capital
Qwen3-Embedding-8B
```

---

如果单纯从你最关心的“**买方卖方到底怎么实现**”看，这篇其实可以一句话定义成：

> **它不是模拟 Buyer–Seller 对话，而是在模拟 Seller 的经营决策；Buyer 被压缩成一个“Persona 控制曝光 + 价格控制购买”的规则消费者。**

所以它在 **库存—定价—营销—利润闭环** 上做得比较明确；但如果关心的是“消费者主动发需求、商家响应、询问、私信、说服、议价、最后购买”，那一整层在 Market-Bench 里其实是**没有的**。论文自己的局限也说明当前消费者没有记忆、没有复购、只做单品购买。
