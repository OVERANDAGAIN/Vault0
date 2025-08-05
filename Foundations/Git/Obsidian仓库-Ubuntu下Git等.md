---
created: 2025-01-07T15
updated: ...
创建时间: 2025-二月-19日  星期三, 4:35:37 下午
---
[[Git]]

# Questions

- [?] 


# Answers
仓库地址： 

```
git@github.com:OVERANDAGAIN/Vault0.git
```

在Ubuntu上安装配置Git  - CSDN教程：  [Linux下Git安装、配置及使用\_在linux上安装git csdn-CSDN博客](https://blog.csdn.net/u012856866/article/details/125499320)[^1]

## 一些问题
### push时需要输入名字和密码
stackoverflow参考： [github - Git push requires username and password - Stack Overflow](https://stackoverflow.com/questions/6565357/git-push-requires-username-and-password)[^2]
>不要使用html地址，==使用ssh仓库地址==

```ad-danger
需要使用ssh地址，不能使用html的，不然还可能以下报错

remote: Support for password authentication was removed on August 13, 2021. remote: Please see https://docs.github.com/get-started/getting-started-with-git/about-remote-repositories#cloning-with-https-urls for information on currently recommended modes of authentication.
```

在之前 `remote` 为html情况下，直接 `git remote add` 会出现问题，以下是解决方法：
````ad-tip
报错 `error: remote origin already exists.` 的意思是你的 Git 仓库已经存在一个名为 `origin` 的远程仓库。为了解决这个问题，你可以通过以下两种方法来更新远程仓库 URL：

### 方法 1：修改现有的远程仓库 URL
如果你已经有一个远程仓库，且只想将它的 URL 更改为 SSH，可以使用 `git remote set-url` 命令：

```bash
git remote set-url origin git@github.com:OVERANDAGAIN/vmomg.git
```

这条命令会将远程仓库的 URL 从原来的 HTTP 或者其他 SSH URL 改为你指定的 SSH 地址。

### 方法 2：删除并重新添加远程仓库
如果你希望删除现有的远程仓库然后重新添加，你可以先删除它，再重新添加：

1. 删除现有的远程仓库：
   ```bash
   git remote remove origin
   ```

2. 重新添加 SSH 的远程仓库：
   ```bash
   git remote add origin git@github.com:OVERANDAGAIN/vmomg.git
   ```

完成后，重新推送：

```bash
git push -u origin master
```

或者，如果你使用的是 `main` 分支：

```bash
git push -u origin main
```

这两种方法都能解决你遇到的问题，选择其中一种就可以了！
````


### 由于fingerprint等原因导致无法push
github的discuss解答： [Cannot push files because key fingerprint doesn't match my saved SSH key · community · Discussion #48086 · GitHub](https://github.com/orgs/community/discussions/48086)[^3]
>选择yes即可


## GPT_Answers


## DS_Answers


## Other_Answers


# Codes

```python

```



# FootNotes

[^1]: Ubuntu下配置git教程
[^2]: 关于push时需要输入名字和密码
[^3]: 关于fingerprint而无法push