---
创建时间: 2024-十二月-6日  星期五, 3:36:29 下午
修改时间: 2024-十二月-16日  星期一, 3:54:30 下午
---
[[DiCE]] 

In general, the loss function that we care about cannot be optimized efficiently. For example, the 0-1 loss function is discontinuous. So, we consider another loss function that will make our life easier, which we call the surrogate loss function.

来自 <[https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function](https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function)>

An example of a surrogate loss function could be ψ(h(x))=max(1−h(x),0)(the so-called hinge loss in SVM), which is convex and easy to optimize using conventional methods.

来自 <[https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function](https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function)>