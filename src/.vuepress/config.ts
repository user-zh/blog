import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/blog/",
  head: [
    ['link', {rel: 'icon', href: '/blog/images/logo.png'}],
  ],
  lang: "zh-CN",
  title: "今天也随弈的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
