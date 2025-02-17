---
创建时间: 2024-十二月-31日  星期二, 4:04:57 下午
created: 2025-01-06T19:59
updated: ...
---
[[OMG]]
[[VAE-ELBO loss]][^1]

# Questions

- [?] 


# Answers
## Overall_Answers
### VAE:
$$L^V = -D_{KL}(q(z|x) \| p(z)) + \beta \cdot \mathbb{E}_{q(z|x)}(\log(p(x|z))).$$
隐空间z中采样，生成x $\Longrightarrow$ 参数为 $\theta$
z:单位高斯分布
q:把x和z对应 x $\Longrightarrow$ z     参数为$\phi$


### CVAE:
不是从z采样了，从z|y中采样
$$L^V = -D_{KL}(q(z|x,y) \| p(z|y)) + \mathbb{E}_{q(z|x,y)} (\log p(x|z, y))$$


知乎分析VAE:[^2]
[Site Unreachable](https://zhuanlan.zhihu.com/p/344546057)



---

### 使用场景

众所周知，VAE 和 CVAE 都是 **生成模型**。从字面上就能看出来，VAE 是纯粹的生成模型，也就是说不能控制它生成什么东西，而 CVAE 可以根据给定的标签进行生成。

比如说同样在手写数字 **MNIST** 数据集上，VAE 是乱来的，它生成的只能是根据单位高斯中采样的隐变量 $z$ 生成的东西。也就是说只能保证生成的是手写数字，但是不能保证生成的是多少。但是 CVAE 就接受输入标签，比如说可以用希望输入的数字作为标签，如果给定标签 6，那么 CVAE 可以生成各种各样的 **6666666**。

这个大概就是 VAE 和 CVAE 之间的区别。

---

## VAE_Answers


---
$p-\theta\;;q- \phi$

整个 VAE 是基于“概率模型”的，我们希望生成的是 $x \in X$，最直接的想法就是直接从 $P(X)$ 中采样。但是问题是我们并不知道 $P(X)$ 的分布是什么样的。所以我们退一步，从一个已知分布的 **隐空间** $Z$ 中进行采样，然后进行生成。生成器是一个神经网络，把它的参数记作 $\theta$。这里假设 $Z$ 服从 **单位高斯分布**：

$$P(X') = \int_Z P_\theta (X'|Z) P(Z)$$

我们需要保证，对于根据 $Z$ 生成出来的结果 $X'$，仍然服从分布 $P(X)$

这个其实很容易实现，对于一个采样出来的隐变量 $z_i$ 和它的对应输入 $x_i$，我们只需要==对生成模型的输出 $\hat{x}_i$ 和 $x_i$ 做 $L2$ Loss 就可以==。那么现在的问题是：

什么是L2 Loss?[^3]

````ad-help
### **什么是 L2 Loss？**

L2 Loss（也称为 **Mean Squared Error (MSE)** 或 **平方误差损失**）是机器学习和深度学习中最常用的回归损失函数之一。它通过计算预测值和目标值之间的平方误差来衡量模型的预测误差。

---

### **公式**

假设有 $n$ 个样本，预测值为 $\hat{y}_i$，真实值为 $y_i$，则 L2 Loss 定义为：

$$L_{2} = \frac{1}{n} \sum_{i=1}^{n} (\hat{y}_i - y_i)^2$$

### **公式解释**
1. **误差**：$(\hat{y}_i - y_i)$ 表示预测值和真实值之间的差距。
2. **平方**：平方操作可以放大大的误差，同时避免正负误差相互抵消。
3. **求和并取均值**：将所有样本的误差平方加总，并取平均值，表示整体误差。

---

### **特点**
1. **平滑性**：L2 Loss 对误差进行平方，使其具有平滑的导数性质，在优化时收敛较稳定。
2. **惩罚大误差**：由于平方项的存在，大的误差会被更严重地惩罚，因此 L2 Loss 更关注离群点。
3. **计算简单**：计算过程简单直观，且易于通过梯度下降优化。

---

### **应用场景**
- **回归问题**：用于衡量模型预测的连续值（如房价预测、气温预测）与真实值之间的偏差。
- **生成模型**：如 VAE 或 CVAE 中，用于衡量生成样本与目标样本之间的相似性。

---

### **优缺点**
#### **优点**：
- **数学性质良好**：平滑且连续，有助于模型的优化。
- **常用且直观**：适合大多数回归任务。

#### **缺点**：
- **对离群点敏感**：大误差被平方后会对损失值产生过大的影响，可能导致模型偏向于极端数据点。

---

总结：L2 Loss 是一种简单高效的损失函数，适合大多数回归和生成任务，但在异常值较多的场景中可能需要更鲁棒的损失函数（如 L1 Loss）。
`````


---

如何==把 $z_i$ 和 $x_i$ 进行配对==？？？
**对于训练集中数据 $x_i$，必须找到相应的 $z_i$，才能进行训练**

---

答案仍然是使用神经网络进行 **映射**。这里的映射有一个限制，就是我们之前的假设 $P(Z)$ 服从 $\mathcal{N}(0, 1)$。

对于每一个数据 $x_i$，我们都希望它能够找到对应的 $z_i$，也就是说我们==希望推断网络代表的分布 $q_\phi(Z|X)$ 去学习 $P(Z|X)$。==这里的学习方法，就是和 **变分推断** 有关。

---

$$L = \log p(x)$$

$$L = \sum_{z} q(z|x) \log p(x)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{p(z|x)} \right)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x) q(z|x)}{q(z|x) p(z|x)} \right)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{q(z|x)} \right) + \sum_{z} q(z|x) \log \left( \frac{q(z|x)}{p(z|x)} \right)$$

$$L = L^V + D_{\text{KL}}(q(z|x) \| p(z|x))$$

---

可以看出 $L$ 显然是一个定值，那么如果想要最小化第二项的 KL 散度，需要通过最大化 $L^V$ 来实现。

---
**其中：**

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{q(z|x)} \right)$$

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(x|z)p(z)}{q(z|x)} \right)$$

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(z)}{q(z|x)} \right) + \sum_{z} q(z|x) \log p(x|z)$$

$$L^V = -D_{\text{KL}}(q(z|x) \| p(z)) + \mathbb{E}_{q(z|x)}[\log p(x|z)]$$

--- 

我们的假设是 $P(Z)$ 服从标准高斯分布，$P(Z|X) = \mathcal{N}(Z|\mu(x), \sigma^2(x) \ast I)$ 服从高斯分布。推断网络的输出是 $\mu, \sigma$，因此可以利用高斯分布的 KL 散度的计算公式直接计算。后面一部分的损失求解需要用蒙特卡罗方法进行计算，但是这里我们可以用上文中说的 $L_2$ Loss 直接进行优化。

再次看这个计算 Loss 的公式，我们可以发现，第一项的 **KL 散度** 是用来保证隐变量 $Z$ 的总体是服从单位高斯分布的，后一项是保证生成器可以很好地从隐变量还原到数据。

需要注意的是，虽然 $Z$ 的总体是服从单位高斯分布的，但是分布 $P(Z|X)$ 只是普通的高斯分布。对于一个特定的训练数据 $x_i$，整个 Loss 函数会让它尽量向单位高斯靠拢，但是又同时需要它保证自己的特异性，是一个 trade-off。因此之后会出现 $\beta$-VAE。也就是说将 Loss 函数改成了：

$$L^V = -D_{KL}(q(z|x) \| p(z)) + \beta \cdot \mathbb{E}_{q(z|x)}(\log(p(x|z))).$$

其中的 $\beta$ 是一个超参数，可以调节模型的生成能力。

整个模型的精髓在于 **损失函数** 中的第一项里面的 KL 散度，引入了噪声，保证了模型的生成能力。

---


## CVAE_Answers

CVAE 中需要根据输入 $y$ 来进行输出。也就是说训练集中是数据对 $(x, y)$，$y$ 是输入，也就是 **condition**，$x$ 是我们期待的输出。在手写数字生成的例子中，$y$ 就是我想输出的数字，比如说 6；$x$ 就是最后输出的 6 的图片。

因此，我们采样的时候，不再是从 $P(Z)$ 中直接采样，而是从 $P(Z|Y)$ 中进行采样，因此假设变成了：
$$P(Z|Y) = \mathcal{N}(Z | \mu(Y), I)$$

相应的，整个损失函数变成了：
$$L^V = -D_{KL}(q(z|x,y) \| p(z|y)) + \mathbb{E}_{q(z|x,y)} (\log p(x|z, y))$$

条件 $y$ 要同时输入到 encoder 和 decoder 中。

这个改动还是很直观的，就是通过条件改变隐变量的均值，从而控制了隐变量采样的位置，控制最后的输出结果。

---

# Codes

### **注释总结**
代码注释涵盖了每个部分的功能和设计思路，方便理解：
1. **Encoder 和 Decoder 的功能**：分别负责特征提取和数据生成。
2. **重参数化技巧**：实现从隐变量分布中采样。
3. **损失函数**：平衡生成能力（

重构误差）和分布约束（KL 散度）的 trade-off。
4. **训练循环**：包含前向传播、损失计算、反向传播以及参数更新的流程。


## VAE

#### **模型定义**
```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class VAE(nn.Module):
    def __init__(self, input_dim, latent_dim):
        super(VAE, self).__init__()
        # Encoder部分：从输入数据中提取特征并映射到隐变量空间
        self.encoder = nn.Sequential(
            nn.Linear(input_dim, 128),  # 输入 -> 隐藏层 1
            nn.ReLU(),
            nn.Linear(128, 64),        # 隐藏层 1 -> 隐藏层 2
            nn.ReLU(),
        )
        # 隐变量的均值和方差网络
        self.mu_layer = nn.Linear(64, latent_dim)        # 输出均值 μ
        self.logvar_layer = nn.Linear(64, latent_dim)    # 输出对数方差 log(σ^2)

        # Decoder部分：从隐变量空间解码重构输入数据
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim, 64),  # 隐变量 -> 隐藏层 1
            nn.ReLU(),
            nn.Linear(64, 128),         # 隐藏层 1 -> 隐藏层 2
            nn.ReLU(),
            nn.Linear(128, input_dim),  # 隐藏层 2 -> 重构数据
            nn.Sigmoid(),  # 归一化输出，用于生成范围在[0,1]的数据
        )

    def encode(self, x):
        # 编码阶段：获取隐变量的均值和对数方差
        h = self.encoder(x)
        mu = self.mu_layer(h)
        logvar = self.logvar_layer(h)
        return mu, logvar

    def reparameterize(self, mu, logvar):
        # 重参数化技巧：使用均值和方差生成隐变量 z
        std = torch.exp(0.5 * logvar)  # 计算标准差 σ = exp(0.5 * log(σ^2))
        eps = torch.randn_like(std)    # 生成与标准差形状一致的随机噪声
        return mu + eps * std          # 生成隐变量 z = μ + ε * σ

    def decode(self, z):
        # 解码阶段：将隐变量映射回输入数据
        return self.decoder(z)

    def forward(self, x):
        # 前向传播：从输入到输出
        mu, logvar = self.encode(x)    # 编码获取均值和对数方差
        z = self.reparameterize(mu, logvar)  # 使用重参数化技巧生成隐变量
        recon_x = self.decode(z)       # 解码重构输入
        return recon_x, mu, logvar
