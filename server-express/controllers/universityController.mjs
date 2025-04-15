import axios from 'axios';
import { log } from '../utils/logger.mjs';

// Strapi API 配置
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

/**
 * 将 Strapi 大学数据映射为前端格式
 * @param {Object} item - Strapi 返回的大学数据
 * @param {string} locale - 语言代码 ('en' 或 'zh')
 * @returns {Object} 格式化后的大学数据
 */
function mapStrapiUniversityToFrontendFormat(item, locale = 'en') {
  // 如果是新的 Strapi 数据格式（没有 attributes 字段）
  if (item && !item.attributes && item.id) {
    log(`处理新格式的大学数据: ${item.id}`);

    // 构建图片URL
    const getImageUrl = (imageData) => {
      if (!imageData) return '';

      // 如果是对象且有url属性
      if (typeof imageData === 'object' && imageData.url) {
        return `${STRAPI_URL}${imageData.url}`;
      }

      // 如果是字符串（可能是相对路径）
      if (typeof imageData === 'string') {
        if (imageData.startsWith('http')) {
          return imageData; // 已经是完整URL
        } else {
          return `${STRAPI_URL}${imageData}`;
        }
      }

      return '';
    };

    // 处理图片数组
    const getGalleryImages = (galleryData) => {
      if (!galleryData) return [];

      // 如果是数组
      if (Array.isArray(galleryData)) {
        return galleryData.map(img => getImageUrl(img));
      }

      return [];
    };

    // 处理富文本内容
    const processRichText = (richTextData) => {
      // 如果是纯文本字符串，直接返回
      if (typeof richTextData === 'string') return richTextData;

      // 如果是空值或非数组，返回空字符串
      if (!richTextData || !Array.isArray(richTextData)) return '';

      // 处理富文本数组
      return richTextData.map(block => {
        if (block.children && Array.isArray(block.children)) {
          return block.children.map(child => child.text || '').join('');
        } else if (block.type === 'paragraph' && typeof block.content === 'string') {
          // 兼容另一种可能的格式
          return block.content;
        } else if (typeof block === 'string') {
          // 如果数组元素是字符串
          return block;
        }
        return '';
      }).join('\n\n');
    };

    // 根据 locale 判断当前语言，并将字段映射到多语言字段
    const name_en = locale === 'en' ? (item.name || '') : '';
    const name_zh = locale === 'zh' ? (item.name || '') : '';
    const location_en = locale === 'en' ? (item.location || '') : '';
    const location_zh = locale === 'zh' ? (item.location || '') : '';
    const programs_en = locale === 'en' ? (item.programs || '') : '';
    const programs_zh = locale === 'zh' ? (item.programs || '') : '';

    // 处理富文本字段
    const description_en = locale === 'en' ? processRichText(item.description || '') : '';
    const description_zh = locale === 'zh' ? processRichText(item.description || '') : '';
    const highlights_en = locale === 'en' ? processRichText(item.highlights || '') : '';
    const highlights_zh = locale === 'zh' ? processRichText(item.highlights || '') : '';
    const facilities_en = locale === 'en' ? processRichText(item.facilities || '') : '';
    const facilities_zh = locale === 'zh' ? processRichText(item.facilities || '') : '';
    const academics_en = locale === 'en' ? processRichText(item.academics || '') : '';
    const academics_zh = locale === 'zh' ? processRichText(item.academics || '') : '';
    const admission_en = locale === 'en' ? processRichText(item.admission || '') : '';
    const admission_zh = locale === 'zh' ? processRichText(item.admission || '') : '';

    // 构建前端格式的大学对象，保留多语言字段
    return {
      id: item.id,
      documentId: item.documentId || '',
      name_en,
      name_zh,
      location_en,
      location_zh,
      programs_en,
      programs_zh,
      image: item.image ? getImageUrl(item.image) : '',
      description_en,
      description_zh,
      featured_image: item.slideshow ? (Array.isArray(item.slideshow) && item.slideshow.length > 0 ? getImageUrl(item.slideshow[0]) : getImageUrl(item.slideshow)) : '',
      gallery_images: item.slideshow ? (Array.isArray(item.slideshow) ? getGalleryImages(item.slideshow) : [getImageUrl(item.slideshow)]) : [],
      highlights_en,
      highlights_zh,
      facilities_en,
      facilities_zh,
      academics_en,
      academics_zh,
      admission_en,
      admission_zh
    };
  }

  // 如果是旧的 Strapi 数据格式（有 attributes 字段）
  if (!item || !item.attributes) {
    log(`无效的大学数据: ${JSON.stringify(item)}`);
    return null;
  }

  const { id } = item;
  const attrs = item.attributes;

  // 构建图片URL
  const getImageUrl = (imageData) => {
    if (!imageData) return '';

    // 如果是旧格式（有data字段）
    if (imageData.data && imageData.data.attributes) {
      const imageAttributes = imageData.data.attributes;
      return `${STRAPI_URL}${imageAttributes.url}`;
    }

    // 如果是对象且有url属性
    if (typeof imageData === 'object' && imageData.url) {
      return `${STRAPI_URL}${imageData.url}`;
    }

    // 如果是字符串（可能是相对路径）
    if (typeof imageData === 'string') {
      if (imageData.startsWith('http')) {
        return imageData; // 已经是完整URL
      } else {
        return `${STRAPI_URL}${imageData}`;
      }
    }

    return '';
  };

  // 处理图库图片
  const getGalleryImages = (galleryData) => {
    if (!galleryData) return [];

    // 如果是旧格式（有data字段）
    if (galleryData.data && Array.isArray(galleryData.data)) {
      return galleryData.data.map(img =>
        `${STRAPI_URL}${img.attributes.url}`
      );
    }

    // 如果是数组
    if (Array.isArray(galleryData)) {
      return galleryData.map(img => {
        if (typeof img === 'object' && img.url) {
          return `${STRAPI_URL}${img.url}`;
        } else if (typeof img === 'string') {
          if (img.startsWith('http')) {
            return img;
          } else {
            return `${STRAPI_URL}${img}`;
          }
        }
        return '';
      }).filter(url => url !== '');
    }

    return [];
  };

  // 构建前端格式的大学对象，保留多语言字段
  return {
    id,
    documentId: attrs.documentId || '',
    name_en: locale === 'en' ? (attrs.name || '') : '',
    name_zh: locale === 'zh' ? (attrs.name || '') : '',
    location_en: locale === 'en' ? (attrs.location || '') : '',
    location_zh: locale === 'zh' ? (attrs.location || '') : '',
    programs_en: locale === 'en' ? (attrs.programs || '') : '',
    programs_zh: locale === 'zh' ? (attrs.programs || '') : '',
    image: getImageUrl(attrs.image),
    description_en: locale === 'en' ? (attrs.description || '') : '',
    description_zh: locale === 'zh' ? (attrs.description || '') : '',
    featured_image: getImageUrl(attrs.slideshow),
    gallery_images: getGalleryImages(attrs.gallery_images),
    highlights_en: locale === 'en' ? (attrs.highlights || '') : '',
    highlights_zh: locale === 'zh' ? (attrs.highlights || '') : '',
    facilities_en: locale === 'en' ? (attrs.facilities || '') : '',
    facilities_zh: locale === 'zh' ? (attrs.facilities || '') : '',
    academics_en: locale === 'en' ? (attrs.academics || '') : '',
    academics_zh: locale === 'zh' ? (attrs.academics || '') : '',
    admission_en: locale === 'en' ? (attrs.admission || '') : '',
    admission_zh: locale === 'zh' ? (attrs.admission || '') : ''
  };
}

