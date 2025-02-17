---
创建时间: 2025-二月-6日  星期四, 4:49:36 下午
created: 2025-02-06T16:49
updated: 2025-02-06-17.
---
#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
Theory of mind (ToM) broadly refers to humans’ ability to represent the mental states of others, including their desires, beliefs, and intentions. 
We design a Theory of Mind neural network a ToMnet – which uses ==meta-learning== to build such models of the agents it encounters.

# Innovation
# Theroy
1. A prominent argument from cognitive psychology is that our social reasoning instead relies on high-level models of other agents —— such as their desires and beliefs. $\Longrightarrow$ This ability is typically described as our Theory of Mind
2. our ultimate human understanding of other agents is not measured by a correspondence between our models and the mechanistic ground truth, but instead by how much they enable prediction and planning.
3. 
# Perspective
# Background
## About meta-learning
We formulate a task for an observer, who, in each episode, gets access to a set of behavioural traces of a novel agent, and must make predictions about the agent’s future behaviour. Over training, the observer should get better at rapidly forming predictions about new agents from limited data. This “learning to learn” about new agents is what we mean by meta-learning.

# Related Work
# Methodology
**general** theory of mind – the learned weights of the network, which encapsulate predictions about the ==common behaviour== of all agents in the training set
**agent-specific theory of mind** – the “agent embedding” formed from observations about a single agent at test time, which encapsulates what makes this agent’s ==character and mental state distinct from others==’. 
These correspond to **a prior and posterior** over agent behaviour.



# Evaluation
# Results
# Limitations
# FootNotes
