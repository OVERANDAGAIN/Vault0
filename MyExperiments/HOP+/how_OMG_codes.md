---

mindmap-plugin: basic

---

# OMG

## 运行
- my_main(): main.py
    - run(_run, _config, _log): run.py
        - run_sequential(args, logger)
            - init runnner/r_REGISTRY[args.runner]
            - init controller/mac_REGISTRY[args.mac]
            - 新节点