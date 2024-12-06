[https://zhuanlan.zhihu.com/p/53948964](https://zhuanlan.zhihu.com/p/53948964)

[https://aijishu.com/a/1060000000089474](https://aijishu.com/a/1060000000089474)



三. MCTS的工作原理

MCTS使用一个tree来记录搜索结果，它更新tree的方法就是模拟游戏。就像人类在下棋时会在大脑中模拟对手的着法，厉害的甚至计算10步、20步以后，MCTS也是类似的原理。它先模拟几次游戏，然后把游戏结果记录在tree中，再根据最好的模拟结果选择最佳的动作。

MCTS一共包含4个步骤：选择（Selection）、扩展（Expansion）、模拟（Simulation）、反向传播（BackPropagation）。

1. 选择（Selection）是从根节点开始，连续选择子节点，一直到达某个叶子节点，然后在那个节点上进行更新。也就是说，select时只会选leaf node（叶子节点）。

注意：根节点是当前的游戏状态，叶节点是尚未启动模拟的任何潜在子节点。

1. 扩展（Expansion）也叫expand，是指一个节点往下，产生新的子节点。
2. 模拟（Simulation）也叫rollout，是随机模拟，即以目前的状态开始，模拟一场游戏直到结束。有时也叫播放或推出。

expand和rollout区别是，如果目前节点是全新的，就进行rollout，如果节点已经被更新过，就进行expand。（这种说法可能不准确！）

1. 反向传播（BackPropagation）就是把leaf node的更新一直往上传，直到根节点。有点类似神经网络的BP，但更简单，不涉及微积分。