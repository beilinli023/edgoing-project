import apiClient from '../api/apiClient';
import { extractData } from '../api/responseHelpers';
import { Program } from '@/types/programTypes';

// Mock hero slides data
const mockHeroSlides = [
  {
    id: "1",
    title_en: "Learn Beyond Walls",
    title_zh: "超越课堂边界",
    subtitle_en: "Ignite Curiosity, Inspire Growth, Immerse Yourself",
    subtitle_zh: "点燃好奇心、启发成长、沉浸式探索世界",
    image_url: "/images/hero-education.jpg",
    button_text_en: "Explore Programs",
    button_text_zh: "浏览项目",
    button_url: "/programs",
    order_index: 0
  },
  {
    id: "2",
    title_en: "STEM Programs",
    title_zh: "STEM 项目",
    subtitle_en: "Molding Tomorrow's Thinkers and Makers",
    subtitle_zh: "培养未来的思想者与创造者",
    image_url: "/images/hero-stem.jpg",
    button_text_en: "Learn More",
    button_text_zh: "了解更多",
    button_url: "/about",
    order_index: 1
  },
  {
    id: "3",
    title_en: "Academic Programs",
    title_zh: "学术项目",
    subtitle_en: "Shaping Global Minds, Inspiring Lifelong Learning",
    subtitle_zh: "塑造全球化思维，激发终身学习热情",
    image_url: "/images/hero-academic.jpg",
    button_text_en: "View Programs",
    button_text_zh: "查看项目",
    button_url: "/programs",
    order_index: 2
  },
  {
    id: "4",
    title_en: "Heritage Cultural Tour",
    title_zh: "文化遗产之旅",
    subtitle_en: "Step into the past, Uncover the stories",
    subtitle_zh: "步入历史长河，探寻精彩故事",
    image_url: "/images/hero-heritage.jpg",
    button_text_en: "View Programs",
    button_text_zh: "查看项目",
    button_url: "/programs",
    order_index: 3
  },
  {
    id: "5",
    title_en: "Global Citizenship Starts Here",
    title_zh: "全球公民，从这里启航",
    subtitle_en: "Explore the world, embrace cultures, and lead with purpose",
    subtitle_zh: "探索世界，拥抱多元文化，以使命引领前行",
    image_url: "/images/hero-global.jpg",
    button_text_en: "View Programs",
    button_text_zh: "查看项目",
    button_url: "/programs",
    order_index: 4
  }
];

// 首页轮播图数据接口
interface CarouselSlide {
  id: string;
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  image_url: string;
  button_text_en: string;
  button_text_zh: string;
  button_url: string;
  order_index: number;
}

interface CarouselApiResponse {
  slides: CarouselSlide[];
}

// 转换轮播图数据为当前语言
const transformSlideToLanguage = (slide: CarouselSlide, language: 'en' | 'zh') => ({
  id: slide.id,
  title: language === 'en' ? slide.title_en : slide.title_zh,
  subtitle: language === 'en' ? slide.subtitle_en : slide.subtitle_zh,
  imageUrl: slide.image_url,
  buttonText: language === 'en' ? slide.button_text_en : slide.button_text_zh,
  buttonUrl: slide.button_url,
  order: slide.order_index
});

// 移除默认Hero数据

