#!/usr/bin/env node

/**
 * 导出Strapi数据的脚本
 * 此脚本将导出所有内容类型的数据到JSON文件
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

// 创建导出目录
const EXPORT_DIR = './strapi-data-export';
if (!fs.existsSync(EXPORT_DIR)) {
  fs.mkdirSync(EXPORT_DIR, { recursive: true });
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

// 导出特定内容类型的数据
async function exportContentType(contentType) {
  try {
    const apiEndpoint = contentType.uid.replace('api::', '').replace('.', '/');
    const response = await axios.get(`${STRAPI_URL}/api/${apiEndpoint}?pagination[limit]=1000`, { headers });
    
    const data = response.data;
    const fileName = `${contentType.uid.split('.')[1] || contentType.uid}.json`;
    const filePath = path.join(EXPORT_DIR, fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ 已导出 ${contentType.uid} 到 ${filePath}`);
    
    return { contentType: contentType.uid, count: data.data ? data.data.length : 0 };
  } catch (error) {
    console.error(`❌ 导出 ${contentType.uid} 失败:`, error.message);
    return { contentType: contentType.uid, error: error.message };
  }
}

// 导出所有上传的媒体文件信息
async function exportUploadedFiles() {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/upload/files?pagination[limit]=1000`, { headers });
    const data = response.data;
    const filePath = path.join(EXPORT_DIR, 'uploaded-files.json');
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ 已导出上传的文件信息到 ${filePath}`);
    
    return { contentType: 'uploaded-files', count: data.length };
  } catch (error) {
    console.error('❌ 导出上传的文件信息失败:', error.message);
    return { contentType: 'uploaded-files', error: error.message };
  }
}

// 主函数
async function main() {
  console.log('开始导出Strapi数据...');
  
  // 导出内容类型
  const contentTypes = await getContentTypes();
  console.log(`找到 ${contentTypes.length} 个内容类型`);
  
  const results = [];
  for (const contentType of contentTypes) {
    const result = await exportContentType(contentType);
    results.push(result);
  }
  
  // 导出上传的文件信息
  const uploadResult = await exportUploadedFiles();
  results.push(uploadResult);
  
  // 创建导出摘要
  const summaryPath = path.join(EXPORT_DIR, 'export-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));
  
  console.log('Strapi数据导出完成!');
}

main().catch(error => {
  console.error('导出过程中发生错误:', error);
  process.exit(1);
});
