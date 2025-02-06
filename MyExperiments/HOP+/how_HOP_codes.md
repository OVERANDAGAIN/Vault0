---

mindmap-plugin: basic

创建时间: 2025-一月-23日  星期四, 5:05:09 下午
---

# HOP

## 运行
- main(): train.py
    - ray.init()
    - register_env("StagHunt", ...): train.py
        - class StagHunt() : env.py
    - ModelCatalog.register_custom_model(): train.py
        - MyModel: mcts_model
        - RLmodel: gpu_deeper_mode
    - trainer = AlphaZeroTrainer(config): train.py
        - policy_mapping/ToM
            - 'ToM1':PolicySpec(AlphaZeroPolicyWrapperClass,...)
                - class AlphaZeroPolicyWrapperClass(AlphaZeroPolicy):
                    - class AlphaZeroPolicy(TorchPolicy): ToM_Alpha_MOA.py
        - __init__(): Alpha_Zero_MOA.py
            - 创建WorkerSet
            - 注册多策略配置
    - trainer.train(): Alpha_Zero_MOA.py
        - train(): trainable.py
            - step(): trainer.py
                - step_attempt(): trainer.py
        - Alpha_Zero_MOA.py  # 调用训练逻辑
            - execution_plan()  # 定义训练流程
                - rollouts.combine()  # 组合回合数据
                - ConcatBatches()  # 合并批次数据
                - TrainOneStep()  # 执行单步训练
            - 执行训练步骤  # 调用 TrainOneStep 更新策略和模型
        - WorkerSet.sample(): RLlib内部
            - RolloutWorker.sample(): RLlib内部
                - self.input_dict = obs_batch
                - compute_actions_from_input_dict(): ToM_Alpha_MOA.py
                    - self.env.set_state(): env.py
                    - self.mcts.compute_action(): mcts_moa.py
                        - Node.select() → expand() → backup(): mcts_moa.py
                            - self.model.compute_priors_and_value(): mcts_model.py
                            - self.env.step(): env.py
        - init():AlphaZeroPolicy(TorchPolicy): ToM_Alpha_MOA.py
            - 初始化mcts : **planning\mcts_moa()**
            - 新节点
        - learn_on_batch(): ToM_Alpha_MOA.py
            - self._loss(): ToM_Alpha_MOA.py
                - model.forward(): mcts_model.py
                - value_function(): mcts_model.py
        - postprocess_trajectory(): ToM_Alpha_MOA.py
            - moa_update(): ToM_Alpha_MOA.py
                - model.forward(): moa_model.py
                - optimizer.step(): ToM_Alpha_MOA.py
    - trainer.save(): Alpha_Zero_MOA.py