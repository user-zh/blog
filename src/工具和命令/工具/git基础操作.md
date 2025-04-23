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

::: code-tabs

@tab 设置用户名

```bash
git config --global user.name {your_name}
```

@tab 设置邮箱

```bash
git config --global user.email {your_email}
```

@tab 查看配置

```bash
git config --list
```

@tab 生成ssh

这个公钥需要放到github管理平台上管理，其中rsa是id号可以随意取

```bash
ssh-keygen -t rsa
```

@tab 查看ssh

```bash
cat ~/.ssh/id_rsa.pub
```

@tab 连接测试

```bash
ssh -T git@github.com
ssh -T git@gitee.com
```

:::

## 基础操作

### 拉取远程仓库的代码

::: code-tabs

@tab 克隆(clone)

```bash
git clone <项目ssh>
```

@tab 查看远程仓库信息

```bash
git remote -v
```

@tab 同步远程仓库分支(pull)

```bash
git pull origin <分支名>
```

@tab 拉取代码(fetch)

```bash
git fetch origin
```

:::

### 本地初始化连接

::: code-tabs

@tab 初始化

```bash
git init
```

@tab 连接仓库(remote)

```bash
git remote add origin <项目ssh>
```

:::

### 分支操作

合并（更适合团队分支）和基变（更适合个人）如果发生冲突，最好手动解决冲突(调整冲突文件并提交)

::: code-tabs

@tab 查看分支

```bash
git branch -a
```

@tab 新建分支

```bash
git branch <分支名>          # 创建分支但不切换
git checkout -b <分支名>    # 创建并切换到新分支（旧版Git）
git switch -c <分支名>      # 创建并切换到新分支（Git 2.23+推荐）
```

@tab 切换分支

```bash
git checkout <分支名>       # 切换到指定分支（旧版Git）
git switch <分支名>        # 切换到指定分支（Git 2.23+推荐）
```

@tab 合并分支(merge)

```bash
git checkout main          # 切换到主分支
git merge <分支名>        # 合并指定分支到当前分支
```

@tab 变基操作(rebase)
```bash
git checkout feature      # 切换到特性分支
git rebase main          # 将特性分支变基到主分支
```

@tab 删除分支

```bash
git remote rm origin <分支名>
```

:::

### 提交文件

::: code-tabs

@tab 添加文件(add)

```bash
git add .
```

@tab 添加注释(commit)

```bash
git commit -m '你的注释'
```

@tab 推送(push)

```bash
git push origin <分支名>
```

:::

### 查看相关日志

log操作可以获取对应提交的commit-hash

::: code-tabs

@tab 查看日志

```bash
git log
```

@tab 查看仓库状态

```bash
git status
```

:::

### 撤销上传文件

已提交但未推送

- commit-hash可以用 HEAD~1 替代表示上一次
- mixed：撤销包含add
- <span style="color:red">hard:撤销并舍弃版本号之后提交，慎重使用</span>

::: code-tabs

@tab 撤销提交

```bash
git reset --soft <commit-hash>
```

@tab 撤销提交(mixed)

```bash
git reset --mixed <commit-hash>
```

@tab 撤销提交(hard)

```bash
git reset --hard <commit-hash>
```

@tab 移除指定文件

```bash
git rm --cached <文件名>
git commit --amend
```

@tab 完全删除指定文件

```bash
git rm <文件名>
git commit --amend
```

:::

已经推送

- 上述提交命令指向同步操作即可
- 如果使用hard撤销需要标记强制，后缀加上 --force-with-lease（更安全） 或者 -f 或者 --force

```bash
git push
```

## 备注说明

### 注释格式（推荐）

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