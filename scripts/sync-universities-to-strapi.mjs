import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Strapi API 配置
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN || '';

// 创建 Axios 实例
const strapiAxios = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': STRAPI_TOKEN ? `Bearer ${STRAPI_TOKEN}` : ''
  }
});

// 读取大学数据
const readUniversityData = async () => {
  try {
    // 读取索引文件
    const indexPath = path.join(__dirname, '..', 'public', 'content', 'universities', 'index.json');
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    
    const universities = [];
    
    // 读取每个大学的详细数据
    for (const uni of indexData.universities) {
      const uniPath = path.join(__dirname, '..', 'public', 'content', 'universities', uni.file);
      const uniData = JSON.parse(fs.readFileSync(uniPath, 'utf8'));
      universities.push(uniData);
    }
    
    return universities;
  } catch (error) {
    console.error('读取大学数据失败:', error);
    throw error;
  }
};

// 将大学数据同步到 Strapi
const syncUniversitiesToStrapi = async () => {
  try {
    console.log('开始同步大学数据到 Strapi...');
    
    // 读取大学数据
    const universities = await readUniversityData();
    console.log(`读取到 ${universities.length} 所大学的数据`);
    
    // 创建的大学条目计数
    let createdCount = 0;
    
    // 遍历大学数据，创建 Strapi 条目
    for (const uni of universities) {
      try {
        console.log(`正在创建大学: "${uni.name_en}" / "${uni.name_zh}"`);
        
        // 创建英文版本
        const enResponse = await strapiAxios.post('/api/universities', {
          data: {
            name_en: uni.name_en,
            name_zh: uni.name_zh,
            location_en: uni.location_en,
            location_zh: uni.location_zh,
            programs_en: uni.programs_en,
            programs_zh: uni.programs_zh,
            description_en: uni.description_en,
            description_zh: uni.description_zh,
            highlights_en: uni.highlights_en || '',
            highlights_zh: uni.highlights_zh || '',
            facilities_en: uni.facilities_en || '',
            facilities_zh: uni.facilities_zh || '',
            academics_en: uni.academics_en || '',
            academics_zh: uni.academics_zh || '',
            admission_en: uni.admission_en || '',
            admission_zh: uni.admission_zh || '',
            locale: 'en'
          }
        });
        
        if (enResponse.data && enResponse.data.data) {
          console.log(`✅ 成功创建大学: "${uni.name_en}"`);
          createdCount++;
        }
      } catch (error) {
        console.error(`❌ 创建大学失败: ${error.message}`);
        if (error.response) {
          console.error('错误详情:', error.response.data);
        }
      }
      
      // 添加延迟，避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log(`\n同步完成! 成功创建 ${createdCount} 所大学。`);
  } catch (error) {
    console.error('同步过程中发生错误:', error);
    process.exit(1);
  }
};

// 执行同步
syncUniversitiesToStrapi().catch(error => {
  console.error('同步过程中发生错误:', error);
  process.exit(1);
});
