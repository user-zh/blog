import {navbar} from "vuepress-theme-hope";
import {readdirSync, statSync} from "fs";
import {join} from "path";

// 扫描文件生成导航栏
function generateNavbarItems(dirPath, basePath = "") {
  const items = [];
  const entries = readdirSync(dirPath)
  for (const entry of entries) {
    // 跳过vuepress文件
    if (entry === '.vuepress' || entry === 'demo') {
      continue;
    }
    // 拼接 完成路径（用于判断是否为文件夹） 和 相对路径（用于link）
    const fullPath = join(dirPath, entry);
    const relativePath = join(basePath, entry);
    const isDirectory = statSync(fullPath).isDirectory();
    // 判断是否为目录
    if (isDirectory) {
      // 使用文件夹名作为文本
      items.push(relativePath + "/");
    }
  }

  return items;
}

export default navbar([
  "/",
  //"/demo/",
  // 注意需要回到目前文件上级才是/src目录
  ...generateNavbarItems(join(__dirname, "../")),
]);
