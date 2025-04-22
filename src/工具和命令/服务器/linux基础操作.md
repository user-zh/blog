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

```plain
firewall-cmd --query-port=8080/tcp
```

```plain
firewall-cmd --permanent --add-port=80/tcp
```

```plain
firewall-cmd --permanent --remove-port=8080/tcp
```

```plain
firewall-cmd --reload
```

### 快捷方式

```plain
ln -s {source_file} {target_file}
```

### 查看监听端口

```plain
lsof -i:8080
```

```plain
netstat -anpt | grep 8080
```

### 授权
注意下面命令是最高权限（读、写、执行），-R表示目录下所有文件
```plain
chmod -R 777 /data
```

### 清缓存

```plain
sync; echo 3 > /proc/sys/vm/drop_caches
```

### 修改host

```plain
vi  /etc/hosts
```

### 定时改密码
将/etc/login.defs里面的PASS_MAX_DAYS 90，改成99999
```plain
vim /etc/login.defs
```

### 修改密码

```plain
passwd 用户
```

### 备份文件

```plain
cp -rf {source_file} {target_file}
```

### 新建文件

```plain
mkdir {target_file}
```

### 删除文件

```plain
rm -rf {target_file}
```

### 查看内存空间

```plain
df -h
```

## 防火墙

### 查看firewalld服务状态

```plain
systemctl status firewalld
```

### 开启、重启、关闭firewalld.service服务

```plain
service firewalld start
```

```plain
service firewalld restart
```

```plain
service firewalld stop
```

## 操作时间

### 查看服务器时间

```plain
date -s
```

### 修改日期和时间

```plain
date -s "20201021 18:30:50"
date -s "20201021"
date -s "18:30:50"
```

### 同步网络时间

```plain
yum install -y ntpdate //安装ntpdate
ntpdate us.pool.ntp.org //同步时间
hwclock --systohc //将系统时间同步到硬件
```

### 将时间修改为24小时制

```plain
cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
ntpdate us.pool.ntp.org //同步时间
hwclock --systohc //将系统时间同步到硬件
```

## cron定时任务

### ubuntu定时执行脚本命令

```plain
crontab -e
```

### 查看定时任务状态

```plain
service cron status
```

### 编辑定时任务脚本

```plain
vim /etc/crontab
```

### 启动服务

```plain
service cron start
```

### 关闭服务

```plain
service cron stop
```

### 重启服务

```plain
service cron restart
```

### 重新载入配置

```plain
service cron reload
```

## 关于环境变量问题

### 解决方案一

![](/posts/project/linux_crontab.png)

### 解决方案二

查看系统的环境变量

```plain
vim /etc/profile
```

```plain
export JAVA_HOME=/usr/local/jdk1.8.0_321
export JRE_HOME=${JAVA_HOME}
export CLASSPATH=.:${JAVA_HOME}/lib:${JRE_HOME}/lib
export PATH=${JAVA_HOME}/bin:$PATH
```

环境生效命令

```plain
source /etc/profile
```

```plain
java -version
```

