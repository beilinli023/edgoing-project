import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// Strapi API URL
const strapiUrl = process.env.STRAPI_API_URL || 'http://localhost:1337';
const strapiToken = process.env.STRAPI_API_TOKEN || '';

// 日志函数
const log = (message) => {
  console.log(`${new Date().toISOString()} - [HomeController] ${message}`);
};

/**
 * 获取首页Hero数据
 */
export const getHomeHero = async (req, res) => {
  // 解析请求中的locale参数，并确保其为'en'或'zh'
  let locale = req.query.locale || 'en';

  // 如果locale参数包含'zh'前缀，则将其视为'zh'
  if (locale.startsWith('zh')) {
    locale = 'zh';
  } else if (locale !== 'en') {
    locale = 'en';
  }

  try {
    log(`获取首页Hero数据，语言: ${locale}`);

    // 尝试从Strapi获取Hero数据
    try {
      // 不使用固定的ID，而是获取所有homehero记录，然后根据语言过滤
      log(`获取${locale}语言的Hero数据`);

      const response = await axios.get(`${strapiUrl}/api/homeheroes?populate=*`, {
        params: {
          locale
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
        log(`成功从Strapi获取Hero数据，共 ${response.data.data.length} 条记录`);

        // 打印所有记录的语言和 ID，以便调试
        response.data.data.forEach((item, index) => {
          log(`记录 ${index + 1}: ID=${item.id}, 语言=${item.locale || (item.attributes && item.attributes.locale) || '未知'}`);
        });

        // 尝试找到当前语言的记录
        let heroData = null;

        // 首先尝试根据 locale 字段过滤
        const matchedByLocale = response.data.data.find(item =>
          (item.locale === locale) ||
          (item.attributes && item.attributes.locale === locale)
        );

        if (matchedByLocale) {
          log(`找到了匹配当前语言(${locale})的记录: ID=${matchedByLocale.id}`);
          heroData = matchedByLocale;
        } else {
          // 如果没有找到匹配的语言，则使用第一条记录
          log(`未找到匹配当前语言(${locale})的记录，使用第一条记录`);
          heroData = response.data.data[0];
        }

        // 打印选中的记录结构，以便调试
        log(`选中的记录结构: ${JSON.stringify(heroData, null, 2)}`);

        // 打印原始heroData的字段
        log('原始heroData的字段:', Object.keys(heroData));
        log('原始heroData的内容:', JSON.stringify(heroData, null, 2));

        // 处理图片URL
        let imageUrl = '/images/hero-default.jpg';

        // 检查是否有heroimage字段，并且是否是数组
        if (heroData.attributes && heroData.attributes.heroimage && heroData.attributes.heroimage.data) {
          const imageData = heroData.attributes.heroimage.data;
          // 检查图片数据结构
          if (imageData && imageData.attributes && imageData.attributes.url) {
            // 构建完整的URL
            imageUrl = `${strapiUrl}${imageData.attributes.url}`;
            log(`使用Strapi图片URL: ${imageUrl}`);
          }
        } else if (heroData.heroimage && Array.isArray(heroData.heroimage) && heroData.heroimage.length > 0) {
          const imageData = heroData.heroimage[0];
          // 检查图片数据结构
          if (imageData && imageData.url) {
            // 构建完整的URL
            imageUrl = `${strapiUrl}${imageData.url}`;
            log(`使用Strapi图片URL: ${imageUrl}`);
          }
        } else {
          log('没有找到heroimage字段或者它不是数组，使用默认图片');

          // 检查是否有其他可能的图片字段
          if (heroData.image && typeof heroData.image === 'string' && heroData.image.trim() !== '') {
            imageUrl = heroData.image.startsWith('http') ? heroData.image : `${strapiUrl}${heroData.image}`;
            log(`使用image字段作为图片URL: ${imageUrl}`);
          } else if (heroData.imageUrl && typeof heroData.imageUrl === 'string' && heroData.imageUrl.trim() !== '') {
            imageUrl = heroData.imageUrl.startsWith('http') ? heroData.imageUrl : `${strapiUrl}${heroData.imageUrl}`;
            log(`使用imageUrl字段作为图片URL: ${imageUrl}`);
          }
        }

        // 处理所有轮播图数据
        const heroSlides = [];

        // 处理当前选中的记录
        heroSlides.push({
          id: heroData.id,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          imageUrl: imageUrl,
          order: 0
        });

        // 处理其他记录
        const otherRecords = response.data.data.filter(item => item.id !== heroData.id);

        // 处理其他记录的图片URL
        for (let i = 0; i < otherRecords.length; i++) {
          const record = otherRecords[i];
          let recordImageUrl = '/images/hero-default.jpg';

          // 检查是否有heroimage字段，并且是否是数组
          if (record.attributes && record.attributes.heroimage && record.attributes.heroimage.data) {
            const imageData = record.attributes.heroimage.data;
            // 检查图片数据结构
            if (imageData && imageData.attributes && imageData.attributes.url) {
              // 构建完整的URL
              recordImageUrl = `${strapiUrl}${imageData.attributes.url}`;
            }
          } else if (record.heroimage && Array.isArray(record.heroimage) && record.heroimage.length > 0) {
            const imageData = record.heroimage[0];
            // 检查图片数据结构
            if (imageData && imageData.url) {
              // 构建完整的URL
              recordImageUrl = `${strapiUrl}${imageData.url}`;
            }
          } else {
            // 检查是否有其他可能的图片字段
            if (record.image && typeof record.image === 'string' && record.image.trim() !== '') {
              recordImageUrl = record.image.startsWith('http') ? record.image : `${strapiUrl}${record.image}`;
            } else if (record.imageUrl && typeof record.imageUrl === 'string' && record.imageUrl.trim() !== '') {
              recordImageUrl = record.imageUrl.startsWith('http') ? record.imageUrl : `${strapiUrl}${record.imageUrl}`;
            }
          }

          heroSlides.push({
            id: record.id,
            title: record.title || '',
            subtitle: record.subtitle || '',
            imageUrl: recordImageUrl,
            order: i + 1
          });
        }

        log(`处理完成，共返回 ${heroSlides.length} 条轮播图数据`);

        // 返回所有轮播图数据
        return res.json({
          success: true,
          data: heroSlides
        });
      }
    } catch (strapiError) {
      log(`从Strapi获取Hero数据失败: ${strapiError.message}`);
      log('将使用默认数据作为备用');
    }

    // 如果从Strapi获取失败，返回默认数据
    log('返回默认Hero数据');

    // 使用默认轮播图数据
    const defaultHeroSlides = [
      {
        id: 1,
        title: locale === 'en' ? 'Learn Beyond Walls' : '超越课堂边界',
        subtitle: locale === 'en' ? 'Ignite Curiosity, Inspire Growth, Immerse Yourself' : '点燃好奇心，启发成长，沉浸式探索世界',
        imageUrl: '/images/hero-education.jpg',
        order: 0
      },
      {
        id: 2,
        title: locale === 'en' ? 'STEM Programs' : 'STEM 项目',
        subtitle: locale === 'en' ? 'Molding Tomorrow\'s Thinkers and Makers.' : '培养未来的思想者与创造者',
        imageUrl: '/images/hero-stem.jpg',
        order: 1
      },
      {
        id: 3,
        title: locale === 'en' ? 'Cultural Immersion' : '文化沉浸',
        subtitle: locale === 'en' ? 'Experience authentic traditions and modern innovations' : '体验真实的传统与现代创新',
        imageUrl: '/images/hero-cultural.jpg',
        order: 2
      }
    ];

    return res.json({
      success: true,
      data: defaultHeroSlides
    });
  } catch (error) {
    log(`获取首页Hero数据失败: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '获取首页Hero数据失败',
      message: error.message
    });
  }
};

// 默认轮播图数据
const defaultCarouselSlides = [
  {
    id: "1",
    title_en: "Learn Beyond Walls",
    title_zh: "超越课堂边界",
    subtitle_en: "Ignite Curiosity, Inspire Growth, Immerse Yourself",
    subtitle_zh: "点燃好奇心，启发成长，沉浸式探索世界",
    image_url: "/images/hero-education.jpg",
    button_text_en: "Explore Programs",
    button_text_zh: "浏览项目",
    button_url: "/programs",
    order_index: 1
  },
  {
    id: "2",
    title_en: "STEM Programs",
    title_zh: "STEM 项目",
    subtitle_en: "Molding Tomorrow's Thinkers and Makers.",
    subtitle_zh: "培养未来的思想者与创造者",
    image_url: "/images/hero-stem.jpg",
    button_text_en: "Learn More",
    button_text_zh: "了解更多",
    button_url: "/programs",
    order_index: 2
  },
  {
    id: "3",
    title_en: "Cultural Immersion",
    title_zh: "文化沉浸",
    subtitle_en: "Experience authentic traditions and modern innovations",
    subtitle_zh: "体验真实的传统与现代创新",
    image_url: "/images/hero-cultural.jpg",
    button_text_en: "Discover",
    button_text_zh: "探索",
    button_url: "/programs",
    order_index: 3
  }
];

/**
 * 获取首页轮播图数据
 */
export const getHomeCarousel = async (req, res) => {
  const locale = req.query.locale || 'en';

  try {
    log(`获取首页轮播图数据，语言: ${locale}`);

    // 尝试从Strapi获取轮播图数据
    try {
      const response = await axios.get(`${strapiUrl}/api/home-carousels`, {
        params: {
          locale,
          populate: '*'
        },
        headers: strapiToken ? { Authorization: `Bearer ${strapiToken}` } : {}
      });

      if (response.data && response.data.data && response.data.data.length > 0) {
        log(`成功从Strapi获取轮播图数据，共 ${response.data.data.length} 条记录`);

        // 处理Strapi返回的数据
        const slides = response.data.data.map(item => {
          const attributes = item.attributes;
          return {
            id: item.id.toString(),
            title_en: attributes.title_en || '',
            title_zh: attributes.title_zh || '',
            subtitle_en: attributes.subtitle_en || '',
            subtitle_zh: attributes.subtitle_zh || '',
            image_url: attributes.image_url || '/images/hero-default.jpg',
            button_text_en: attributes.button_text_en || 'Learn More',
            button_text_zh: attributes.button_text_zh || '了解更多',
            button_url: attributes.button_url || '/programs',
            order_index: attributes.order_index || 999
          };
        });

        return res.json({
          success: true,
          slides: slides.sort((a, b) => a.order_index - b.order_index)
        });
      }
    } catch (strapiError) {
      log(`从Strapi获取轮播图数据失败: ${strapiError.message}`);
      log('将使用默认数据作为备用');
    }

    // 如果从Strapi获取失败，返回默认数据
    log('返回默认轮播图数据');
    return res.json({
      success: true,
      slides: defaultCarouselSlides
    });
  } catch (error) {
    log(`获取首页轮播图数据失败: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '获取首页轮播图数据失败',
      message: error.message
    });
  }
};

/**
 * 获取首页标语部分数据
 */
export const getTaglineSection = async (req, res) => {
  const locale = req.query.locale || 'en';

  try {
    log(`获取首页标语部分数据，语言: ${locale}`);

    // 返回默认数据
    return res.json({
      success: true,
      data: {
        title: "Explore. Learn. Grow.",
        description: locale === 'en'
          ? 'Every EdGoing program is a carefully crafted adventure, designed to go beyond sightseeing—challenging assumptions, building empathy, and empowering students to see the world, and themselves, in new ways. Through these transformative experiences, we open minds, build bridges, and create memories that last a lifetime.'
          : '每一个 EdGoing 项目都是精心打造的探险之旅，旨在超越简单的观光——挑战固有观念、培养共情能力，并赋予学生以全新的方式看待世界和自我。通过这些变革性的体验，我们开阔思维，架起桥梁，创造终生难忘的记忆。'
      }
    });
  } catch (error) {
    log(`获取首页标语部分数据失败: ${error.message}`);
    res.status(500).json({
      success: false,
      error: '获取首页标语部分数据失败',
      message: error.message
    });
  }
};

export default {
  getHomeCarousel,
  getTaglineSection,
  getHomeHero
};
