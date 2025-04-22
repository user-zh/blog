---
title: Tomcat基础操作
order: 3
date: 2025-02-09
isOriginal: false
category:
  - 中间件
tags:
  - Tomcat
---

## Tomcat
### 启动命令
```plain
cd /home/apache-tomcat-8.5.59/bin
./startup.sh
```

### 关闭命令
```plain
./shutdown.sh
```

### 查看进程
```plain
ps -ef |grep tomcat
```

### 查看日志
```plain
tail -f ../logs/catalina.out
```

### 清理日志
```plain
true > catalina.out
```

### 查看日志大小
```plain
du -h catalina.out
```

### 增加内存分配
1.在Linux系统中，修改tomcat/bin/catalina.sh 在cygwin=false之前添加

```plain
JAVA_OPTS="-server -Xms4096m -Xmx4096m -XX:NewSize=256m -XX:MaxNewSize=256m -XX:PermSize=256m -XX:MaxPermSize=256m"
```

（Xmx最大我设置的4个G，可以根据服务器内存大小设置，如果服务器内存是8G，这里可以设置4G，就是服务器内存的一半）

2.在Windows系统中，修改tomcat/bin/catalina.bat 在文件第一行添加

```plain
set JAVA_OPTS=-server -Xms4096m -Xmx4096m -XX:NewSize=256m -XX:MaxNewSize=256m -XX:PermSize=256m -XX:MaxPermSize=256m
```

### 页面输出乱码
1.在tomcat中将server.xml 的我们所用的端口的配置添加URIEncoding=“UTF-8”

2.catalina.bat的配置问题 在catalina.bat这个配置文件中加上set JAVA_OPTS=-Dfile.encoding=UTF-8

3.用编译工具，在IDEA编译器中的VM options:设置-D·file.encoding=UTF-8，或eclipse 的设置中改成utf-8 输出的问题可以解决

### 控制台输出乱码
这个问题的原因是windows默认编码集为GBK，由于使用startup.bat启动tomcat时，它会读取catalina.bat的代码并打开一个新窗口运行。打开的cmd默认编码可能不是utf-8，与系统编码不一致，所以导致乱码。所以tomcat的命令框和输出日志都是乱码 修改logging.properties配置 打开tomcat/conf/logging.properties 添加语句：

```plain
java.util.logging.ConsoleHandler.encoding = GBK
```