// 获取首页Hero数据
export const getHomeHero = async (language: 'en' | 'zh' = 'en') => {
  try {
    // 从API获取数据
    // 确保locale参数值为'en'或'zh'，而不是其他值
    const locale = language === 'zh' ? 'zh' : 'en';
    console.log(`获取首页Hero数据，语言: ${locale}`);
    // 修复：移除重复的 /api 前缀
    console.log(`%c✅ 请求Hero数据，路径: home/hero?locale=${locale}`, 'color: green; font-weight: bold');
    const response = await apiClient.get(`home/hero?locale=${locale}`);
    console.log('%c原始API响应:', 'color: blue; font-weight: bold', response);
    const data = extractData(response);
    console.log('%c提取后的数据:', 'color: blue; font-weight: bold', data);
    console.log('%c提取后的数据 (JSON):', 'color: blue; font-weight: bold', JSON.stringify(data, null, 2));

    // 检查响应数据结构 - 增加更详细的日志
    console.log('%c响应数据结构详细检查:', 'color: blue; font-weight: bold', {
      dataType: typeof data,
      isNull: data === null,
      isUndefined: data === undefined,
      isObject: typeof data === 'object' && data !== null,
      isArray: Array.isArray(data),
      hasDataProperty: data && typeof data === 'object' && 'data' in data,
      hasSuccessProperty: data && typeof data === 'object' && 'success' in data,
      dataPropertyType: data && typeof data === 'object' && 'data' in data ? typeof data.data : 'N/A',
      dataPropertyIsArray: data && typeof data === 'object' && 'data' in data ? Array.isArray(data.data) : false,
      dataPropertyLength: data && typeof data === 'object' && 'data' in data && Array.isArray(data.data) ? data.data.length : 'N/A',
      successPropertyValue: data && typeof data === 'object' && 'success' in data ? data.success : 'N/A',
      allKeys: data && typeof data === 'object' ? Object.keys(data) : [],
      fullData: data,
      rawResponse: response
    });

    // 如果数据是数组，直接使用
    if (Array.isArray(data)) {
      console.log('%c✅ 数据是数组，直接使用', 'color: green; font-weight: bold');
      return data;
    }

    // 如果数据是对象且有id属性，可能是单个项目
    if (data && typeof data === 'object' && !Array.isArray(data) && 'id' in data) {
      console.log('%c✅ 数据是单个对象且有id属性，将其包装为数组', 'color: green; font-weight: bold');
      return [data];
    }

    // 如果数据是对象且有success属性为true，并且有data属性
    if (data && typeof data === 'object' && data.success === true && 'data' in data) {
      console.log('%c✅ 数据是成功的API响应，使用data属性', 'color: green; font-weight: bold');
      if (Array.isArray(data.data)) {
        return data.data;
      } else if (data.data && typeof data.data === 'object') {
        return [data.data];
      }
    }

    // 如果API返回了有效数据，则使用API数据
    if (data && typeof data === 'object' && 'data' in data) {
      console.log('%c✅ 成功从 API 获取到 homehero 数据', 'color: green; font-weight: bold');
      console.log('%c数据结构:', 'color: blue; font-weight: bold', {
        dataType: typeof data.data,
        isArray: Array.isArray(data.data),
        dataLength: Array.isArray(data.data) ? data.data.length : 'N/A',
        dataKeys: data.data && typeof data.data === 'object' ? Object.keys(data.data) : 'N/A',
        fullData: data.data
      });

      // 获取数据
      const heroData = data.data;

      // 如果是数组，处理后返回
      if (Array.isArray(heroData)) {
        console.log(`%c✅ 成功获取到 ${heroData.length} 条 homehero 数据`, 'color: green; font-weight: bold');

        // 检查数组结构
        console.log('%c数组结构检查:', 'color: blue; font-weight: bold', {
          length: heroData.length,
          firstItem: heroData.length > 0 ? heroData[0] : null,
          allItems: heroData
        });

        // 如果数组为空，返回空数组
        if (heroData.length === 0) {
          console.log('%c数组为空，返回空数组', 'color: orange; font-weight: bold');
          return [];
        }

        // 处理数组中的每一项
        const processedData = heroData.map((item, index) => {
          // 创建新对象，确保所有必要字段都存在
          const processedItem = {
            id: item.id || `hero-${index}`,
            title: item.title || '',
            subtitle: item.subtitle || '',
            imageUrl: '',
            order: item.order || index
          };

          // 处理图片URL
          if (item.imageUrl && typeof item.imageUrl === 'string') {
            let imageUrl = item.imageUrl.trim();
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `/${imageUrl}`;
              console.log(`%c修正第 ${index + 1} 项的图片URL:`, 'color: blue; font-weight: bold', imageUrl);
            }
            processedItem.imageUrl = imageUrl;
          } else if (item.image && typeof item.image === 'string') {
            // 尝试使用备用字段
            let imageUrl = item.image.trim();
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `/${imageUrl}`;
            }
            processedItem.imageUrl = imageUrl;
            console.log(`%c使用备用image字段:`, 'color: blue; font-weight: bold', imageUrl);
          } else if (item.heroimage && typeof item.heroimage === 'string') {
            // 尝试使用另一个备用字段
            let imageUrl = item.heroimage.trim();
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
              imageUrl = `/${imageUrl}`;
            }
            processedItem.imageUrl = imageUrl;
            console.log(`%c使用备用heroimage字段:`, 'color: blue; font-weight: bold', imageUrl);
          } else {
            // 如果没有有效的图片URL，使用默认图片
            processedItem.imageUrl = '/images/hero-default.jpg';
            console.log(`%c使用默认图片:`, 'color: orange; font-weight: bold', processedItem.imageUrl);
          }

          return processedItem;
        });

        console.log('%c✅ 返回前的处理后数组数据:', 'color: green; font-weight: bold', processedData);
        return processedData;
      }
      // 如果是单个对象，处理后返回
      else if (typeof heroData === 'object' && heroData !== null) {
        console.log('%c✅ 成功获取到单个 homehero 数据', 'color: green; font-weight: bold');

        // 检查heroData结构
        console.log('%cheroData结构检查:', 'color: blue; font-weight: bold', {
          hasId: heroData && 'id' in heroData,
          hasTitle: heroData && 'title' in heroData,
          hasSubtitle: heroData && 'subtitle' in heroData,
          hasImageUrl: heroData && 'imageUrl' in heroData,
          idValue: heroData?.id,
          titleValue: heroData?.title,
          subtitleValue: heroData?.subtitle,
          imageUrlValue: heroData?.imageUrl,
          imageUrlType: typeof heroData?.imageUrl,
          fullHeroData: heroData
        });

        // 检查图片URL
        if (heroData?.imageUrl) {
          console.log('%c图片URL检查:', 'color: blue; font-weight: bold', {
            url: heroData.imageUrl,
            isString: typeof heroData.imageUrl === 'string',
            isEmpty: !heroData.imageUrl,
            length: heroData.imageUrl?.length
          });

          // 确保图片URL是完整的
          if (typeof heroData.imageUrl === 'string' && !heroData.imageUrl.startsWith('http') && !heroData.imageUrl.startsWith('/')) {
            heroData.imageUrl = `/${heroData.imageUrl}`;
            console.log('%c修正后的图片URL:', 'color: blue; font-weight: bold', heroData.imageUrl);
          }
        }

        // 构建结果对象
        const result = {
          id: heroData.id,
          title: heroData.title || '',
          subtitle: heroData.subtitle || '',
          imageUrl: heroData.imageUrl || ''
        };

        console.log('%c✅ 成功获取homehero数据:', 'color: green; font-weight: bold', result);
        console.log('%c✅ 成功获取homehero数据 (JSON):', 'color: green; font-weight: bold', JSON.stringify(result, null, 2));

        // 返回单个对象包装成数组，以保持一致的返回格式
        return [result];
      }
    }

    // 如果数据格式不符合预期，返回空数组
    console.log('%c❌ 没有从 API 获取到有效数据', 'color: red; font-weight: bold');
    console.log('%c原始数据:', 'color: red; font-weight: bold', data);
    console.log('%c原始数据类型:', 'color: red; font-weight: bold', typeof data);
    console.log('%c原始数据键:', 'color: red; font-weight: bold', data && typeof data === 'object' ? Object.keys(data) : 'N/A');
    return [];
  } catch (error) {
    console.error('Error fetching home hero:', error);
    // 出错时返回空数组
    console.log('%c❌ 获取 homehero 数据时出错', 'color: red; font-weight: bold');
    return [];
  }
};

