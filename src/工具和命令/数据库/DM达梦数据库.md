---
title: 达梦数据库基本操作
order: 1
date: 2025-02-09
isOriginal: false
category:
  - 数据库
tags:
  - 达梦
---

## 文档
[https://eco.dameng.com/document/dm/zh-cn/sql-dev/practice-func.html##%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%87%BD%E6%95%B0](https://eco.dameng.com/document/dm/zh-cn/sql-dev/practice-func.html##%E7%B1%BB%E5%9E%8B%E8%BD%AC%E6%8D%A2%E5%87%BD%E6%95%B0)

## 常用命令
### 修改数据库字段类型，并数据迁移
```sql
alter table 表 add 临时字段 VARBINARY(100);
update 表 set 需要修改字段=null;
alter table 表 modify 需要修改字段 VARCHAR2(100);
update 表 set 需要修改字段=to_char(临时字段),临时字段=null;
alter table 表 drop column 临时字段;
```

### 修改最大连接数
MAX_SESSIONS 10000 静态 系统允许同时连接的最大数，同时还受到 LICENSE 的限制，取二者中较小的值，有效值范围（1~65000）

```sql
select SF_GET_PARA_VALUE(2,'MAX_SESSIONS');
select SF_GET_PARA_VALUE(2,'MAX_SESSION_STATEMENT');
SP_SET_PARA_VALUE(2,'MAX_SESSIONS', 1500);
SP_SET_PARA_VALUE(2,'MAX_SESSION_STATEMENT',20000);
```

### 查看连接数量
```sql
select clnt_ip,user_name,state,count() from v$sessions group by clnt_ip,user_name,state;
select count() from v$sessions;
```

### 服务器上执行sql
```shell
cd /home/dmdba/dmdbms/tool
./disql
conn 账号/"密码"@ip:端口;
commit;
```

### 查看数据库慢的sql
```sql
select * from V$SYSTEM_LONG_EXEC_SQLS;
```

### 看执行会话超过一秒
```sql
SELECT *
FROM (
         SELECT SESS_ID,
                SQL_TEXT,
                DATEDIFF(SS, LAST_SEND_TIME, SYSDATE) SS,
                SF_GET_SESSION_SQL(SESS_ID)           FULLSQL
         FROM V$SESSIONS
         WHERE STATE = 'ACTIVE')
WHERE SS >= 1;
##
select * from V$LONG_EXEC_SQLS;
```

### oracle中与mysql中group concat同样作用的函数
```sql
LISTAGG(ID, ',') WITHIN GROUP(ORDER BY ID) AS ids
```

### oracle中与mysql中STR_TO_DATE同样作用的函数
```sql
STR_TO_DATE(time, '%Y-%m-%d %H:%i:%s')
TO_DATE(time,'yyyy-MM-dd HH24:mi:ss')
```

### oracle中order by 和 group by（比较限制）
大文本类型不允许进行比较，建议使用函数to_char转换后进行比较

### oracle中DECODE 类似于mysql的if函数
	比如，有个if语句如下

	if(a==1){//如果a等于1，返回2,否则返回3

	   return 2;

	}else{

	   return 3;

	}

	翻译成DECODE如下

	DECODE(a,1,2,3)

### 达梦数据库查询时clob字段无法转换的问题
在数据库连接加上参数clobAsString=true

### 查询表信息
```sql
select * from user_tab_comments where Table_Name='B_T_DEFINED_CVDDZP';
```

### 查询表字段信息
```sql
select * from user_tab_columns where Table_Name='B_T_DEFINED_CVDDZP';
```

### 查询表字段注释
```sql
select * from user_col_comments where Table_Name='B_T_DEFINED_CVDDZP';
```

### 通过下面sql查出哪张表上的某种锁是由哪个会话里的操作加上的
```sql
select a.*,b.NAME,c.SESS_ID from v$lock a
	left join sysobjects b on b.ID=a.TABLE_ID
	left join v$sessions c on a.TRX_ID=c.TRX_ID
```

### 找到表名对应的SESS_ID,执行下面sql就可以对表进行修改操作
```sql
sp_close_session(140670650200624)
```

## 数据库迁移
### 创建表空间
```sql
create tablespace "BPMDB" datafile 'BPMDB.DBF' size 128 CACHE = NORMAL;
```

### oracle迁移达梦
基本上没什么问题，需要精度上问题解决下即可

### mysql迁移达梦
1. 中文乱码问题（完美解决方案，指定数据库连接参数即可）
2. 代码中出现dm的clob类型序列化问题（在数据库连接加上参数clobAsString=true）
3. sql语法不兼容问题，少用特定类型的函数（如 mysql的GROUP_CONCAT（））
4. 一些特性造成sql问题，目前比较常见因为是长字段造成（达梦是不支持在长字段类型排序或则去重）	

### 无法像mysql一样使用group by问题
```sql
sp_set_para_value(2,'COMPATIBLE_MODE',4);
```



### ENABLE_BLOB_CMP_FLAG
参数含义：是否支持大字段类型的比较。0：不支持；1： 支持，此时 DISTINCT、ORDER BY、 分析函数和集函数支持对大字段进行处理。
默认值：0
原则不建议在大字段列进行排序或比较操作，会消耗较多资源。
如果开启该参数，执行命令：

```sql
SP_SET_PARA_VALUE(1,'ENABLE_BLOB_CMP_FLAG',1)
```

### 递归查询优化
/*+CNNTB_OPT_FLAG(2) */ 

### 修改密码
```sql
alter user SYSDBA identified by “密码”；
```



