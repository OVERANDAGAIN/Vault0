---
创建时间: 2025-十一月-11日  星期二, 1:15:42 凌晨
---
#meeting 

**Reporter:**  me


# Inspiration
# Probelms or Thinkings 
# Context

## 可解释性1



## 大模型可解释性
[7月11日-分享会-大模型的可解释性-阿里云专家 #沈旭\_哔哩哔哩\_bilibili](https://www.bilibili.com/video/BV17Bu7zXE5B/?spm_id_from=333.1365.top_right_bar_window_default_collection.content.click&vd_source=6c33cf6826337aad387874b66413aa72)[^1]
### 要点：
1. 例子1：关于大模型如何计算加法 $\Longrightarrow$ 可能与人类不同，大模型先计算高位？视频0:07:17
2. how llm recall knowledge $\Longrightarrow$ mlp的ranking部分搞错了？llm可能不是不知道，而是不会处理? 



## 关于矿工目标检测

[BIMSA Videos](https://bimsa.net/bimsavideo.html?id=32767.mp4)[^2]

转文字：[[矿工转文字]]
### M
1. 
> **在这个应用场景中，靠监督学习做定位是不现实的。**
> 因为标注 bounding box 的成本太高，不可规模推广。

2. 
所以如果直接使用经典 KDE（Kernel Density Estimation，核密度估计）：

* **效果不够平滑**（噪点多）
* **方差很大**（容易误检）
* **对每个像素独立计算成本会非常高**

这就是我们提出新方法的动机。

3. 

* **DS 在准确性上远优于传统 KDE**
* 但 **计算成本极高 → 无法直接用于监控系统**

> 能不能保留双重平滑的统计优越性，但让它“算得起”？
> ——也就是 **在不损失密度估计质量的前提下，大幅降低计算量**？

---

### C
1. 
> **能否完全不标 bounding box，就实现自动定位？**
> → 即 **无监督定位（Unsupervised Localization）**

2. 
DS方法： 
> **不仅在像素值域上做核平滑（第一次平滑），还在空间域对像素位置之间做第二次平滑。**

换句话说：

* **相邻像素的密度分布结构是相似的**，我们应该利用这一点；
* **再在空间上对密度估计本身做平滑**，就可以显著降低方差、提升鲁棒性。

| 问题                    | DS 的解决思路            |
| --------------------- | ------------------- |
| 单像素 KDE 过于噪声 → 分布估计不稳 | **空间平滑**利用邻域信息，减少方差 |
| 每个像素独立估计 → 计算量过大      | **邻域共享结构**允许减少重复估计  |

3. 
那么 **网格点近似（GPA）** 解决的是：

> **如何把这个方法变成真实可部署的系统**



---



### E



## 其他poster




# Innovation
# Background
# Related Work
# Theroy
# Methodology
# Evaluation
# Results
# Limitations
# FootNotes

[^1]: b斩关于沈旭大模型可解释性的视频，与mla会上内容基本一致
[^2]: 关于矿工目标检测的视频，与mla会上内容基本一致