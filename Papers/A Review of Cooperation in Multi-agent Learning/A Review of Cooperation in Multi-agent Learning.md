---
创建时间: 2024-十二月-30日  星期一, 2:54:58 下午
created: 2024-12-30T14:54
updated: ...
---
#paper_summary 

# Inspiration


## Take-away Message

以下是对综述论文《A Review of Cooperation in Multi-agent Learning》的**核心内容总结表格**，已按照你的要求**精炼、结构清晰、可快速浏览**，适合作为长期查阅的笔记使用：

---

### 📘 多智能体合作学习综述核心内容表

| 模块          | 内容摘要                                                                                                                          |               |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------- |
| **研究背景**    | 合作是多智能体系统实现高效决策的关键，涵盖从完全协同到混合动机场景。合作难点包括：部分可观测、个体-集体冲突、学习耦合等。                                                                 |               |
| **合作类型划分**  | **① 纯合作（Pure Cooperation）**：智能体目标一致<br>**② 混合动机合作（Mixed-motivation）**：既有协作又存在目标冲突，需权衡个体理性与群体最优（社会困境）                          |               |
| **关键研究挑战**  | - 信号归因难（Credit Assignment）<br> - 动态适应性差（Partner Adaptation）<br> - 社会困境诱发背叛<br> - 策略缺乏泛化能力<br> - 缺乏行为可解释性                      |               |
| **核心机制分类**  | **类别**                                                                                                                        | **代表方法 / 特点** |
| --------    | ---------------------                                                                                                         |               |
| **CTDE 架构** | MADDPG、QMIX、QTRAN：集中训练，去中心化执行                                                                                                 |               |
| **通信机制**    | DIAL、CommNet、IC3Net：学习共享信息、选择性注意                                                                                              |               |
| **归因机制**    | Counterfactual Baseline、Credit Assignment Graph                                                                               |               |
| **伙伴适应机制**  | Learning with Opponent Modeling (LOLA)、Bayesian ToM                                                                           |               |
| **利他激励**    | Prosocial RL、Inequity Aversion、SVO、自学习内在动机                                                                                    |               |
| **影响建模**    | LIO、Social Influence、LOLA：建模行为对他人学习的影响                                                                                        |               |
| **声誉与规范**   | CNM、Competitive Altruism：引入社会评价、惩罚偏差                                                                                          |               |
| **契约机制**    | Contract、Reward Exchange：构造合作承诺、共享收益方案                                                                                        |               |
| **社会困境建模**  | Sequential Social Dilemmas (SSD)：将社会困境拓展至状态-策略层面，支持多智能体、跨期建模                                                                  |               |
| **评估环境**    | - 粒子环境（simple-spread, speaker-listener）<br> - Hanabi（部分可观测+非语言合作）<br> - Overcooked-AI（现实多阶段任务）<br> - Harvest/Cleanup（SSD）     |               |
| **评估指标**    | - 社会福利（SW）<br> - 公平性（Gini）<br> - 可泛化性（zero-shot, 多任务）<br> - 合作稳定性（抗背叛性、规范遵守）                                                  |               |
| **关键结论**    | - 合作策略需兼顾学习机制、博弈动力学与行为适应；<br> - 需加强**理论支持、泛化性建模、人类交互适应性**；<br> - 当前方法多在人工环境中验证，缺乏现实复杂性支持；<br> - 推动构建**标准化评估协议、真实世界基准任务**是关键方向 |               |
|             |                                                                                                                               |               |
|             |                                                                                                                               |               |
|             |                                                                                                                               |               |

---

如果你还希望我根据这个表格生成 Markdown/WPS 表格代码、中文幻灯片内容提纲，或转换成PPT，请告诉我。


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