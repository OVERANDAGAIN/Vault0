#paper_summary 
Generative Agent Modeling for Multi-agent Adaptation (GAMMA)
# Inspiration

### Take-away Message （关键信息）

1. Generative model(VAE) for diverse strategy modeling —— robust  zero-shot coordination
2. Combining simulated and human data —— solve data scarcity and distribution shift
3. Human-adaptive sampling —— let generated strategies align closely with real-world human behaviors
4. limitations —— relies heavily on the quality and diversity of the training data
5. Human-adaptive sampling ——  reduces reliance on expensive human data



## Inspiration for Us （启发点）

1. Emphasizing strategy diversity in training can significantly improve coordination performance and robustness to novel agents or humans.
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


# FootNotes
