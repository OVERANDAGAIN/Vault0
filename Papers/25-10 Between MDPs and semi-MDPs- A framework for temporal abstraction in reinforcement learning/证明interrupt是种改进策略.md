[[25-10 Between MDPs and semi-MDPs-A framework for temporal abstraction in reinforcement learning]]



# 一、题设（条件）

1. 给定一个 MDP、状态集 $S$、折扣因子 $\gamma\in(0,1)$，以及一组 options
   $$
   o=(\mathcal I,\pi,\beta),\qquad \mathcal O={o}.
   $$
   其中 $\mathcal I$ 为启动集，$\pi(a|s)$ 为 option 内策略，$\beta(h)\in[0,1]$ 为（依赖历史 $h$ 的）终止函数。

2. 给定在 options 上的高层策略（主策略）
   $$
   \mu(o|s),\quad s\in S,\ o\in\mathcal O.
   $$

3. 从任一状态 $s$ 启动并执行 option $o$ 至终止，其“闭环一步”的期望回报—转移对定义为
   $$
   r_s^o,\qquad p_{ss'}^o.
   $$
   相应地，策略 $\mu$ 的值函数与 $Q$ 函数满足
   $$
   V^{\mu}(s) = \sum_{o}\mu(o|s)\Big[r_s^o+\sum_{s'}p_{ss'}^{o},V^{\mu}(s')\Big],
   $$
   $$
   Q^{\mu}(h,o)=\mathbb E\big[r+\gamma^{k}V^{\mu}(s')\ \big|\ \text{从历史 }h\text{ 执行 }o\text{ 至终止}\big],
   $$
   其中 $k$ 为该次执行的步数，$s'$ 为终止后的继续决策状态。

4. 由每个 $o$ 构造“可中断版” $o'=(\mathcal I,\pi,\beta')$：当历史末状态为 $s$ 且
   $$
   Q^{\mu}(h,o)<V^{\mu}(s)
   $$
   时，令
   $$
   \beta'(h)=1,
   $$
   否则 $\beta'(h)=\beta(h)$。记**中断历史集合**
   $$
   \Gamma={h:\ \beta(h)\neq \beta'(h),}.
   $$

5. 定义新策略 $\mu'$ 在“状态—option（一一对应）”层面与 $\mu$ 保持相同的选择分布：
   $$
   \mu'(o'|s)=\mu(o|s),\qquad \text{每个 }o\leftrightarrow o'.
   $$

---

# 二、欲证（结论）

1. 对任意 $s\in S$，
   $$
   V^{\mu'}(s)\ge V^{\mu}(s).
   $$

2. 若从某个 $s$ 出发以非零概率进入 $\Gamma$（确实会发生中断），则存在 $s$ 使
   $$
   V^{\mu'}(s)>V^{\mu}(s).
   $$

---

# 三、证明

## 步骤 1：确立“单步比较”目标

为得到 $V^{\mu'}\ge V^{\mu}$，先证明对任意 $s$、对应的一对 $o\leftrightarrow o'$ 有
$$
r_s^{o'}+\sum_{s'}p_{ss'}^{o'},V^{\mu'}(s')\ge r_s^{o}+\sum_{s'}p_{ss'}^{o},V^{\mu}(s')\qquad (\star)
$$
再结合 $\mu'(o'|s)=\mu(o|s)$ 做外层加权，即得
$$
\sum_{o'}\mu'(o'|s)\Big[r_s^{o'}+\sum_{s'}p_{ss'}^{o'}V^{\mu'}(s')\Big]\ge\sum_{o}\mu(o|s)\Big[r_s^{o}+\sum_{s'}p_{ss'}^{o}V^{\mu}(s')\Big],\qquad (\dagger)
$$
把 $(\dagger)$ 视为 Bellman 型不等式并迭代展开，可推出 $V^{\mu'}\ge V^{\mu}$若某处严格不等，则存在 $s$ 使 $V^{\mu'}(s)>V^{\mu}(s)$。

下文专注证明 $(\star)$。

---

## 步骤 2：将期望分解为“未中断/中断”两类历史

从 $s$ 执行 $o'$ 至终止（可能提前中断），记该次执行的累计奖励为 $r$，步数为 $k$，终止后状态为 $s'$，则
$$
r_s^{o'}+\sum_{s'}p_{ss'}^{o'},V^{\mu'}(s')=\mathbb E!\big[r+\gamma^{k}V^{\mu}(s')\ \big|\ \mathcal E(o',s)\big],
$$
其中 $\mathcal E(o',s)$ 表示“从 $s$ 执行 $o'$ 直至终止”，终止后按高层策略继续，因而接续值为 $V^{\mu}$。

按是否中断将条件期望拆分：
$$
\mathbb E[\cdot\mid \mathcal E(o',s)]
========

\mathbb E[\cdot\mid h\notin\Gamma]\mathbb P(h\notin\Gamma)
+\mathbb E[\cdot\mid h\in\Gamma]\mathbb P(h\in\Gamma).
$$

---

## 步骤 3：分别比较两类历史的期望

**(a) 未中断历史 $h\notin\Gamma$：**
此时 $o'$ 与 $o$ 的演化与终止一致，故
$$
\mathbb E!\big[r+\gamma^{k}V^{\mu}(s')\ \big|\ h\notin\Gamma\big]
=r_s^{o}+\sum_{s'}p_{ss'}^{o},V^{\mu}(s').
$$

**(b) 中断历史 $h\in\Gamma$：**
中断的触发条件定义为
$$
Q^{\mu}(h,o)<V^{\mu}(s),
$$
即“继续执行 $o$ 的期望”劣于“立即返回按 $\mu$ 再选”的期望。因此对这部分历史有
$$
\mathbb E!\big[r+\gamma^{k}V^{\mu}(s')\ \big|\ h\in\Gamma\big]
\ge
\mathbb E!\big[r+\gamma^{k}Q^{\mu}(h,o)\ \big|\ h\in\Gamma\big],
$$
且若 $\mathbb P(h\in\Gamma)>0$，上式严格不等号在集合上具正测度，从而带来**严格改进**。

---

## 步骤 4：合并两类历史并得到 $(\star)$

将 (a)(b) 两块按各自概率加权相加，得到
$$
r_s^{o'}+\sum_{s'}p_{ss'}^{o'},V^{\mu'}(s')
\ge
r_s^{o}+\sum_{s'}p_{ss'}^{o},V^{\mu}(s'),
$$
这正是目标不等式 $(\star)$若 $\mathbb P(h\in\Gamma)>0$，则存在严格提升。

---

## 步骤 5：外层加权与迭代，得全局结论

由定义 $\mu'(o'|s)=\mu(o|s)$ 对所有 $s$、$o\leftrightarrow o'$ 成立，对 $(\star)$ 进行外层加权即得 $(\dagger)$：
$$
\sum_{o'}\mu'(o'|s)\Big[r_s^{o'}+\sum_{s'}p_{ss'}^{o'}V^{\mu'}(s')\Big]\ge\sum_{o}\mu(o|s)\Big[r_s^{o}+\sum_{s'}p_{ss'}^{o}V^{\mu}(s')\Big].
$$
将其视作 Bellman 型递推不等式并迭代展开（或用不动点比较法），可知
$$
V^{\mu'}(s)\ge V^{\mu}(s)\qquad \forall s\in S,
$$
且若 $\mathbb P(h\in\Gamma)>0$，则存在 $s$ 使
$$
V^{\mu'}(s)>V^{\mu}(s).
$$

---

# 四、结论

* 在保持“同一状态下对 option 的选择分布不变”的前提下，仅通过“在 $Q^{\mu}(h,o)<V^{\mu}(s)$ 时提前终止”的**中断规则**，即可保证每个状态的单步 Bellman 更新不劣，从而全局上
  $$
  V^{\mu'}\ge V^{\mu},
  $$
  且中断以正概率发生时存在严格改进。
* 关键技巧：把执行期望拆分为“未中断/中断”两类历史，分别与原执行对齐（等式）与基于触发条件的改进（不等式），再外层加权、迭代推广。





