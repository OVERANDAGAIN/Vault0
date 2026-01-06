#paper_summary 

# Inspiration
## Take-away Message
## Inspiration for Us
# Focus
## RSSM
1. For planning, we need to evaluate thousands of action sequences at every time step of the agent. Therefore, we use a recurrent state-space model (RSSM) that can ==predict forward purely in latent space==
2. both ==stochastic and deterministic paths== in the transition model are crucial for successful planning
![[Pasted image 20260104123422.png]]
# Innovation
# Theroy
# Perspective
# Formulation
# Background
# Related Work
# Methodology

```ad-abstract
1. **初始化数据与模型**

* 用 $S$ 个随机策略 episode 收集初始数据集 $\mathcal{D}$
* 随机初始化世界模型参数 $\theta$（encoder + latent dynamics + decoder/reward）

2. **循环迭代：交替进行“模型拟合”与“数据采集”**（直到收敛）

* 核心就是：**用当前数据训练 world model → 用当前 world model 做规划收集新数据 → 回到训练**

3. **模块 A：Model fitting（世界模型训练）**

* 从数据集 $\mathcal{D}$ 随机采样 $B$ 段序列 chunk（长度 $L+k$）
* 计算训练损失 $\mathcal{L}(\theta)$（ELBO：重构/奖励项 + KL 正则；可带 overshooting）
* 用梯度下降更新 $\theta \leftarrow \theta - \alpha \nabla_{\theta}\mathcal{L}(\theta)$

> 对应的主要子模块：
> **Encoder / Inference** $q(s_t\mid o_{\le t},a_{<t})$；
> **Dynamics prior** $p(s_t\mid s_{t-1},a_{t-1})$；
> **Observation decoder** $p(o_t\mid s_t)$；
> **Reward model** $p(r_t\mid s_t)$

4. **模块 B：Data collection（用规划器与环境交互）**

* reset 环境得到 $o_1$
* 对每个时间步 $t$：

  * **状态估计**：用历史 $o_{\le t}, a_{<t}$ 推断当前 latent belief $q(s_t\mid o_{\le t},a_{<t})$
  * **规划决策**：调用 planner（Algorithm 2，CEM）在 latent 空间 rollout，选出动作 $a_t$
  * **探索噪声**：给 $a_t$ 加噪声 $\epsilon$（鼓励探索）
  * **动作重复**：执行同一动作 $R$ 次（action repeat），累积奖励并得到下一观测 $o_{t+1}$

5. **模块 C：数据回灌（Replay / Dataset update）**

* 把这一整条 episode 的 ${(o_t,a_t,r_t)}_{t=1}^{T}$ 加入数据集：$\mathcal{D} \leftarrow \mathcal{D}\cup \text{episode}$

* **Train world model on replay** → **Infer latent belief** → **Plan with CEM in latent** → **Act in env + explore** → **Store data** → repeat
```



# Evaluation
# Results
# Limitations
# FootNotes
