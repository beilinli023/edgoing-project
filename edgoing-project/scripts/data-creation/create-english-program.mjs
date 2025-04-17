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

// 准备请求头
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  return headers;
}

// 创建英文版本的程序
async function createEnglishProgram(programId) {
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
        description: markdownToBlocks(programData.overview_en),
        highlights: markdownToBlocks(programData.highlights_en),
        itinerary: markdownToBlocks(programData.itinerary_en),
        features: markdownToBlocks(programData.features_en),
        other_info: markdownToBlocks(programData.other_info_en),
        duration: programData.duration_en,
        camp_period: programData.duration_en, // 使用duration作为camp_period
        locale: 'en',
        publishedAt: new Date().toISOString()
      }
    };

    console.log(`Creating English program ${programId}: ${programData.title_en}...`);

    // 使用Strapi API创建
    const response = await axios.post(
      `${STRAPI_URL}/api/programs`,
      createData,
      { headers: getHeaders() }
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

  // 处理第一个程序
  const programId = 1;
  const programData = programs.find(p => p.id === programId);

  if (programData) {
    console.log(`\n--- Processing Program ${programId}: ${programData.data.title_en} ---`);
    await createEnglishProgram(programId);
  } else {
    console.log(`Program ${programId} not found`);
  }

  console.log('\nAll programs processed!');
}

// 执行主函数
main().catch(console.error);
