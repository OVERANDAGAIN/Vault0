---
created: 2024-12-18T20
updated: ...
创建时间: 2025-三月-3日  星期一, 10:23:13 上午
---
[[HOP_Overall]]



# Codes/Questions

- [?] 


LOLA_policy: 

```python
我想查看inout_dict；obs_batch里面的内容    @override(Policy)
    def compute_actions_from_input_dict(
        self, input_dict, explore=None, timestep=None, episodes=None, state_batches=None, **kwargs
    ):
        #self.Q_temp=min(1+(7-1)*1e-6*timestep,7)
        with torch.no_grad():
            action_batch=[]
            new_state_batch=[]
            obs_batch=input_dict['obs']
            for n in range(len(obs_batch)):
                obs_flatten=obs_batch[n]
                time=episodes[n].length
                if state_batches == None:
                    if time==0:
                        state=self.get_initial_state()
                    else:
                        state=episodes[n].user_data[f'recurrent_state{self.my_id}'][-1]
                else:
                    state=np.array(state_batches)[:,n] 
                obs=obs_flatten[7:].reshape((self.world_height,self.world_width,self.player_num+3))
            
```

```bash
(RolloutWorker pid=576435) obs_batch: [[1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)   0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]]
(RolloutWorker pid=576435) obs_batch shape: (1, 87)
(RolloutWorker pid=576435) obs_batch first sample: [1. 1. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 1. 0. 0. 1. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0. 0.
(RolloutWorker pid=576435)  0. 0. 0. 0. 0. 0. 0. 0. 1. 0. 0. 0. 0. 0. 0.]
```
# Answers

## Overall_Answers


## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
