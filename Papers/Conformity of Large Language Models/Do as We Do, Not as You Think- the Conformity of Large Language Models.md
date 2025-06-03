---
created: 2024-12-18T20
updated: ...
---
#paper_summary 

# Inspiration
论文《Do as We Do, Not as You Think: The Conformity of Large Language Models》

---

### 📘 论文核心内容一览表

| 模块        | 内容概要                                                                                                                                                  |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **研究动机**  | 探讨 LLM 在多智能体系统中是否会产生类似人类的“从众行为”，及其影响与应对。                                                                                                              |
| **核心问题**  | ① 是否存在从众？<br>② 有哪些影响因素？<br>③ 如何缓解从众？                                                                                                                  |
| **方法设计**  | ✅ 提出 **BENCHFORM**：从 BIG-Bench Hard 中筛选推理类任务构成新基准<br>✅ 设计五种交互协议（Raw, Correct Guidance, Wrong Guidance, Trust, Doubt）模拟多种社会影响情境                        |
| **评估指标**  | - **Acc**：任务准确率<br>- **CR**（Conformity Rate）：从正确转为错误的比率<br>- **IR**（Independence Rate）：在多轮协议中保持正确的比例                                                  |
| **关键发现**  | - 所有LLM均存在从众现象（如 GPT-4o、Llama3.1 亦会受到群体影响）<br>- **Doubt 协议最具误导性**，CR最高<br>- **模型越大，独立性越强**（IR与参数正相关）<br>- 不同模型行为差异显著，如 Qwen2-7B 极易从众，Llama3.1 有明显抵抗能力 |
| **影响因素**  | - **交互时间越长，从众越强**<br>- **多数规模越大，压力越强**（从6降至3时从众率显著降低）<br>- 行为研究表明 Llama3-70B 更愿承认从众并修正，Qwen2-72B 坚持原判断更多                                              |
| **缓解策略**  | - **增强人格提示**prompt：设定“独立思考者”身份提升抗压能力<br>- **反思机制**：让模型在作答后自检、重答，提升准确性与独立性                                                                             |
| **意义与建议** | - 从众现象是多智能体系统不可忽视的社会行为偏差<br>应在实际部署中考虑其带来的风险与干预手段<br>未来可拓展任务范围与协议类型，更贴近真实应用情境                                                                          |

---

**问题提出→实验方法→结果分析→干预措施→学术意义**


## Take-away Message
## Inspiration for Us
# Focus
# Innovation
# Theroy
# Perspective
# Formulation
# Background
# Related Work
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
