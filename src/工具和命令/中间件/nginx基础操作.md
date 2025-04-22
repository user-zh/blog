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

## linux基本操作
### 启动
```plain
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

### 重启
```plain
./nginx -s reload
```

### 杀死进程
```plain
pkill -9 nginx
```

## windows基本操作
### 验证nginx.conf配置文件是否有语法错误
```plain
nginx -t
```

### 查看版本号（注意大写，可以看到依赖版本
```plain
nginx -V
```

### 启动
```plain
start nginx
```

### 快速停止或关闭Nginx
```plain
nginx -s stop
```

### 正常停止或关闭Nginx
```plain
nginx -s quit
```

### 配置文件修改重装载命令
```plain
nginx -s reload
```

### 查看帮助信息
```plain
nginx -h
```

### 打开日志文件
```plain
nginx -s reopen
```

## 配置
### root和alias
> root：请求的根目录
>
> alias：请求的虚拟目录
>
> 区别：root会加上location的路径，而alias不会
>

### nginx限制地址访问ip限制
### 屏蔽单个ip访问和允许单个ip访问
```plain
deny 123.68.23.5;
```

```plain
allow 123.68.25.6;
```

### 屏蔽所有ip访问和允许所有ip访问
```plain
deny all;
```

```plain
allow all;
```

### 屏蔽ip段访问和允许ip段访问
```plain
deny 172.12.62.0/24;
```

```plain
allow 172.102.0.0/16;
```

24表示子网掩码:255.255.255.0

16表示子网掩码:255.255.0.0

8表示子网掩码:255.0.0.0

### 负载均衡策略
| 参数 | 解释 |
| --- | --- |
| fail_timeout | 与max_fails结合使用。 |
| max_fails | 设置在fail_timeout参数设置的时间内最大失败次数，如果在这个时间内，所有针对该服务器的请求都失败了，那么认为该服务器会被认为是停机了 |
| fail_time | 服务器会被认为停机的时间长度,默认为10s。 |
| down | 标记服务器永久停机了 |
| backup | 标记该服务器为备用服务器。当主服务器停止时，请求会被发送到它这里。 |


默认是轮询

```plain
upstream dynamic_server {
    server localhost:8080;
    server localhost:8081;
}
```

```plain
upstream dynamic_server {
    server localhost:8080 weight=3;##权重表示访问比列
    server localhost:8081;## 默认是1
}
```

```plain
upstream dynamic_server {
    ip_hash;
    server localhost:8080;
    server localhost:8081;
}
```

```plain
upstream dynamic_server {
    least_conn;
    server localhost:8080;
    server localhost:8081;
}
```

## nginx平滑升级
### 解压+编译
```plain
tar -zxvf nginx-1.24.0.tar.gz
```

```plain
cd ./nginx-1.24.0
```

```plain
./configure --prefix=/usr/local/nginx --with-http_stub_status_module --with-http_ssl_module
```

```plain
make
```

```plain
./configure --prefix=/usr/local/nginx --conf-path=/usr/local/nginx/conf/nginx.conf
```

### 解决编译问题
```plain
yum -y install gcc openssl openssl-devel pcre-devel zlib zlib-devel
```

### 备份+迁移
```plain
mv /usr/local/nginx/sbin/nginx /usr/local/nginx/sbin/nginx.20230613old
mv /data/nginx/sbin/nginx /data/nginx/sbin/nginx.20230517old
```

```plain
cp objs/nginx /usr/local/nginx/sbin/nginx
cp /data/nginx-bak/nginx-1.23.4/objs/nginx /data/nginx/sbin/nginx
```

### 升级
执行升级命令(在解压出的新版本的nginx源文件目录下执行)

```plain
make upgrade
```

```plain
mkdir /data/nginx/logs
```

```plain
ps -ef|grep nginx
```

```plain
pkill -9 nginx
```

```plain
ps -ef|grep nginx
```

```plain
/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
/data/nginx/sbin/nginx -c /data/nginx/conf/nginx.conf
```

```plain
ps -ef|grep nginx
```

