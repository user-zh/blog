---
title: Anacond基础操作
order: 3
date: 2025-03-06
isOriginal: false
category:
  - 工具
tags:
  - Anacond
---

## 下载地址

推荐：[miniconda](https://mirrors.tuna.tsinghua.edu.cn/anaconda/miniconda/?C=M&O=D)

## 基础操作

::: code-tabs

@tab 清理缓存

```bash
conda clean -a
```

@tab 查看已创建的虚拟环境

```bash
conda env list
conda info
```

@tab 创建激活删除虚拟环境

```bash
conda create -n {env_name} python=X.X
conda activate {env_name}
conda remove -n {env_name} --all
```

@tab 包的安装和删除

```bash
conda install {package}
conda remove {package}
```

:::