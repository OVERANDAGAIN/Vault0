---
创建时间: 2026-九月-14日  星期一, 1:08:25 下午
---
我把这篇 **《Sell More, Play Less: Benchmarking LLM Realistic Selling Skill》** 按你最关心的“**买方怎么设计、卖方怎么设计、购买怎么发生、一步怎么推进、实验环境怎么搭**”来读。先给一个总判断：

> **这篇文章本质上不是一个“真实交易/市场仿真环境”，而是一个“销售对话 benchmark”。**
> 它把卖方做成待测 LLM，把买方做成专门训练的 CustomerLM，然后让两边多轮聊天。所谓“购买”并不是环境里真的执行 `buy()`、扣钱、减库存，而是看顾客最后在语言上有没有表现出购买意图，以及整个销售过程有没有实质推进。

这个区别对理解整篇文章非常重要。

---

# 一、先把论文里的核心术语列出来

| 论文术语                          | 中文             | 在系统里实际是什么               |
| ----------------------------- | -------------- | ----------------------- |
| SalesLLM Benchmark            | 销售能力 Benchmark | 整个评测框架                  |
| Sales Model / Sales Assistant | 卖方/销售 Agent    | **被测试的 LLM**            |
| User Model / CustomerLM       | 买方/顾客模拟器       | 专门训练来扮演客户的 LLM          |
| Product Inventory             | 商品池            | 商品/金融产品的描述集合            |
| Base Persona                  | 基础用户画像         | 年龄、职业、城市等               |
| Customer Persona              | 完整顾客画像         | 基础属性 + 动机 + 痛点 + 决策因素   |
| Difficulty Profile            | 难度画像           | 控制顾客有多容易被说服             |
| Buy Propensity \(p_k\)        | 初始购买倾向         | 写进 buyer prompt 的先验倾向   |
| User Script                   | 买方脚本           | CustomerLM 私有 prompt    |
| Sales Script                  | 卖方脚本           | Seller 私有产品信息和规则        |
| Buying Intent                 | 购买意图           | 对话结束后顾客有多想买             |
| Selling Performance           | 销售过程能力         | 有没有真正推动交易               |
| Verbal Purchase Commitment    | 口头购买承诺         | “那就买吧”“帮我下单”            |
| Concrete Next-step Alignment  | 明确下一步          | 约时间、发链接、发材料等            |
| Key Information Elicitation   | 关键信息获取         | 有没有问出预算、风险偏好等           |
| Objection Resolution          | 异议处理           | 顾客提出问题后有没有真正消除          |
| Role Inversion                | 角色反转           | 买方模型突然开始像销售一样推销         |
| Long-horizon Selling          | 长周期销售          | 第一次拒绝后再次跟进              |
| Multi-product Selling         | 多商品销售          | 同时给销售多个商品供选择            |
| SFT                           | 监督微调           | 先教 CustomerLM “怎么像顾客说话” |
| DPO                           | 偏好优化           | 再压制“AI 助手味”和角色错乱        |

整篇文章的主框架，就是 Figure 1 的三阶段：

**生成场景 → 训练/运行 CustomerLM → Seller 和 CustomerLM 对话 → 对最终对话打分。** 

---

# 二、先用大白话把整个系统讲明白

假设现在要测一个 DeepSeek 会不会卖吸尘器。

论文大概做的是下面这件事。

## 第一步：先造一个商品

例如：

> Dyson V11
> 60 分钟续航
> 185AW 吸力
> HEPA
> 高端价位

这部分是卖家知道的信息。

论文有两个大商品领域：

* Consumer Goods 消费品
* Financial Services 金融服务

消费品最终做出 **10,074** 个产品；金融服务从 300 个真实产品种子扩展出 **20,000** 个样本。

---

## 第二步：造一个“人”

例如随机得到：

> 45–55 岁
> 男性
> 机械工程师
> 洛阳

但只有这些还不像真正买东西的人。

所以论文再让 LLM 根据“这个人 + 这个产品”，补出：

