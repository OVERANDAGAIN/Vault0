[[HOP_Overall]]



# Codes/Questions

- [?] 下面的 `policy_mapping_fn` 是如何起作用的？项目代码中没看到调用的地方


```python
    def policy_mapping(agent_id, episode, worker, **kwargs):
        if agent_id=='player_1':
            return 'ToM1'
        elif agent_id=='player_2':
            return 'ToM2'
        elif agent_id=='player_3':
            return 'ToM3'
        else:
            return 'ToM4'
    config['multiagent']['policy_mapping_fn']=policy_mapping
```


# Answers
>Here’s a loop that I ripped out from rollout that I use for post-processing the policies. I believe this loops mimics train’s internal logic.



```python
policy_agent_mapping = trainer.config['multiagent']['policy_mapping_fn']
for episode in range(100):
    print('Episode: {}'.format(episode))
    obs = sim.reset()
    done = {agent: False for agent in obs}
    while True: # Run until the episode ends
        # Get actions from policies
        joint_action = {}
        for agent_id, agent_obs in obs.items():
            if done[agent_id]: continue # Don't get actions for done agents
            policy_id = policy_agent_mapping(agent_id)
            action = trainer.compute_action(agent_obs, policy_id=policy_id)
            joint_action[agent_id] = action
        # Step the simulation
        obs, reward, done, info = sim.step(joint_action)
        if done['__all__']:
            break
```


## Overall_Answers


## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes
