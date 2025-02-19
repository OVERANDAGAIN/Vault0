---
created: 2024-12-20T16
updated: ...
创建时间: 2025-二月-19日  星期三, 10:49:39 上午
---
[[双系统]]

# Questions

- [?] 无法在Lecoo显示屏中显示主板信息logo,进入BIOS，选择GRUB等操作，而是直接进入了桌面
- [ ] 并且在识图以上操作时，黑屏

```python

```

# Answers
参考：



```timeline
[line-3, body-3]
+ 开始阶段（失败）
+ 使用联想显示屏Lecoo， 接口 DP+HDMI
+ 进入bios方法：狂按 `F2` , 但是虽然进入了BIOS，显示屏黑屏
 >显示屏问题: 换一个旧显示屏

+ 换旧显示屏（部分成功）
+ 使用Philips显示屏， 接口DP转HDMI可以，纯HDMI不行**（未测试DP转换器的影响）**
+ DP下：按 `F2`可成功进入BIOS，并进行设置
 HDML下不行。
 >未知问题: 花很多时间排查

+ 迷茫期
+ 各处搜集信息
+  -  BIOS落后原因，需要刷机更新BIOS？
 - DisplayID原因。需要更新驱动等？
 - 显示屏的锅，无法解决？
 - 使用旧显示屏在成功进入BIOS时，把CSM兼容模式打开！！！
>**打开CSM兼容模式，即可**


+ 解决问题
+ 在进入BIOS时，打开CSM兼容模式即也可在Lecoo显示屏中显示主板信息logo,进入BIOS，选择GRUB等操作
+ 成功**（DP接口转HDMI情况下，还未测试纯HDMI接口）**
>关键是打开CSM模式（前提是在旧显示屏中进入BIOS后，才能设置这个模式）
```


# Codes

```python

```


# FootNotes