> Motivation：为什么想买
> Pain Point：目前哪里不爽
> Decision Factor：什么因素决定他买不买
> Communication Preference：喜欢怎么沟通

比如吸尘器：

> 想清理宠物毛发；
> 现在的吸尘器太重、带线；
> 在意吸力、过滤和方便程度。

也就是说：

**persona 不是单纯 demographics，而是 product-conditioned persona。**

Figure 2 基本就是这个流程：商品池和人口属性先独立构造，然后进行 **Persona–Product Pairing**，再让 LLM 合成完整买方脚本和卖方脚本。

---

## 第三步：人为控制这个人“有多难卖”

这是这篇文章非常关键的设计。

同样一个商品、同样一个人，可以生成：

| 难度          | 初始购买倾向 |
| ----------- | -----: |
| Easy        |   0.80 |
| Medium      |   0.50 |
| Hard        |   0.20 |
| Very Hard   |   0.10 |
| Adversarial |   0.05 |

但这个数字**不是代码里每一步拿来算购买概率**。

它直接被写进 Buyer 的 system prompt。

例如 Easy：

> 这是一个开放、积极的买家；需求明确，预算灵活；如果产品合适，很快做决定。

Hard：

> 怀疑、价格敏感、风险厌恶；默认不愿意买，除非销售给出非常具体的证据。

Adversarial：

> 基本是在找理由淘汰你，关注边界情况、法律风险、总成本，几乎不会主动表达购买意向。

所以这里千万不要理解成：

$$
P(\text{buy})=0.8
$$

然后随机采样。

**不是。**

更准确是：

$$
p_k
\rightarrow
\text{写进 Prompt}
\rightarrow
CustomerLM 根据这个人格进行自然语言行为
$$

这篇文章的“用户差异产生作用”的方式，本质是 **Prompt-conditioned simulation**。

---

# 三、买方到底怎么设计？

这是论文最值得看的部分之一。

## 1. Buyer 不是 GPT-4o 直接扮演

作者认为直接说：

> “GPT-4o，你现在是一名客户。”

效果不够好。

因为通用 LLM 有两个严重问题：

### Language Bias

客户说话不像客户。

会说得太长、太正式、太完整。

真实客户可能说：

> “有风险吗？”

LLM 客户容易说：

> “感谢您的介绍，我想进一步了解该金融产品的风险等级和相关保障措施……”

太 AI 了。

### Role Inversion

更严重的是：

聊着聊着，“客户”自己开始卖东西了。

比如本来应该问：

> “多少钱？”

结果模型突然：

> “我们这款产品具有非常优秀的特点……”

角色反转。

作者发现 GPT-4o 的 Role Inversion Rate 是 **17.44%**。他们训练 CustomerLM 后降到了 **8.8%**。

---

# 四、CustomerLM 是怎么训练出来的？

作者以 **Qwen3-8B** 为 base model。

分两步。

## 第一阶段：SFT

用 **8,000+ 真人参与的销售对话**训练。

目标很直接：

> 先让模型学会“客户到底怎么说话”。

也就是：

$$
Qwen3\text{-}8B
\xrightarrow{\text{8000+ sales dialogues}}
CustomerLM_{\text{SFT}}
$$

---

## 第二阶段：DPO

这个设计更有意思。

作者让 SFT CustomerLM 分别跟：

* GPT-4o
* GLM-4.6
* Qwen2.5-72B

扮演的销售聊天。

然后检查 CustomerLM 有没有产生坏回复。

例如：

> 客户突然开始推销产品

或者：

> 回复太像 AI 助手。

LLM Judge 先找出这些错误，再用 GPT-4o + 人工修正出更好的客户回复。

于是得到：

$$
(\text{bad customer response},
\text{good customer response})
$$

最终构成 **268 个 DPO preference pairs**。

所以它的思路可以大白话理解成：

> SFT 教它“怎么当客户”；
> DPO 专门纠正“别又变回 ChatGPT”。

这比单纯 prompt 一个 GPT-4o 当用户，要精细很多。

---

# 五、卖方到底怎么设计？

