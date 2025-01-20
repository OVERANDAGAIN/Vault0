---

mindmap-plugin: basic

---

# OMG

## 运行
- my_main(): main.py
    - run(_run, _config, _log): run.py
        - run_sequential(args, logger)
            - init runnner/r_REGISTRY[args.runner]
                - self.env = env_REGISTRY[self.args.env]: episode_runner.py
            - buffer = ReplayBuffer()
            - init controller/mac_REGISTRY[args.mac]
            - init learner/le_REGISTRY[args.learner]
            - learner.load_models(path)
            - **Start training**/runner.run()
                - self.reset(): episode_runner.py
                    - self.env.reset()
                - actions = self.mac.select_actions()
                    - agent_outputs = self.forward()
                        - agent_inputs = self._build_inputs(ep_batch, t)
                        - agent_outs[i], self.hidden_states[i] = agent(agent_inputs[i], self.hidden_states[i])
                    - chosen_actions = self.action_selector.select_action()
                - reward, terminated, env_info = self.env.step(actions[0])
                - self.batch.update()
            - buffer.insert_episode_batch(episode_batch)
            - episode_sample = buffer.sample(args.batch_size)
            - learner.train(episode_sample, runner.t_env, episode): omg_learner.py
                - Calculate OMG loss
                    - omg_am = self.mac.agents_model[self.mac.main_alg_idx]
                    - eval_net = self.mac.agents[self.mac.main_alg_idx]
                    - omg_loss = omg_am.omg_loss_func(batch, eval_net, self.args.subgoal_mode)
                        - train CVAE/
                        - recons_loss = F.mse_loss(cvae_output, cvae_input, reduction='none').mean(dim=-1)
                        - recons_loss = recons_loss * mask
                        - Calculate VAE subgoal & mu & log_var
                - Calculate estimated Q-Values
                    - agent_outs = self.mac.main_alg_forward(batch, t=t)
                    - mac_out.append(agent_outs)
                - Calculate the Q-Values necessary for the target
                    - target_agent_outs = self.target_mac.main_alg_forward(batch, t=t)
                    - target_mac_out.append(target_agent_outs)
                - Max over target Q-Values
                    - target_max_qvals = target_mac_out.max(dim=3)[0]
                - Calculate 1-step Q-Learning targets
                    - targets = rewards + self.args.gamma * (1 - terminated) * target_max_qvals
                - Td-error
                    - td_error = (chosen_action_qvals - targets.detach())
                - 0-out the targets that came from padded data
                    - masked_td_error = td_error * mask
                - Normal L2 loss, take mean over actual data
                - Optimise
                    - self.optimiser.zero_grad()
                    - loss.backward()
                    - self.optimiser.step()