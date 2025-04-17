import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

// 获取Strapi URL
const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

// 获取Strapi API Token
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN || '';

// 创建Strapi API请求头
const getStrapiHeaders = () => {
  const headers = {};
  if (STRAPI_API_TOKEN) {
    headers['Authorization'] = `Bearer ${STRAPI_API_TOKEN}`;
  }
  return headers;
};

// 简单的日志函数
const log = (message) => console.log(`[StudentStory] ${message}`);
const logError = (message, error) => console.error(`[StudentStory] ${message}`, error);

/**
 * 获取所有学生故事
 */
export const getAllStudentStories = async (req, res) => {
  const locale = req.query.locale || 'en';

  try {
    log(`获取学生故事列表，语言: ${locale}`);

    // 从Strapi获取数据
    log(`尝试从Strapi获取数据，URL: ${STRAPI_URL}/api/student-stories?locale=${locale}&populate=*`);

    try {
      const response = await axios.get(`${STRAPI_URL}/api/student-stories?locale=${locale}&populate=*`, { headers: getStrapiHeaders() });

      if (response.data && response.data.data) {
        log(`成功从Strapi获取数据，共 ${response.data.data.length} 条记录`);

        // 处理Strapi返回的数据
        const stories = response.data.data.map(item => {
          // 构建图片URL
          let imageUrl = '';
          if (item.image && item.image.url) {
            // 直接使用image对象中的url字段
            imageUrl = `${STRAPI_URL}${item.image.url}`;
          }

          return {
            id: item.id,
            image: imageUrl || `/Edgoing/Home_Page/Testimonial${item.id}StevenStanley.jpg`, // 使用默认图片
            name: item.name || '',
            background: item.background || '',
            program: item.program || '',
            testimonial: item.testimonial || '',
            rating: item.rating || 5,
            order_index: item.id // 使用ID作为排序索引
          };
        });

        log(`成功处理 ${stories.length} 个学生故事`);
        res.json(stories);
        return;
      }
    } catch (strapiError) {
      log(`从Strapi获取数据失败: ${strapiError.message}`);
      log('将使用模拟数据作为备用');
    }

    // 如果从Strapi获取数据失败，使用模拟数据作为备用
    log('使用模拟数据作为备用');

    // 返回模拟数据 - 使用您在Strapi中配置的数据
    const stories = [
        {
          id: "1",
          image: "/Edgoing/Home_Page/Testimonial1StevenStanley.jpg",
          name: locale === 'en' ? "Steven Stanley" : "史蒂文·斯坦利",
          background: locale === 'en' ? "High School Student, 17 years old" : "高中生，17 岁",
          program: locale === 'en' ? "Cultural Exchange in Kyoto" : "京都的文化交流",
          testimonial: locale === 'en' ? "I had an enjoyable time exploring the streets of Kyoto and immersing myself in its rich culture, especially experiencing the powerful beats of Japanese drums and participating in vibrant summer festivals. The tea ceremony workshop, calligraphy classes, and homestay experience with a local family truly deepened my understanding of traditional Japanese values and modern lifestyle." : "我在京都的街头漫步，沉浸在其丰富的文化中，度过了非常愉快的时光，尤其是体验了日本太鼓的强劣节奏并参与了充满活力的夏日祖典。茶道工作坊、书法课程以及与当地家庭的寄宿体验真正加深了我对传统日本价值观和现代生活方式的理解。",
          rating: 5,
          order_index: 1
        },
        {
          id: "2",
          image: "/Edgoing/Home_Page/Testimonial2KhengLeng.jpg",
          name: locale === 'en' ? "Kheng Lee" : "李康",
          background: locale === 'en' ? "Teacher" : "教师",
          program: locale === 'en' ? "STEM Program in Singapore" : "新加坡的STEM项目",
          testimonial: locale === 'en' ? "My students couldn't stop sharing their exciting experiences after the trip to Singapore. I, too, thoroughly enjoyed the excursion to Gardens by the Bay, where we marveled at a stunning variety of flora and fauna in the beautiful indoor gardens, creating unforgettable memories." : "这是我的学生们在新加坡之旅后无法停止分享他们的激动经历。我也非常享受这次滨海湾花园的游览，我们在美丽的室内花园中惊叹于各种令人惊叹的动植物，创造了难忘的回忆。",
          rating: 5,
          order_index: 2
        },
        {
          id: "3",
          image: "/Edgoing/Home_Page/Testimonial3Liwei.jpg",
          name: locale === 'en' ? "Li Wei" : "李维",
          background: locale === 'en' ? "High School Student, 17 years old" : "高中生，17岁",
          program: locale === 'en' ? "Wealth Management Program by Edgoing at SMU" : "Edgoing与新加坡管理大学（SMU）合作的财富管理项目",
          testimonial: locale === 'en' ? "The Wealth Management Program by Edgoing at Singapore Management University (SMU) ignited my passion for finance. Lecturers made complex topics accessible—their interactive lectures on stock markets and personal budgeting were eye-opening! Assignments, like analyzing mock portfolios, and group presentations on risk management taught me teamwork and critical thinking." : "Edgoing与新加坡管理大学（SMU）合作的财富管理项目点燃了我对金融的热情。讲师们将复杂的主题讲解得通俗易懂——他们关于股票市场和个人预算的互动课程让我大开眼界！作业，比如分析模拟投资组合，以及关于风险管理的小组展示，教会了我团队合作和批判性思维。",
          rating: 5,
          order_index: 3
        }
      ];

    log(`成功获取 ${stories.length} 个学生故事（模拟数据）`);
    res.json(stories);
  } catch (error) {
    logError('获取学生故事失败:', error);
    res.status(500).json({
      error: '获取学生故事失败',
      message: error.message
    });
  }
};

