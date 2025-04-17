import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置
const STRAPI_URL = 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || ''; // 如果有的话填写Strapi API Token
const PROGRAMS_DIR = path.join(__dirname, '../../frontend/public/content/programs');

// 读取程序数据
async function readProgramData(programId) {
  const filePath = path.join(PROGRAMS_DIR, `program${programId}.json`);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading program ${programId}:`, error);
    return null;
  }
}

// 将Markdown转换为Strapi的blocks格式
function markdownToBlocks(markdown) {
  if (!markdown) return [];

  // 简单处理，将每一行转换为一个段落
  return markdown.split('\n').map(line => ({
    type: 'paragraph',
    children: [
      {
        type: 'text',
        text: line
      }
    ]
  }));
}

// 创建中文版本的程序
async function createChineseProgram(programId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 准备创建数据
    const createData = {
      data: {
        title: programData.title_zh,
        program_id: programData.program_id,
        description: markdownToBlocks(programData.overview_zh),
        highlights: markdownToBlocks(programData.highlights_zh),
        itinerary: markdownToBlocks(programData.itinerary_zh),
        features: markdownToBlocks(programData.features_zh),
        other_info: markdownToBlocks(programData.other_info_zh),
        duration: programData.duration_zh,
        camp_period: programData.duration_zh, // 使用duration作为camp_period
        locale: 'zh',
        publishedAt: new Date().toISOString() // 设置发布时间，使程序状态为已发布
      }
    };

    console.log(`Creating Chinese program ${programId}: ${programData.title_zh}...`);

    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    // 使用Strapi API创建
    const response = await axios.post(
      `${STRAPI_URL}/api/programs`,
      createData,
      { headers }
    );

    console.log(`Chinese program ${programId} created successfully with ID: ${response.data.data.id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error creating Chinese program ${programId}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// 创建英文版本的程序
async function createEnglishProgram(programId, documentId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 准备创建数据
    const createData = {
      data: {
        title: programData.title_en,
        program_id: programData.program_id,
        description: programData.overview_en,
        highlights: programData.highlights_en,
        itinerary: programData.itinerary_en,
        features: programData.features_en,
        other_info: programData.other_info_en,
        duration: programData.duration_en,
        location: programData.location_en,
        grade_level: programData.grade_level_en,
        locale: 'en',
        documentId: documentId, // 使用中文版本的documentId
        publishedAt: new Date().toISOString() // 设置发布时间，使程序状态为已发布
      }
    };

    console.log(`Creating English program ${programId}: ${programData.title_en}...`);

    // 准备请求头
    const headers = {
      'Content-Type': 'application/json',
    };

    if (STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
    }

    // 使用Strapi API创建
    const response = await axios.post(
      `${STRAPI_URL}/api/programs`,
      createData,
      { headers }
    );

    console.log(`English program ${programId} created successfully with ID: ${response.data.data.id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error creating English program ${programId}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// 主函数
async function main() {
  // 获取所有程序
  const programs = [];
  for (let i = 1; i <= 9; i++) {
    const program = await readProgramData(i);
    if (program) {
      programs.push({ id: i, data: program });
    }
  }

  console.log(`Found ${programs.length} programs in mock data`);

  // 处理所有程序
  for (const program of programs) {
    const programId = program.id;
    const programData = program.data;

    console.log(`\n--- Processing Program ${programId}: ${programData.title_zh} ---`);

    // 1. 创建中文版本
    const chineseProgram = await createChineseProgram(programId);
    if (!chineseProgram) {
      console.error(`Failed to create Chinese program ${programId}, skipping English version`);
      continue;
    }

    // 2. 获取documentId
    const documentId = chineseProgram.attributes.documentId;
    console.log(`Got documentId: ${documentId} for program ${programId}`);

    // 3. 创建英文版本
    const englishProgram = await createEnglishProgram(programId, documentId);
    if (!englishProgram) {
      console.error(`Failed to create English program ${programId}`);
    } else {
      console.log(`Successfully created both Chinese and English versions for program ${programId}`);
    }

    // 等待一下，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nAll programs processed!');
}

// 执行主函数
main().catch(console.error);
