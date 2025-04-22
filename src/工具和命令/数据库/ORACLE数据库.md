---
title: Oracle数据库基本操作
order: 1
date: 2025-03-24
isOriginal: false
category:
  - 数据库
tags:
  - Oracle
---

## 常用命令
### 日志
```sql
select * from v$flash_recovery_area_usage; --查看空间占用率
select * from v$recovery_file_dest;  --查看归档日志的存放地址;
```

### 删除日志
1. 登陆rman target  sys/password命令进入RMAN命令行后执行

RMAN> crosscheckarchivelog all;

RMAN>delete expired archivelog all; 就可以删除所有过期的日志文档并释放空间或者删除指定时间之前的archivelog：

DELETEARCHIVELOG ALL COMPLETED BEFORE 'SYSDATE-7'；(指定删除7天前的归档日志)

然后再做测试数据，问题就没有了。

### 查看监听
cmd输入lsnrctl status

### 查看表空间
```sql
SELECT UPPER(F.TABLESPACE_NAME) "表空间名",
	D.TOT_GROOTTE_MB "表空间大小(M)",
	D.TOT_GROOTTE_MB - F.TOTAL_BYTES "已使用空间(M)",
	TO_CHAR(ROUND((D.TOT_GROOTTE_MB - F.TOTAL_BYTES) / D.TOT_GROOTTE_MB * 100,2),'990.99') || '%' "使用比",
	F.TOTAL_BYTES "空闲空间(M)",
	F.MAX_BYTES "最大块(M)"
	FROM (SELECT TABLESPACE_NAME,
	ROUND(SUM(BYTES) / (1024 * 1024), 2) TOTAL_BYTES,
	ROUND(MAX(BYTES) / (1024 * 1024), 2) MAX_BYTES
	FROM SYS.DBA_FREE_SPACE
	GROUP BY TABLESPACE_NAME) F,
	(SELECT DD.TABLESPACE_NAME,
	ROUND(SUM(DD.BYTES) / (1024 * 1024), 2) TOT_GROOTTE_MB
	FROM SYS.DBA_DATA_FILES DD
	GROUP BY DD.TABLESPACE_NAME) D
	WHERE D.TABLESPACE_NAME = F.TABLESPACE_NAME
	ORDER BY 1
```

### 实际表空间路径
```sql
select f.* from dba_data_files f
```

### 扩大表空间
```sql
alter tablespace SYSTEM
	add datafile '路径'
	size 10G ;
```

### 管理员进入
1. 进入dos窗口—>>> 菜单键+R,进入 运行 界面,输入cmd
2. 登录 sqlplus,—>> 方法: sqlplus/nolog,切忌:不要输入sql...
3. 登入管理员—>> 方法: conn/as sysdba;

### 开启归档日志
```sql
shutdown immediate; --关闭数据库
startup mount; --打开数据库
alter database archivelog; --开启归档日志
alter database open; --开启数据库
archive log list; --查看归档日志是否开启
```

### 关闭归档日志
```sql
shutdown immediate;  --关闭数据库
startup mount;  --打开数据库
alter database noarchivelog;  --关闭归档日志
alter database open;  --开启数据库
archive log list ; --查看归档日志是否关闭
```

### 查看表信息
```sql
select table_name from user_tables; //当前用户拥有的表
select table_name from all_tables; //所有用户的表
select table_name from dba_tables; //包括系统表
select table_name from dba_tables where owner='用户名';
select * from user_col_comments;//获取字段注释
```

### 正则数字不正常
```sql
select 字段 from 表 where not regexp_like(字段,'^[0-9]*\.?[0-9]*$');
```



