---
创建时间: 2025-三月-10日  星期一, 4:42:37 下午
created: 2025-01-07T15
updated: ...
---
[[Git]]

# Questions

- [?]  对于一个现有仓库，把代码 clone 下来（SSH方式可能更好，避免http方式出现的一些错误）, 并可以在本地 push pull 操作 。==注册ssh== 的过程


# Answers

## WIndows下SSH
参考CSDN ： [Git的配置、本地绑定Github及基本使用\_git绑定github-CSDN博客](https://blog.csdn.net/m0_56676311/article/details/135509261)[^1]
### 本机创建 密匙文件
在 `Git Bash` 中：

```bash
//1.输入以下命令不断回车
ssh-keygen -t rsa
```

```bash
//2.获取公钥
cat ~/.ssh/id_rsa.pub

```

### 复制公匙
![[Pasted image 20250310205059.png]]

### Github中配置 SSH
略


## Ubuntu 中 SSH 
CSDN教程： [Linux下Git安装、配置及使用\_在linux上安装git csdn-CSDN博客](https://blog.csdn.net/u012856866/article/details/125499320)[^2]
### 本机创建 密匙文件
在 `Git Bash` 中：
会在用户目录 `~/.ssh/` 下建立相应的密钥文件

```bash
//1.输入以下命令不断回车
ssh-keygen -C "xyz@gmail.com" -t rsa
```

先进入` ~/.ssh` 文件夹
```bash
cd ~/.ssh
```


输入 `gedit id_rsa.pub` 打开 `id_rsa.pub` 文件，复制其中所有内容
```bash
gedit id_rsa.pub
```

### Github中配置 SSH
略


## Other_Answers


# Codes

```python

```



# FootNotes

[^1]: Windows下配置SSH CSDN
[^2]: Ubuntu下配置SSH CSDN