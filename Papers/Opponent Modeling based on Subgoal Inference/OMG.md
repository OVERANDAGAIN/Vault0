---
创建时间: 2024-十二月-30日  星期一, 3:15:27 下午
---
#paper_summary 

# Inspiration


## Take-away Message




## Inspiration for Us





# Focus
1. we propose ==opponent modeling== based on ==subgoal inference== using ==variational inference==, which infers the opponent’s subgoals through historical trajectories
2. design ==two  subgoal selection modes== for ==cooperative== games and ==general-sum== games respectively.


# Innovation



# Theroy
As subgoals are likely to be shared by different opponent policies, predicting subgoals can yield better generalization to unknown opponents.


# Background
1. Opponent modeling plays a crucial role in enhancing the robustness and stability of reinforcement learning


# Related Work
1. Variational auto-encoders can also be used to model the opponent’s policy
2. 



# Methodology
![[Pasted image 20250103145958.png]]


# Evaluation
1. In this paper, we consider the most common setting where ==opponents have unseen, diverse, but fixed policies== during test.
2. The historical trajectory is available
3. For convenience, the learning agent treats all other agents as a joint opponent with the joint action and reward.


# Results



# Limitations


# FootNotes
