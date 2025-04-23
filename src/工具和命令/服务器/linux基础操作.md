---
title: linux基础操作
order: 1
date: 2025-03-31
isOriginal: false
category:
  - 操作系统
tags:
  - Linux
---

## 基础命令

### 查询、开放、关闭端口

```shell
firewall-cmd --query-port=8080/tcp
```

```shell
firewall-cmd --permanent --add-port=80/tcp
```

```shell
firewall-cmd --permanent --remove-port=8080/tcp
```

```shell
firewall-cmd --reload
```

### 快捷方式

```shell
ln -s {source_file} {target_file}
```

### 查看监听端口

```shell
lsof -i:8080
```

```shell
netstat -anpt | grep 8080
```

### 授权
注意下面命令是最高权限（读、写、执行），-R表示目录下所有文件
```shell
chmod -R 777 /data
```

### 清缓存

```shell
sync; echo 3 > /proc/sys/vm/drop_caches
```

### 修改host

```shell
vi  /etc/hosts
```

### 定时改密码
将/etc/login.defs里面的PASS_MAX_DAYS 90，改成99999
```shell
vim /etc/login.defs
```

### 修改密码

```shell
passwd 用户
```

### 备份文件

```shell
cp -rf {source_file} {target_file}
```

### 新建文件

```shell
mkdir {target_file}
```

### 删除文件

```shell
rm -rf {target_file}
```

### 查看内存空间

```shell
df -h
```

## 防火墙

### 查看firewalld服务状态

```shell
systemctl status firewalld
```

### 开启、重启、关闭firewalld.service服务

```shell
service firewalld start
```

```shell
service firewalld restart
```

```shell
service firewalld stop
```

## 操作时间

### 查看服务器时间

```shell
date -s
```

### 修改日期和时间

```shell
date -s "20201021 18:30:50"
date -s "20201021"
date -s "18:30:50"
```

### 同步网络时间

```shell
yum install -y ntpdate //安装ntpdate
ntpdate us.pool.ntp.org //同步时间
hwclock --systohc //将系统时间同步到硬件
```

### 将时间修改为24小时制

```shell
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ntpdate us.pool.ntp.org //同步时间
hwclock --systohc //将系统时间同步到硬件
```

## cron定时任务

### ubuntu定时执行脚本命令

```shell
crontab -e
```

### 查看定时任务状态

```shell
service cron status
```

### 编辑定时任务脚本

```shell
vim /etc/crontab
```

### 启动服务

```shell
service cron start
```

### 关闭服务

```shell
service cron stop
```

### 重启服务

```shell
service cron restart
```

### 重新载入配置

```shell
service cron reload
```

## 关于环境变量问题

### 解决方案一

![](/posts/project/linux_crontab.png)

### 解决方案二

查看系统的环境变量

```shell
vim /etc/profile
```

```shell
export JAVA_HOME=/usr/local/jdk1.8.0_321
export JRE_HOME=${JAVA_HOME}
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

环境生效命令

```shell
source /etc/profile
```

```shell
java -version
```

