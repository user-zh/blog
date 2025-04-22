---
title: Redis数据库基本操作
order: 1
date: 2025-02-09
isOriginal: false
star: true
category:
  - 数据库
tags:
  - Redis
---

## 查看信息

> 可以查看最近fork耗时（latest_fork_usec，微秒）
>

```powershell
info
```

## 性能测试

```powershell
redis-cli -h 127.0.0.1 -p 6379 --intrinsic-latency 60
```

```powershell
redis-cli -h 127.0.0.1 -p 6379 --latency-history -i 1
```

## 开启慢日志

> 尽量不使用复杂度过高命令（数据处理放在客户端），每次返回数据尽可能少（推荐300以下）
>

```powershell
## 命令执行耗时超过 5 毫秒，记录慢日志
CONFIG SET slowlog-log-slower-than 5000
## 只保留最近 500 条慢日志
CONFIG SET slowlog-max-len 500
```

## 查看bigkey（尽可能避免bigkey写入）

> 当你发现都是 SET / DEL 这种简单命令出现在慢日志中，那么你就要怀疑你的实例否写入了 bigkey。
>

```powershell
redis-cli -h 127.0.0.1 -p 6379 --bigkeys -i 0.01
```

从输出结果我们可以很清晰地看到，每种数据类型所占用的最大内存 / 拥有最多元素的 key
是哪一个，以及每种数据类型在整个实例中的占比和平均大小 / 元素数量。

### 优化策略分类（建议分片）

字符串类型（String）

- 拆分与压缩：
    - 将大value拆分为多个子key，如large_data:part1、large_data:part2。
    - 使用压缩算法（如gzip、Snappy）压缩数据，客户端解压（需权衡CPU与网络开销）。
- 调整存储格式：
    - 避免存储序列化的大对象，改用Hash结构存储字段，按需读取。
      集合类型（Hash/List/Set/ZSet）
- 分片存储：
    - Hash分片：将大Hash按字段哈希分片，如user:{id}:info_{shard_id}。
    - 时间分片：对List/ZSet按时间拆分，如chat_log:2023-10。
    - 范围分片：按数据范围划分，如leaderboard:0-1000、leaderboard:1001-2000。
    - 控制元素数量：
    - 定期清理过期数据（如LTRIM、ZREMRANGEBYSCORE）。
    - 限制集合最大长度（如仅保留最新1000条数据）。

删除优化
- 异步删除：
    - 使用UNLINK替代DEL（Redis 4.0+），后台异步释放内存。
- 渐进式删除：
    - 分批删除集合元素，例如循环执行HSCAN+HDEL或SSCAN+SREM。

## 内存上限

> 建议占用内存15%-30%（10g以下）
>

```powershell
CONFIG SET maxmemory 4gb
```

### 内存淘汰策略

```powershell
maxmemory-policy volatile-lru
```

```powershell
CONFIG SET maxmemory-policy volatile-lru
```

- `allkeys-lru`：不管 key 是否设置了过期，淘汰最近最少访问的 key（常用）
- `volatile-lru`：只淘汰最近最少访问、并设置了过期时间的 key（常用）
- `allkeys-random`：不管 key 是否设置了过期，随机淘汰 key
- `volatile-random`：只随机淘汰设置了过期时间的 key
- `allkeys-ttl`：不管 key 是否设置了过期，淘汰即将过期的 key
- `noeviction`：不淘汰任何 key，实例内存达到 maxmeory 后，再写入新数据直接返回错误
- `allkeys-lfu`：不管 key 是否设置了过期，淘汰访问频率最低的 key（4.0+版本支持）
- `volatile-lfu`：只淘汰访问频率最低、并设置了过期时间 key（4.0+版本支持）

## 关闭内存大页

> **主进程在拷贝内存数据时，这个阶段就涉及到新内存的申请，如果此时操作系统开启了内存大页，那么在此期间，客户端即便只修改 10B
> 的数据，Redis 在申请内存时也会以 2MB 为单位向操作系统申请，申请内存的耗时变长，进而导致每个写请求的延迟增加，影响到 Redis
> 性能
**。
>

```powershell
cat /sys/kernel/mm/transparent_hugepage/enabled
```

> 如果输出选项是 always，就表示目前开启了内存大页机制
>

```powershell
 echo never > /sys/kernel/mm/transparent_hugepage/enabled
```

