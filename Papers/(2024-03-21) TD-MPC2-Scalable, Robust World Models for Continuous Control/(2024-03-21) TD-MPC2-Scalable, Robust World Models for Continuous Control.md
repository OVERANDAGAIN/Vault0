---
创建时间: 2025-十二月-22日  星期一, 5:56:19 下午
---
#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
## Q1:这里的p与moa的异同？
>The policy prior p serves to guide the sample-based trajectory **optimizer (planner)**, and to **reduce the computational cost of TD-learning**
![[Pasted image 20251222175705.png]]


![[Pasted image 20251222175750.png]]
1. 在上面的式子中，用于“决策”$\Longrightarrow$选出动作
2. 可以用作TD的计算中减少计算

## Q2:这里的trick?
>As the magnitude of rewards may differ drastically between tasks, TD-MPC2 formulates reward and value prediction as a discrete regression (multiclass classification) problem in a log-transformed space, which is optimized by minimizing crossentropy with rt, qt as soft targets



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
