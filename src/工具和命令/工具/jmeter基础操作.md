---
title: jmeter基础操作
order: 2
date: 2025-01-22
isOriginal: false
category:
  - 工具
tags:
  - jmeter
---

## 下载地址

[官方下载](https://jmeter.apache.org/download_jmeter.cgi)

## 基础操作

### 启动

解压后在bin目录下执行jmeter.bat

### 操作

1. 新建 Thread Group 配置 Number of Threads（用户线程数）和 Ramp-up period（启动时间）
2. 在 Thread Group 下新建 HttpRequest 配置请求的接口
3. 在 HttpRequest 下新建监听器 Aggregate Graph（统计情况，建议） 和 View Results Tree（响应情况，可选）