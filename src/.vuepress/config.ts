import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",
  head: [
    ['link', {rel: 'icon', href: '/images/logo.png'}],
  ],
  lang: "zh-CN",
  title: "今天也随弈的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
