---
创建时间: 2024-十二月-23日  星期一, 11:12:13 上午
---
#paper_summary 
Generative Agent Modeling for Multi-agent Adaptation (GAMMA)
# Inspiration

## Take-away Message

1. Generative model(VAE) for diverse strategy modeling —— robust  zero-shot coordination
2. Combining simulated and human data —— solve data scarcity and distribution shift
3. Human-adaptive sampling —— let generated strategies align closely with real-world human behaviors ——  reduce reliance on expensive human data
4. limitations —— rely heavily on the quality and diversity of the training data



## Inspiration for Us

1. Emphasizing strategy diversity in training —— improve coordination performance and robustness to novel agents or humans.
2. Efficient use of limited human data（Methods like human-adaptive sampling)
3. Generative modeling as a tool


# Focus
the dual problems 
1) human-only data being expensive, 
2) synthetic-only data lacking coverage over human behaviors.


# Innovation
1. GAMMA, a novel approach for learning a generative model of partner strategies which can be trained on data from humans or a simulated population of agents
2. a data-efficient and human-adaptive sampling technique to steer the model to generate more human-like partners, even with limited amounts of human data
3. We find that contrary to past published results, training on human data is highly effective in our human evaluation, especially for the new, more complex layout we propose.


# Theroy



# Background



# Related Work
[[#Focus]] $\Longrightarrow$ To tackle these challenges, a popular approach to **solving the distribution shift problem in human-AI cooperation** has become ==training a Cooperator agent against a population of simulated agents rather than just itself(e.g. self-play)==





# Methodology

1. Learning Generative Models of Partner Behavior
![[Pasted image 20241224103322.png]]

![[Pasted image 20241224103526.png]]

```ad-success
while simulated behavior may not cover the space by itself, the generative model has significantly greater coverage over the strategy space.

```

2.  Training a Cooperator with Generative Coordination Models
![[Pasted image 20241224105209.png]]

3. Targeted GAMMA using Human-Adaptive Sampling and Fine-tuning
>it is useful to target model adaptation to be human-specific rather than to span the entire space of potentially irrelevant synthetic strategies (as shown in Figure 1).


# Evaluation



# Results



# Limitations

### **关于实验设计的问题**
4. **实验评价的客观性**  
   - 人类主观评价结果表明GAMMA生成的智能体更符合人类期望。然而主观评价是否可能存在偏差，例如用户偏好某种特定行为？是否需要更多样化的人群样本以验证主观评价的广泛适用性？

5. **复杂任务场景的适应性**  
   - 在Multi-Strategy Counter布局中，论文提到由于CoMeDi生成的数据不足以覆盖复杂的策略空间，导致GAMMA表现不佳。如果任务的复杂性进一步提升，例如需要多步骤的协同决策（如分配角色+协调行为），是否会放大这种缺陷？

6. **对抗性环境的表现**  
   - 实验集中在合作场景中。如果在部分对抗性环境（如部分参与者非理性或恶意行为）中，GAMMA的生成模型是否能够避免生成容易被剥削的策略？

---

8. **长期合作中的动态适应**  
   - GAMMA聚焦于零样本合作，强调短期合作适应能力。在长期合作中（如逐步建立更深的信任或合作规则），是否需要引入额外的动态适应模块或社会行为建模？

### **关于实验中的人类数据**
5. **人类数据的来源与代表性**  
   - 论文中提到的人类数据来自有限的轨迹样本。实验中是否考虑了不同技能水平的人类玩家（如新手和熟练者）对数据多样性的影响？

7. **潜在变量的解释性**  
   - 实验中的潜在空间是否清晰地反映了人类行为的关键特征（如速度、策略选择等）？分享者如何评价这些潜在变量与人类行为的对应关系？

---

### **关于实验评价指标**
11. **人类主观评价的局限性**  
    - 实验通过人类主观评价收集对智能体合作能力的反馈。分享者是否认为这些主观评价足够客观和全面？是否有其他更可靠的评价方法可以补充？

# FootNotes
