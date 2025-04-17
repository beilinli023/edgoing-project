// 测试 Strapi API 内容块结构的脚本
import fs from 'fs';
import path from 'path';

// 输入文件路径
const inputFile = './strapi-test/first-blog.json';
const outputDir = './strapi-test';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 读取博客数据
console.log(`读取博客数据: ${inputFile}`);
const blogData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

// 分析博客内容块
console.log('\n===== 博客内容块分析 =====');

// 检查内容块是否存在
if (!blogData.content || !Array.isArray(blogData.content)) {
  console.log('没有找到内容块数据或内容块不是数组');
  process.exit(1);
}

const contentBlocks = blogData.content;
console.log(`找到 ${contentBlocks.length} 个内容块`);

// 保存内容块数据
fs.writeFileSync(
  path.join(outputDir, 'content-blocks-detailed.json'),
  JSON.stringify(contentBlocks, null, 2)
);
console.log(`内容块数据已保存到 ${path.join(outputDir, 'content-blocks-detailed.json')}`);

// 分析内容块类型
const blockTypes = {};
contentBlocks.forEach(block => {
  if (block.type) {
    blockTypes[block.type] = (blockTypes[block.type] || 0) + 1;
  }
});

console.log('\n内容块类型统计:');
Object.keys(blockTypes).forEach(type => {
  console.log(`- ${type}: ${blockTypes[type]} 个`);
});

// 分析每个内容块
console.log('\n内容块详细分析:');
contentBlocks.forEach((block, index) => {
  console.log(`\n内容块 #${index + 1}:`);
  console.log(`- 类型: ${block.type}`);
  
  // 分析块的属性
  Object.keys(block).forEach(key => {
    if (key !== 'type') {
      const value = block[key];
      const valueType = Array.isArray(value) ? 'array' : typeof value;
      
      if (key === 'children' && Array.isArray(value)) {
        console.log(`- ${key}: 子元素数组 (${value.length} 个)`);
        
        // 分析子元素
        value.forEach((child, childIndex) => {
          console.log(`  子元素 #${childIndex + 1}:`);
          Object.keys(child).forEach(childKey => {
            const childValue = child[childKey];
            const childType = Array.isArray(childValue) ? 'array' : typeof childValue;
            console.log(`  - ${childKey}: ${childType} ${childValue === null ? '(null)' : ''}`);
            
            // 如果是文本，显示内容
            if (childKey === 'text' && typeof childValue === 'string') {
              const displayText = childValue.length > 50 ? 
                childValue.substring(0, 50) + '...' : 
                childValue;
              console.log(`    值: "${displayText}"`);
            }
          });
        });
      } else {
        console.log(`- ${key}: ${valueType}`);
      }
    }
  });
});

// 分析本地化内容
if (blogData.localizations && Array.isArray(blogData.localizations)) {
  console.log('\n===== 本地化内容分析 =====');
  console.log(`找到 ${blogData.localizations.length} 个本地化版本`);
  
  blogData.localizations.forEach((localization, index) => {
    console.log(`\n本地化版本 #${index + 1}:`);
    console.log(`- 语言: ${localization.locale}`);
    console.log(`- 标题: ${localization.title}`);
    
    if (localization.content && Array.isArray(localization.content)) {
      console.log(`- 内容块: ${localization.content.length} 个`);
      
      // 保存本地化内容块数据
      fs.writeFileSync(
        path.join(outputDir, `content-blocks-${localization.locale}.json`),
        JSON.stringify(localization.content, null, 2)
      );
      console.log(`  本地化内容块数据已保存到 ${path.join(outputDir, `content-blocks-${localization.locale}.json`)}`);
    }
  });
}

console.log('\n===== 分析完成 =====');
