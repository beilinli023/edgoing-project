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

// 创建或获取国家
async function createOrGetCountry(countryName, locale) {
  try {
    // 先检查国家是否已存在
    const response = await axios.get(
      `${STRAPI_URL}/api/countries?filters[countryname][$eq]=${encodeURIComponent(countryName)}&filters[locale][$eq]=${locale}`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      console.log(`Country ${countryName} already exists with ID: ${response.data.data[0].id}`);
      return response.data.data[0].id;
    }

    // 如果不存在，创建新国家
    const createData = {
      data: {
        countryname: countryName,
        locale: locale,
        publishedAt: new Date().toISOString()
      }
    };

    const createResponse = await axios.post(
      `${STRAPI_URL}/api/countries`,
      createData,
      { headers: getHeaders() }
    );

    console.log(`Created country ${countryName} with ID: ${createResponse.data.data.id}`);
    return createResponse.data.data.id;
  } catch (error) {
    console.error(`Error creating/getting country ${countryName}:`, error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    return null;
  }
}

// 获取年级ID
async function getGradeId(gradeName, locale) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/grades?filters[gradename][$eq]=${encodeURIComponent(gradeName)}&filters[locale][$eq]=${locale}`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error getting grade ID for ${gradeName}:`, error.message);
    return null;
  }
}

// 获取项目类型ID
async function getProgramTypeId(typeName, locale) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/programtypes?filters[programname][$eq]=${encodeURIComponent(typeName)}&filters[locale][$eq]=${locale}`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      return response.data.data[0].id;
    }
    return null;
  } catch (error) {
    console.error(`Error getting program type ID for ${typeName}:`, error.message);
    return null;
  }
}

// 创建中文版本的程序
async function createChineseProgram(programId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 创建或获取国家
    const countryId = await createOrGetCountry(programData.country_zh, 'zh');

    // 获取年级ID
    const gradeId = await getGradeId(programData.grade_level_zh, 'zh');

    // 获取项目类型ID（假设只使用第一个类型）
    const programTypeId = programData.program_type_zh && programData.program_type_zh.length > 0
      ? await getProgramTypeId(programData.program_type_zh[0], 'zh')
      : null;

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
        publishedAt: new Date().toISOString()
      }
    };

    // 添加关联
    if (countryId) {
      createData.data.countries = [countryId];
    }

    if (gradeId) {
      createData.data.grades = [gradeId];
    }

    if (programTypeId) {
      createData.data.programtypes = [programTypeId];
    }

    console.log(`Creating Chinese program ${programId}: ${programData.title_zh}...`);

    // 使用Strapi API创建
    const response = await axios.post(
      `${STRAPI_URL}/api/programs`,
      createData,
      { headers: getHeaders() }
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

    // 检查是否已存在
    try {
      const existingResponse = await axios.get(
        `${STRAPI_URL}/api/programs?filters[program_id][$eq]=${programData.program_id}&filters[locale][$eq]=zh`,
        { headers: getHeaders() }
      );

      if (existingResponse.data.data && existingResponse.data.data.length > 0) {
        console.log(`Program ${programId} already exists with ID: ${existingResponse.data.data[0].id}, skipping`);
        continue;
      }
    } catch (error) {
      console.error(`Error checking existing program ${programId}:`, error.message);
    }

    // 创建中文版本
    await createChineseProgram(programId);

    // 等待一下，避免请求过快
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\nAll programs processed!');
}

// 执行主函数
main().catch(console.error);