/**
 * 获取所有大学列表
 */
export const getAllUniversities = async (req, res) => {
  const locale = req.query.locale || 'en';

  try {
    log(`获取所有大学列表，语言: ${locale}`);

    // 尝试从Strapi获取大学数据
    try {
      const response = await axios.get(`${STRAPI_URL}/api/universities`, {
        params: {
          locale,
          populate: '*' // 获取所有关联字段，包括图片
        }
      });

      if (response.data) {
        // 如果是新格式（直接返回数组）
        if (Array.isArray(response.data)) {
          log(`使用新格式处理大学数据，找到 ${response.data.length} 所大学`);

          // 映射数据到前端格式
          const universities = response.data
            .map(item => mapStrapiUniversityToFrontendFormat(item, locale))
            .filter(Boolean);

          log(`成功获取 ${universities.length} 所大学`);
          return res.json(universities);
        }

        // 如果是旧格式（data.data）
        if (response.data.data && Array.isArray(response.data.data)) {
          log(`使用旧格式处理大学数据，找到 ${response.data.data.length} 所大学`);

          // 映射数据到前端格式
          const universities = response.data.data
            .map(item => mapStrapiUniversityToFrontendFormat(item, locale))
            .filter(Boolean);

          log(`成功获取 ${universities.length} 所大学`);
          return res.json(universities);
        }
      }

      log('无法识别的大学数据格式，尝试直接返回原始数据');
      return res.json(response.data || []);
    } catch (error) {
      log(`获取大学数据失败: ${error.message}`);
      return res.status(500).json({
        error: '获取大学数据失败',
        message: error.message
      });
    }
  } catch (error) {
    log(`获取大学列表失败: ${error.message}`);
    res.status(500).json({
      error: '获取大学列表失败',
      message: error.message
    });
  }
};

