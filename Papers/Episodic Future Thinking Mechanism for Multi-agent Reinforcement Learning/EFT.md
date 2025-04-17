---
created: 2024-12-18T20
updated: ...
创建时间: 2025-四月-17日  星期四, 3:41:18 下午
---
#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
1. 奖励函数的四个复合部分，其中包括 $r_{fail}$ 表示对无效动作的惩罚，其目的是为了在自动驾驶环境中==对 安全 的考虑==
# Focus
# Innovation
# Theroy
# Perspective
# Formulation ：Autonomous Driving

## observation

$$
o_{t,i} = \begin{bmatrix} v_{t,i},\ \Delta \mathbf{v}_{t,i},\ \Delta \mathbf{p}_{t,i},\ k_{t,i} \end{bmatrix}^{T}
$$
其中的 $\Delta v$ : 6 个其他观察者的信息

| o1  | o2      | o3  |
| --- | ------- | --- |
|     | Agent i |     |
| o4  | o5      | o6  |

## Action (混合动作空间)
连续动作空间：acceleration control
离散动作空间：lane change
## Reward
$$
R_{t,i} = c_{1} \mathcal{R}_{1} + c_{2} \mathcal{R}_{2} + c_{3} \mathcal{R}_{3} + r_{\text{fail}},

$$
$r_{fail}$ means a penalty for the unfeasible actions (i.e., trial to move a non-existence lane and a lane where other vehicles are located


# Background
# Related Work
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes
