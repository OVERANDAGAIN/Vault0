---
创建时间: 2025-三月-17日  星期一, 7:36:42 晚上
created: 2025-01-15T12
updated: ...
---
[[HOP+]]


# Objectives
件描述 2025.3.17 ： 
[[2025-03-17]]


# Issues & Debugging
上面的这个呈现一定的周期变化，可不可能是因为每次都是从头开始训练的？也就是说我在训练的过程中，不仅需要 save_models，还需要load?比如下面的基于RLlib的代码：每次在 learn_on_batch里面才会寻训练保存vae: 

```python
   def learn_on_batch(self, samples):
        if (self.am_train):
           # train vae
            for name, model in self.player.opponent_model.items():
                state = torch.from_numpy(samples[f'obs_{name}'].copy()).float()
                # print("state.shape",state.shape )
                # print(state)

                action = F.one_hot(torch.from_numpy(samples[f'actions_{name}'].copy()), 7).float()
                for _ in range(self.moa_update_time):
                    for index in BatchSampler(SubsetRandomSampler(range(samples[f'actions_{name}'].shape[0])),
                                              self.moa_batch_size, False):
                        #vae train
                        start_index = 7 + self.player_num
                        state_dist = state[index][:, start_index:]  # 去掉前 mask and actions
                        # print(state_dist.shape)
                        recons_loss, kld_loss,total_loss=self.learner.train(state_dist)
                        self.recons_losses.append(recons_loss.item())
                        self.kld_losses.append(kld_loss.item())
                        self.total_losses.append(total_loss.item())

                        #moa train
                        action_dist = model.flatten_state_forward(state[index])
                        loss = -torch.sum(action[index] * torch.log(action_dist + 1e-30), dim=1).mean()
                        self.player.opponent_optimizer[name].zero_grad()
                        loss.backward()
                        self.player.opponent_optimizer[name].step()
                #save vae
                self.learner.save_models(self.save_dir)
                #save moa
                torch.save(model.state_dict(), self.save_dir + f'/{name}_in_{self.player.my_player_name}.pth')
           #policy train
            print(self.id)
            self.player.update()
            if self.should_plot_loss():
                self.plot_loss()  # 只在满足条件时绘图
```


## Problem1: 
- [?] 

### 1_Answers


### 2_Answers



## Problem2: 
- [?] 

### 1_Answers


### 2_Answers



# Limitations
# Future Work
# FootNotes