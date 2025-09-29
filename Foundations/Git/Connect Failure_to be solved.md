---
创建时间: 2024-十二月-9日  星期一, 6:19:27 晚上
修改时间: 2024-十二月-16日  星期一, 3:51:19 下午
created: 2024-12-18T20:35
updated: ...
---
[[Git]]
#to_be_solved---solved 
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
可能的解决：端口冲突
好的 👍，我帮你整理成一份笔记格式，方便以后回顾。

---

# 📑 GitHub SSH 端口 22 被封导致无法 `git pull/push` 的问题记录

## 1. **问题现象**

执行 `git pull` 时提示：

```
ssh: connect to host github.com port 22: Connection timed out
fatal: Could not read from remote repository.
```

即：连接 GitHub 的 22 端口超时，无法完成 SSH 认证。

---

## 2. **原因分析**

* GitHub 的 SSH 默认走 **22 端口**；
* 在公司/校园/酒店等网络环境下，**22 端口经常被屏蔽**（防止绕过代理）；
* 导致即使本地 SSH key 配置正确，也会连接超时。

---

## 3. **解决方案**

### 方案 A（改远程 URL，强制走 443）

直接把远程地址改为走 **ssh.github.com:443**：

```bash
git remote set-url origin ssh://git@ssh.github.com:443/OVERANDAGAIN/Vault0.git
```

之后 `git pull` / `git push` 会强制使用 443 端口，成功连通。

---

---

## 4. **排查要点**

1. 确认 `ssh -T -p 443 git@ssh.github.com` 能连通；
2. 确认 `~/.ssh/config` 在正确路径且编码为 UTF-8；
3. 确认远程 URL 写对（不要用 `USERNAME/REPO.git` 占位符）。

---

## 5. **结论**

* **根因**：22 端口被封。
* **最终解决**：将远程 URL 改为 443 端口版本即可。
* **收获**：以后遇到类似超时问题，第一时间检查是否端口被阻塞，再考虑配置或权限问题。

---

要不要我帮你再补一张 **小流程图**，展示从报错 → 排查 → 解决的过程？这样放在笔记里会更直观。


## Other_Answers


# Codes

```python

```
