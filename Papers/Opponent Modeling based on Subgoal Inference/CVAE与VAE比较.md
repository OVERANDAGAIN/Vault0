---
创建时间: 2024-十二月-31日  星期二, 4:04:57 下午
---
[[Opponent Modeling based on Subgoal Inference]]
[[VAE-ELBO loss]][^1]

# Questions

- [?] 


# Answers



知乎分析VAE:[^2]
[Site Unreachable](https://zhuanlan.zhihu.com/p/344546057)



## GPT_Answers

---

$$L = \log p(x)$$

$$L = \sum_{z} q(z|x) \log p(x)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{p(z|x)} \right)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x) q(z|x)}{q(z|x) p(z|x)} \right)$$

$$= \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{q(z|x)} \right) + \sum_{z} q(z|x) \log \left( \frac{q(z|x)}{p(z|x)} \right)$$

$$L = L^V + D_{\text{KL}}(q(z|x) \| p(z|x))$$

---

**其中：**

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(z, x)}{q(z|x)} \right)$$

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(x|z)p(z)}{q(z|x)} \right)$$

$$L^V = \sum_{z} q(z|x) \log \left( \frac{p(z)}{q(z|x)} \right) + \sum_{z} q(z|x) \log p(x|z)$$

$$L^V = -D_{\text{KL}}(q(z|x) \| p(z)) + \mathbb{E}_{q(z|x)}[\log p(x|z)]$$

--- 

完整公式如上展示，已与图片中内容一致。

## Other_Answers


# Codes

```python

```


# FootNotes

[^1]: 不一样的证明方式_Jensen不等式与直接展开
[^2]: 知乎分析VAE链接