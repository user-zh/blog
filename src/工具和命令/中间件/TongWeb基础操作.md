---
title: TongWeb基础操作
order: 4
date: 2025-02-09
isOriginal: false
category:
  - 中间件
tags:
  - TongWeb
---

## TongWeb

Tongweb管理控制台地址：[http://localhost:9060/console/](http://localhost:9060/console/)

::: code-tabs

@tab 默认账号密码

```shell
账号：thanos
密码：thanos123.com
```

@tab 启动命令

```shell
cd /home/TongWeb7.0/bin/
./startservernohup.sh
```

@tab 查看进程

```shell
ps -ef | grep TongWeb
ss -antpl | grep 9060
```

@tab 查看日志

```shell
tail -f /home/TongWeb7.0/logs/server.log
```

:::