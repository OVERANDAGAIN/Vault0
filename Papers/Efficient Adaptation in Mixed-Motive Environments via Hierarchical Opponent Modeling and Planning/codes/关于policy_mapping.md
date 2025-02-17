---
创建时间: 2025-二月-6日  星期四, 2:10:51 下午
created: 2025-02-06T14:10
updated: 2025-02-13-13.
---
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
回答来源： [Policy mapping for computing actions in multi agent env - RLlib - Ray](https://discuss.ray.io/t/policy-mapping-for-computing-actions-in-multi-agent-env/4489/6)[^1]

其他可能相关的回答： [I'm confused about how policy mapping works in configuration - RLlib - Ray](https://discuss.ray.io/t/im-confused-about-how-policy-mapping-works-in-configuration/7001/3)[^2]


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

[^1]: 网上的问答
[^2]: 可参考的其他问答