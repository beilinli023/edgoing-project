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
const PROGRAMS_DIR = path.join(__dirname, 'public/content/programs');

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

// 创建英文版本的程序（使用本地化API）
async function createEnglishProgramLocalization(programId, chineseProgramId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 准备创建数据
    const createData = {
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
    };

    console.log(`Creating English localization for program ${programId}: ${programData.title_en}...`);

    // 使用Strapi本地化API创建
    const response = await axios.post(
      `${STRAPI_URL}/api/programs/${chineseProgramId}/localizations`,
      { data: createData },
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

  // 获取已有的中文程序
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/programs?locale=zh`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      console.log(`Found ${response.data.data.length} Chinese programs in Strapi`);
      
      // 处理每个中文程序
      for (const chineseProgram of response.data.data) {
        const documentId = chineseProgram.documentId;
        const title = chineseProgram.title;
        const programId = chineseProgram.program_id;
        
        console.log(`\n--- Processing Chinese program: ${title} (ID: ${chineseProgram.id}, Program ID: ${programId}) ---`);
        
        // 查找对应的程序数据
        const programData = programs.find(p => p.data.program_id === programId);
        if (!programData) {
          console.log(`No matching program data found for program ID: ${programId}, skipping`);
          continue;
        }
        
        // 检查是否已有英文版本
        const enResponse = await axios.get(
          `${STRAPI_URL}/api/programs?locale=en&filters[program_id][$eq]=${programId}`,
          { headers: getHeaders() }
        );
        
        if (enResponse.data.data && enResponse.data.data.length > 0) {
          console.log(`English version already exists for program ${programId}, skipping`);
          continue;
        }
        
        // 创建英文版本
        console.log(`Creating English version for program ${programId} with ID: ${chineseProgram.id}`);
        await createEnglishProgramLocalization(programData.id, chineseProgram.id);
      }
    } else {
      console.log('No Chinese programs found in Strapi');
    }
  } catch (error) {
    console.error('Error getting Chinese programs:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }

  console.log('\nAll programs processed!');
}

// 执行主函数
main().catch(console.error);
