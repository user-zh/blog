---
title: docker基础操作
order: 1
date: 2025-01-22
isOriginal: false
category:
  - 中间件
tags:
  - docker
---

## docker基础命令

### 查看镜像列表

```plain
docker images
```

### 拉取镜像

```plain
docker pull <镜像名>
```

### 删除镜像

```plain
docker rmi <镜像id>
```

### 查看容器

-a是历史，没有-a是正在运行

```plain
docker ps -a
```

### 停止容器

```plain
docker stop <container_id>
```

### 删除容器

```plain
docker rm <container_id>
```

### 进入容器目录

```plain
docker exec -it <容器名> /bin/bash
```

### 退出容器

```plain
exit
```

## 服务基础命令

### 设置开机启动

```plain
systemctl enable docker
```

### 取消开机自启

```plain
systemctl disable docker
```

### 启动docker服务

```plain
systemctl start docker
```

### 停止docker服务

```plain
systemctl stop docker
```

### 重启docker服务

```plain
systemctl restart docker
```

### 查看状态

```plain
systemctl status docker
```

## 配置镜像源

### 修改/etc/docker/daemon.json

```plain
{
  "registry-mirrors": [" https://registry.docker-cn.com"]
}
```

### 重启服务

```plain
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## 配置docker服务开启tcp

### 编辑docker.service

```plain
vim /usr/lib/systemd/system/docker.service
```

### 修改ExecStart

```plain
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
```

### 重启服务

```plain
systemctl daemon-reload
systemctl restart docker
```

