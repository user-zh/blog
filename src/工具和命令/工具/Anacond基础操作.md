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

### 清理缓存

```cmd
conda clean -a
```

### 查看已创建的虚拟环境

```cmd
conda env list
```

```cmd
conda info
```

### 创建激活删除虚拟环境

```cmd
conda create -n {env_name} python=X.X
```

```cmd
conda activate {env_name}
```

```cmd
conda remove -n {env_name} --all
```

### 包的安装和删除

```cmd
conda install {package}
```

```cmd
conda remove {package}
```

