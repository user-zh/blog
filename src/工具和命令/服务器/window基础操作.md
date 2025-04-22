---
title: windows基础操作
order: 2
date: 2025-03-31
isOriginal: false
category:
  - 操作系统
tags:
  - windows
---

## 基础命令

### 复制文件夹

```plain
xcopy 原目录 目标目录 /T/E
```

### 查看端口（最后一个是pid）

```plain
netstat -ano|findstr 9092
```

### 杀死进程

```plain
taskkill -pid [pid] -f
```