/**
 * 从 Strapi 获取指定 ID 和语言的大学数据
 * @param {string|number} id - 大学 ID
 * @param {string} locale - 语言代码
 * @returns {Promise<Object|null>} 大学数据或 null
 */
async function fetchUniversityById(id, locale) {
  try {
    // 从Strapi获取所有大学，然后过滤出指定的大学
    const response = await axios.get(`${STRAPI_URL}/api/universities`, {
      params: {
        locale,
        populate: '*' // 获取所有关联字段，包括图片
      }
    });

    if (response.data) {
      let university = null;
      let allUniversities = [];

      // 如果是新格式（直接返回数组）
      if (Array.isArray(response.data)) {
        log(`使用新格式处理大学数据，查找ID: ${id}`);
        allUniversities = response.data;

        // 查找指定ID的大学
        const uniData = allUniversities.find(item => item.id === parseInt(id));

        if (uniData) {
          university = mapStrapiUniversityToFrontendFormat(uniData, locale);
        }
      }

      // 如果是旧格式（data.data）
      else if (response.data.data && Array.isArray(response.data.data)) {
        log(`使用旧格式处理大学数据，查找ID: ${id}`);
        allUniversities = response.data.data;

        // 查找指定ID的大学
        const uniData = allUniversities.find(item => item.id === parseInt(id));

        if (uniData) {
          university = mapStrapiUniversityToFrontendFormat(uniData, locale);
        }
      }

      // 如果没有找到指定 ID 的大学，尝试查找对应语言版本的大学
      if (!university && allUniversities.length > 0) {
        log(`没有找到 ID 为 ${id} 的大学，尝试查找对应语言版本`);

        // 尝试获取另一种语言的数据
        const alternativeLocale = locale === 'en' ? 'zh' : 'en';
        const alternativeResponse = await axios.get(`${STRAPI_URL}/api/universities`, {
          params: {
            locale: alternativeLocale,
            populate: '*' // 获取所有关联字段，包括图片
          }
        });

        if (alternativeResponse.data) {
          let alternativeUniversities = [];

          // 如果是新格式（直接返回数组）
          if (Array.isArray(alternativeResponse.data)) {
            alternativeUniversities = alternativeResponse.data;
          }
          // 如果是旧格式（data.data）
          else if (alternativeResponse.data.data && Array.isArray(alternativeResponse.data.data)) {
            alternativeUniversities = alternativeResponse.data.data;
          }

          // 查找指定 ID 的大学
          const alternativeUniData = alternativeUniversities.find(item => item.id === parseInt(id));

          if (alternativeUniData && alternativeUniData.documentId) {
            // 如果找到了对应 ID 的大学，并且有 documentId，尝试在当前语言中查找相同 documentId 的大学
            const documentId = alternativeUniData.documentId;
            log(`尝试根据 documentId ${documentId} 查找 ${locale} 语言版本的大学`);

            const matchingUniData = allUniversities.find(item => item.documentId === documentId);

            if (matchingUniData) {
              log(`找到对应 documentId ${documentId} 的 ${locale} 语言版本大学，ID: ${matchingUniData.id}`);
              university = mapStrapiUniversityToFrontendFormat(matchingUniData, locale);
            }
          }
        }
      }

      return university;
    }

    return null;
  } catch (error) {
    log(`获取大学数据失败，ID: ${id}, 语言: ${locale}, 错误: ${error.message}`);
    return null;
  }
}

/**
 * 获取特定大学的详细信息
 */
export const getUniversityById = async (req, res) => {
  const { id } = req.params;
  const locale = req.query.locale || 'en';

  if (!id) {
    return res.status(400).json({ error: '缺少大学ID' });
  }

  try {
    log(`获取大学详情，ID: ${id}，语言: ${locale}`);

    // 获取指定 ID 的大学数据
    let university = await fetchUniversityById(id, locale);

    if (university) {
      log(`成功获取大学详情，ID: ${id}`);
      return res.json(university);
    } else {
      log(`未找到ID为 ${id} 的大学`);
      return res.status(404).json({ error: '未找到大学' });
    }
  } catch (error) {
    log(`获取大学详情失败，ID: ${id}, 错误: ${error.message}`);
    res.status(500).json({
      error: '获取大学详情失败',
      message: error.message
    });
  }
};

