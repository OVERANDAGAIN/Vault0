---
创建时间: 2026-七月-3日  星期五, 6:16:38 晚上
---




### 第一组：整体地图

1. **A Survey on LLM-based Conversational User Simulation**
   用来把握分类框架。重点看 Who / What / How / Evaluation / Applications。综述明确把 conversational user simulation 组织为 Who、What、How 三个核心问题，并进一步总结 evaluation、datasets、applications 和 open challenges。

### 第二组：推荐场景 user simulator 的评价

2. **Evaluating Large Language Models as Generative User Simulators for Conversational Recommendation**
   看五任务评价协议。

3. **How Reliable is Your Simulator? Analysis on the Limitations of Current LLM-based User Simulators for Conversational Recommendation**
   看数据泄漏、prompt 不可控、评估高估问题。

4. **ConvApparel: A Benchmark Dataset and Validation Framework for User Simulators in Conversational Recommenders**
   看 realism gap、human-likeness、counterfactual validation。

### 第三组：机制设计

5. **UserSimCRS**
   看 classic agenda-based + satisfaction + conditional generation 的模拟器结构。

6. **CSHI**
   看插件式、可控、可扩展、记忆驱动的 simulator 工程框架。

7. **RecUserSim**
   重点看 profile / memory / bounded-rationality action / explicit rating / refinement，这是你后面设计 reaction model 最值得借鉴的。

### 第四组：训练鲁棒性

8. **Beyond Cooperative Simulators: Generating Realistic User Personas for Robust Evaluation of LLM Agents**
   看非合作、多样、困难用户如何让 agent 更鲁棒。

9. **DAUS**
   可选。看 goal coherence 和 hallucination mitigation。

