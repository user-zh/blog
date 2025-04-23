import {sidebar} from "vuepress-theme-hope";
import {readdirSync, statSync} from "fs";
import {join} from "path";

/**
 * 扫描文件生成侧边栏
 * 1. 增加isExpand（二级导航展开），如果内容很多不是很推荐设置为true
 * @param sidebar 侧边栏对象
 * @param dirPath 扫描文件路径
 * @param isExpand 二级导航展开
 */
function generateSidebarItems(sidebar, dirPath, isExpand = false) {
  const entries = readdirSync(dirPath)
  for (const entry of entries) {
    // 跳过vuepress文件
    if (entry === '.vuepress' || entry === 'demo') {
      continue;
    }
    // 拼接 完成路径（用于判断是否为文件夹）
    const fullPath = join(dirPath, entry);
    const isDirectory = statSync(fullPath).isDirectory();
    // 判断是否为目录
    if (isDirectory) {
      // 是否展开
      if (isExpand) {
        const sidebarChildren = generateSidebarChildrenItems([], fullPath)
        // 使用文件夹名路由
        sidebar[`/${entry}/`] = sidebarChildren
      } else {
        sidebar[`/${entry}/`] = "structure"
      }
    }
  }
  return sidebar;
}

// 子导航生成
function generateSidebarChildrenItems(sidebars, dirPath) {
  const entries = readdirSync(dirPath)
  for (const entry of entries) {
    // 拼接 完成路径（用于判断是否为文件夹）
    const fullPath = join(dirPath, entry);
    const isDirectory = statSync(fullPath).isDirectory();
    // 判断是否为目录
    if (isDirectory) {
      // 使用文件夹名路由
      sidebars.push({
        text: entry,
        prefix: `${entry}/`,
        //link: `/${entry}/`,
        children: generateSidebarChildrenItems([], fullPath),
      });
    } else {
      sidebars.push({
        text: entry.replace(".md", ""),
        link: `${entry}`,
      })
    }
  }
  return sidebars;
}

export default sidebar(generateSidebarItems({
  "/": "structure",
}, join(__dirname, "../")));
