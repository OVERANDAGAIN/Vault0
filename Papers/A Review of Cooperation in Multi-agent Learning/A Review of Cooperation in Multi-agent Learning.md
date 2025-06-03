---
创建时间: 2024-十二月-30日  星期一, 2:54:58 下午
created: 2024-12-30T14:54
updated: ...
---
#paper_summary 

# Inspiration


## Take-away Message
当然，这里是针对 **《Autonomous Agents Modelling Other Agents: A Comprehensive Survey and Open Problems》** 这篇综述的**高密度、结构化总结**，重点突出其核心内容与创新点，便于你在笔记中快速回顾，不与泛泛综述混淆：

---

## 📘 综述核心笔记：《自主智能体建模他者智能体：方法综述与问题展望》

### 🧩 综述主线逻辑：

> **目的：** 系统梳理“智能体建模他者智能体”的方法体系，明确建模目标、输入类型、推理深度、适应性等关键要素，同时识别当前研究盲点与发展趋势。

---

### 🧠 一、方法分类（Chapter 4）

按核心建模机制划分为 8 类：

| 方法类别                       | 核心思路                         | 典型用途       |
| -------------------------- | ---------------------------- | ---------- |
| 4.1 Policy Reconstruction  | 从观测轨迹重建策略函数                  | 模仿、行为预测    |
| 4.2 Type-based Reasoning   | 假设有限行为“类型”，识别后对症应对           | 快速适应、博弈    |
| 4.3 Plan Recognition       | 识别对手长远计划或目标                  | 高层意图理解     |
| 4.4 Recursive Reasoning    | 建模“我认为你认为…”等递归信念             | 多阶博弈、ToM建模 |
| 4.5 Graphical Models       | DBNs, I-DIDs 表达多智能体结构与策略联合分布 | 决策下推、联合建模  |
| 4.6 Classification Methods | 使用监督学习方法建模行为/类型              | 大数据驱动环境    |
| 4.7 Group Modelling        | 将多个智能体当作协同行为体建模              | 群体战术识别     |
| 4.8 Other Methods          | 模仿学习、IRL、情绪建模等补充方法           | 心理建模、人机交互  |

> ✅ 作者重点强调 **不同方法的输出目标、处理粒度、是否支持在线建模、推理深度** 等关键对比维度，并在表3中详列对比。

---

### 🧭 二、方法比较与整合（Chapter 5）

5.1 明确建模目标：

* 策略预测、类型识别、意图推理、行为解释、长期适应

5.2 信息假设维度：

* 动作是否可见？状态是否观察？对方是否透明表达意图？

5.3 时间特性：

* 静态 vs 动态；在线 vs 离线；短期 vs 长期预测

5.4 建模与决策耦合方式：

* 用于策略调节、博弈分析、规划辅助、模型集成等

5.5-5.6 多方法整合：

* 并行组合、层次结构、互补组件、集成框架、模型切换

5.7 主动建模（核心亮点）：

* 智能体可通过试探性行为探索对手类型（探测-建模-自适应闭环）

5.8 多对多建模：

* 面向复杂 MAS 场景的对多建模方法（图神经网络等）

---

### 🚧 三、当前难点与研究方向（Chapter 6）

1. **建模学习型智能体：** 当前方法大多假设对手静态，难以应对 co-adaptation；
2. **小样本 / 快速建模：** 需要支持 few-shot / one-shot 的策略识别；
3. **多元行为驱动因素：** 需整合非功利性动因（偏好、情绪、社会规范等）；
4. **可扩展性：** 智能体数量多时现有方法难以适配，需模型压缩或结构泛化；
5. **不确定性建模：** 多模型共存、置信度驱动行为选择；
6. **落地难：** 大量方法停留在模拟，缺乏真实部署与系统集成接口。

---

### ✅ 本综述的独特贡献：

* 明确提出**建模任务的目标导向分类框架**；
* 系统性比较建模方法的多个技术维度；
* 引入**主动建模 / few-shot 识别**作为发展重点；
* 强调建模与**实际决策机制深度耦合**；
* 较少综述覆盖到的**群体建模、多对多建模、博弈推理结构化表达**等内容。

---

如需将此内容进一步浓缩为思维导图或PPT结构提纲，我也可以继续帮助整理。




## Inspiration for Us





# Focus
![[Pasted image 20241230145523.png]]

Various multi-agent learning settings:[^1]
1. Cooperative Setting $\Longrightarrow$ recognised as ==multi-agent MDPs==
2. Comprtitive Setting $\Longrightarrow$ ==zero-sum== Markov games
3. Mixed Setting $\Longrightarrow$ ==general-sum== game framework 




# Innovation



# Theroy



# Background



# Related Work




# Methodology



# Evaluation



# Results



# Limitations


# FootNotes

[^1]: MAL settings