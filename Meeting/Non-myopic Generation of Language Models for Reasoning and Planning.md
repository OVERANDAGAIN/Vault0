---
created: 2025-01-10T14
updated: ...
创建时间: 2025-四月-22日  星期二, 7:31:44 晚上
---
#meeting 

**Reporter:**  
报告人：张议文
主题：Non-myopic Generation of Language Models for Reasoning and Planning
时间：2024年4月22日（周二）19：30~20：30
参考论文：https://openreview.net/pdf?id=OoNazl6T7D
腾讯会议号：981-8006-9100
摘要：Large Language Models have demonstrated remarkable abilities in reasoning and planning by breaking down complex problems into sequential steps. Despite their success in various domains like mathematical problem-solving and coding, LLMs face challenges in ensuring reliable and optimal planning due to their inherent myopic nature of autoregressive decoding. This paper revisits LLM reasoning from an optimal-control perspective, proposing a novel method, Predictive-Decoding, that leverages Model Predictive Control to enhance planning accuracy. By re-weighting LLM distributions based on foresight trajectories, Predictive-Decoding aims to mitigate early errors and promote non-myopic planning. Our experiments show significant improvements in a wide range of tasks for math, coding, and agents. Furthermore, Predictive-Decoding demonstrates computational efficiency, outperforming search baselines with reduced computational resources. This study provides insights into optimizing LLM planning capabilities.
# Inspiration
# Probelms or Thinkings 
# Context
## Overview
通过预测解码(Predictive-Decoding)，将模型预测控制(MPC)**的长期规划能力嵌入LLM的自回归推理过程，解决其因短视性**导致的规划缺陷。

## 两种决策方式
![[Pasted image 20250422194601.png]]

## MDP与MPC
![[Pasted image 20250422194910.png]]
# Innovatio
# Background
# Related Work
# Theroy
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
