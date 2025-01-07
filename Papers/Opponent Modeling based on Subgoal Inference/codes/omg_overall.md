---
创建时间: 2025-一月-7日  星期二, 2:32:15 下午
---
[[OMG]]



# Codes/Questions

- [?] 


```markdown
OMG/
├── components/
│   ├── __init__.py
│   ├── action_selectors.py
│   ├── episode_buffer.py
│   ├── epsilon_schedules.py
│   └── transforms.py
├── config/
│   └── default.yaml
│   ├── algs/
│   │   ├── coma.yaml
│   │   ├── iql.yaml
│   │   ├── iql_am.yaml
│   │   ├── iql_beta.yaml
│   │   ├── iql_idv.yaml
│   │   ├── iql_omg.yaml
│   │   ├── qmix.yaml
│   │   ├── qmix_beta.yaml
│   │   ├── qtran.yaml
│   │   ├── vdn.yaml
│   │   └── vdn_beta.yaml
│   └── envs/
│       ├── sc2.yaml
│       └── sc2_beta.yaml
├── controllers/
│   ├── __init__.py
│   ├── basic_controller.py
│   └── om_controller.py
├── envs/
│   ├── __init__.py
│   └── multiagentenv.py
├── learners/
│   ├── __init__.py
│   ├── am_learner.py
│   ├── coma_learner.py
│   ├── omg_learner.py
│   ├── q_learner.py
│   ├── q_learner_4am.py
│   └── qtran_learner.py
├── modules/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── idv_rnn_agent.py
│   │   └── rnn_agent.py
│   ├── am/
│   │   ├── __init__.py
│   │   ├── base_am.py
│   │   ├── none_am.py
│   │   └── omg_am.py
│   ├── critics/
│   │   ├── __init__.py
│   │   └── coma.py
│   └── mixers/
│       ├── __init__.py
│       ├── qmix.py
│       ├── qtran.py
│       └── vdn.py
├── runners/
│   ├── __init__.py
│   ├── episode_runner.py
│   └── parallel_runner.py
├── utils/
│   ├── dict2namedtuple.py
│   ├── logging.py
│   ├── MY_EXP_PATH.py
│   ├── rl_utils.py
│   ├── timehelper.py
│   └── __init__.py
├── .gitignore
├── __init__.py
├── main.py
├── readme.md
├── requirements.txt
└── run.py
```


# Answers

## Overall_Answers
### main.py
[[Sacred]][^1]

## 1_Answers


## 2_Answers


## 3_Answers




# FootNotes

[^1]: 使用了sacred库来管理