// 获取首页轮播图 (保留原有函数以保持兼容性)
export const getHeroSlides = async (language: 'en' | 'zh' = 'en') => {
  try {
    // 使用新的getHomeHero函数获取数据
    const validLanguage = language === 'zh' ? 'zh' : 'en';
    console.log(`获取Hero数据，语言: ${validLanguage}`);

    // 修复：移除重复的 /api 前缀
    console.log(`%c✅ 请求Hero数据，路径: home/hero?locale=${validLanguage}`, 'color: green; font-weight: bold');
    const response = await apiClient.get(`home/hero?locale=${validLanguage}`);
    const data = extractData(response);

    console.log('%c提取后的轮播图数据:', 'color: blue; font-weight: bold', data);

    // 检查是否有数据并且是数组
    if (data && data.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log(`%c✅ 成功获取到 ${data.data.length} 条轮播图数据`, 'color: green; font-weight: bold');

      // 将API返回的数据转换为轮播图格式
      const heroSlides = data.data.map((item, index) => ({
        id: item.id,
        imageUrl: item.imageUrl,
        title: item.title,
        subtitle: item.subtitle,
        buttonText: validLanguage === 'en' ? 'Explore Programs' : '浏览项目',
        buttonUrl: '/programs',
        order: item.order || index
      }));

      console.log('%c✅ 转换后的轮播图数据:', 'color: green; font-weight: bold', heroSlides);
      return heroSlides;
    } else if (data && typeof data === 'object' && 'id' in data) {
      // 兼容单个对象的情况
      console.log('%c✅ 成功获取到单个轮播图数据', 'color: green; font-weight: bold');

      return [{
        id: data.id,
        imageUrl: data.imageUrl,
        title: data.title,
        subtitle: data.subtitle,
        buttonText: validLanguage === 'en' ? 'Explore Programs' : '浏览项目',
        buttonUrl: '/programs',
        order: 0
      }];
    } else {
      console.log('%c❗ API返回的数据格式不符合预期', 'color: orange; font-weight: bold');
      // 出错时使用 mock 数据作为后备
      return mockHeroSlides.map(slide => transformSlideToLanguage(slide, language));
    }
  } catch (error) {
    console.error('Error fetching hero slides:', error);
    // 出错时使用 mock 数据作为后备
    return mockHeroSlides.map(slide => transformSlideToLanguage(slide, language));
  }
};

