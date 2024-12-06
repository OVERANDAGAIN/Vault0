In general, the loss function that we care about cannot be optimized efficiently. For example, the 0-1 loss function is discontinuous. So, we consider another loss function that will make our life easier, which we call the surrogate loss function.

来自 <[https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function](https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function)>

An example of a surrogate loss function could be ψ(h(x))=max(1−h(x),0)(the so-called hinge loss in SVM), which is convex and easy to optimize using conventional methods.

来自 <[https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function](https://stats.stackexchange.com/questions/263712/what-is-a-surrogate-loss-function)>