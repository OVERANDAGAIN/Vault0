---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-3日  星期一, 10:59:44 上午
---
[[



# Codes/Questions

- [?] 

LOLA_policy

```python

    @override(Policy)
    def postprocess_trajectory(
        self, sample_batch, other_agent_batches=None, episode=None
    ):
        '''
        if self.train:
            all_buffer_full=True
            for name in self.player.opponent_model_name_list:
                total_time=other_agent_batches[name][1]['actions'].shape[0]
                self.memory_buffer[name][0].append(other_agent_batches[name][1]['obs'].copy())
                self.memory_buffer[name][1].append(other_agent_batches[name][1]['actions'].copy())
                self.memory_buffer_count[name]+=total_time
            
                if self.memory_buffer_count[name]<self.buffer_capacity:
                    all_buffer_full=False
            if all_buffer_full:
                print(self.memory_buffer_count)
                self.update()
        '''
        # if self.train:
        #     for name in self.player.opponent_model_name_list:
        #         sample_batch[f'obs_{name}']=other_agent_batches[name][1]['obs'].copy()
        #         sample_batch[f'actions_{name}']=other_agent_batches[name][1]['actions'].copy()
        print("🔹 sample_batch before processing:")
        print(sample_batch)

        print("🔹 other_agent_batches:")
        print(other_agent_batches)
        if self.train:
            for name in self.player.opponent_model_name_list:
                print(f"🔹 Processing opponent: {name}")

                # 打印每个对手的obs和actions
                print(f"🔹 obs_{name}:")
                print(other_agent_batches[name][1]['obs'])

                print(f"🔹 actions_{name}:")
                print(other_agent_batches[name][1]['actions'])

                sample_batch[f'obs_{name}'] = other_agent_batches[name][1]['obs'].copy()
                sample_batch[f'actions_{name}'] = other_agent_batches[name][1]['actions'].copy()
        print("🔹 sample_batch after processing:")
        print(sample_batch)
        return sample_batch

```


# Answers

## Overall_Answers
```bash
(RolloutWorker pid=585198) 🔹 sample_batch before processing:
(RolloutWorker pid=585198) SampleBatch(4: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
(RolloutWorker pid=585198) 🔹 other_agent_batches:
(RolloutWorker pid=585198) {'player_2': (LOLAPolicy, SampleBatch(2: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't']))}
(RolloutWorker pid=585198) 🔹 Processing opponent: player_2
(RolloutWorker pid=585198) 🔹 obs_player_2:
(RolloutWorker pid=585198) [[1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 1. 1. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
(RolloutWorker pid=585198)  [0. 1. 0. 1. 1. 0. 1. 1. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]]
(RolloutWorker pid=585198) 🔹 actions_player_2:
(RolloutWorker pid=585198) [0 6]
(RolloutWorker pid=585198) 🔹 sample_batch after processing:
(RolloutWorker pid=585198) SampleBatch(4: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't', 'obs_player_2', 'actions_player_2'])
(RolloutWorker pid=585198) 🔹 sample_batch before processing:
(RolloutWorker pid=585198) SampleBatch(2: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't'])
(RolloutWorker pid=585198) 🔹 other_agent_batches:
(RolloutWorker pid=585198) {'player_1': (LOLAPolicy, SampleBatch(4: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't', 'obs_player_2', 'actions_player_2']))}
(RolloutWorker pid=585198) 🔹 Processing opponent: player_1
(RolloutWorker pid=585198) 🔹 obs_player_1:
(RolloutWorker pid=585198) [[1. 1. 0. 1. 1. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 1. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
(RolloutWorker pid=585198)  [1. 1. 0. 1. 1. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
(RolloutWorker pid=585198)  [0. 1. 1. 1. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
(RolloutWorker pid=585198)  [0. 1. 1. 0. 1. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=585198)   0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1.
(RolloutWorker pid=585198)   0. 0. 1. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]]
(RolloutWorker pid=585198) 🔹 actions_player_1:
(RolloutWorker pid=585198) [0 0 3 6]
(RolloutWorker pid=585198) 🔹 sample_batch after processing:
(RolloutWorker pid=585198) SampleBatch(2: ['obs', 'new_obs', 'actions', 'prev_actions', 'rewards', 'prev_rewards', 'dones', 'infos', 'eps_id', 'unroll_id', 'agent_index', 't', 'obs_player_1', 'actions_player_1'])
```

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