卖方反而简单很多。

因为**卖方就是待测试模型**。

例如：

* DeepSeek
* GPT-4o
* GLM
* Qwen
* Gemini

等等。

卖方拿到一个私有的 Product Information，例如：

> 商品名
> 价格
> 功能
> 卖点
> 退货政策

同时给一个销售 system prompt：

> 你是专业销售。
> 只能你看到 PRODUCT_INFORMATION。
> 不要泄露隐藏信息。
> 根据用户需求进行销售。
> 如果客户准备购买而且有购买渠道，则提供购买渠道；否则推动到合适的下一步。

这里一个很重要的设计是：

**作者基本没有手写“销售策略规则”。**

没有：

```python
if price_sensitive:
    give_discount()
elif risk_concern:
    explain_warranty()
```

这种规则。

而是：

> 商品信息 + system prompt + conversation history
> → LLM 自己决定下一句话。

因此 Sales Agent 的核心 policy 就是 LLM 本身。

---

# 六、最关键的问题：这个系统里的“一步”到底是什么？

如果把它抽象成一个 Agent Environment，可以这样理解。

### State

并没有显式：

```text
budget = 500
trust = 0.62
purchase_intention = 0.7
inventory = 5
```

它的 state 主要就是：

$$
s_t =
(\text{conversation history},
\text{private script})
$$

---

### Seller Action

销售生成一句话：

$$
a_t^{seller}
=
LLM(
history,
product\_script
)
$$

例如：

> 你每周大概跑多少公里？主要是公路还是越野？

---

### Buyer Transition / Response

CustomerLM 看到：

* buyer persona
* difficulty
* motivations
* pain points
* conversation history
* seller 刚才的话

然后生成：

$$
u_t =
CustomerLM(
history,
persona,
difficulty,
a_t
)
$$

比如：

> 每周大概 40 英里，主要公路，偶尔越野。

然后新的 history：

$$
h_{t+1}
=
h_t +
a_t +
u_t
$$

再进入下一轮。

---

## 所以它不是标准 MDP 那种显式状态转移

没有类似：

$$
trust_{t+1}
=
trust_t+0.1
$$

也没有：

$$
buy\_prob_{t+1}
=
f(price, trust, persuasion)
$$

**所有这些东西都是隐式存在 LLM 的自然语言行为里的。**

这点非常关键。

论文在实验中统一设置 **最多 20 个 dialogue rounds**。

而正文并没有为主 benchmark 定义一个复杂的显式 transaction-state machine。

---

# 七、那“购买”到底是怎么实现的？

这是这篇文章和真正 marketplace benchmark 差别最大的地方。

答案是：

## 没有真正执行购买。

没有：

```python
purchase(product_id)
money -= price
inventory -= 1
```

也没有 payment simulator。

所谓买了，是顾客**在语言上明确表现出买的行为**。

例如论文中的高分案例：

Customer：

> “Let’s go ahead and order. How do I pay?”

Seller：

> 可以通过网站 checkout，或者我给你发送 payment link。

这时候 benchmark 就把它理解成成功购买意图。

注意：

**payment link 并不会真的执行。**

---

# 八、购买结果怎么判断？

作者训练了一个专门的 BERT classifier。

最终把一段完整销售对话分成五档：

| 类别 | 含义                         | 分数 |
| -- | -------------------------- | -: |
| F  | Insulting，敌对/辱骂            |  2 |
| X  | Perfunctory，敷衍             |  4 |
| C  | No Intention，不想买           |  6 |
| B  | Potential Interest，有兴趣     |  8 |
| A  | Clear Purchase Intent，明确购买 | 10 |



比如：

> “我再想想。”

可能是 C。

> “你们具体多少钱？保修多久？”

可能是 B。

> “那就给我下单吧。”

就是 A。

---

## 为什么不用 GPT-4o 判断？

作者试了。

中文：

* GPT-4o zero-shot：69.60%
* GPT-4o 10-shot：78.42%
* Fine-tuned BERT：**93.51%**

英文：

