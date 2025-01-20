---

mindmap-plugin: basic

---

# OMG

## 运行
- my_main(): main.py
    - run(_run, _config, _log): run.py
        - run_sequential(args, logger)
            - init runnner/r_REGISTRY[args.runner]
            - buffer = ReplayBuffer()
            - init controller/mac_REGISTRY[args.mac]
            - init learner/le_REGISTRY[args.learner]
            - learner.load_models(path)
            - **Start training**/runner.run()
            - buffer.insert_episode_batch(episode_batch)
            - episode_sample = buffer.sample(args.batch_size)
            - learner.train(episode_sample, runner.t_env, episode)