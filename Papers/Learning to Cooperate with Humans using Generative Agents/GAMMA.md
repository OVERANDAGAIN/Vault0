#paper_summary 
Generative Agent Modeling for Multi-agent Adaptation (GAMMA)
# Inspiration



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





# Evaluation



# Results



# Limitations


# FootNotes
