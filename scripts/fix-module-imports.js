const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 服务器构建目录
const serverDir = path.resolve(__dirname, '../dist/server');

// 递归遍历目录查找 .cjs 文件
function findCjsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findCjsFiles(filePath, fileList);
    } else if (file.endsWith('.cjs')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// 修复模块引用
function fixModuleImports() {
  console.log('开始修复模块引用...');
  
  // 获取所有 .cjs 文件
  const cjsFiles = findCjsFiles(serverDir);
  let fixedCount = 0;
  
  cjsFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 匹配本地模块引用: require("./path/to/module") 或 require("../path/to/module")
    // 确保不会重复添加 .cjs 后缀
    const regex = /require\("(\.\.?\/[^"]+?)(?:\.js|\.cjs)?"\)/g;
    
    content = content.replace(regex, (match, modulePath) => {
      // 如果已经有 .cjs 后缀，不做修改
      if (modulePath.endsWith('.cjs')) {
        return match;
      }
      return `require("${modulePath}.cjs")`;
    });
    
    // 只保存修改过的文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      fixedCount++;
      console.log(`已修复: ${filePath}`);
    }
  });
  
  console.log(`模块引用修复完成，共修复 ${fixedCount} 个文件`);
}

// 执行修复
fixModuleImports(); 