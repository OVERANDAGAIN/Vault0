[[Alice in Differentiable Wonderland]]



We close with two additional observations that will be useful. First, we can write the sum of the elements of a vector as its dot product with a vector 1 composed entirely of ones:

$$
\langle x, 1 \rangle = \sum_{i=1}^{d} x_i
$$

Second, the distance between two vectors can also be written in terms of their dot products:

$$
\|x - y\|^2 = \langle x, x \rangle + \langle y, y \rangle - 2 \langle x, y \rangle
$$

The case $y = 0$ gives us $\|x\|^2 = \langle x, x \rangle$. Both equations can be useful when writing equations or in the code.

