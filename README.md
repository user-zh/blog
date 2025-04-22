# 介绍

1. 基于vuepress-theme-hope + vite + pnpm开发个人博客。
2. [博客地址](https://user-zh.github.io/blog/)

# 功能开发优化记录

## 自动生成顶部导航和侧边导航

基于最新官方API和简单文件路径扫描实现，目前保留demo页作为总导航，相关方法下面

- [generateNavbarItems](/src/.vuepress/navbar.ts): 自动生成顶部导航
- [generateSidebarItems](/src/.vuepress/sidebar.ts): 自动生成侧边导航