---
创建时间: 2025-三月-12日  星期三, 7:38:22 晚上
created: 2024-12-18T20
updated: ...
---
[[



# Codes/Questions

- [?] 在 OMG 代码中，`runner.run()` 和 `learner.train()`  的 `batch_size` 是不一样的：
	前者为 `batch_size` 

## run_sequential（）中的初始化batch_size 32\*8 = ==256== 
```python
def run_sequential(args, logger):
    # My_TASK customized setting
    if args.learner in ["q_learner_4am", "omg_learner"]:#, "omg_learner"]:
		args.t_max *= args.n_agents
        args.batch_size *= args.n_agents
```

## runner 里面的 init 为 batch_size_rnn = ==1== (并行数量)
```python

class EpisodeRunner:

    def __init__(self, args, logger):
        self.args = args
        self.logger = logger
        self.batch_size = self.args.batch_size_run
        assert self.batch_size == 1
    
```

## learner.train() 为 32\*8/8 =32 

omg_learner: 
```python
    def train(self, batch: EpisodeBatch, t_env: int, episode_num: int):
        # Get the relevant quantities
        batch_size = batch.batch_size // self.args.n_agents
        max_t = batch.max_seq_length
        batch = self._refine_batch(batch)

```

## buffer 创建为 32\*8 = 256 

```python 
    buffer = ReplayBuffer(scheme, groups, args.buffer_size, env_info["episode_limit"] + 1,
                          preprocess=preprocess,
                          device="cpu" if args.buffer_cpu_only else args.device)

```



# run_sequential 流程中的变化 while runner.t_env <= args.t_max: 

## run.py 8 次 batch_runs( `runner.run()` ) ,  buffer 中 insert 8 次
```python
  # Run for a whole episode at a time
        if args.learner in ["q_learner_4am", "omg_learner"]:
            batch_runs = args.n_agents
        else:
            batch_runs = 1
        for _ in range(batch_runs):
            episode_batch = runner.run(test_mode=False)
            if args.agent_shift:
                episode_batch.update({"agent_idx": [args.agent_shift]}, ts = 0)
            buffer.insert_episode_batch(episode_batch)
```

## can_sample() 时 ，即 > 256 

```python
       if buffer.can_sample(args.batch_size):
            episode_sample = buffer.sample(args.batch_size)

            # Truncate batch to only filled timesteps
            max_ep_t = episode_sample.max_t_filled()
            episode_sample = episode_sample[:, :max_ep_t]

            if episode_sample.device != args.device:
                episode_sample.to(args.device)

            learner.train(episode_sample, runner.t_env, episode)
```

### learner.train() 为 32\*8/8 =32 

omg_learner: 
```python
    def train(self, batch: EpisodeBatch, t_env: int, episode_num: int):
        # Get the relevant quantities
        batch_size = batch.batch_size // self.args.n_agents
        max_t = batch.max_seq_length
        batch = self._refine_batch(batch)

```

#### omg_loss_func() 传入32 大小的
```python
        # Calculate OMG loss
        omg_am = self.mac.agents_model[self.mac.main_alg_idx]
        eval_net = self.mac.agents[self.mac.main_alg_idx]
        omg_loss = omg_am.omg_loss_func(batch, eval_net, self.args.subgoal_mode)

```

#### 计算q-values 时 init_hidden

```python
 # Calculate estimated Q-Values
        mac_out = []
        self.mac.init_hidden(batch.batch_size)
```

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