* 68.85%
* 81.92%
* **92.94%**

所以作者认为：

> 对这种相对明确的 intent classification，专门训练过的小型分类器比通用大模型 judge 更稳定。

---

# 九、你特别问的“一步推进”——论文其实有两个概念，不要混在一起

这一点我建议特别注意。

## 第一种“step”：Agent 仿真的一步

就是：

> Seller 说一句 → Customer 说一句。

前面已经讲了。

它本身没有数字 reward。

---

## 第二种“next step”：销售意义上的下一步

论文有一个非常重要的评价指标：

### Concrete Next-step Alignment

就是：

> 这一轮销售有没有把事情真正推进到一个具体动作。

例如这些算：

> “明天下午三点我给你打电话。”
> “把材料发我邮箱吧。”
> “给我支付链接。”
> “下周我们安排产品演示。”

但是：

> “我再考虑考虑。”

不算真正的 next step。

而且销售自己说：

> “那我明天联系你。”

也不一定算。

**必须客户明确接受。**

作者在定义中特别强调：

> Credit requires the customer to accept the step, not merely the salesperson to propose it. 

所以这个 benchmark 不是只看：

> 最后买没买。

还看：

> 即使暂时没买，你有没有把销售 pipeline 往前推了一格。

这个思想其实非常有价值。

---

# 十、Selling Performance 是怎么评的？

除了最终 Buying Intent，它还有第二个分数：

$$
S_{sell}
$$

由 LLM Judge 评销售过程。

关注四件事：

### 1. Verbal Purchase Commitment

客户有没有亲口表现出购买意愿。

---

### 2. Concrete Next-step Alignment

有没有形成具体下一步。

---

### 3. Key Information Elicitation

销售有没有问出真正重要的信息。

例如：

* budget
* time horizon
* risk tolerance
* competing options
* decision authority



这个非常像真实销售里的 qualification。

---

### 4. Objection Resolution

例如客户说：

> “这个太贵了。”

销售解释以后，不能只看销售说得漂不漂亮。

必须后面客户表现出：

> “这样的话价格还能接受。”

才算 objection resolved。

作者反复强调：

> **customer-side evidence**。

不能销售自己宣布：

> “很好，我已经解决了您的担忧。”

然后就拿分。

---

# 十一、最终 reward / score 怎么算？

非常简单：

$$
FinalScore
=
\alpha S_{buy}
+
(1-\alpha)S_{sell}
$$

其中：

$$
\alpha=0.5
$$

所以：

$$
FinalScore
=
0.5S_{buy}
+
0.5S_{sell}
$$

一半看：

> **结果——客户想不想买。**

一半看：

> **过程——销售有没有做对事情。**

作者还用人工评价测试了不同 \(\alpha\)，发现 0.5 平均与人的相关性最高。

---

# 十二、如果用一个非常简单的伪代码表示整篇文章

其实就是：

```text
product = sample(ProductPool)
persona = sample(PersonaPool)
difficulty = sample(Difficulty)

buyer_script =
    LLM_generate(
        persona,
        product,
        difficulty,
        motivations,
        pain_points,
        decision_factors
    )

seller_script =
    product_information + sales_rules

history = []

for t = 1 ... 20:

    seller_response =
        SalesLLM(
            seller_script,
            history
        )

    buyer_response =
        CustomerLM(
            buyer_script,
            history,
            seller_response
        )

    history += seller_response
    history += buyer_response

S_buy =
    BERT_intent_classifier(history)

S_sell =
    LLM_judge(history)

Final =
    0.5 * S_buy +
    0.5 * S_sell
```

这基本就是整篇 benchmark 最核心的运行机制。

注意这里最重要的一件事：

> **没有 turn-level reward。**

它基本是一个：

$$
\text{Episode-level Evaluation}
$$

整段对话跑完以后统一评。

---

# 十三、多商品环境是怎么设计的？

论文后来又扩展了一个比较值得注意的场景：

### Multi-product Selling

卖方不再只有一个商品，而是一次看到 **6 个商品**。