```

---

#### **损失函数**
```python
def vae_loss(recon_x, x, mu, logvar, beta=1):
    # 重构损失：衡量重构数据 recon_x 与原始数据 x 的相似性
    recon_loss = F.mse_loss(recon_x, x, reduction='sum')  # 或 F.binary_cross_entropy
    # KL 散度损失：强制隐变量 z 的分布接近标准正态分布
    kl_divergence = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    # 总损失：重构损失 + KL 散度（权重由 beta 调节）
    return recon_loss + beta * kl_divergence
```

---

#### **训练代码**
```python
# 超参数
input_dim = 784  # 输入维度（以 MNIST 数据为例，每张图像为28x28像素）
latent_dim = 20  # 隐变量维度
lr = 1e-3        # 学习率
epochs = 10      # 训练轮数

# 数据加载和预处理
from torchvision import datasets, transforms
from torch.utils.data import DataLoader

# 将数据归一化并展平成一维
transform = transforms.Compose([transforms.ToTensor(), transforms.Lambda(lambda x: x.view(-1))])
dataset = datasets.MNIST('./data', train=True, download=True, transform=transform)
dataloader = DataLoader(dataset, batch_size=64, shuffle=True)

# 初始化模型和优化器
vae = VAE(input_dim, latent_dim).to("cuda")  # 使用 GPU
optimizer = torch.optim.Adam(vae.parameters(), lr=lr)  # Adam 优化器

