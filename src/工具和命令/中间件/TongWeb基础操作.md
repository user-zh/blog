---
title: TongWeb基础操作
order: 2
date: 2025-02-09
isOriginal: false
category:
  - 中间件
tags:
  - TongWeb
---

## TongWeb

Tongweb管理控制台地址：[http://localhost:9060/console/](http://localhost:9060/console/)

```plain
账号：thanos
密码：thanos123.com
```

### 启动命令

```plain
cd /data/TongWeb7.0/bin/
./startservernohup.sh
```

### 查看进程

```plain
ps -ef | grep TongWeb
```

```plain
ss -antpl | grep 9060
```

### 查看日志

```plain
tail -f /data/TongWeb7.0/logs/server.log
```