// Mock student stories data
const mockStudentStories = [
  {
    id: "1",
    image: "/Edgoing/Home_Page/Testimonial1StevenStanley.jpg",
    name_en: "Steven Stanley",
    name_zh: "史蒂文·斯坦利",
    background_en: "High School Student, 17 years old",
    background_zh: "高中生，17 岁",
    program_en: "Cultural Exchange in Kyoto",
    program_zh: "京都的文化交流",
    testimonial_en: "I had an enjoyable time exploring the streets of Kyoto and immersing myself in its rich culture, especially experiencing the powerful beats of Japanese drums and participating in vibrant summer festivals. The tea ceremony workshop, calligraphy classes, and homestay experience with a local family truly deepened my understanding of traditional Japanese values and modern lifestyle.",
    testimonial_zh: "我在京都的街头漫步，沉浸在其丰富的文化中，度过了非常愉快的时光，尤其是体验了日本太鼓的强劲节奏，并参加了充满活力的夏日祭典。茶道工作坊、书法课程以及与当地家庭的寄宿体验，真正加深了我对日本传统价值观与现代生活方式的理解。",
    rating: 5,
    order_index: 0
  },
  {
    id: "2",
    image: "/Edgoing/Home_Page/Testimonial2KhengLeng.jpg",
    name_en: "Kheng Lee",
    name_zh: "李康",
    background_en: "Teacher",
    background_zh: "教师",
    program_en: "STEM Program in Singapore",
    program_zh: "新加坡的STEM项目",
    testimonial_en: "My students couldn't stop sharing their exciting experiences after the trip to Singapore. I, too, thoroughly enjoyed the excursion to Gardens by the Bay, where we marveled at a stunning variety of flora and fauna in the beautiful indoor gardens, creating unforgettable memories.",
    testimonial_zh: "这是我的学生们在新加坡之旅后无法停止分享他们的激动经历。我也非常享受这次滨海湾花园的游览，我们在美丽的室内花园中惊叹于各种令人惊叹的动植物，创造了难忘的回忆。",
    rating: 5,
    order_index: 1
  },
  {
    id: "3",
    image: "/Edgoing/Home_Page/Testimonial3Liwei.jpg",
    name_en: "Li Wei",
    name_zh: "李维",
    background_en: "High School Student, 17 years old",
    background_zh: "高中生，17岁",
    program_en: "Wealth Management Program by Edgoing at SMU",
    program_zh: "Edgoing与新加坡管理大学（SMU）合作的财富管理项目",
    testimonial_en: "I'm Li Wei, 17, from Shanghai. Edgoing's SMU program ignited my finance passion. Lectures, portfolio tasks, and mentorship honed my skills. The certificate boosted my university applications—I'm set on finance degrees!",
    testimonial_zh: "我是李伟，17岁，来自上海。Edgoing的新加坡管理大学项目点燃了我的金融热情。讲座和投资组合任务提升了我的技能，导师指导让我受益匪浅。结业证书增强了我的大学申请信心，我决心攻读金融学位！",
    rating: 5,
    order_index: 2
  },
  {
    id: "4",
    image: "/Edgoing/Home_Page/Testimonial4Yoyo.jpg",
    name_en: "Yoyo",
    name_zh: "Bruce",
    background_en: "Middle-school student, 13 years old",
    background_zh: "初中生，12岁",
    program_en: "STEM Program in Singapore",
    program_zh: "英国国际学校暑期项目",
    testimonial_en: "This trip transformed my worldview! Hands-on learning, cultural experiences, and incredible friends made it unforgettable. Supportive staff ensured safety. I'm excited for the next program and staying connected with newfound friends.",
    testimonial_zh: "这次旅行改变了我的世界观！实践学习、文化体验和结识的朋友让它难以忘怀。工作人员的支持让我全程感到安全。我期待下一个项目，并希望与新朋友们保持联系。",
    rating: 5,
    order_index: 3
  },
  {
    id: "5",
    image: "/Edgoing/Home_Page/Testimonial5MrsZhang.jpg",
    name_en: "Mrs. Zhang",
    name_zh: "张女士",
    background_en: "Parent of a 15-year-old",
    background_zh: "10岁学生家长",
    program_en: "UK International School Summer Program",
    program_zh: "新加坡 STEM 项目",
    testimonial_en: "I was initially concerned about safety, but the team ensured constant updates, and my child was well cared for. She returned more confident, independent, and globally aware—highly recommend this transformative experience! ",
    testimonial_zh: "起初我担心安全问题，但团队及时沟通，孩子得到了很好的照顾。她回来后更加自信、独立，视野也更开阔了——强烈推荐这次改变人生的经历！",
    rating: 5,
    order_index: 4
  },
  {
    id: "6",
    image: "/Edgoing/Home_Page/Testimonial6Parent.jpg",
    name_en: "Parent of Li Wei",
    name_zh: "陈女士",
    background_en: "Parent",
    background_zh: "家长",
    program_en: "Edgoing's Wealth Management Program at SMU",
    program_zh: "Edgoing在新加坡管理大学举办的财富管理项目",
    testimonial_en: "Edgoing's SMU program wowed with expert lectures, fintech startup visits, and cultural trips. Li Wei gained skills, clarity, and ambition in finance, blending academics, industry, and culture into an inspiring educational adventure.",
    testimonial_zh: "Edgoing的新加坡管理大学项目令人惊叹，结合专家讲座、金融科技公司参访和文化之旅。李伟提升了技能，明确了方向，激发了金融抱负，将学术、行业与文化融合成一场精彩的教育之旅。",
    rating: 5,
    order_index: 5
  }
];

