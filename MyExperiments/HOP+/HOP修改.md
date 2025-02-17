---
创建时间: 2025-一月-22日  星期三, 9:51:34 上午
created: 2025-01-22T09:51
updated: ...
---
 [[HOP+]]


# Objectives
# Results
# Insights
# Setup
# Methodology
# Issues & Debugging

## Problem1
- [?] pid=40900) 2025-01-22 02:00:05,005	WARNING deprecation.py:46 -- DeprecationWarning: `ray.rllib.utils.torch_ops.[...]` has been deprecated. Use `ray.rllib.utils.torch_utils.[...]` instead. This will raise an error in the future!

### 1_Answers


### 2_Answers



## Problem2
- [?] 环境过小导致分配不足的问题(可能由于连通性的检查，可用的实际摆放方法很少)
- [x]  增大环境，或减少障碍物，猎物数量等


```bash
  File "F:\HOP\msh_code\env.py", line 80, in reset
    prey_pos=np.random.choice(empty_grid_num,size=(self.stag_num+self.hare_num,),replace=False)
  File "mtrand.pyx", line 965, in numpy.random.mtrand.RandomState.choice
ValueError: Cannot take a larger sample than population when 'replace=False'
```

### 1_Answers
从提供的代码和配置中，导致错误的代码段在 `reset()` 方法中：

```python
#find empty grid
empty_grid=np.where(self.state[:,:,-3]==0)
empty_grid_num=len(empty_grid[0])

#add position of preys
prey_pos=np.random.choice(empty_grid_num, size=(self.stag_num+self.hare_num,), replace=False)
```

### 问题分析：
1. `empty_grid` 获取的是环境中未被占用的位置，其形状是 `(array([...]), array([...]))`，`empty_grid_num` 是未占用位置的数量。
2. `np.random.choice(empty_grid_num, size=(self.stag_num+self.hare_num,), replace=False)` 试图从 `empty_grid_num` 个元素中选择 `self.stag_num + self.hare_num` 个不同的位置。
3. 如果 `empty_grid_num < self.stag_num + self.hare_num`，将导致如下错误：
   ```
   ValueError: Cannot take a larger sample than population when 'replace=False'
   ```

### 问题原因：
- 配置中 `world_height=4` 和 `world_width=4`，即网格大小为 $4 \times 4 = 16$。
- 如果 `max_block_comp=5`，可能会创建多个障碍物，减少可用的网格数量。
- `stag_num=1` 和 `hare_num=4`，一共需要 5 个空位。
- 当障碍物填充的数量超过一定阈值时，导致可用空位不足，触发 `np.random.choice` 抽样错误。

### 可选改进方案：
1. **减少障碍物数量**
   在 `config['max_block_comp']` 中降低 `max_block_comp` 值，确保网格上有足够的空位。例如：

   ```python
   config['max_block_comp'] = 2  # 减少障碍物
   ```

2. **增加网格大小**
   如果必须保留相同数量的障碍物，可以增大 `world_height` 和 `world_width`，例如：

   ```python
   config['world_height'] = 8
   config['world_width'] = 8
   ```

3. **动态调整猎物数量**
   在 `reset()` 方法中动态减少 `self.stag_num` 和 `self.hare_num`，以适应可用的空格：

   ```python
   max_prey_count = min(empty_grid_num, self.stag_num + self.hare_num)
   prey_pos = np.random.choice(empty_grid_num, size=max_prey_count, replace=False)
   ```

### 2_Answers

在你提供的现有配置情况下，导致“分配不足”错误的原因主要是网格大小、障碍物数量以及猎物和玩家的数量之间的矛盾。让我们逐步分析为什么会出现这种情况：

---

### **1. 环境尺寸分析**
你的配置如下：

```python
"world_height": 4,
"world_width": 4,
```

- 这意味着环境是一个 $4 \times 4 = 16$ 单元的网格。
- 这 16 个网格需要容纳玩家、猎物以及障碍物。

---

### **2. 玩家、猎物和障碍物需求**
你的配置如下：

```python
"player_num": 2,   
"stag_num": 1,     
"hare_num": 4,     
"max_block_comp": 5, 
```

- 需要放置 **2** 名玩家。
- 需要放置 **1** 只鹿（`stag`）。
- 需要放置 **4** 只兔（`hare`）。
- 还需要放置最多 **5** 个障碍物块。

**合计需求**（理想情况下，没有障碍物的情况下）：  
$$2 + 1 + 4 = 7 \text{（玩家 + 猎物）}$$

**障碍物影响**：  
如果放置了 5 个障碍物，则剩余的空网格数量为：
$$16 - 5 = 11$$

在 11 个空位中，需要同时容纳 **7** 个位置，理论上可行。但存在以下问题：

---

### **3. 问题分析**
#### **(1) 障碍物可能分布不均**
障碍物的摆放是随机的，如果它们形成封闭区域或阻碍通行，可能会将部分网格隔离，从而减少可用的空格数量。`check_connectivity()` 方法尽管确保了连通性，但它可能导致可用区域缩小。

例如，如果障碍物布置如下：
```
.  .  #  #
.  #  .  .
.  #  .  .
.  .  .  .
```
这里，尽管网格总数足够，但某些区域被阻挡，无法用于放置猎物。

---

#### **(2) 随机生成索引问题**
代码中使用了以下随机抽样逻辑：

```python
empty_grid=np.where(self.state[:,:,-3]==0)
empty_grid_num=len(empty_grid[0])
prey_pos=np.random.choice(empty_grid_num, size=(self.stag_num+self.hare_num,), replace=False)
```

**问题发生的原因：**  
如果 `empty_grid_num` 的实际值 **小于** `self.stag_num + self.hare_num`（即 5），则 `np.random.choice` 会抛出错误，因为它无法从比需求数量更少的网格中进行“无放回”抽样。

**为什么可能小于需求数量？**  
1. 障碍物的布局可能过于集中，导致有效网格不足。
2. 玩家位置的随机选择可能已经占据了一些空位，使得剩余空间无法满足猎物放置需求。

### **5. 解决方案**
1. **增加环境大小**
   ```python
   "world_height": 6,
   "world_width": 6,
   ```
   这样会提供更多的空间，减少障碍物的影响。

2. **减少障碍物数量**
   ```python
   "max_block_comp": 3,
   ```
   降低障碍物的复杂性，确保有更多的可用空间。

3. **在代码中添加检查**
   在 `reset()` 方法中添加：

   ```python
   if empty_grid_num < (self.stag_num + self.hare_num):
       raise ValueError(f"Not enough empty spaces: {empty_grid_num} available, "
                        f"but {self.stag_num + self.hare_num} required.")
   ```

4. **调整猎物和玩家数量**
   - 如果环境不变，可以减少猎物数量，例如将 `hare_num=3` 以减少需求。

5. **调试障碍物生成**
   在 `block_build()` 函数中加入日志，检查是否某些模式导致过多的障碍物：

   ```python
   print(f"Attempting to place block {mode}, current blocks: {np.sum(self.state[:,:,-3])}")
   ```

---

### **总结**
在你的现有配置下，导致分配不足的核心原因可能是：

1. **网格尺寸较小（16格），障碍物占据了部分空位，导致空位不足。**
2. **随机分配障碍物的方式可能导致可用空位区域变得过小，或随机抽样冲突。**
3. **玩家的随机位置可能与猎物位置冲突，使得可分配网格数量不足。**

调整环境配置或增加调试手段可以解决这个问题。

# Limitations
# Future Work
# FootNotes