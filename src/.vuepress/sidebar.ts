import {sidebar} from "vuepress-theme-hope";
import {readdirSync, statSync} from "fs";
import {join} from "path";

function generateNavbarItems(sidebar, dirPath) {
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
      // 使用文件夹名路由
      sidebar[`/${entry}/`] = "structure"
      // 插入到 导航页
      sidebar["/"].push({
        text: entry,
        prefix: `${entry}/`,
        children: "structure",
      });
    }
  }
  return sidebar;
}

export default sidebar(generateNavbarItems({
  "/": [
    "",
    {
      text:"自我介绍",
      link: "intro.md"
    },
    {
      text:"样例",
      prefix: "demo/",
      children: "structure",
    }
  ],
}, join(__dirname, "../")));