这 6 个商品是人工挑出来、与 persona 可能的偏好比较匹配的。

Seller 获得：

```text
Product 1 description
Product 2 description
...
Product 6 description
```

然后自己根据客户聊天动态决定：

> 应该推哪个产品。

因此测试：

1. **dynamic product selection**
2. **bundling**



后来还扩展到：

> **15 SKU = 1 target + 14 competing peers**

来验证不是因为商品太少才简单。

---

# 十四、但是这里有个非常重要的缺失：它没有真正做 pricing

这点如果你关注“销售 Agent 不只是聊天，还要选择和定价”，一定要看清。

这篇论文中：

### 商品选择

有。

### 说服

有。

### 商品推荐

有。

### Bundling

有。

### 自主定价

**基本没有。**

价格属于 Product Information。

例如：

> price: $39.99/year



Agent 并没有：

$$
a_t^{price}=p_t
$$

这样的行动空间。

甚至作者发现模型为了成交有时会**自己编优惠**：

> unauthorized concessions / discounts

论文反而把这当作 limitation，因为产品脚本根本没有授权它降价。

所以这篇论文严格讲是：

> **persuasion + product selection benchmark**

而不是：

> **pricing + inventory + transaction benchmark**。

---

# 十五、Long-horizon 是怎么做的？

这个设计也值得注意。

作者先从主 benchmark 里面挑出：

> 第一轮结束后明确没有购买意向

的样本。

然后允许 Seller 再进行：

> 最多 **两轮 follow-up sessions**

上一轮的完整 history 被塞进下一轮 system context。

所以：

$$
Session_1
\rightarrow
History
\rightarrow
Session_2
\rightarrow
History
\rightarrow
Session_3
$$

如果购买意图已经非常负面，则提前终止。

最终评分看整个 trajectory。

---

## 很有意思的一点

多联系不一定加分。

论文有个例子：

第一次用户：

> “我考虑一下。”

销售第二次来就：

> 限时 20% off！

然后：

> 别人买了都说好！

再然后：

> 库存快没了！

用户最后：

> “Please stop messaging me about this.”

结果从普通拒绝升级成强烈反感。

也就是说 CustomerLM 可以模拟：

$$
\text{过度 push}
\rightarrow
\text{购买意愿下降}
$$



这是这篇文章里比较接近“动态用户状态”的一个体现。

但是这个状态仍然是**隐式在 LLM 中变化的**，并没有一个显式：

$$
annoyance_{t+1}=annoyance_t+0.2
$$

---

# 十六、实验环境的具体参数

这一块可以直接作为复现笔记。

## 测试模型

共 **15 个主流模型**，包括：

* Doubao-1.5-pro-32k
* Qwen3-Max
* DeepSeek-Chat
* GPT-4o
* GLM-4.6
* Gemini-3 系列
* GPT-5-nano
* Xiaomi-MiMo-V2
* Llama-3.3-70B
* Qwen3-8B / 32B
* Qwen2.5-72B
* Gemma-3-27B 等。

统一 inference：

```text
temperature = 0.8
top_p = 0.99
max_tokens = 2048
max dialogue rounds = 20
```

闭源模型：

> official API

开源模型：

> vLLM



---

# 十七、CustomerLM 训练环境

这个论文给得比较完整：

```text
Base: Qwen3-8B

Training:
SFT + DPO
Full fine-tuning

Hardware:
5 × A100 80GB

Distributed:
DeepSpeed ZeRO-3

dtype:
bfloat16

Epoch:
SFT = 2
DPO = 1

Train batch size:
20

Learning rate:
SFT = 1e-5
DPO = 5e-5

Warmup ratio:
0.05

Max sequence length:
3072
```



---

# 十八、Scenario 数据规模

整个场景空间：

* E-commerce：10,074
* Financial Services：20,000
* User Personas：19,138



最终形成：

> **30,074 dialogue scripts**

实际 benchmark 人工筛选：

* 中文：1,000
* 英文：805

总共：

$$
1805
$$



---

# 十九、从“论文”的角度再给你梳理一遍