# 开始训练
vae.train()  # 设置为训练模式
for epoch in range(epochs):
    total_loss = 0
    for x, _ in dataloader:  # 遍历训练数据
        x = x.to("cuda")  # 将数据传输到 GPU
        recon_x, mu, logvar = vae(x)  # 前向传播
        loss = vae_loss(recon_x, x, mu, logvar)  # 计算损失

        optimizer.zero_grad()  # 清空梯度
        loss.backward()        # 反向传播
        optimizer.step()       # 更新参数

        total_loss += loss.item()  # 累加损失
    print(f"Epoch {epoch + 1}, Loss: {total_loss / len(dataloader.dataset)}")
```

## CAVE

#### **模型定义**
```python
class CVAE(nn.Module):
    def __init__(self, input_dim, latent_dim, condition_dim):
        super(CVAE, self).__init__()
        # Encoder部分：结合输入和条件生成隐变量的均值和方差
        self.encoder = nn.Sequential(
            nn.Linear(input_dim + condition_dim, 128),  # 输入数据 + 条件
            nn.ReLU(),
            nn.Linear(128, 64),
            nn.ReLU(),
        )
        self.mu_layer = nn.Linear(64, latent_dim)        # 均值 μ
        self.logvar_layer = nn.Linear(64, latent_dim)    # 对数方差 log(σ^2)

        # Decoder部分：结合隐变量和条件生成数据
        self.decoder = nn.Sequential(
            nn.Linear(latent_dim + condition_dim, 64),  # 隐变量 + 条件
            nn.ReLU(),
            nn.Linear(64, 128),
            nn.ReLU(),
            nn.Linear(128, input_dim),
            nn.Sigmoid(),  # 归一化输出
        )

    def encode(self, x, y):
        # 编码阶段：将输入和条件拼接后获取隐变量分布
        h = self.encoder(torch.cat([x, y], dim=-1))
        mu = self.mu_layer(h)
        logvar = self.logvar_layer(h)
        return mu, logvar

    def reparameterize(self, mu, logvar):
        # 重参数化技巧
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        return mu + eps * std

    def decode(self, z, y):
        # 解码阶段：结合隐变量和条件生成重构数据
        return self.decoder(torch.cat([z, y], dim=-1))

    def forward(self, x, y):
        # 前向传播
        mu, logvar = self.encode(x, y)  # 编码
        z = self.reparameterize(mu, logvar)  # 重参数化
        recon_x = self.decode(z, y)  # 解码
        return recon_x, mu, logvar
