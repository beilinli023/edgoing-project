/**
 * 静态API回退机制
 * 提供零侵入式API请求保护，确保前端部署时不依赖后端API可用性
 */
import { AxiosError } from 'axios';
import { ApiResponse } from '@/services/api/apiService';

/**
 * 环境配置
 * 强制禁用静态数据回退，确保始终使用真实 API 数据
 */
// 静态模式强制禁用，使用真实API数据
const STATIC_MODE = false;

// 强制禁用静态模式，即使发生错误也不会回退到静态数据
const FORCE_DISABLE_STATIC = true;

// 防止其他代码修改这些值
Object.defineProperty(window, 'STATIC_MODE', {
  value: false,
  writable: false,
  configurable: false
});

Object.defineProperty(window, 'FORCE_DISABLE_STATIC', {
  value: true,
  writable: false,
  configurable: false
});

// 静态数据存储 - 保持与真实API完全相同的数据结构
const staticData: Record<string, ApiResponse<unknown>> = {
  // 联系信息API
  '/api/contact-info': {
    success: true,
    data: {
      phone: "+86 138-1234-5678",
      email: "contact@younikco.com",
      address: "上海市浦东新区创新大道123号"
    }
  },

  // 导航菜单API
  '/api/navigation': {
    success: true,
    data: {
      menu: [
        { id: "home", label: { en: "Home", zh: "首页" }, url: "/" },
        { id: "about", label: { en: "About", zh: "关于我们" }, url: "/about" },
        { id: "programs", label: { en: "Programs", zh: "项目" }, url: "/programs" },
        { id: "blog", label: { en: "Blog", zh: "博客" }, url: "/blog" },
        { id: "contact", label: { en: "Contact", zh: "联系我们" }, url: "/contact" }
      ]
    }
  },

  // 社交媒体API
  '/api/social-media': {
    success: true,
    data: {
      links: [
        { platform: "wechat", url: "#", icon: "wechat" },
        { platform: "weibo", url: "https://weibo.com/younikco", icon: "weibo" },
        { platform: "linkedin", url: "https://linkedin.com/company/younikco", icon: "linkedin" }
      ]
    }
  },

  // About页面内容API
  '/about-page': {
    success: true,
    data: {
      hero: {
        title_en: "Meet EdGoing",
        title_zh: "认识EdGoing",
        subtitle_en: "A leading education organization committed to providing quality global education experiences",
        subtitle_zh: "致力于提供高质量全球教育体验的领先教育机构"
      },
      mission: {
        title_en: "Our Mission",
        title_zh: "我们的使命",
        content_en: "EdGoing is dedicated to bridging educational gaps and creating meaningful cross-cultural experiences for students worldwide. We believe in the transformative power of education and aim to make quality learning accessible to all.",
        content_zh: "EdGoing致力于弥合教育差距，为全球学生创造有意义的跨文化体验。我们相信教育的变革力量，旨在使优质学习对所有人都可获得。"
      },
      values: [
        {
          id: "1",
          icon: "Book",
          title_en: "Academic Excellence",
          title_zh: "学术卓越",
          description_en: "Maintaining highest educational standards",
          description_zh: "保持最高的教育标准"
        },
        {
          id: "2",
          icon: "Users",
          title_en: "Community Focus",
          title_zh: "社区关注",
          description_en: "Building strong educational communities",
          description_zh: "建立强大的教育社区"
        },
        {
          id: "3",
          icon: "Globe",
          title_en: "Global Perspective",
          title_zh: "全球视野",
          description_en: "Fostering international understanding",
          description_zh: "培养国际理解"
        },
        {
          id: "4",
          icon: "Heart",
          title_en: "Student Wellbeing",
          title_zh: "学生福祉",
          description_en: "Ensuring well-being of our participants",
          description_zh: "确保参与者的健康福祉"
        },
        {
          id: "5",
          icon: "Globe2",
          title_en: "Global Citizenship",
          title_zh: "全球公民意识",
          description_en: "Nurturing responsible world citizens",
          description_zh: "培养负责任的世界公民"
        }
      ]
    }
  },

  // 页脚信息API
  '/api/footer': {
    success: true,
    data: {
      copyright: " 2025 YouNiKco Education",
      links: [
        { label: { en: "Terms", zh: "条款" }, url: "/terms" },
        { label: { en: "Privacy", zh: "隐私" }, url: "/privacy" }
      ]
    }
  },

  // 首页轮播图API
  '/api/home/carousel': {
    success: true,
    data: {
      slides: [
        {
          id: "1",
          title_en: "Learn Beyond Walls",
          title_zh: "超越课堂边界",
          subtitle_en: "Ignite Curiosity, Inspire Growth, Immerse Yourself",
          subtitle_zh: "点燃好奇心，启发成长，沉浸式探索世界",
          image_url: "/Edgoing/Home_Page/Picture_1.jpg",
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
          image_url: "/Edgoing/Home_Page/Picture_2.jpg",
          button_text_en: "Learn More",
          button_text_zh: "了解更多",
          button_url: "/about",
          order_index: 2
        },
        {
          id: "3",
          title_en: "Academic Programs",
          title_zh: "学术项目",
          subtitle_en: "Shaping Global Minds, Inspiring Lifelong Learning.",
          subtitle_zh: "塑造全球化思维，激发终身学习热情",
          image_url: "/Edgoing/Home_Page/Picture_3.jpg",
          button_text_en: "View Programs",
          button_text_zh: "查看项目",
          button_url: "/programs",
          order_index: 3
        },
        {
          id: "4",
          title_en: "Heritage Cultural Tour",
          title_zh: "文化遗产之旅​",
          subtitle_en: "Step into the past, Uncover the stories",
          subtitle_zh: "步入历史长河，探寻精彩故事",
          image_url: "/Edgoing/Home_Page/Picture_4.jpg",
          button_text_en: "View Programs",
          button_text_zh: "查看项目",
          button_url: "/programs",
          order_index: 4
        },
        {
          id: "5",
          title_en: "Global Citizenship Starts Here",
          title_zh: "全球公民，从这里启航",
          subtitle_en: "Explore the world, embrace cultures, and lead with purpose",
          subtitle_zh: "探索世界，拥抱多元文化，以使命引领前行",
          image_url: "/Edgoing/Home_Page/Picture_5.jpg",
          button_text_en: "View Programs",
          button_text_zh: "查看项目",
          button_url: "/programs",
          order_index: 5
        }
      ]
    }
  },


  // 博客文章列表API
  '/api/blog/posts': {
    success: true,
    data: {
      posts: [
        {
          id: 1,
          title: { en: "Education Trends 2025", zh: "2025年教育趋势" },
          summary: { en: "The future of learning", zh: "学习的未来" },
          author: "张教授",
          date: "2025-02-15",
          imageUrl: "/images/blog/post1.jpg",
          slug: "education-trends-2025"
        },
        {
          id: 2,
          title: { en: "Technology in Classrooms", zh: "课堂中的技术" },
          summary: { en: "Digital tools for teaching", zh: "教学数字工具" },
          author: "李博士",
          date: "2025-01-28",
          imageUrl: "/images/blog/post2.jpg",
          slug: "technology-in-classrooms"
        },
        {
          id: 3,
          title: { en: "Student Success Stories", zh: "学生成功故事" },
          summary: { en: "Inspirational journeys", zh: "励志旅程" },
          author: "王老师",
          date: "2025-01-10",
          imageUrl: "/images/blog/post3.jpg",
          slug: "student-success-stories"
        }
      ]
    }
  },

  // 博客文章详情API
  '/api/blog/post/': {
    success: true,
    data: {
      id: 1,
      title: { en: "Education Trends 2025", zh: "2025年教育趋势" },
      content: {
        en: "This is a detailed article about education trends in 2025...",
        zh: "这是一篇关于2025年教育趋势的详细文章..."
      },
      author: "张教授",
      date: "2025-02-15",
      imageUrl: "/images/blog/post1.jpg",
      tags: ["education", "trends", "technology"]
    }
  },

  // 快速链接API
  '/api/quick-links': {
    success: true,
    data: {
      links: [
        {
          id: 1,
          title: { en: "Student Portal", zh: "学生门户" },
          url: "/student-portal",
          icon: "user-student"
        },
        {
          id: 2,
          title: { en: "Apply Now", zh: "立即申请" },
          url: "/apply",
          icon: "document"
        },
        {
          id: 3,
          title: { en: "FAQ", zh: "常见问题" },
          url: "/faq",
          icon: "question"
        },
        {
          id: 4,
          title: { en: "Contact Us", zh: "联系我们" },
          url: "/contact",
          icon: "mail"
        }
      ]
    }
  },

  // 项目列表API
  '/programs': {
    success: true,
    data: [
      {
        id: "1",
        title_en: "English Language Summer School 2025 Adcote Matrix International",
        title_zh: "2025年阿德科特国际英语暑期学校",
        program_id: "MYLAN-2025-002",
        image: "/Edgoing/Program_Page/Malaysia/Picture_3.jpg",
        location_en: "Malaysia",
        location_zh: "马来西亚",
        duration: "3 weeks",
        duration_en: "3 weeks",
        duration_zh: "3 周",
        country: "Malaysia",
        program_type_en: ["Language Intensive", "Language & Lifestyle"],
        program_type_zh: ["语言强化", "语言与生活"],
        destination_en: "Malaysia",
        destination_zh: "马来西亚",
        grade_level_en: ["Middle School"],
        grade_level_zh: ["初中"],
        grade_levels: ["Middle School", "初中"],
        overview_en: "Our 3-week English Language Summer School is designed for learners aged 10 to 14, offering a comprehensive and immersive experience to develop English language skills.",
        overview_zh: "我们的3周英语夏令营专为10至14岁的学习者设计，提供全面且沉浸式的体验，帮助学生提升英语语言能力。"
      },
      {
        id: "2",
        title_en: "Singapore 'Sea, Land, Air' English Camp 2025",
        title_zh: "2025年新加坡\"海陆空\"英语营",
        program_id: "SGLAN-2025-001",
        image: "/Edgoing/Program_Page/Singapore/English_Camp/Picture_1.png",
        location_en: "Singapore",
        location_zh: "新加坡",
        duration: "2 weeks",
        duration_en: "2 weeks",
        duration_zh: "2周",
        country: "Singapore",
        program_type_en: ["Language & Lifestyle", "Language Intensive"],
        program_type_zh: ["语言与生活", "语言强化"],
        destination_en: "Singapore",
        destination_zh: "新加坡",
        grade_level_en: ["Middle School", "High School"],
        grade_level_zh: ["初中", "高中"],
        grade_levels: ["Middle School", "High School", "初中", "高中"],
        overview_en: "The \"Sea, Land, and Sky\" English Camp in Singapore is a 7-day immersive program designed for students aged 10 to 15.",
        overview_zh: "新加坡\"海陆空\"英语营是一个为期7天的沉浸式项目，专为10至15岁的学生设计。"
      },
      {
        id: "3",
        title_en: "Singapore STEM & AI Camp 2025",
        title_zh: "2025年新加坡STEM与AI营",
        program_id: "SGSTEM-2025-003",
        image: "/Edgoing/Program_Page/Singapore/STEM/Picture_6.png",
        location_en: "Singapore",
        location_zh: "新加坡",
        duration: "7 days",
        duration_en: "7 days",
        duration_zh: "7 天",
        country: "Singapore",
        program_type_en: ["STEM & Science"],
        program_type_zh: ["STEM与科学创新"],
        destination_en: "Singapore",
        destination_zh: "新加坡",
        grade_level_en: ["Middle School", "High School"],
        grade_level_zh: ["初中", "高中"],
        grade_levels: ["Middle School", "High School", "初中", "高中"],
        overview_en: "AI and STEM focused courses and workshops at top Singaporean institutions like Nanyang Technological University and the Science Centre Singapore.",
        overview_zh: "AI与STEM重点课程，在新加坡南洋理工大学和科学中心等顶级机构进行。"
      }
    ]
  },

  // 单个项目详情API - 动态路径模板
  '/programs/': {
    success: true,
    data: {
      id: "1",
      title_en: "English Language Summer School 2025 Adcote Matrix International",
      title_zh: "2025年阿德科特国际英语暑期学校",
      program_id: "MYLAN-2025-002",
      image: "/Edgoing/Program_Page/Malaysia/Picture_3.jpg",
      location_en: "Malaysia",
      location_zh: "马来西亚",
      duration: "3 weeks",
      duration_en: "3 weeks",
      duration_zh: "3 周",
      country: "Malaysia",
      program_type_en: ["Language Intensive", "Language & Lifestyle"],
      program_type_zh: ["语言强化", "语言与生活"],
      destination_en: "Malaysia",
      destination_zh: "马来西亚",
      grade_level_en: ["Middle School"],
      grade_level_zh: ["初中"],
      grade_levels: ["Middle School", "初中"],
      overview_en: "Our 3-week English Language Summer School is designed for learners aged 10 to 14, offering a comprehensive and immersive experience to develop English language skills. The program welcomes students of all proficiency levels and combines classroom learning with a variety of extracurricular activities.",
      overview_zh: "我们的3周英语夏令营专为10至14岁的学习者设计，提供全面且沉浸式的体验，帮助学生提升英语语言能力。该项目欢迎所有英语水平的学生参加，将课堂学习与丰富多彩的课外活动相结合。",
      description_en: "Our English Language Summer School offers a balanced program that combines academic learning with fun activities, cultural experiences, and personal development. Classes are taught by qualified native English speakers, ensuring an authentic language learning environment.",
      description_zh: "我们的英语暑期学校提供平衡的课程，将学术学习与有趣的活动、文化体验和个人发展相结合。课程由合格的英语母语教师授课，确保地道的语言学习环境。",
      gallery_images: [
        "/Edgoing/Program_Page/Malaysia/Picture_3.jpg",
        "/Edgoing/Program_Page/Malaysia/Picture_2.jpg",
        "/Edgoing/Program_Page/Malaysia/Picture_1.jpg"
      ]
    }
  },
};

/**
 * API请求拦截函数
 * 强制使用真实API数据，不使用静态数据
 */
export function interceptApiRequest<T>(
  apiPath: string,
  originalRequestFn: () => Promise<T>
): Promise<T> {
  // 直接执行原始请求，不使用静态数据
  console.log(`[真实API] 请求: ${apiPath}`);
  return originalRequestFn().catch((error: AxiosError) => {
    console.error(`[API错误] ${apiPath} 请求失败:`, error.message);
    // 始终抛出错误，不使用静态数据
    throw error;
  });
}

/**
 * 静态数据管理工具
 * 允许在运行时添加/更新静态数据
 */
export const StaticDataManager = {
  // 添加或更新静态数据
  setData: <T>(path: string, data: ApiResponse<T>): void => {
    staticData[path] = data as ApiResponse<unknown>;
  },

  // 获取静态数据
  getData: <T>(path: string): ApiResponse<T> | undefined => {
    return staticData[path] as ApiResponse<T> | undefined;
  },

  // 检查是否有路径的静态数据
  hasData: (path: string): boolean => {
    return !!staticData[path];
  }
};
