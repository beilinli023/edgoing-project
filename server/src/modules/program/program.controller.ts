import { Request, Response } from 'express';
import axios from 'axios';
import { config } from '../../config';

// Strapi API URL
const strapiUrl = config.strapiUrl || 'http://localhost:1337';

// 转换 Strapi 响应到前端格式
const transformProgramData = (strapiProgram: any) => {
  if (!strapiProgram) return null;
  
  const { attributes } = strapiProgram;
  
  return {
    id: strapiProgram.id,
    title_en: attributes.title?.en || '',
    title_zh: attributes.title?.zh || '',
    slug: attributes.slug,
    program_id: attributes.program_id,
    
    // 媒体字段
    image: attributes.cover_image?.data?.attributes?.url || '',
    gallery_images: attributes.gallery_images?.data?.map((img: any) => img.attributes.url) || [],
    
    // 时间和地点
    duration_en: attributes.duration?.en || '',
    duration_zh: attributes.duration?.zh || '',
    camp_period_en: attributes.camp_period?.en || '',
    camp_period_zh: attributes.camp_period?.zh || '',
    deadline: attributes.deadline,
    
    // 关联字段
    program_type_en: attributes.programtypes?.data?.map((type: any) => type.attributes.programname?.en || '') || [],
    program_type_zh: attributes.programtypes?.data?.map((type: any) => type.attributes.programname?.zh || '') || [],
    
    grade_level_en: attributes.grades?.data?.map((grade: any) => grade.attributes.gradename?.en || '') || [],
    grade_level_zh: attributes.grades?.data?.map((grade: any) => grade.attributes.gradename?.zh || '') || [],
    
    destination_en: attributes.destinations?.data?.map((dest: any) => dest.attributes.city?.en || '').join(', ') || '',
    destination_zh: attributes.destinations?.data?.map((dest: any) => dest.attributes.city?.zh || '').join(', ') || '',
    
    country_en: attributes.countries?.data?.map((country: any) => country.attributes.countryname?.en || '') || [],
    country_zh: attributes.countries?.data?.map((country: any) => country.attributes.countryname?.zh || '') || [],
    
    // 排序
    display_order: attributes.display_order || 999,
    
    // 富文本内容
    description_en: attributes.description?.en || '',
    description_zh: attributes.description?.zh || '',
    highlights_en: attributes.highlights?.en || '',
    highlights_zh: attributes.highlights?.zh || '',
    itinerary_en: attributes.itinerary?.en || '',
    itinerary_zh: attributes.itinerary?.zh || '',
    features_en: attributes.features?.en || '',
    features_zh: attributes.features?.zh || '',
    other_info_en: attributes.other_info?.en || '',
    other_info_zh: attributes.other_info?.zh || '',
    
    // 状态字段
    status: attributes.publishedAt ? 'published' : 'draft',
    published_at: attributes.publishedAt
  };
};

// 获取项目列表
export const getPrograms = async (req: Request, res: Response) => {
  try {
    const { locale = 'en', page = 1, limit = 10, programType, gradeLevel, country } = req.query;
    
    // 构建查询参数
    const queryParams: any = {
      locale,
      sort: 'display_order:asc',
      'pagination[page]': page,
      'pagination[pageSize]': limit,
      populate: [
        'cover_image',
        'gallery_images',
        'programtypes',
        'grades',
        'destinations',
        'countries'
      ].join(',')
    };
    
    // 添加筛选条件
    if (programType) {
      queryParams['filters[programtypes][programname][$containsi]'] = programType;
    }
    
    if (gradeLevel) {
      queryParams['filters[grades][gradename][$containsi]'] = gradeLevel;
    }
    
    if (country) {
      queryParams['filters[countries][countryname][$containsi]'] = country;
    }
    
    console.log('Fetching programs with params:', queryParams);
    
    const response = await axios.get(`${strapiUrl}/api/programs`, { params: queryParams });
    
    const programs = response.data.data.map(transformProgramData);
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
export const getProgramById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { locale = 'en' } = req.query;
    
    console.log(`Fetching program with ID: ${id}, locale: ${locale}`);
    
    // 使用 filters 参数获取单个项目
    const response = await axios.get(`${strapiUrl}/api/programs`, {
      params: {
        locale,
        'filters[id]': id,
        populate: [
          'cover_image',
          'gallery_images',
          'programtypes',
          'grades',
          'destinations',
          'countries'
        ].join(',')
      }
    });
    
    if (!response.data.data || response.data.data.length === 0) {
      return res.status(404).json({ error: 'Program not found' });
    }
    
    const program = transformProgramData(response.data.data[0]);
    
    res.json(program);
  } catch (error) {
    console.error('Error fetching program:', error);
    res.status(500).json({ error: 'Failed to fetch program' });
  }
};

// 获取项目筛选选项
export const getProgramFilters = async (req: Request, res: Response) => {
  try {
    const { locale = 'en' } = req.query;
    
    // 获取项目类型
    const programTypesResponse = await axios.get(`${strapiUrl}/api/programtypes`, {
      params: { locale }
    });
    
    // 获取年级
    const gradesResponse = await axios.get(`${strapiUrl}/api/grades`, {
      params: { locale }
    });
    
    // 获取国家
    const countriesResponse = await axios.get(`${strapiUrl}/api/countries`, {
      params: { locale }
    });
    
    const programTypes = programTypesResponse.data.data.map((type: any) => ({
      id: type.id,
      name: type.attributes.programname
    }));
    
    const grades = gradesResponse.data.data.map((grade: any) => ({
      id: grade.id,
      name: type.attributes.gradename
    }));
    
    const countries = countriesResponse.data.data.map((country: any) => ({
      id: country.id,
      name: country.attributes.countryname
    }));
    
    res.json({
      programTypes,
      grades,
      countries
    });
  } catch (error) {
    console.error('Error fetching program filters:', error);
    res.status(500).json({ error: 'Failed to fetch program filters' });
  }
};