```

---

#### **损失函数**
```python
def cvae_loss(recon_x, x, mu, logvar, beta=1):
    # CVAE 损失：重构损失 + KL 散度
    recon_loss = F.mse_loss(recon_x, x, reduction='sum')  # 重构误差
    kl_divergence = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())  # KL 散度
    return recon_loss + beta * kl_divergence
```

---

#### **训练代码**
```python
# 条件维度（MNIST 的数字类别）
condition_dim = 10  # 条件是数字 0-9 的 one-hot 编码

# 初始化 CVAE
cvae = CVAE(input_dim, latent_dim, condition_dim).to("cuda")
optimizer = torch.optim.Adam(cvae.parameters(), lr=lr)

# 训练 CVAE
cvae.train()
for epoch in range(epochs):
    total_loss = 0
    for x, labels in dataloader:
        x, labels = x.to("cuda"), labels.to("cuda")
        y = F.one_hot(labels, num_classes=10).float()  # 将标签转为 one-hot 编码

        recon_x, mu, logvar = cvae(x, y)  # 前向传播
        loss = cvae_loss(recon_x, x, mu, logvar)  # 计算损失

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()
    print(f"Epoch {epoch + 1}, Loss: {total_loss / len(dataloader.dataset)}")
```




# FootNotes

[^1]: 不一样的证明方式_Jensen不等式与直接展开
[^2]: 知乎分析VAE链接
[^3]: 介绍L2 Loss