// 学生故事数据接口
interface StudentStory {
  id: string;
  image: string;
  name: string;
  background: string;
  program: string;
  rating: number;
  testimony: string;
}

// 获取学生故事
export const getStudentStories = async (language: 'en' | 'zh' = 'en') => {
  try {
    // 从代理服务器获取学生故事数据
    // 修复：移除重复的 /api 前缀
    console.log(`%c✅ 请求学生故事数据，路径: student-stories?locale=${language}`, 'color: green; font-weight: bold');
    const response = await apiClient.get(`student-stories?locale=${language}`);
    const data = extractData(response);

    if (Array.isArray(data)) {
      // 返回服务器数据
      return data.map(story => ({
        id: story.id,
        image: story.image,
        name: story.name,
        background: story.background,
        program: story.program,
        rating: story.rating,
        testimony: story.testimonial
      }) as StudentStory);
    }

    // 如果服务器数据无效，使用本地模拟数据
    console.warn('从服务器获取学生故事失败，使用本地模拟数据');
    return mockStudentStories.map(story => ({
      id: story.id,
      image: story.image,
      name: language === 'en' ? story.name_en : story.name_zh,
      background: language === 'en' ? story.background_en : story.background_zh,
      program: language === 'en' ? story.program_en : story.program_zh,
      rating: story.rating,
      testimony: language === 'en' ? story.testimonial_en : story.testimonial_zh
    }) as StudentStory);
  } catch (error) {
    console.error('Error fetching student stories:', error);
    // 出错时使用本地模拟数据
    return mockStudentStories.map(story => ({
      id: story.id,
      image: story.image,
      name: language === 'en' ? story.name_en : story.name_zh,
      background: language === 'en' ? story.background_en : story.background_zh,
      program: language === 'en' ? story.program_en : story.program_zh,
      rating: story.rating,
      testimony: language === 'en' ? story.testimonial_en : story.testimonial_zh
    }) as StudentStory);
  }
};

