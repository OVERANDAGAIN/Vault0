---
创建时间: 2026-September-15th  Tuesday, 7:57:44 pm
---
改：现阶段插件自动验证git和obsidian。所以不需要进行下面的步骤
即使验证失败，只要添加一下用户邮箱和remote,大概也能连上，ssh都不用设置了


[Git的配置、本地绑定Github及基本使用-CSDN博客](https://blog.csdn.net/m0_56676311/article/details/135509261)


```
git config --global user.name "OverandAgain"
```

```
git config --global user.email "2510729767@qq.com"
```

test
```
ssh-keygen -t rsa
```

```
cat ~/.ssh/id_rsa.pub
```

验证：
```
ssh -T git@github.com
```

```
git remote add origin git@github.com:OVERANDAGAIN/Vault0.git
```