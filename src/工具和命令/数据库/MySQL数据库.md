---
title: MySQL数据库基本操作
order: 1
date: 2025-03-31
isOriginal: false
star: true
category:
  - 数据库
tags:
  - MySQL
---

## 常用命令

### 查重sql

```plsql
SELECT *
FROM testdelete a
WHERE (a.one, a.two, a.three) IN (SELECT ONE, two, three FROM testdelete GROUP BY ONE, two, three HAVING COUNT(*) > 1) 
```

### 除重sql

```plsql
DELETE
FROM testdelete
WHERE (ONE, two, three) IN (
  SELECT ONE, two, three FROM (SELECT ONE, two, three FROM testdelete GROUP BY ONE, two, three HAVING COUNT(*) > 1) a)
  AND id NOT IN (SELECT id FROM (SELECT MIN(id) AS id FROM testdelete GROUP BY ONE, two, three HAVING COUNT(*) > 1) b)
```

### 返回组的最大值记录

```plsql
select t1.* from table_name t1 where t.MARK_VALUE=(select max(MARK_VALUE) from table_name t2 where t2.S_NAME=t1.S_NAME)
```

### 查看数据库各表数据量

```plsql
select table_name,table_rows,table_comment from information_schema.tables where TABLE_SCHEMA = '我的数据库' order by table_rows desc;
```

### 清除表数据

```plsql
truncate table table_name;
```

### 设置远程密码

```plsql
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' identified by '你的密码' WITH GRANT OPTION;
	FLUSH PRIVILEGES;
	
GRANT ALL PRIVILEGES ON *.* TO 'root'@'ip' identified by '你的密码' WITH GRANT OPTION;
```

### 修改密码

```plsql
use mysql;
update user set password=PASSWORD('你的密码') where user='root' and host='ip';
flush privileges; 
```

### 数据库配置

```plsql
show variables like 'have_query_cache';
```

```plsql
SHOW VARIABLES LIKE 'max_connections';
```

### 查询表信息

```plsql
SELECT TABLE_NAME,TABLE_COMMENT FROM information_schema.tables WHERE table_schema = (select database());
```

```plsql
select COLUMN_NAME,COLUMN_COMMENT,DATA_TYPE from information_schema.COLUMNS where TABLE_SCHEMA = (select database()) and table_name=##{table_name};
```

### 正则

```plsql
SELECT name FROM person_tbl WHERE name REGEXP 'ok$';
```

### linux数据库备份

```bash
##!/bin/bash
##保存备份个数，备份31天数据
number=31
##备份保存路径
backup_dir=/root/mysql/backups
##日期
dd=`date +%Y-%m-%d-%H-%M-%S`
##备份工具
tool=mysqldump
##ip地址
ipaddress=127.0.0.1
##用户名
username=root
##密码
password=123456
##将要备份的数据库
database_name=base
##如果文件夹不存在则创建
if [ ! -d $backup_dir ];
then
mkdir -p $backup_dir;
fi
##简单写法 mysqldump -u root -p123456 users > /root/mysqlbackup/users-$filename.sql
$tool --socket=/opt/zbox/tmp/mysql/mysql.sock -u $username -h $ipaddress -p$password $database_name > $backup_dir/$database_name-$dd.sql
##写创建备份日志
echo "create $backup_dir/$database_name-$dd.dupm" >> $backup_dir/log.txt
##找出需要删除的备份
delfile=`ls -l -crt $backup_dir/*.sql | awk '{print $9 }' | head -1`
##判断现在的备份数量是否大于$number
count=`ls -l -crt $backup_dir/*.sql | awk '{print $9 }' | wc -l`
if [ $count -gt $number ]
then
##删除最早生成的备份，只保留number数量的备份
rm $delfile
##写删除文件日志
echo "delete $delfile" >> $backup_dir/log.txt
fi
```

```shell
service crond start //启动服务
service crond stop //关闭服务
service crond restart //重启服务
service crond reload //重新载入配置
service crond status //查看服务状态
crontab -e
//增加定时执行计划 每天凌晨2点执行
0 2 * * * /root/mysql_backup_script.sh
crontab -l //查看执行计划
service crond restart //重启服务让定时计划生效
```

## 优化建议

### 查询优化

1. 查询时遵循**索引最左前缀原则**

### 存储优化

1. 所有字段建议设置**not null**（节省至少1字节空间，每个nullable字段占1bit，每8个占1字节）
2. 如果是有分库分表建议id使用**雪花算法**生成（存在系统时间回拨id重复问题）；后续有数据迁移用**UUID**
   ，虽然全局唯一但是没有递增性质（无法用id>过滤数据加快查询）；**自增**适合读多写少的小表（适合并发写不高的表，节省空间）
3. 数据存放建议**在3层b+树内**。**阿里推荐3年内超过500w或者存储到2g建议分库分表**。
   下面是理论说明默认情况页大小为16KB，即16384字节，去掉页头页尾约200字节，有效字节为16184。需要计算2层指针数量
   *叶子节点数量，计算公式如下：
   （16184/（索引需要字节））²*（16184/（每行需要最大字节））

4. 分库分表主要是提高数据库并发写和读表的能力，分库是连接数的提升（防止连接数达到数据库上限，默认151），分表是读写。