/**
 * 获取特定ID的学生故事
 */
export const getStudentStoryById = async (req, res) => {
  const { id } = req.params;
  const locale = req.query.locale || 'en';

  if (!id) {
    return res.status(400).json({ error: '缺少学生故事ID' });
  }

  try {
    log(`获取学生故事详情，ID: ${id}，语言: ${locale}`);

    // 从Strapi获取数据
    log(`尝试从Strapi获取数据，URL: ${STRAPI_URL}/api/student-stories/${id}?locale=${locale}&populate=*`);

    try {
      const response = await axios.get(`${STRAPI_URL}/api/student-stories/${id}?locale=${locale}&populate=*`, { headers: getStrapiHeaders() });

      if (response.data && response.data.data) {
        log(`成功从Strapi获取数据，ID: ${id}`);

        // 处理Strapi返回的数据
        const item = response.data.data;

        // 构建图片URL
        let imageUrl = '';
        if (item.image && item.image.url) {
          // 直接使用image对象中的url字段
          imageUrl = `${STRAPI_URL}${item.image.url}`;
        }

        const story = {
          id: item.id,
          image: imageUrl || `/Edgoing/Home_Page/Testimonial${item.id}StevenStanley.jpg`, // 使用默认图片
          name: item.name || '',
          background: item.background || '',
          program: item.program || '',
          testimonial: item.testimonial || '',
          rating: item.rating || 5,
          order_index: item.id // 使用ID作为排序索引
        };

        log(`成功处理学生故事详情，ID: ${id}`);
        res.json(story);
        return;
      }
    } catch (strapiError) {
      log(`从Strapi获取数据失败: ${strapiError.message}`);
      log('将使用模拟数据作为备用');
    }

    // 如果从Strapi获取数据失败，使用模拟数据作为备用
    log('使用模拟数据作为备用');

    // 模拟数据
    const mockStories = [
      {
        id: "1",
        image: "/Edgoing/Home_Page/Testimonial1StevenStanley.jpg",
        name: locale === 'en' ? "Steven Stanley" : "史蒂文·斯坦利",
        background: locale === 'en' ? "High School Student, 17 years old" : "高中生，17 岁",
        program: locale === 'en' ? "Cultural Exchange in Kyoto" : "京都的文化交流",
        testimonial: locale === 'en' ? "I had an enjoyable time exploring the streets of Kyoto and immersing myself in its rich culture, especially experiencing the powerful beats of Japanese drums and participating in vibrant summer festivals. The tea ceremony workshop, calligraphy classes, and homestay experience with a local family truly deepened my understanding of traditional Japanese values and modern lifestyle." : "我在京都的街头漫步，沉浸在其丰富的文化中，度过了非常愉快的时光，尤其是体验了日本太鼓的强劣节奏并参与了充满活力的夏日祖典。茶道工作坊、书法课程以及与当地家庭的寄宿体验真正加深了我对传统日本价值观和现代生活方式的理解。",
        rating: 5,
        order_index: 1
      },
      {
        id: "2",
        image: "/Edgoing/Home_Page/Testimonial2KhengLeng.jpg",
        name: locale === 'en' ? "Kheng Lee" : "李康",
        background: locale === 'en' ? "Teacher" : "教师",
        program: locale === 'en' ? "STEM Program in Singapore" : "新加坡的STEM项目",
        testimonial: locale === 'en' ? "My students couldn't stop sharing their exciting experiences after the trip to Singapore. I, too, thoroughly enjoyed the excursion to Gardens by the Bay, where we marveled at a stunning variety of flora and fauna in the beautiful indoor gardens, creating unforgettable memories." : "这是我的学生们在新加坡之旅后无法停止分享他们的激动经历。我也非常享受这次滨海湾花园的游览，我们在美丽的室内花园中惊叹于各种令人惊叹的动植物，创造了难忘的回忆。",
        rating: 5,
        order_index: 2
      },
      {
        id: "3",
        image: "/Edgoing/Home_Page/Testimonial3Liwei.jpg",
        name: locale === 'en' ? "Li Wei" : "李维",
        background: locale === 'en' ? "High School Student, 17 years old" : "高中生，17岁",
        program: locale === 'en' ? "Wealth Management Program by Edgoing at SMU" : "Edgoing与新加坡管理大学（SMU）合作的财富管理项目",
        testimonial: locale === 'en' ? "The Wealth Management Program by Edgoing at Singapore Management University (SMU) ignited my passion for finance. Lecturers made complex topics accessible—their interactive lectures on stock markets and personal budgeting were eye-opening! Assignments, like analyzing mock portfolios, and group presentations on risk management taught me teamwork and critical thinking." : "Edgoing与新加坡管理大学（SMU）合作的财富管理项目点燃了我对金融的热情。讲师们将复杂的主题讲解得通俗易懂——他们关于股票市场和个人预算的互动课程让我大开眼界！作业，比如分析模拟投资组合，以及关于风险管理的小组展示，教会了我团队合作和批判性思维。",
        rating: 5,
        order_index: 3
      }
    ];

    // 根据ID查找对应的学生故事
    const story = mockStories.find(s => s.id === id);

    log(`成功获取学生故事详情，ID: ${id}（模拟数据）`);
    res.json(story);
  } catch (error) {
    logError(`获取学生故事详情失败，ID: ${id}:`, error);
    res.status(500).json({
      error: '获取学生故事详情失败',
      message: error.message
    });
  }
};

export default {
  getAllStudentStories,
  getStudentStoryById
};
