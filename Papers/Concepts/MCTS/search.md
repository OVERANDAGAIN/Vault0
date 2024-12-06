[https://www.moderndescartes.com/essays/deep_dive_mcts/](https://www.moderndescartes.com/essays/deep_dive_mcts/)

In 2016, AlphaGo leapfrogged the best MCTS AIs by replacing some heuristics with deep learning models,

and [AlphaGoZero](https://deepmind.com/blog/alphago-zero-learning-scratch/) in 2018 completely replaced all heuristics with learned models.

# AlphaGoZero

1. learn by repeatedly playing against itself
2. distill that experience back into the neural network

## to achieve Exploration and Exploitation: Upper Confidence Bounds
