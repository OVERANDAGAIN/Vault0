#log_git 

# Questions

```bash
.../Obsidian/Remote $ git pull origin main
fatal: 'origin' does not appear to be a git repository
fatal: Could not read from remote repository.

Please make sure you have the correct access rights
and the repository exists.
```

```bash
../Obsidian/Remote $ git remote -v
.../Obsidian/Remote $ git remote add origin https://github.com/OVERANDAGAIN/Vault0.git
.../Obsidian/Remote $ git remote -v               origin  https://github.com/OVERANDAGAIN/Vault0.git (fetch)
origin  https://github.com/OVERANDAGAIN/Vault0.git (push)
.../Obsidian/Remote $ git ls-remote origin
fatal: unable to access 'https://github.com/OVERANDAGAIN/Vault0.git/': Recv failure: Connection reset by peer
.../Obsidian/Remote $ git pull origin main        fatal: unable to access 'https://github.com/OVERANDAGAIN/Vault0.git/': Recv failure: Connection reset by peer
```

```bash
fatal: unable to access.git/': TLS connect error: error:00000000:lib(0)::reason(0)
```

# Answers
remote设置问题？网络问题？代理问题？权限问题？

## GPT_Answers


## Other_Answers


# Codes

```python

```