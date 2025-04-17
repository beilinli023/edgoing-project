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

// 创建或获取目的地
async function createOrGetDestination(cityName, countryId, locale) {
  try {
    // 先检查目的地是否已存在
    const response = await axios.get(
      `${STRAPI_URL}/api/destinations?filters[city][$eq]=${encodeURIComponent(cityName)}&filters[locale][$eq]=${locale}`,
      { headers: getHeaders() }
    );

    if (response.data.data && response.data.data.length > 0) {
      console.log(`Destination ${cityName} already exists with ID: ${response.data.data[0].id}`);
      return response.data.data[0].id;
    }

    // 如果不存在，创建新目的地
    const createData = {
      data: {
        city: cityName,
        country: countryId,
        locale: locale,
        publishedAt: new Date().toISOString()
      }
    };

    const createResponse = await axios.post(
      `${STRAPI_URL}/api/destinations`,
      createData,
      { headers: getHeaders() }
    );

    console.log(`Created destination ${cityName} with ID: ${createResponse.data.data.id}`);
    return createResponse.data.data.id;
  } catch (error) {
    console.error(`Error creating/getting destination ${cityName}:`, error.message);
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

// 创建英文版本的程序
async function createEnglishProgram(programId, documentId) {
  try {
    const programData = await readProgramData(programId);
    if (!programData) {
      console.error(`Program ${programId} not found`);
      return null;
    }

    // 创建或获取国家
    const countryId = await createOrGetCountry(programData.country_en, 'en');

    // 创建或获取目的地
    const destinationId = countryId ? await createOrGetDestination(programData.location_en, countryId, 'en') : null;

    // 获取年级ID
    const gradeId = await getGradeId(programData.grade_level_en, 'en');

    // 获取项目类型ID（假设只使用第一个类型）
    const programTypeId = programData.program_type_en && programData.program_type_en.length > 0
      ? await getProgramTypeId(programData.program_type_en[0], 'en')
      : null;

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
        documentId: documentId, // 使用中文版本的documentId
        publishedAt: new Date().toISOString()
      }
    };

    // 添加关联
    if (countryId) {
      createData.data.countries = [countryId];
    }

    if (destinationId) {
      createData.data.destinations = [destinationId];
    }

    if (gradeId) {
      createData.data.grades = [gradeId];
    }

    if (programTypeId) {
      createData.data.programtypes = [programTypeId];
    }

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
          `${STRAPI_URL}/api/programs?locale=en&filters[documentId][$eq]=${documentId}`,
          { headers: getHeaders() }
        );

        if (enResponse.data.data && enResponse.data.data.length > 0) {
          console.log(`English version already exists for program ${programId}, skipping`);
          continue;
        }

        // 创建英文版本
        console.log(`Creating English version for program ${programId} with documentId: ${documentId}`);
        await createEnglishProgram(programData.id, documentId);
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