// Mock featured programs data
const mockFeaturedPrograms = [
  {
    id: "1",
    program_id: "1",
    image: "/images/programs/tokyo-2025.jpg",
    title_en: "2025 Summer Tokyo Anime Cultural Exploration Project",
    title_zh: "2025年夏季日本东京动漫文化探索项目",
    description_en: "Experience the vibrant anime culture in Tokyo",
    description_zh: "体验东京充满活力的动漫文化",
    location_en: "Tokyo",
    location_zh: "日本东京",
    duration: "7 days",
    duration_en: "7 days",
    duration_zh: "7天",
    country: "Japan",
    grade_levels: ["9", "10", "11", "12"]
  },
  {
    id: "2",
    program_id: "2",
    image: "/images/programs/cambridge-2025.jpg",
    title_en: "2025 Cambridge Summit Academic Summer Camp",
    title_zh: "2025年剑桥峰会学术夏令营",
    description_en: "Join the prestigious academic summit at Cambridge",
    description_zh: "参加剑桥大学顶尖学术峰会",
    location_en: "Cambridge",
    location_zh: "英国剑桥",
    duration: "16 days",
    duration_en: "16 days",
    duration_zh: "16天",
    country: "UK",
    grade_levels: ["10", "11", "12"]
  },
  {
    id: "3",
    program_id: "3",
    image: "/images/programs/singapore-2025.jpg",
    title_en: "2025 Singapore Science & Innovation STEM Summer Camp",
    title_zh: "2025年新加坡科学与创新STEM夏令营",
    description_en: "Explore STEM innovation in Singapore",
    description_zh: "在新加坡探索STEM创新",
    location_en: "Singapore",
    location_zh: "新加坡",
    duration: "7 days",
    duration_en: "7 days",
    duration_zh: "7天",
    country: "Singapore",
    grade_levels: ["8", "9", "10", "11", "12"]
  }
];

// 精选项目数据接口
interface FeaturedProgram {
  id: string;
  image: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  location_en: string;
  location_zh: string;
  duration: string;
  duration_en: string;
  duration_zh: string;
  country: string;
}

// 获取精选项目 - 使用display_order字段从 Strapi 获取
// 导入新的获取首页项目的函数
import { getHomePagePrograms } from '@/services/programs/programFileService';

