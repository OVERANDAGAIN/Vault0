---
创建时间: 2025-一月-7日  星期二, 2:32:15 下午
---
[[OMG]]



# Codes/Questions

- [?] 


```markdown
OMG/
├── components/
│   ├── __init__.py
│   ├── action_selectors.py
│   ├── episode_buffer.py
│   ├── epsilon_schedules.py
│   └── transforms.py
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
├── controllers/
│   ├── __init__.py
│   ├── basic_controller.py
│   └── om_controller.py
├── envs/
│   ├── __init__.py
│   └── multiagentenv.py
├── learners/
│   ├── __init__.py
│   ├── am_learner.py
│   ├── coma_learner.py
│   ├── omg_learner.py
│   ├── q_learner.py
│   ├── q_learner_4am.py
│   └── qtran_learner.py
├── modules/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── idv_rnn_agent.py
│   │   └── rnn_agent.py
│   ├── am/
│   │   ├── __init__.py
│   │   ├── base_am.py
│   │   ├── none_am.py
│   │   └── omg_am.py
│   ├── critics/
│   │   ├── __init__.py
│   │   └── coma.py
│   └── mixers/
│       ├── __init__.py
│       ├── qmix.py
│       ├── qtran.py
│       └── vdn.py
├── runners/
│   ├── __init__.py
│   ├── episode_runner.py
│   └── parallel_runner.py
├── utils/
│   ├── dict2namedtuple.py
│   ├── logging.py
│   ├── MY_EXP_PATH.py
│   ├── rl_utils.py
│   ├── timehelper.py
│   └── __init__.py
├── .gitignore
├── __init__.py
├── main.py
├── readme.md
├── requirements.txt
└── run.py
```

问题1：关于am[^2]
问题2：关于om[^3]
# Answers

OMG代码是在pymarl(SMAC环境)基础上实现的。

pymarl结构：
![[Pasted image 20250108110345.png|250]]



OMG 与pymarl相比： 
1. `config/algs` 下多了: `iql_am.yaml, iql_idv.yaml, iql_omg.yaml`这三个文件
2. `controllers` 下多了: `om_controller.py`
3. `learners` 下多了: `am_learner.py, omg_learner.py, q_learner_4am.py` 这三个文件
   
4. `module/agents` 下多了: i`dv_rnn_agent.py`
5. `module` 下多了一整个 am 文件夹，其中包括 `__init__.py, base_am.py, none_am.py, omg_am.py` 这四个文件
   
6. `utils` 下多了 `MY_EXP_PATH.py` 
7. `main.py` 内多了 `_get_other_config()` 这个函数
8. `run.py` 的 `run_sequential()` 内添加了关于 `MY_EXP_PATH.py` 的相关逻辑, 以及及其他若干处修改




## Overall_Answers



|                  | save_models()                                                                   | 备注                                                           |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| basic_controller | agent.th                                                                        |                                                              |
| om_controller    | agent.th<br>am.save_model()/agents_model.save_models()                          |                                                              |
|                  |                                                                                 |                                                              |
| am_learner       | am_model.save_models()                                                          | args.am_model                                                |
| omg_learner      | mac.save_models()<br>mac.agents_model[main_alg_idx].omg_save_models()<br>opt.th | 使用的是om_controller <br>$\Longrightarrow$ 因为使用了 `main_alg_idx` |
| q_learner        | mac.save_models()<br>mixer.th<br>opt.th                                         |                                                              |
| q_learner_4am    | mac.save_models()<br>mixer.th<br>opt.th                                         |                                                              |
|                  |                                                                                 |                                                              |
| base_am          | base_am.th                                                                      |                                                              |
| none_am          | pass                                                                            |                                                              |
| omg_am           | vae.th                                                                          |                                                              |
| omg_am           | cvae.th<br>cond_rnn.th<br>fc.th                                                 | omg_save_models()方法                                          |


```python 
    def _build_agents(self, scheme, groups, input_shape):
        self.agents = []
        self.agents_model = []
        for i, alg_args in enumerate(self.algs_args):
            self.agents.append(agent_REGISTRY[alg_args.policy_model](input_shape[i][0]+input_shape[i][1][1], self.algs_args[i]))###iql, qmix  and so on
            self.agents_model.append(am_REGISTRY[alg_args.am_model](scheme, groups, self.algs_args[i]))###omg_am, none_am and so on
```



### main.py
[[Sacred]][^1]

#### **调用关系**
1. 在 `main.py` 中，Sacred 的 `ex.run_commandline(params)` 会自动调用 `@ex.main` 装饰器注册的函数，即 `my_main`。
2. `my_main` 是整个实验的逻辑起点，负责加载配置和调用具体的训练流程。

