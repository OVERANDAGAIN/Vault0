[[OMG]]
[Opponent Modeling based on Sub-Goal Inference \| OpenReview](https://openreview.net/forum?id=l3s3HwJYDm)
# Questions

- [?] 


# Answers
The subgoal's prior model  is a VAE that learns from a set of states that are collected while training opponents.

There is ==no subgoal selection process during execution phase== because the state at timestep $t+k$  cannot be obtained at timestep $t$. The ==subgoal selection process exists only during training phase== and uses the future state on the trajectories as prior about the subgoal.

During training, only the OMG agent's policy is trained, and the policies of the opponents are fixed. 


## GPT_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
