#!/usr/bin/env node

/**
 * 导入Strapi数据的脚本
 * 此脚本将从JSON文件导入所有内容类型的数据到Strapi
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: './my-strapi-backend/.env' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('错误: 未设置STRAPI_API_TOKEN环境变量');
  process.exit(1);
}

// 导入目录
const IMPORT_DIR = './strapi-data-export';
if (!fs.existsSync(IMPORT_DIR)) {
  console.error(`错误: 导入目录 ${IMPORT_DIR} 不存在`);
  process.exit(1);
}

// 设置API请求头
const headers = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// 获取所有内容类型
async function getContentTypes() {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/content-type-builder/content-types`, { headers });
    return response.data.data.filter(type => !type.uid.startsWith('admin::') && !type.uid.startsWith('plugin::'));
  } catch (error) {
    console.error('获取内容类型失败:', error.message);
    return [];
  }
}

// 导入特定内容类型的数据
async function importContentType(contentType) {
  const typeName = contentType.uid.split('.')[1] || contentType.uid;
  const fileName = `${typeName}.json`;
  const filePath = path.join(IMPORT_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 文件 ${filePath} 不存在，跳过导入 ${contentType.uid}`);
    return { contentType: contentType.uid, status: 'skipped' };
  }
  
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const apiEndpoint = contentType.uid.replace('api::', '').replace('.', '/');
    
    // 检查是否已有数据
    const checkResponse = await axios.get(`${STRAPI_URL}/api/${apiEndpoint}?pagination[limit]=1`, { headers });
    if (checkResponse.data.data && checkResponse.data.data.length > 0) {
      console.log(`⚠️ ${contentType.uid} 已有数据，跳过导入以避免重复`);
      return { contentType: contentType.uid, status: 'skipped_existing' };
    }
    
    // 导入数据
    let successCount = 0;
    let errorCount = 0;
    
    if (fileData.data && Array.isArray(fileData.data)) {
      for (const item of fileData.data) {
        try {
          // 移除id字段，让Strapi自动生成新id
          const data = { ...item.attributes };
          
          await axios.post(`${STRAPI_URL}/api/${apiEndpoint}`, { data }, { headers });
          successCount++;
        } catch (error) {
          console.error(`导入 ${contentType.uid} 项目失败:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log(`✅ 已导入 ${contentType.uid}: ${successCount} 成功, ${errorCount} 失败`);
    return { contentType: contentType.uid, success: successCount, error: errorCount };
  } catch (error) {
    console.error(`❌ 导入 ${contentType.uid} 失败:`, error.message);
    return { contentType: contentType.uid, error: error.message };
  }
}

// 主函数
async function main() {
  console.log('开始导入Strapi数据...');
  
  // 获取内容类型
  const contentTypes = await getContentTypes();
  console.log(`找到 ${contentTypes.length} 个内容类型`);
  
  const results = [];
  for (const contentType of contentTypes) {
    const result = await importContentType(contentType);
    results.push(result);
  }
  
  // 创建导入摘要
  const summaryPath = path.join(IMPORT_DIR, 'import-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));
  
  console.log('Strapi数据导入完成!');
}

main().catch(error => {
  console.error('导入过程中发生错误:', error);
  process.exit(1);
});