1. **`params` 的来源**：
   - 来自命令行输入，通过 `sys.argv` 捕获。

2. **如何解析具体配置**：
   - 使用 `_get_config()` 解析 `--env-config` 和 `--config`，选择对应的 YAML 文件。
   - 使用 `_get_other_config()` 提取其他动态参数。

3. **如何调用**：
   - Sacred 的 `ex.run_commandline(params)` 会接收解析后的参数并启动实验流程，最终调用 `my_main`。
### run.py

以训练模式为例，`run.py` 的调用逻辑如下：

1. **主入口**：
   - 在 `main.py` 中，`my_main` 调用 `run(_run, _config, _log)`，启动训练流程。

2. **参数检查**：
   - 调用 `args_sanity_check`，确保配置参数合理性。

3. **初始化**：
   - 初始化 Runner、控制器（MAC）、Replay Buffer 和 Learner。

4. **训练循环**：
   - **与环境交互**：Runner 通过控制器与环境交互，生成 `episode_batch`。
   - **存储经验**：将 `episode_batch` 存储到 Replay Buffer。
   - **模型更新**：从 Replay Buffer 中采样，调用 Learner 的 `train()` 更新模型参数。
   - **定期测试**：调用 Runner 的 `run()`，在测试模式下评估模型。
   - **定期保存**：调用 Learner 的 `save_models()` 保存模型参数。

5. **结束训练**：
   - 关闭环境，清理资源。

### config/algs

三个配置文件之间的主要差异：

| 配置项              | **iql_am** | **iql_idv** | **iql_omg** |
| ---------------- | ---------- | ----------- | ----------- |
| **policy_model** | `rnn`      | `idv_rnn`   | `rnn`       |
| **am_model**     | `base_am`  | `none_am`   | `omg_am`    |
| **name**         | `"iql_am"` | `"iql_idv"` | `"iql_omg"` |

1. **`policy_model`（策略模型）**：
   - `rnn`：普通循环神经网络模型，适合 OMG 的主逻辑。
   - `idv_rnn`：可能是专门用于个体智能体的 RNN 模型，用于无对手建模的实验。
   - **差异影响**：不同策略模型适用于不同的实验设置。

2. **`am_model`（对手建模模块）**：
   - `base_am`：使用基础对手建模模块。
   - `none_am`：没有对手建模模块。
   - `omg_am`：使用 OMG 的核心对手建模模块，可能实现了 CVAE。
   - **差异影响**：直接决定是否进行对手建模以及子目标推理。

3. **`name`**：
   - 仅用于标识不同的配置文件。




### controllers/om_controller

在 OMG 算法运行时，`Multi_Module_MAC` 的调用逻辑如下：
1. **初始化阶段**：
   - 创建所有智能体和对手建模模块。
   - 动态解析算法组合配置。

2. **环境交互阶段**：
   - 每个时间步调用 `select_actions` 选择智能体的动作。
   - 动作选择依赖于智能体的输出（由 AM 提供子目标推理结果）。

3. **模型训练阶段**：
   - 调用 `main_alg_forward` 获取主算法智能体的输出。
   - AM 模块通过输入数据更新子目标推理模型。

4. **模型保存和加载**：
   - 定期保存或加载智能体和对手建模模块的参数。

5. **子目标嵌入**：
   - AM 的推理结果直接作为智能体输入的一部分，影响动作选择和模型更新。

`def _build_multi_mudule_config(self):`函数：（init)
1. **输入**：
   - `self.args.name`：算法组合名称，如 `4iql1iql_omg`。
   - `self.args.train_alg`：主算法名称。

2. **输出**：
   - `self.algs`：算法名称列表。
   - `self.agent_algs`：每个智能体对应的算法。
   - `self.algs_args`：每种算法的参数配置。
   - 主算法相关信息（`self.main_alg`、`self.main_alg_idx`、`self.main_alg_args`）。


### modules/agents
idv_rnn_agent 与 rnn_agent
**区别汇总**:

| 特性        | IDV_RNNAgent                  | RNNAgent        |
| --------- | ----------------------------- | --------------- |
| **网络层设计** | 每个智能体独立的网络（`fc1`、`rnn`、`fc2`） | 所有智能体共享网络层      |
| **参数共享**  | 不共享                           | 共享              |
| **前向传播**  | 独立计算每个智能体的输入、隐藏状态和 Q 值        | 同一网络层计算所有智能体的结果 |
| **适用场景**  | 个性化策略、多样性智能体环境                | 策略共享、同质性智能体环境   |





## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes

[^2]: am指的是什么
[^3]: om指的是什么
[^1]: 使用了sacred库来管理