export const getFeaturedPrograms = async (language: 'en' | 'zh' = 'en') => {
  console.log('开始获取首页项目，语言:', language);
  try {
    // 直接从 API 获取所有项目，添加时间戳避免缓存
    console.log('尝试从 API 获取首页项目');
    const timestamp = new Date().getTime();
    // 修复：使用正确的API路径
    console.log(`%c✅ 请求项目数据，路径: programs?_t=${timestamp}`, 'color: green; font-weight: bold');
    const response = await fetch(`/api/programs?_t=${timestamp}`, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log('从 API 获取到的原始数据:', responseData);

      // 检查响应数据的格式
      if (!responseData || !responseData.data || !Array.isArray(responseData.data)) {
        console.error('响应数据格式不正确，预期是包含 data 数组的对象');
        console.log('使用静态数据作为备选');
      } else {
        const allPrograms = responseData.data;
        console.log('从 API 获取到所有项目数量:', allPrograms.length);

        // 打印所有项目的 display_order 值
        console.log('所有项目的 display_order 值:', allPrograms.map((p: any) => ({ id: p.id, display_order: p.display_order })));

        // 过滤出 display_order > 0 的项目
        const featuredPrograms = allPrograms
          .filter((program: any) => {
            const order = program.display_order;
            // 接受任何大于0的display_order值
            return order && order > 0;
          })
          .sort((a: any, b: any) => {
            // 按 display_order 排序
            return (a.display_order || 0) - (b.display_order || 0);
          })
          .slice(0, 3);

        // 打印过滤后的项目的 display_order 值
        console.log('过滤后的项目的 display_order 值:', featuredPrograms.map((p: any) => p.display_order));

        console.log('过滤后的首页项目数量:', featuredPrograms.length);
        console.log('过滤后的首页项目:', featuredPrograms.map((p: any) => ({ id: p.id, title: language === 'en' ? p.title_en : p.title_zh, display_order: p.display_order })));

        if (featuredPrograms.length > 0) {
          console.log('成功从 API 获取首页项目，根据 display_order 排序');
          return featuredPrograms;
        } else {
          console.log('从 API 获取的项目中没有设置 display_order 为 1、2、3 的项目');

          // 如果没有设置 display_order 为 1、2、3 的项目，则返回前三个项目
          if (allPrograms.length > 0) {
            console.log('返回前三个项目作为首页项目');
            return allPrograms.slice(0, 3);
          }
        }
      }
    } else {
      console.log('API 请求失败，状态码:', response.status);
    }

    // 如果从 API 获取失败，则返回空数组
    console.warn('从 API 获取首页项目失败，返回空数组');
    return [];
  } catch (error) {
    console.error('Error fetching featured programs:', error);
    return [];
  }
};

// Mock featured programs intro data
const mockFeaturedProgramsIntro = {
  subtitle_en: "Featured Educational Programs",
  subtitle_zh: "精选教育项目",
  title_en: "Explore Our Featured Programs",
  title_zh: "探索我们的精选项目",
  link_text_en: "View All Programs",
  link_text_zh: "查看所有项目",
  link_url: "/programs"
};

// 精选项目简介数据接口
interface FeaturedProgramsIntro {
  subtitle: string;
  title: string;
  linkText: string;
  linkUrl: string;
}

// 获取精选项目简介
export const getFeaturedProgramsIntro = async (language: 'en' | 'zh' = 'en') => {
  try {
    // 尝试从本地 JSON 文件加载精选项目简介数据
    try {
      const response = await fetch(`/content/home/featured-programs-intro.json?t=${new Date().getTime()}`);
      if (response.ok) {
        const introData = await response.json();
        return {
          subtitle: language === 'en' ? introData.subtitle_en : introData.subtitle_zh,
          title: language === 'en' ? introData.title_en : introData.title_zh,
          linkText: language === 'en' ? introData.link_text_en : introData.link_text_zh,
          linkUrl: introData.link_url
        } as FeaturedProgramsIntro;
      } else {
        console.error(`无法加载精选项目简介数据: ${response.statusText}`);
      }
    } catch (fileError) {
      console.error('Error loading featured programs intro from file:', fileError);
    }

    // 如果从 JSON 文件加载失败，则返回模拟数据作为备选
    console.warn('从 JSON 文件加载精选项目简介数据失败，使用模拟数据作为备选');
    return {
      subtitle: language === 'en' ? mockFeaturedProgramsIntro.subtitle_en : mockFeaturedProgramsIntro.subtitle_zh,
      title: language === 'en' ? mockFeaturedProgramsIntro.title_en : mockFeaturedProgramsIntro.title_zh,
      linkText: language === 'en' ? mockFeaturedProgramsIntro.link_text_en : mockFeaturedProgramsIntro.link_text_zh,
      linkUrl: mockFeaturedProgramsIntro.link_url
    } as FeaturedProgramsIntro;
  } catch (error) {
    console.error('Error fetching featured programs intro:', error);
    return null;
  }
};