如果不陷入细节，这篇文章其实讲了四层故事。

## 第一层：现有对话 benchmark 有问题

以前很多 benchmark 看：

> 回复流不流畅？
> 合不合理？
> 有没有帮助？

但是销售真正关心的是：

> **你有没有把客户从“不买”推向“买”。**

所以作者要做 **outcome-oriented evaluation**。

---

## 第二层：要评销售，首先得有一个靠谱的“客户”

直接用 GPT-4o 模拟用户容易：

* 太礼貌
* 太容易说服
* 太像 AI
* 角色反转

所以训练：

> **CustomerLM**

这是论文非常核心的 contribution。

---

## 第三层：不能只看“成交没有”

因为销售经常无法一轮成交。

所以评价：

$$
Outcome + Process
$$

也就是：

### Buying Intent

最后想不想买。

*

### Selling Performance

有没有：

* 问出关键需求
* 解决异议
* 获得口头承诺
* 推动明确下一步

这使得它比纯：

```text
Success / Failure
```

细很多。

---

## 第四层：拿这套框架去测不同 LLM

结果发现：

强模型和弱模型的区别，不只是：

> “回答好不好”。

而是：

强模型会主动：

> qualification → matching → objection handling → closing

弱模型容易变成：

> Q&A → Q&A → Q&A → Q&A

论文给 DeepSeek 和 GPT-4o 的 case 非常直观。

DeepSeek：

> “你一周跑多少公里？公路还是越野？”

知道信息以后马上：

> “这个型号正好适合你。”

然后：

> “现在帮你下单还是先试穿？”

而 GPT-4o：

> “你还有品牌偏好吗？”
> “你有颜色偏好吗？”
> “要不要我继续给你介绍？”

最后没有推进交易。

作者把这称为 **passive Q&A pattern**。

---

# 二十、我认为你读这篇文章最应该记住的框架

可以把它压缩成这张逻辑图：

```text
           Product
              │
              ├────────────→ Seller private info
              │
              ↓
Persona + Product + Difficulty
              │
              ↓
       Customer Script
              │
              ↓
         CustomerLM
              ↑
              │ dialogue
              ↓
          Sales LLM
              │
              ↓
      Multi-turn Transcript
          /          \
         /            \
        ↓              ↓
 BERT Buying      LLM Selling
 Intent Score     Process Score
        \              /
         \            /
          ↓          ↓
        Final Score
```

其中最核心的：

$$
\boxed{
Final=0.5\times BuyIntent+0.5\times SellingProcess
}
$$

---

# 二十一、如果从“机制设计”而不是论文成绩看，我对它的定位

这篇论文其实有一个很鲜明的边界：

### 它已经做得很好的

**用户建模**

```text
demographic
+ motivation
+ pain point
+ decision factor
+ difficulty
```

**用户仿真**

```text
专门 CustomerLM
SFT + DPO
```

**多轮销售过程**

```text
qualification
→ persuasion
→ objection
→ next step
→ purchase intent
```

**过程 + 结果评价**

这一块设计得很完整。

---

### 它还没有真正解决的

如果把销售环境往“经济决策 Agent”推进，它还缺：

```text
显式预算
显式 utility
真实 purchase action
真实 price action
可谈判价格
库存变化
钱的变化
商品消耗
竞争卖家
市场变化
逐 step reward
显式用户状态 transition
```

尤其是：

$$
\textbf{Selection 有，Pricing 没有。}
$$

$$
\textbf{Purchase Intent 有，Transaction 没有。}
$$

$$
\textbf{Dialogue State 有，Economic State 没有。}
$$

所以我会把这篇论文定位成：

> **一个做得非常完整的“LLM 销售对话与说服能力 benchmark”，而不是完整的 buyer–seller market simulator。**

而恰恰因为如此，它非常适合借鉴 **Buyer Persona、User Simulator、难度控制、销售推进评价**；但如果目标是研究“选哪个商品、报什么价格、用户是否真正购买、库存和收益如何变化”，那还必须在它外面再加一层显式交易环境。