/**
 * 获取留学页面内容（包括大学列表）
 */
export const getStudyAbroadContent = async (req, res) => {
  const locale = req.query.locale || 'en';

  try {
    log(`获取留学页面内容，语言: ${locale}`);

    // 获取大学列表
    const universitiesResponse = await axios.get(`${STRAPI_URL}/api/universities`, {
      params: {
        locale,
        populate: '*' // 获取所有关联字段，包括图片
      }
    });

    let universities = [];

    if (universitiesResponse.data) {
      // 如果是新格式（直接返回数组）
      if (Array.isArray(universitiesResponse.data)) {
        log(`使用新格式处理大学数据，找到 ${universitiesResponse.data.length} 所大学`);

        // 映射数据到前端格式
        universities = universitiesResponse.data
          .map(item => mapStrapiUniversityToFrontendFormat(item, locale))
          .filter(Boolean);
      }

      // 如果是旧格式（data.data）
      else if (universitiesResponse.data.data && Array.isArray(universitiesResponse.data.data)) {
        log(`使用旧格式处理大学数据，找到 ${universitiesResponse.data.data.length} 所大学`);

        // 映射数据到前端格式
        universities = universitiesResponse.data.data
          .map(item => mapStrapiUniversityToFrontendFormat(item, locale))
          .filter(Boolean);
      }
    }

    // 留学目的与种类数据
    const benefits = [
      {
        icon: 'graduation-cap',
        title_en: 'Academic Excellence',
        title_zh: '学术卓越',
        description_en: 'Access to world-class educational institutions and programs that enhance your academic credentials.',
        description_zh: '获取世界一流教育机构和课程，提升您的学术证书。'
      },
      {
        icon: 'globe',
        title_en: 'Global Perspective',
        title_zh: '全球视野',
        description_en: 'Develop a broader worldview and cross-cultural communication skills essential in today\'s global environment.',
        description_zh: '培养更广阔的世界观和跨文化交流能力，这在当今的全球环境中至关重要。'
      },
      {
        icon: 'briefcase',
        title_en: 'Career Advancement',
        title_zh: '职业发展',
        description_en: 'Gain a competitive edge in the job market with international experience and specialized knowledge.',
        description_zh: '通过国际经验和专业知识，在就业市场中获得竞争优势。'
      },
      {
        icon: 'users',
        title_en: 'Cultural Immersion',
        title_zh: '文化深浸',
        description_en: 'Experience different cultures firsthand, building lifelong international friendships and networks.',
        description_zh: '亲身体验不同文化，建立终身的国际友谊和人脉网络。'
      }
    ];

    // 构建页面内容
    const pageContent = {
      title_en: 'Study Abroad: Expand Your Horizons',
      title_zh: '留学：拓展你的视野',
      description_en: 'Embark on a life-changing study abroad journey to explore new cultures, gain a global perspective, and enhance your education. Whether you seek academic excellence, language immersion, or unforgettable experiences, studying abroad opens doors to endless opportunities.',
      description_zh: '踏上改变人生的留学之旅，探索新文化，获得全球视野，并提升你的教育水平。无论你追求学术卓越、语言深浸还是难忘的经历，留学都将为你打开无限机遇的大门。',
      benefits: benefits,
      universities: universities,
      cta_title_en: 'Ready to Start Your Journey?',
      cta_title_zh: '准备好开始您的旅程了吗？',
      cta_description_en: 'Contact our advisors to learn more about our study abroad programs and find the perfect fit for your educational goals.',
      cta_description_zh: '联系我们的顾问，了解我们的留学项目，并找到最适合您教育目标的项目。',
      cta_button_text_en: 'Get Started',
      cta_button_text_zh: '开始咨询',
      cta_button_link: '/contact'
    };

    log(`成功获取留学页面内容，包含 ${universities.length} 所大学`);
    res.json(pageContent);
  } catch (error) {
    log(`获取留学页面内容失败: ${error.message}`);
    res.status(500).json({
      error: '获取留学页面内容失败',
      message: error.message
    });
  }
};

export default {
  getAllUniversities,
  getUniversityById,
  getStudyAbroadContent
};
