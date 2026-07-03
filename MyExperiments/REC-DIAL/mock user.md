---
创建时间: 2026-七月-3日  星期五, 6:16:38 晚上
---






第一组，直接搜 LLM 用户模拟：

A Survey on LLM-based Conversational User Simulation。
这是 2026 年的综述

第二组，搜“真实性缺口”：
Measuring and bridging the realism gap in user simulators
一个是 Google Research 的 ConvApparel，它明确指出 LLM 用户模拟器常见问题包括过度冗长、persona 不一致、偏好表达不稳定、不合理的知识水平、过高耐心等；这些问题本质上来自 LLM 默认被训练成 helpful assistant，而不是“有缺陷、容易不耐烦的普通用户”。

第三组，搜 conversational recommender，因为你的系统里有推荐/广告成分：

Evaluating Large Language Models as Generative User Simulators for Conversational Recommendation。这篇很重要，因为它不是只提出一个 simulator，而是提出了评估协议，测试 synthetic user 是否能做到：选择谈论的物品、表达二元偏好、表达开放式偏好、请求推荐、给出反馈。它也指出 baseline simulator 会偏离真实人类行为

UserSimCRS