// 获取标语部分内容
export const getTaglineSection = async (language: 'en' | 'zh') => {
  try {
    // 修复：移除重复的 /api 前缀
    console.log('%c✅ 请求标语部分数据，路径: tagline-section', 'color: green; font-weight: bold');
    const response = await apiClient.get('tagline-section');
    const data = extractData<{title?: string; description?: string}>(response);

    return {
      title: "Explore. Learn. Grow.",
      description: language === 'en'
        ? 'Every EdGoing program is a carefully crafted adventure, designed to go beyond sightseeing—challenging assumptions, building empathy, and empowering students to see the world, and themselves, in new ways. Through these transformative experiences, we open minds, build bridges, and create memories that last a lifetime.'
        : '每一个 EdGoing 项目都是精心打造的探险之旅，旨在超越简单的观光——挑战固有观念、培养共情能力，并赋予学生以全新的方式看待世界和自我。'
    };
  } catch (error) {
    console.error('Error fetching tagline section:', error);
    return {
      title: "Explore. Learn. Grow.",
      description: language === 'en'
        ? 'Every EdGoing program is a carefully crafted adventure, designed to go beyond sightseeing—challenging assumptions, building empathy, and empowering students to see the world, and themselves, in new ways. Through these transformative experiences, we open minds, build bridges, and create memories that last a lifetime.'
        : '每一个 EdGoing 项目都是精心打造的探险之旅，旨在超越简单的观光——挑战固有观念、培养共情能力，并赋予学生以全新的方式看待世界和自我。'
    };
  }
};

// 获取项目页面Hero数据
export const getProgramHero = async (language: 'en' | 'zh' = 'en') => {
  try {
    // 确保locale参数值为'en'或'zh'
    const locale = language === 'zh' ? 'zh' : 'en';
    console.log(`获取项目页面Hero数据，语言: ${locale}`);

    // 请求项目页面Hero数据
    console.log(`%c✅ 请求项目Hero数据，路径: programs/hero?locale=${locale}`, 'color: green; font-weight: bold');
    const response = await apiClient.get(`programs/hero?locale=${locale}`);
    console.log('%c原始API响应:', 'color: blue; font-weight: bold', response);

    // 直接处理原始响应数据，不使用 extractData 函数
    if (response && typeof response === 'object') {
      // 如果响应是对象且有 success 属性为 true，并且有 data 属性
      if (response.success === true && response.data) {
        console.log('%c✅ 成功从API获取项目Hero数据', 'color: green; font-weight: bold');
        console.log('%c项目Hero数据:', 'color: blue; font-weight: bold', response.data);

        // 处理图片URL
        const heroData = response.data;
        if (heroData.imageUrl && typeof heroData.imageUrl === 'string') {
          // 确保图片URL是完整的
          if (!heroData.imageUrl.startsWith('http') && !heroData.imageUrl.startsWith('/')) {
            heroData.imageUrl = `/${heroData.imageUrl}`;
          }
        }

        return heroData;
      } else {
        console.log('%c❌ response.success 不为 true 或者没有 data 属性', 'color: red; font-weight: bold');
        console.log('response.success:', response.success);
        console.log('response 对象属性:', Object.keys(response));
      }
    } else {
      console.log('%c❌ response 不是对象或为 null', 'color: red; font-weight: bold');
      console.log('response 类型:', typeof response);
      console.log('response 值:', response);
    }

    // 如果数据格式不符合预期，返回 null
    console.log('%c❌ 没有从API获取到有效的项目Hero数据，返回 null', 'color: red; font-weight: bold');
    return null;
  } catch (error) {
    console.error('Error fetching program hero:', error);
    // 出错时抛出错误
    console.log('%c❌ 获取项目Hero数据出错', 'color: red; font-weight: bold');
    throw error;
  }
};

export default {
  getHeroSlides,
  getHomeHero,
  getStudentStories,
  getFeaturedPrograms,
  getFeaturedProgramsIntro,
  getTaglineSection,
  getProgramHero
};
