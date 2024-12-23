#paper_summary 

[Site Unreachable](https://zhuanlan.zhihu.com/p/361648110)[^1]

# Inspiration



# Focus
这篇paper基于三个主要的想法：

1. 使用一个集中式critic网络，在训练的过程中可以获取所有智能体的信息；
2. 采用反事实基线（counterfactual baseline）来解决信用分配的问题； 
3. Critic网络要能够对反事实基线进行高效的计算。


# Innovation



# Theroy
1. 在协作任务下的多智能体系统中，奖励函数是全局共享的，所以只需要一个critic网络就可以了。但是那样的话，所有的智能体优化目标都是同一个。因此，对每个actor网络来说，从critic那边反向传播过来的误差都是一样的。这种“吃大锅饭”式的训练方式显然不是最有效的，因为每个actor网络对整体性能的贡献不一样，贡献大的反向传播的误差应该要稍微小些，贡献小的其反向传播误差应该要大一些。最终的目标都是优化整体的性能。所以，作者提出利用counterfactual baseline来解决该问题！


# Background



# Related Work




# Methodology



# Evaluation



# Results



# Limitations


# FootNotes

[^1]: 知乎相关的COMA论文解析