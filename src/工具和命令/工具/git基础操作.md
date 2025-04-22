---
title: git基础操作
order: 1
date: 2025-03-06
isOriginal: false
category:
  - 工具
tags:
  - git
---

## 初始化操作

### 设置全局用户名

```Git
git config --global user.name {your_name}
```

### 设置全局邮箱

```Git
git config --global user.email {your_email}
```

### 查看配置

```Git
git config --list
```

### 生成ssh

这个公钥需要放到github管理平台上管理，其中rsa是id号可以随意取

```Git
ssh-keygen -t rsa
```

### 查看ssh

```Git
cat ~/.ssh/id_rsa.pub
```

### 连接测试

```Git
ssh -T git@github.com
ssh -T git@gitee.com
```

## 基础操作

### 拉去远程仓库的代码(clone)

```Git
git clone {project_ssh}
```

### 初始化仓库

```Git
git init
```

### 连接远程仓库(remote)

拉取远程仓库代码

```Git
git remote add origin {project_ssh}
```

查看远程分支

```Git
git remote -v
```

删除远程分支

```Git
git remote rm origin
```

### 同步远程仓库到本地(pull)

```Git
git pull origin master
```

### 添加要上传的文件(add)

```Git
git add .
```

### 添加注释(commit)

```Git
git commit -m '你的注释'
```

### 推送(push)

```Git
git push origin master
```

### 查看仓库状态

```Git
git status
```

## 工作中用到

### 注释格式

type（提交类型）：用于说明提交的性质，常见的类型有以下几种：

- feat：新功能（feature）。
- fix：修复 bug。
- docs：文档修改。
- style：代码格式调整（不影响代码逻辑）。
- refactor：代码重构（不添加新功能也不修复bug）。
- perf：性能优化
- revert：回退
- test：增加测试用例。
- chore：其他杂项事务，如更新构建工具等。

subject（简短描述）：用简洁的语言描述本次提交的主要内容。
body（详细描述）：如果需要，可以在 body 部分提供更详细的提交信息，包括背景、解决方法等。
footer（可选）：可以用于添加一些关联的问题编号、合并请求编号等信息。

```text
{type}:{subject}
{body}
{footer}
```

### 误上传文件

```Git
git rm --cached {文件}
git commit --amend
git push --force
```