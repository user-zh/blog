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

::: code-tabs

@tab 查看镜像列表

```shell
docker images
```

@tab 拉取镜像

```shell
docker pull {镜像名}
```

@tab 删除镜像

```shell
docker rmi {镜像id}
```

@tab 查看容器

```shell
docker ps -a
```

@tab 停止容器

```shell
docker stop {container_id}
```

@tab 删除容器

```shell
docker rm {container_id}
```

@tab 进入容器目录

```shell
docker exec -it {容器名} /bin/bash
```

@tab 退出容器

```shell
exit
```

:::

## 服务基础命令

::: code-tabs

@tab 设置开机启动

```shell
systemctl enable docker
```

@tab 取消开机自启

```shell
systemctl disable docker
```

@tab 启动docker服务

```shell
systemctl start docker
```

@tab 停止docker服务

```shell
systemctl stop docker
```

@tab 重启docker服务

```shell
systemctl restart docker
```

@tab 查看状态

```shell
systemctl status docker
```

:::

## 配置镜像源

::: code-tabs
@tab 修改/etc/docker/daemon.json

```yaml
{
  "registry-mirrors": [ " https://registry.docker-cn.com" ]
}
```

@tab 重启服务

```shell
sudo systemctl daemon-reload
sudo systemctl restart docker
```

:::

## 配置docker服务开启tcp

::: code-tabs

@tab 编辑docker.service

```shell
vim /usr/lib/systemd/system/docker.service
```

@tab 修改ExecStart

```
ExecStart=/usr/bin/dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
```

@tab 重启服务

```shell
systemctl daemon-reload
systemctl restart docker
```

:::
