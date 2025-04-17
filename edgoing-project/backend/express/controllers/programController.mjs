import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi API URL
const strapiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN || '';

/**
 * 将相对路径转换为完整的URL
 * @param {string} path - 相对路径
 * @returns {string} - 完整的URL
 */
const getFullUrl = (path) => {
  if (!path) return '';

  // 如果已经是完整的URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // 确保路径以/开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  // 将相对路径与Strapi域名组合
  return `${strapiUrl}${normalizedPath}`;
};

// 获取关联字段的多语言版本
const fetchRelatedFieldsLocalized = async (strapiProgram) => {
  const results = {
    programtypes_zh: [],
    programtypes_en: [],
    grades_zh: [],
    grades_en: [],
    destinations_zh: [],
    destinations_en: [],
    countries_zh: [],
    countries_en: []
  };

  try {
    // 获取项目类型的中文版本
    if (strapiProgram.programtypes?.length) {
      const programtypeIds = strapiProgram.programtypes.map(type => type.documentId);
      console.log('Fetching programtypes with documentIds:', programtypeIds);

      // 获取中文版本
      const programtypesZhResponse = await axios.get(`${strapiUrl}/api/programtypes`, {
        params: {
          locale: 'zh',
          'filters[documentId][$in]': programtypeIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (programtypesZhResponse.data?.data) {
        results.programtypes_zh = programtypesZhResponse.data.data.map(item => item.programname);
        console.log('Found ZH programtypes:', results.programtypes_zh);
      }

      // 获取英文版本
      const programtypesEnResponse = await axios.get(`${strapiUrl}/api/programtypes`, {
        params: {
          locale: 'en',
          'filters[documentId][$in]': programtypeIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (programtypesEnResponse.data?.data) {
        results.programtypes_en = programtypesEnResponse.data.data.map(item => item.programname);
        console.log('Found EN programtypes:', results.programtypes_en);
      }
    }

    // 获取年级的中文版本
    if (strapiProgram.grades?.length) {
      const gradeIds = strapiProgram.grades.map(grade => grade.documentId);
      console.log('Fetching grades with documentIds:', gradeIds);

      // 获取中文版本
      const gradesZhResponse = await axios.get(`${strapiUrl}/api/grades`, {
        params: {
          locale: 'zh',
          'filters[documentId][$in]': gradeIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (gradesZhResponse.data?.data) {
        results.grades_zh = gradesZhResponse.data.data.map(item => item.gradename);
        console.log('Found ZH grades:', results.grades_zh);
      }

      // 获取英文版本
      const gradesEnResponse = await axios.get(`${strapiUrl}/api/grades`, {
        params: {
          locale: 'en',
          'filters[documentId][$in]': gradeIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (gradesEnResponse.data?.data) {
        results.grades_en = gradesEnResponse.data.data.map(item => item.gradename);
        console.log('Found EN grades:', results.grades_en);
      }
    }

    // 获取目的地的中文版本
    if (strapiProgram.destinations?.length) {
      const destinationIds = strapiProgram.destinations.map(dest => dest.documentId);
      console.log('Fetching destinations with documentIds:', destinationIds);

      // 获取中文版本
      const destinationsZhResponse = await axios.get(`${strapiUrl}/api/destinations`, {
        params: {
          locale: 'zh',
          'filters[documentId][$in]': destinationIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (destinationsZhResponse.data?.data) {
        results.destinations_zh = destinationsZhResponse.data.data.map(item => item.city);
        console.log('Found ZH destinations:', results.destinations_zh);
      }

      // 获取英文版本
      const destinationsEnResponse = await axios.get(`${strapiUrl}/api/destinations`, {
        params: {
          locale: 'en',
          'filters[documentId][$in]': destinationIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (destinationsEnResponse.data?.data) {
        results.destinations_en = destinationsEnResponse.data.data.map(item => item.city);
        console.log('Found EN destinations:', results.destinations_en);
      }
    }

    // 获取国家的中文版本
    if (strapiProgram.countries?.length) {
      const countryIds = strapiProgram.countries.map(country => country.documentId);
      console.log('Fetching countries with documentIds:', countryIds);

      // 获取中文版本
      const countriesZhResponse = await axios.get(`${strapiUrl}/api/countries`, {
        params: {
          locale: 'zh',
          'filters[documentId][$in]': countryIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (countriesZhResponse.data?.data) {
        results.countries_zh = countriesZhResponse.data.data.map(item => item.countryname);
        console.log('Found ZH countries:', results.countries_zh);
      }

      // 获取英文版本
      const countriesEnResponse = await axios.get(`${strapiUrl}/api/countries`, {
        params: {
          locale: 'en',
          'filters[documentId][$in]': countryIds
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (countriesEnResponse.data?.data) {
        results.countries_en = countriesEnResponse.data.data.map(item => item.countryname);
        console.log('Found EN countries:', results.countries_en);
      }
    }
  } catch (error) {
    console.error('Error fetching related fields:', error.message);
  }

  return results;
};

// 处理富文本内容，保留富文本格式
const processRichText = (richTextData) => {
  // 如果是纯文本字符串，直接返回
  if (typeof richTextData === 'string') return richTextData;

  // 如果是空值或非数组，返回空字符串
  if (!richTextData || !Array.isArray(richTextData)) return '';

  // 直接返回富文本数组，保留其结构和格式
  return richTextData;
};

// 转换 Strapi 响应到前端格式
const transformProgramData = (strapiProgram) => {
  if (!strapiProgram) return null;

  // 打印字段信息以便调试
  console.log('Program keys:', Object.keys(strapiProgram));
  console.log('Program documentId:', strapiProgram.documentId);
  console.log('Program locale:', strapiProgram.locale);

  // 获取英文和中文版本
  // 使用 documentId 确保我们获取的是同一内容的不同语言版本
  const enVersion = strapiProgram.locale === 'en' ? strapiProgram : strapiProgram.localizations?.find(loc => loc.locale === 'en');
  const zhVersion = strapiProgram.locale === 'zh' ? strapiProgram : strapiProgram.localizations?.find(loc => loc.locale === 'zh');

  // 打印语言版本信息以便调试
  console.log('Found EN version:', enVersion ? `ID ${enVersion.id}, documentId ${enVersion.documentId}` : 'Not found');
  console.log('Found ZH version:', zhVersion ? `ID ${zhVersion.id}, documentId ${zhVersion.documentId}` : 'Not found');

  // 如果没有找到对应语言版本，使用当前版本
  const en = enVersion || strapiProgram;
  const zh = zhVersion || strapiProgram;

  // 处理关联字段的多语言内容
  const processRelationalField = (field, fieldName, locale) => {
    if (!field) return [];

    return field.map(item => {
      console.log(`Processing ${fieldName} item:`, {
        id: item.id,
        documentId: item.documentId,
        locale: item.locale,
        name: item[fieldName],
        hasLocalizations: !!item.localizations
      });

      // 如果当前项的语言与目标语言相同，直接使用
      if (item.locale === locale) return item[fieldName];

      // 否则，通过 documentId 查找对应语言版本
      const localizedItem = item.localizations?.find(loc => loc.locale === locale);
      if (localizedItem) {
        console.log(`Found ${locale} version for ${fieldName}:`, localizedItem[fieldName]);
      }
      return localizedItem ? localizedItem[fieldName] : item[fieldName];
    });
  };

  // 处理单个关联字段的多语言内容，用于目的地等需要连接的字段
  const processSingleRelationalField = (field, fieldName, locale) => {
    if (!field) return '';

    return processRelationalField(field, fieldName, locale).join(', ');
  };

  return {
    id: strapiProgram.id,
    title_en: en.title || '',
    title_zh: zh.title || '',
    slug: strapiProgram.slug || '',
    program_id: strapiProgram.program_id || '',

    // 媒体字段 - 使用getFullUrl函数处理URL
    image: strapiProgram.cover_image?.url ? getFullUrl(strapiProgram.cover_image.url) : '',
    gallery_images: strapiProgram.gallery_images?.map(img => img.url ? getFullUrl(img.url) : '') || [],

    // 时间和地点
    duration_en: en.duration || '',
    duration_zh: zh.duration || '',
    // 添加默认值确保营期和截止日期字段始终有值
    // 打印原始值以便调试
    camp_period: (() => {
      console.log('原始 camp_period 值:', strapiProgram.camp_period);
      return strapiProgram.camp_period || '';
    })(),
    camp_period_en: (() => {
      console.log('原始 camp_period_en 值:', en.camp_period);
      return en.camp_period || strapiProgram.camp_period || '';
    })(),
    camp_period_zh: (() => {
      console.log('原始 camp_period_zh 值:', zh.camp_period);
      return zh.camp_period || strapiProgram.camp_period || '';
    })(),
    // 添加 display_order 字段
    display_order: (() => {
      console.log('原始 display_order 值:', strapiProgram.display_order);
      return strapiProgram.display_order || 0;
    })(),
    deadline: (() => {
      console.log('原始 deadline 值:', strapiProgram.deadline);
      return strapiProgram.deadline || '';
    })(),

    // 关联字段 - 使用新的处理函数确保正确关联不同语言版本
    program_type_en: processRelationalField(strapiProgram.programtypes, 'programname', 'en'),
    program_type_zh: processRelationalField(strapiProgram.programtypes, 'programname', 'zh'),

    grade_level_en: processRelationalField(strapiProgram.grades, 'gradename', 'en'),
    grade_level_zh: processRelationalField(strapiProgram.grades, 'gradename', 'zh'),

    destination_en: processSingleRelationalField(strapiProgram.destinations, 'city', 'en'),
    destination_zh: (() => {
      // 获取原始中文目的地
      const originalDestination = processSingleRelationalField(strapiProgram.destinations, 'city', 'zh');

      // 如果中文目的地是英文，尝试翻译
      if (originalDestination && !(/[\u4e00-\u9fa5]/.test(originalDestination))) {
        // 常见地点的英文到中文映射
        const locationMap = {
          'Singapore': '新加坡',
          'Shanghai': '上海',
          'Beijing': '北京',
          'Hong Kong': '香港',
          'London': '伦敦',
          'New York': '纽约',
          'Tokyo': '东京',
          'Paris': '巴黎',
          'Sydney': '悉尼',
          'Melbourne': '墨尔本',
          'Toronto': '多伦多',
          'Vancouver': '温哥华'
        };

        // 尝试直接匹配
        if (locationMap[originalDestination]) {
          console.log(`将目的地从 ${originalDestination} 翻译为 ${locationMap[originalDestination]}`);
          return locationMap[originalDestination];
        } else {
          // 尝试部分匹配
          for (const [en, zh] of Object.entries(locationMap)) {
            if (originalDestination.includes(en)) {
              const translated = originalDestination.replace(en, zh);
              console.log(`将目的地从 ${originalDestination} 翻译为 ${translated}`);
              return translated;
            }
          }
        }
      }

      return originalDestination;
    })(),

    country_en: processRelationalField(strapiProgram.countries, 'countryname', 'en'),
    country_zh: processRelationalField(strapiProgram.countries, 'countryname', 'zh'),

    // 排序 - 使用真实值，不设置默认值
    display_order: strapiProgram.display_order || 0,

    // 富文本内容 - 使用 processRichText 函数处理
    description_en: processRichText(en.description) || '',
    description_zh: processRichText(zh.description) || '',
    // 将 description 字段映射到 overview 字段，用于项目概述
    overview_en: processRichText(en.description) || '',
    overview_zh: processRichText(zh.description) || '',
    highlights_en: processRichText(en.highlights) || '',
    highlights_zh: processRichText(zh.highlights) || '',
    itinerary_en: processRichText(en.itinerary) || '',
    itinerary_zh: processRichText(zh.itinerary) || '',
    features_en: processRichText(en.features) || '',
    features_zh: processRichText(zh.features) || '',
    other_info_en: processRichText(en.other_info) || '',
    other_info_zh: processRichText(zh.other_info) || '',

    // 状态字段
    status: strapiProgram.publishedAt ? 'published' : 'draft',
    published_at: strapiProgram.publishedAt
  };
};

// 获取项目列表
export const getAllPrograms = async (req, res) => {
  try {
    const { locale = 'en', page = 1, limit = 10, programType, gradeLevel, country } = req.query;

    // 构建查询参数
    const queryParams = {
      locale,
      sort: 'display_order:asc',
      'pagination[page]': page,
      'pagination[pageSize]': limit,
      populate: '*'
    };

    // 添加筛选条件
    if (programType) {
      queryParams['filters[programtypes][programname][$containsi]'] = programType;
      console.log(`添加项目类型筛选条件: ${programType}`);
    }

    if (gradeLevel) {
      queryParams['filters[grades][gradename][$containsi]'] = gradeLevel;
      console.log(`添加年级筛选条件: ${gradeLevel}`);
    }

    if (country) {
      queryParams['filters[countries][countryname][$containsi]'] = country;
      console.log(`添加国家筛选条件: ${country}`);
    }

    console.log('请求参数:', req.query);
    console.log('Strapi 查询参数:', queryParams);

    const response = await axios.get(`${strapiUrl}/api/programs`, {
      params: queryParams,
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return res.json({
        data: [],
        total: 0,
        page: 1,
        totalPages: 0
      });
    }

    // 处理每个项目，并获取关联字段的多语言版本
    const programsPromises = response.data.data.map(async (strapiProgram) => {
      try {
        // 获取关联字段的多语言版本
        const relatedFieldsLocalized = await fetchRelatedFieldsLocalized(strapiProgram);

        // 转换数据格式
        const program = transformProgramData(strapiProgram);

        // 使用从 Strapi 直接获取的多语言版本覆盖原有字段
        if (relatedFieldsLocalized && relatedFieldsLocalized.programtypes_en && relatedFieldsLocalized.programtypes_en.length > 0) {
          program.program_type_en = relatedFieldsLocalized.programtypes_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.programtypes_zh && relatedFieldsLocalized.programtypes_zh.length > 0) {
          program.program_type_zh = relatedFieldsLocalized.programtypes_zh;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.grades_en && relatedFieldsLocalized.grades_en.length > 0) {
          program.grade_level_en = relatedFieldsLocalized.grades_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.grades_zh && relatedFieldsLocalized.grades_zh.length > 0) {
          program.grade_level_zh = relatedFieldsLocalized.grades_zh;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.destinations_en && relatedFieldsLocalized.destinations_en.length > 0) {
          program.destination_en = relatedFieldsLocalized.destinations_en.join(', ');
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.destinations_zh && relatedFieldsLocalized.destinations_zh.length > 0) {
          program.destination_zh = relatedFieldsLocalized.destinations_zh.join(', ');
        }

        // 如果中文目的地是英文，尝试翻译
        if (program.destination_zh && !(/[\u4e00-\u9fa5]/.test(program.destination_zh))) {
          // 常见地点的英文到中文映射
          const locationMap = {
            'Singapore': '新加坡',
            'Shanghai': '上海',
            'Beijing': '北京',
            'Hong Kong': '香港',
            'London': '伦敦',
            'New York': '纽约',
            'Tokyo': '东京',
            'Paris': '巴黎',
            'Sydney': '悉尼',
            'Melbourne': '墨尔本',
            'Toronto': '多伦多',
            'Vancouver': '温哥华'
          };

          // 尝试直接匹配
          if (locationMap[program.destination_zh]) {
            console.log(`将目的地从 ${program.destination_zh} 翻译为 ${locationMap[program.destination_zh]}`);
            program.destination_zh = locationMap[program.destination_zh];
          } else {
            // 尝试部分匹配
            for (const [en, zh] of Object.entries(locationMap)) {
              if (program.destination_zh.includes(en)) {
                const translated = program.destination_zh.replace(en, zh);
                console.log(`将目的地从 ${program.destination_zh} 翻译为 ${translated}`);
                program.destination_zh = translated;
                break;
              }
            }
          }
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.countries_en && relatedFieldsLocalized.countries_en.length > 0) {
          program.country_en = relatedFieldsLocalized.countries_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.countries_zh && relatedFieldsLocalized.countries_zh.length > 0) {
          program.country_zh = relatedFieldsLocalized.countries_zh;
        }

        return program;
      } catch (error) {
        console.error('Error processing program:', error);
        // 如果处理失败，返回基本转换的结果
        return transformProgramData(strapiProgram);
      }
    });

    // 等待所有项目处理完成
    const programs = await Promise.all(programsPromises);
    const pagination = response.data.meta.pagination;

    res.json({
      data: programs,
      total: pagination.total,
      page: pagination.page,
      totalPages: pagination.pageCount
    });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

// 获取单个项目详情
export const getProgramById = async (req, res) => {
  try {
    const { id } = req.params;
    const { locale = 'en' } = req.query;

    console.log(`Fetching program with ID: ${id}, locale: ${locale}`);

    // 构建请求 URL 和参数
    const url = `${strapiUrl}/api/programs`;
    const params = {
      locale,
      populate: '*'
    };

    console.log('Request URL:', url);
    console.log('Request params:', params);
    console.log('Request headers:', strapiToken ? { Authorization: 'Bearer [REDACTED]' } : {});
    console.log('Strapi URL:', strapiUrl);
    console.log('Strapi Token available:', !!strapiToken);

    // 添加错误处理
    try {
      // 使用 filters 参数获取所有项目
      const response = await axios.get(url, {
        params,
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      // 检查响应状态
      if (response.status !== 200) {
        console.error(`Strapi API returned status ${response.status}`);
        return res.status(response.status).json({
          error: 'Strapi API error',
          status: response.status,
          message: 'Failed to fetch data from Strapi API'
        });
      }

      console.log('Response status:', response.status);
      console.log('Response data:', JSON.stringify(response.data, null, 2));

      if (!response.data.data || response.data.data.length === 0) {
        console.log('No programs found');
        return res.status(404).json({ error: 'Programs not found' });
      }

      // 在所有项目中查找匹配的项目
      let matchedProgram = response.data.data.find(program => program.id.toString() === id);

      // 如果没有找到匹配的项目，尝试通过documentId查找
      if (!matchedProgram) {
        console.log(`No program found with ID: ${id}, trying to find by documentId or in localizations`);

        // 尝试在所有项目中查找具有匹配documentId的项目
        for (const program of response.data.data) {
          // 检查当前项目的ID
          if (program.documentId && program.documentId.toString() === id) {
            console.log(`Found program with documentId: ${id}`);
            matchedProgram = program;
            break;
          }

          // 检查本地化版本中是否有匹配的ID
          if (program.localizations && program.localizations.length > 0) {
            const matchedLocalization = program.localizations.find(loc => loc.id.toString() === id);
            if (matchedLocalization) {
              console.log(`Found program with localization ID: ${id}`);
              // 如果在本地化版本中找到匹配的ID，直接使用当前项目
              console.log(`Found program with localization ID: ${id}, using parent program`);
              matchedProgram = program;
              break;
            }
          }
        }

        // 如果仍然没有找到匹配的项目，返回第一个项目作为回退
        if (!matchedProgram && response.data.data.length > 0) {
          console.log(`Program with ID ${id} not found, returning first available program as fallback`);
          matchedProgram = response.data.data[0];

          // 打印可用的项目 ID，便于调试
          console.log('Available program IDs:', response.data.data.map(p => p.id).join(', '));

          // 在响应中添加一个标志，表示这是一个回退项目
          res.set('X-Program-Fallback', 'true');
          res.set('X-Available-Programs', response.data.data.map(p => p.id).join(','));
        } else if (!matchedProgram) {
          return res.status(404).json({
            error: 'Program not found',
            message: `No program found with ID ${id}. Please check the program ID and try again.`,
            availableIds: response.data.data.map(p => p.id)
          });
        }
      }

      // 获取匹配的项目
      const strapiProgram = matchedProgram;

      if (!strapiProgram) {
        return res.status(404).json({ error: 'Program not found' });
      }

      try {
        // 获取关联字段的多语言版本
        console.log('Fetching related fields localized versions...');
        const relatedFieldsLocalized = await fetchRelatedFieldsLocalized(strapiProgram);
        console.log('Related fields localized versions:', relatedFieldsLocalized);

        // 转换数据格式
        const program = transformProgramData(strapiProgram);

        // 使用从 Strapi 直接获取的多语言版本覆盖原有字段
        if (relatedFieldsLocalized && relatedFieldsLocalized.programtypes_en && relatedFieldsLocalized.programtypes_en.length > 0) {
          program.program_type_en = relatedFieldsLocalized.programtypes_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.programtypes_zh && relatedFieldsLocalized.programtypes_zh.length > 0) {
          program.program_type_zh = relatedFieldsLocalized.programtypes_zh;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.grades_en && relatedFieldsLocalized.grades_en.length > 0) {
          program.grade_level_en = relatedFieldsLocalized.grades_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.grades_zh && relatedFieldsLocalized.grades_zh.length > 0) {
          program.grade_level_zh = relatedFieldsLocalized.grades_zh;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.destinations_en && relatedFieldsLocalized.destinations_en.length > 0) {
          program.destination_en = relatedFieldsLocalized.destinations_en.join(', ');
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.destinations_zh && relatedFieldsLocalized.destinations_zh.length > 0) {
          program.destination_zh = relatedFieldsLocalized.destinations_zh.join(', ');
        }

        // 如果中文目的地是英文，尝试翻译
        if (program.destination_zh && !(/[\u4e00-\u9fa5]/.test(program.destination_zh))) {
          // 常见地点的英文到中文映射
          const locationMap = {
            'Singapore': '新加坡',
            'Shanghai': '上海',
            'Beijing': '北京',
            'Hong Kong': '香港',
            'London': '伦敦',
            'New York': '纽约',
            'Tokyo': '东京',
            'Paris': '巴黎',
            'Sydney': '悉尼',
            'Melbourne': '墨尔本',
            'Toronto': '多伦多',
            'Vancouver': '温哥华'
          };

          // 尝试直接匹配
          if (locationMap[program.destination_zh]) {
            console.log(`将目的地从 ${program.destination_zh} 翻译为 ${locationMap[program.destination_zh]}`);
            program.destination_zh = locationMap[program.destination_zh];
          } else {
            // 尝试部分匹配
            for (const [en, zh] of Object.entries(locationMap)) {
              if (program.destination_zh.includes(en)) {
                const translated = program.destination_zh.replace(en, zh);
                console.log(`将目的地从 ${program.destination_zh} 翻译为 ${translated}`);
                program.destination_zh = translated;
                break;
              }
            }
          }
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.countries_en && relatedFieldsLocalized.countries_en.length > 0) {
          program.country_en = relatedFieldsLocalized.countries_en;
        }

        if (relatedFieldsLocalized && relatedFieldsLocalized.countries_zh && relatedFieldsLocalized.countries_zh.length > 0) {
          program.country_zh = relatedFieldsLocalized.countries_zh;
        }

        res.json(program);
        return; // 添加return语句，防止继续执行
      } catch (processingError) {
        console.error('Error processing program data:', processingError);
        // 如果处理失败，返回基本转换的结果
        const basicProgram = transformProgramData(strapiProgram);
        res.json(basicProgram);
        return; // 添加return语句，防止继续执行
      }
    } catch (axiosError) {
      console.error('Error making request to Strapi API:', axiosError.message);
      if (axiosError.response) {
        console.error('Strapi API response status:', axiosError.response.status);
        console.error('Strapi API response data:', axiosError.response.data);
      }
      return res.status(500).json({
        error: 'Strapi API request failed',
        message: axiosError.message,
        details: axiosError.response ? axiosError.response.data : null
      });
    }
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

// 更新程序排序
export const updateProgramsOrder = async (req, res) => {
  try {
    console.log('收到更新排序请求:', req.body);

    const { programs } = req.body;

    if (!Array.isArray(programs) || programs.length === 0) {
      console.error('无效的程序数据:', req.body);
      return res.status(400).json({ success: false, message: '无效的程序数据' });
    }

    console.log('更新程序排序:', JSON.stringify(programs, null, 2));

    // 首先获取所有程序，确保我们只更新存在的程序
    console.log('开始获取所有程序...');
    try {
      const strapiResponse = await axios.get(`${strapiUrl}/api/programs?pagination[pageSize]=100`, {
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      console.log('成功获取程序列表');

      // 检查响应结构
      if (!strapiResponse.data || !strapiResponse.data.data) {
        console.error('意外的Strapi响应格式:', strapiResponse.data);
        return res.status(500).json({ success: false, message: 'Strapi响应格式错误' });
      }

      const existingPrograms = strapiResponse.data.data || [];
      console.log(`找到 ${existingPrograms.length} 个现有程序`);

      // 打印前几个程序的ID和标题
      existingPrograms.slice(0, 3).forEach(p => {
        console.log(`程序 ID: ${p.id}, 标题: ${p.attributes?.title || '无标题'}`);
      });

      // 创建一个存在程序的ID映射
      const existingProgramIds = new Set(existingPrograms.map(p => p.id.toString()));

      // 过滤出存在的程序
      const validPrograms = programs.filter(program => {
        const exists = existingProgramIds.has(program.id.toString());
        if (!exists) {
          console.log(`程序 ID ${program.id} 不存在，已跳过`);
        }
        return exists;
      });

      console.log(`将更新 ${validPrograms.length} 个有效程序的排序`);

      if (validPrograms.length === 0) {
        console.warn('没有有效的程序需要更新');
        return res.status(400).json({ success: false, message: '没有有效的程序需要更新' });
      }

      // 更新所有有效程序的 display_order 字段
      console.log('开始更新程序排序...');
      const updateResults = await Promise.allSettled(validPrograms.map(async (program) => {
        try {
          // 在Strapi v4中，正确的端点是 /api/programs/:id
          // 但是我们需要确保使用正确的ID格式
          // 在获取程序列表时，我们已经有了完整的程序对象
          // 我们需要使用它们的ID而不是前端传来的ID

          // 找到对应的程序对象
          const existingProgram = existingPrograms.find(p => p.id.toString() === program.id.toString());

          if (!existingProgram) {
            console.error(`找不到ID为 ${program.id} 的程序`);
            return { id: program.id, success: false, error: '找不到程序' };
          }

          // 使用正确的ID和端点
          const updateUrl = `${strapiUrl}/api/programs/${existingProgram.id}`;
          const updateData = {
            data: {
              display_order: program.order_index
            }
          };
          const headers = strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {};

          console.log(`尝试更新程序 ${program.id} 的排序为 ${program.order_index}`);
          console.log(`PUT ${updateUrl}`);
          console.log('Data:', JSON.stringify(updateData));

          const updateResponse = await axios.put(updateUrl, updateData, { headers });

          console.log(`成功更新程序 ${program.id} 的排序为 ${program.order_index}`);
          return { id: program.id, success: true };
        } catch (updateError) {
          console.error(`更新程序 ${program.id} 排序失败:`, updateError.message);
          if (updateError.response) {
            console.error('Response status:', updateError.response.status);
            console.error('Response data:', JSON.stringify(updateError.response.data));
          }
          return { id: program.id, success: false, error: updateError.message };
        }
      }));

      // 检查结果
      const successCount = updateResults.filter(result => result.status === 'fulfilled' && result.value.success).length;
      const failureCount = updateResults.length - successCount;

      if (failureCount > 0) {
        console.warn(`${failureCount} 个程序排序更新失败`);
      }

      if (successCount > 0) {
        res.json({
          success: true,
          message: `成功更新 ${successCount} 个程序的排序${failureCount > 0 ? `，${failureCount} 个失败` : ''}`
        });
      } else {
        res.status(500).json({
          success: false,
          message: '所有程序排序更新失败'
        });
      }
    } catch (strapiError) {
      console.error('获取程序列表失败:', strapiError.message);
      if (strapiError.response) {
        console.error('Response status:', strapiError.response.status);
        console.error('Response data:', JSON.stringify(strapiError.response.data));
      }
      res.status(500).json({ success: false, message: '获取程序列表失败' });
    }
  } catch (error) {
    console.error('更新程序排序失败:', error.message);
    if (error.stack) {
      console.error('Error stack:', error.stack);
    }
    res.status(500).json({ success: false, message: '更新程序排序失败' });
  }
};

// 获取项目页面Hero数据
export const getProgramHero = async (req, res) => {
  try {
    const { locale = 'en' } = req.query;

    console.log(`获取项目页面Hero数据，语言: ${locale}`);

    // 尝试从 Strapi 获取 programHero 数据
    console.log(`尝试从 Strapi 获取 programHero 数据: ${strapiUrl}/api/programsheroes`);
    const response = await axios.get(`${strapiUrl}/api/programsheroes`, {
      params: {
        locale,
        'populate': '*'
      },
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
    });

    console.log(`Strapi 响应状态码: ${response.status}`);
    console.log('Strapi 响应数据:', response.data);

    if (response.data && response.data.data && response.data.data.length > 0) {
      const heroData = response.data.data[0];
      console.log('找到 programHero 数据:', heroData);

      // 构建返回数据
      const strapiHeroData = {
        id: heroData.id,
        title: heroData.title || '',
        subtitle: heroData.subtitle || '',
        imageUrl: heroData.programhero?.url ? `${strapiUrl}${heroData.programhero.url}` : ''
      };

      console.log('返回 Strapi 的 programHero 数据:', strapiHeroData);
      return res.json({
        success: true,
        data: strapiHeroData,
        source: 'strapi'
      });
    } else {
      console.log('Strapi 中没有找到 programHero 数据');
      return res.status(404).json({
        success: false,
        error: 'No program hero data found in Strapi',
        source: 'strapi'
      });
    }
  } catch (error) {
    console.error('Error in getProgramHero:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch program hero',
      source: 'error'
    });
  }
};

// 获取项目筛选选项
export const getProgramFilters = async (req, res) => {
  try {
    const { locale = 'en' } = req.query;

    console.log(`获取项目筛选选项，语言: ${locale}`);

    // 获取项目类型
    console.log(`获取项目类型: ${strapiUrl}/api/programtypes`);
    const programTypesResponse = await axios.get(`${strapiUrl}/api/programtypes`, {
      params: { locale },
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
    });

    console.log(`项目类型响应状态码: ${programTypesResponse.status}`);
    console.log(`项目类型数量: ${programTypesResponse.data.data.length}`);

    // 获取年级
    console.log(`获取年级: ${strapiUrl}/api/grades`);
    const gradesResponse = await axios.get(`${strapiUrl}/api/grades`, {
      params: { locale },
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
    });

    console.log(`年级响应状态码: ${gradesResponse.status}`);
    console.log(`年级数量: ${gradesResponse.data.data.length}`);

    // 获取国家
    console.log(`获取国家: ${strapiUrl}/api/countries`);
    const countriesResponse = await axios.get(`${strapiUrl}/api/countries`, {
      params: { locale },
      headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
    });

    console.log(`国家响应状态码: ${countriesResponse.status}`);
    console.log(`国家数量: ${countriesResponse.data.data.length}`);

    const programTypes = programTypesResponse.data.data.map((type) => {
      console.log(`项目类型: ${type.id}, programname:`, type.programname);
      return {
        id: type.id,
        name: type.programname
      };
    });

    const grades = gradesResponse.data.data.map((grade) => {
      console.log(`年级: ${grade.id}, gradename:`, grade.gradename);
      return {
        id: grade.id,
        name: grade.gradename
      };
    });

    const countries = countriesResponse.data.data.map((country) => {
      console.log(`国家: ${country.id}, countryname:`, country.countryname);
      return {
        id: country.id,
        name: country.countryname
      };
    });

    const result = {
      programTypes,
      grades,
      countries
    };

    console.log('返回筛选选项:', result);
    res.json(result);
  } catch (error) {
    console.error('Error fetching program filters:', error);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    res.status(500).json({ error: 'Failed to fetch program filters' });
  }
};
