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

// 创建或更新英文版本的程序
async function updateEnglishProgram(programId, englishProgramId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 准备更新数据
    const updateData = {
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
        publishedAt: new Date().toISOString()
      }
    };

    console.log(`Updating English program ${programId}: ${programData.title_en}...`);

    // 使用Strapi API更新
    console.log(`PUT URL: ${STRAPI_URL}/api/programs/${englishProgramId}`);
    const response = await axios.put(
      `${STRAPI_URL}/api/programs/${englishProgramId}`,
      updateData,
      { headers: getHeaders() }
    );

    console.log(`English program ${programId} updated successfully with ID: ${response.data.data.id}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error updating English program ${programId}:`, error.message);
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

  // 获取已有的英文程序
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/programs?locale=en`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      console.log(`Found ${response.data.data.length} English programs in Strapi`);

      // 处理每个英文程序
      for (const englishProgram of response.data.data) {
        const programId = englishProgram.program_id;

        console.log(`\n--- Processing English program: ${englishProgram.title} (ID: ${englishProgram.id}, Program ID: ${programId}) ---`);

        // 查找对应的程序数据
        const programData = programs.find(p => p.data.program_id === programId);
        if (!programData) {
          console.log(`No matching program data found for program ID: ${programId}, skipping`);
          continue;
        }

        // 更新英文版本
        console.log(`Updating English program ${programId} with ID: ${englishProgram.id}`);
        await updateEnglishProgram(programData.id, englishProgram.id);
      }
    } else {
      console.log('No English programs found in Strapi');
    }
  } catch (error) {
    console.error('Error getting English programs:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }

  console.log('\nAll programs processed!');
}

// 执行主函数
main().catch(console.error);
