---
title: nginx基础操作
order: 2
date: 2025-02-20
isOriginal: false
category:
  - 中间件
tags:
  - nginx
---

## 基础操作

### linux

linux基本上在window命令前面加上“./”即可

::: code-tabs

@tab 启动

```shell
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

@tab 杀死进程

```shell
pkill -9 nginx
```

:::

### windows

::: code-tabs
@tab 验证语法

```bash
nginx -t
```

@tab 查看版本号

```bash
nginx -V
```

@tab 启动Nginx

```bash
start nginx
```

@tab 停止Nginx

```bash
nginx -s stop
```

@tab 关闭Nginx

```bash
nginx -s quit
```

@tab 刷新配置

```bash
nginx -s reload
```

@tab 帮助信息

```bash
nginx -h
```

@tab 打开日志

```bash
nginx -s reopen
```

:::

## 配置说明

### root和alias区别

> root：请求的根目录
>
> alias：请求的虚拟目录
>
> 区别：root会加上location的路径，而alias不会

### nginx限制地址访问ip限制

::: code-tabs
@tab 屏蔽单个ip访问

```nginx
deny {ip};
```

@tab 允许单个ip访问

```nginx
allow {ip};
```

@tab 屏蔽所有ip访问

```nginx
deny all;
```

@tab 允许所有ip访问

```nginx
allow all;
```

@tab 屏蔽ip段访问

```nginx
deny {ip};
```

@tab 允许ip段访问

```nginx
allow {ip};
```

:::

### 负载均衡策略

| 参数           | 解释                                                                      |
|--------------|-------------------------------------------------------------------------|
| fail_timeout | 与max_fails结合使用。                                                         |
| max_fails    | 设置在fail_timeout参数设置的时间内最大失败次数，如果在这个时间内，所有针对该服务器的请求都失败了，那么认为该服务器会被认为是停机了 |
| fail_time    | 服务器会被认为停机的时间长度,默认为10s。                                                  |
| down         | 标记服务器永久停机了                                                              |
| backup       | 标记该服务器为备用服务器。当主服务器停止时，请求会被发送到它这里。                                       |

::: code-tabs

@tab 默认轮询

```nginx
upstream dynamic_server {
    server localhost:8080;
    server localhost:8081;
}
```

@tab 权重

```nginx
upstream dynamic_server {
    server localhost:8080 weight=3; ##权重表示访问比列
    server localhost:8081;  ## 默认是1
}
```

@tab ip

```nginx
upstream dynamic_server {
    ip_hash;
    server localhost:8080;
    server localhost:8081;
}
```

@tab 最少连接

```nginx
upstream dynamic_server {
    least_conn;
    server localhost:8080;
    server localhost:8081;
}
```

:::

## nginx离线安装

### 解压+编译

```shell
tar -zxvf nginx-1.24.0.tar.gz
```

```shell
cd ./nginx-1.24.0
```

```shell
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
```

```shell
make
```

```shell
./configure --prefix=/usr/local/nginx --conf-path=/usr/local/nginx/conf/nginx.conf
```

### 解决编译问题

```plain
yum -y install gcc openssl openssl-devel pcre-devel zlib zlib-devel
```

备份+迁移

```shell
mv /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.20230613old
```

```shell
cp /home/nginx-1.23.4/objs/nginx /usr/local/nginx/sbin/nginx
```

## 平滑升级

执行升级命令(在解压出的新版本的nginx源文件目录下执行)

```shell
make upgrade
```

```shell
mkdir /data/nginx/logs
```

```shell
ps -ef|grep nginx
```

```shell
pkill -9 nginx
```

```shell
ps -ef|grep nginx
```

```shell
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

```shell
ps -ef|grep nginx
```

