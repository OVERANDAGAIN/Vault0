---
创建时间: 2024-十二月-6日  星期五, 3:36:29 下午
created: 2024-12-18T20:35
updated: ...
---
[[DiCE]]
#REINFORCE

[What is Storchastic? — Storchastic 0.3.5 documentation](https://storchastic.readthedocs.io/en/latest/intro.informal.html)

![[Pasted image 20241206171622.png]]
![[Pasted image 20241206171632.png]]![[Pasted image 20241206171636.png]]![[Pasted image 20241206171640.png]]![[Pasted image 20241206171643.png]]The pathwise derivative/reparameterization![[Pasted image 20241206171653.png]]

move the sampling procedure outside of the computation path

- The first is that a reparameterization must exist for the distribution to sample from.  However, no (unbiased [3](https://storchastic.readthedocs.io/en/latest/intro.informal.html#f3) ) reparameterization exists for discrete distributions!

- Secondly, the pathwise derivative requires there to be a differentiable path from the sampling step to the output.

 When it is not applicable, we can turn to the score function
 ![[Pasted image 20241206171713.png]] the score function  works for non-differentiable functions f

having very high variance