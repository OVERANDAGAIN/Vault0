[[OMG]]
[Opponent Modeling based on Sub-Goal Inference \| OpenReview](https://openreview.net/forum?id=l3s3HwJYDm)
# Questions

- [?] 
Predicting an opponent's short-term actions tends to provide limited information compared to understanding their long-term strategies.

# Answers
The ==subgoal's prior model==  is a VAE that learns from a set of states that are ==collected while training opponents.==

There is ==no subgoal selection process during execution phase== because the state at timestep $t+k$  cannot be obtained at timestep $t$. The ==subgoal selection process exists only during training phase== and uses the future state on the trajectories as prior about the subgoal.

During training, ==only the OMG agent's policy is trained,== and **the policies of the opponents are fixed**. 

Subgoal predictions $\hat{g}$ are made to assist OMG decision making and ==are made at every timestep.==

---


"==In essence, $f_\psi$ and $p_\psi$ are the same functions==. The subgoal probability uses a normal distribution, with $p_\psi(\bar{g} | s^g)$ describes the probability distribution of subgoals. ==The mapping from state $s^g$ to subgoal $\bar{g}$ is expressed as $\bar{g} = f_\psi(s^g)$.== This process involves encoding the state $s^g$ into the distribution and sampling from the distribution to derive $\bar{g}$. 


## GPT_Answers


## Other_Answers


# Codes

```python

```


# FootNotes
