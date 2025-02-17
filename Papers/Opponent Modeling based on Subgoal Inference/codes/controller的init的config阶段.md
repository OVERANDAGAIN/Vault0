---
创建时间: 2025-一月-21日  星期二, 10:13:17 上午
created: 2025-01-21T10:13
updated: 2025-02-17T22:22
---
[[omg_overall]]



# Codes/Questions

- [?] 4iql3qmix1iql_omg表示的是： 4 个 iql 智能体、3 个 qmix 智能体 和 1 个 iql_omg 智能体,如图中yaml配置所示。


```python
├── config/
│   └── default.yaml
│   ├── algs/
│   │   ├── coma.yaml
│   │   ├── iql.yaml
│   │   ├── iql_am.yaml
│   │   ├── iql_beta.yaml
│   │   ├── iql_idv.yaml
│   │   ├── iql_omg.yaml
│   │   ├── qmix.yaml
│   │   ├── qmix_beta.yaml
│   │   ├── qtran.yaml
│   │   ├── vdn.yaml
│   │   └── vdn_beta.yaml
│   └── envs/
│       ├── sc2.yaml
│       └── sc2_beta.yaml
```


# Answers

## Overall_Answers
根据 `iql_omg.yaml` 的配置文件来看，`4iql3qmix1iql_omg` 可能表示 **4 个 `iql` 智能体**、**3 个 `qmix` 智能体** 和 **1 个 `iql_omg` 智能体**

在 `iql_omg.yaml` 中，`iql_omg` 表示一个特定的智能体配置，它结合了 **`iql`** 和 **`omg`**，因此这个智能体既会使用 `iql` 算法，又会考虑对手建模。

在这种情况下，`4iql3qmix1iql_omg` 的含义应该是：
- 4 个使用 `iql` 算法的智能体。
- 3 个使用 `qmix` 算法的智能体。
- 1 个使用 `iql_omg` 算法的智能体，结合了 `iql` 和 `omg`，并在决策时考虑对手建模。
````ad-seealso
关于xx.yaml中关于对手建模的配置信息：
其中的==am_model决定了对手的建模信息==，none_am表示无，omg_am有
此外，base_am仅在iql_am中使用了
1. iql
	
```yaml
learner: "q_learner"
double_q: True
mixer: # Mixer becomes None
policy_model: "rnn"
am_model: "none_am"
name: "iql"
```
	
2. qmix
```yaml
   # use the Q_Learner to train
agent_output_type: "q"
learner: "q_learner"
double_q: True
mixer: "qmix"
mixing_embed_dim: 32
hypernet_layers: 2
hypernet_embed: 64
policy_model: "rnn"
am_model: "none_am"
```
3. iql_omg
```yaml
# use the Q_Learner to train
agent_output_type: "q"
learner: "q_learner"
double_q: True
mixer: # Mixer becomes None
policy_model: "rnn"
am_model: "omg_am"

```

````
因此，基于这个解释，在 `Multi_Module_MAC` 中，智能体的初始化将会根据每个算法配置来分别实例化不同的策略模型和对手建模模型。这意味着：
- **`iql` 智能体**：将使用 `iql` 策略模型，可能没有对手建模。
- **`qmix` 智能体**：将使用 `qmix` 策略模型，使用 Q-value 混合来做决策，没有对手建模。
- **`iql_omg` 智能体**：将使用 `iql` 策略模型，同时利用 `omg_am` 对手建模来推测其他智能体的潜在目标和策略。


## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
