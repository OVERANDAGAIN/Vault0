[[HOP+]]


# Objectives
# Results
# Insights
# Setup
# Methodology
# Issues & Debugging

## Problem1
- [?] 在训练时的 `config`

### 1_Answers
train.py:
```python
    config['_disable_preprocessor_api']=False
    config['create_env_on_driver']=True
    config['framework']='torch'
    config['num_gpus']=0
    config['num_workers']=6
    config['num_envs_per_worker']=1
    config['rollout_fragment_length']=500
    config['gamma']=0.95
    config['train_batch_size']=3000
    config['sgd_minibatch_size']=1024
    config['num_sgd_iter']=15
    config['lr']=5e-4

```

`num_workers` * `rollout_fragment_length` = `train_batch_size`
$6*500=3000$




### 2_Answers

```python
  ToM_config={
        'discount_factor':0.995,
        'gamma':0.95,
        'my_id':1,
        'tree_num':5,
        'Q_temperature':2,
        'evaluation':False}
```

`tree_num` 设置为 $5$ 


## Problem2
- [?] 

### 1_Answers


### 2_Answers



# Limitations
# Future Work
# FootNotes