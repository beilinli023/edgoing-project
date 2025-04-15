import { useMutation, useQuery } from '@tanstack/react-query';
import { getFrontendFormContent, submitNewsletterSubscription, submitPlanningForm } from '@/services/frontend/formService';
import { toast } from 'sonner';
import { FormOption, FormContent, PlanningFormData } from '@/types/formTypes';

// 重新导出类型，以保持兼容性
export type { FormOption, FormContent, PlanningFormData };

/**
 * 获取表单内容的自定义Hook
 * @param {string} language - 语言，默认为'en'
 * @returns {Object} 包含表单内容数据、加载状态和错误信息的对象
 */
export function useFormContent(language = 'en') {
  // 获取默认表单内容
  const getDefaultFormContent = (lang: string): FormContent => {
    return {
      hero: {
        title: lang === 'en' ? "Start Your Planning" : "开始计划",
        subtitle: lang === 'en'
          ? "Ready to begin your educational journey? Let us help you create the perfect study abroad experience."
          : "准备开始您的教育之旅？让我们帮助您创造完美的海外学习体验。",
        backgroundImage: "/lovable-uploads/47bf9bbe-157b-4ebd-8119-331c7101bce3.png",
      },
      formSection: {
        title: lang === 'en' ? "Need help with assistance, or just have a question for us?" : "需要帮助或有任何问题？",
        responseTimeText: lang === 'en' ? "Fill out our form and we'll respond within 2 business days." : "填写我们的表单，我们将在2个工作日内回复。",
        phoneContact: lang === 'en' ? "Or Call Us @ 400-115-3558 (Email: Hello@edgoing.com)" : "或致电 400-115-3558（邮件：Hello@edgoing.com）",
      },
      options: {
        roles: [
          { id: "student", label: lang === 'en' ? "Student" : "学生" },
          { id: "parent", label: lang === 'en' ? "Parent" : "家长" },
          { id: "teacher", label: lang === 'en' ? "Teacher" : "教师" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        gradeLevels: [
          { id: "elementary", label: lang === 'en' ? "Elementary School" : "小学" },
          { id: "middle", label: lang === 'en' ? "Middle School" : "初中" },
          { id: "high", label: lang === 'en' ? "High School" : "高中" },
          { id: "university", label: lang === 'en' ? "University" : "大学" },
          { id: "graduate", label: lang === 'en' ? "Graduate School" : "研究生" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        provinces: [
          { id: "beijing", label: lang === 'en' ? "Beijing" : "北京" },
          { id: "shanghai", label: lang === 'en' ? "Shanghai" : "上海" },
          { id: "tianjin", label: lang === 'en' ? "Tianjin" : "天津" },
          { id: "chongqing", label: lang === 'en' ? "Chongqing" : "重庆" },
          { id: "hebei", label: lang === 'en' ? "Hebei" : "河北" },
          { id: "shanxi", label: lang === 'en' ? "Shanxi" : "山西" },
          { id: "liaoning", label: lang === 'en' ? "Liaoning" : "辽宁" },
          { id: "jilin", label: lang === 'en' ? "Jilin" : "吉林" },
          { id: "heilongjiang", label: lang === 'en' ? "Heilongjiang" : "黑龙江" },
          { id: "jiangsu", label: lang === 'en' ? "Jiangsu" : "江苏" },
          { id: "zhejiang", label: lang === 'en' ? "Zhejiang" : "浙江" },
          { id: "anhui", label: lang === 'en' ? "Anhui" : "安徽" },
          { id: "fujian", label: lang === 'en' ? "Fujian" : "福建" },
          { id: "jiangxi", label: lang === 'en' ? "Jiangxi" : "江西" },
          { id: "shandong", label: lang === 'en' ? "Shandong" : "山东" },
          { id: "henan", label: lang === 'en' ? "Henan" : "河南" },
          { id: "hubei", label: lang === 'en' ? "Hubei" : "湖北" },
          { id: "hunan", label: lang === 'en' ? "Hunan" : "湖南" },
          { id: "guangdong", label: lang === 'en' ? "Guangdong" : "广东" },
          { id: "guangxi", label: lang === 'en' ? "Guangxi" : "广西" },
          { id: "hainan", label: lang === 'en' ? "Hainan" : "海南" },
          { id: "sichuan", label: lang === 'en' ? "Sichuan" : "四川" },
          { id: "guizhou", label: lang === 'en' ? "Guizhou" : "贵州" },
          { id: "yunnan", label: lang === 'en' ? "Yunnan" : "云南" },
          { id: "shaanxi", label: lang === 'en' ? "Shaanxi" : "陕西" },
          { id: "gansu", label: lang === 'en' ? "Gansu" : "甘肃" },
          { id: "qinghai", label: lang === 'en' ? "Qinghai" : "青海" },
          { id: "taiwan", label: lang === 'en' ? "Taiwan" : "台湾" },
          { id: "neimenggu", label: lang === 'en' ? "Inner Mongolia" : "内蒙古" },
          { id: "xizang", label: lang === 'en' ? "Tibet" : "西藏" },
          { id: "ningxia", label: lang === 'en' ? "Ningxia" : "宁夏" },
          { id: "xinjiang", label: lang === 'en' ? "Xinjiang" : "新疆" },
          { id: "xianggang", label: lang === 'en' ? "Hong Kong" : "香港" },
          { id: "aomen", label: lang === 'en' ? "Macau" : "澳门" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        cities: [
          // 直辖市
          { id: "beijing", label: lang === 'en' ? "Beijing City" : "北京市", provinceId: "beijing" },
          { id: "shanghai", label: lang === 'en' ? "Shanghai City" : "上海市", provinceId: "shanghai" },
          { id: "tianjin", label: lang === 'en' ? "Tianjin City" : "天津市", provinceId: "tianjin" },
          { id: "chongqing", label: lang === 'en' ? "Chongqing City" : "重庆市", provinceId: "chongqing" },

          // 河北省
          { id: "shijiazhuang", label: lang === 'en' ? "Shijiazhuang" : "石家庄", provinceId: "hebei" },
          { id: "tangshan", label: lang === 'en' ? "Tangshan" : "唐山", provinceId: "hebei" },
          { id: "qinhuangdao", label: lang === 'en' ? "Qinhuangdao" : "秦皇岛", provinceId: "hebei" },
          { id: "baoding", label: lang === 'en' ? "Baoding" : "保定", provinceId: "hebei" },

          // 山西省
          { id: "taiyuan", label: lang === 'en' ? "Taiyuan" : "太原", provinceId: "shanxi" },
          { id: "datong", label: lang === 'en' ? "Datong" : "大同", provinceId: "shanxi" },

          // 辽宁省
          { id: "shenyang", label: lang === 'en' ? "Shenyang" : "沈阳", provinceId: "liaoning" },
          { id: "dalian", label: lang === 'en' ? "Dalian" : "大连", provinceId: "liaoning" },

          // 吉林省
          { id: "changchun", label: lang === 'en' ? "Changchun" : "长春", provinceId: "jilin" },
          { id: "jilin", label: lang === 'en' ? "Jilin City" : "吉林市", provinceId: "jilin" },

          // 黑龙江省
          { id: "haerbin", label: lang === 'en' ? "Harbin" : "哈尔滨", provinceId: "heilongjiang" },
          { id: "qiqihaer", label: lang === 'en' ? "Qiqihar" : "齐齐哈尔", provinceId: "heilongjiang" },

          // 江苏省
          { id: "nanjing", label: lang === 'en' ? "Nanjing" : "南京", provinceId: "jiangsu" },
          { id: "suzhou", label: lang === 'en' ? "Suzhou" : "苏州", provinceId: "jiangsu" },
          { id: "wuxi", label: lang === 'en' ? "Wuxi" : "无锡", provinceId: "jiangsu" },
          { id: "changzhou", label: lang === 'en' ? "Changzhou" : "常州", provinceId: "jiangsu" },
          { id: "yangzhou", label: lang === 'en' ? "Yangzhou" : "扬州", provinceId: "jiangsu" },

          // 浙江省
          { id: "hangzhou", label: lang === 'en' ? "Hangzhou" : "杭州", provinceId: "zhejiang" },
          { id: "ningbo", label: lang === 'en' ? "Ningbo" : "宁波", provinceId: "zhejiang" },
          { id: "wenzhou", label: lang === 'en' ? "Wenzhou" : "温州", provinceId: "zhejiang" },
          { id: "jiaxing", label: lang === 'en' ? "Jiaxing" : "嘉兴", provinceId: "zhejiang" },
          { id: "shaoxing", label: lang === 'en' ? "Shaoxing" : "绍兴", provinceId: "zhejiang" },

          // 安徽省
          { id: "hefei", label: lang === 'en' ? "Hefei" : "合肥", provinceId: "anhui" },
          { id: "wuhu", label: lang === 'en' ? "Wuhu" : "芜湖", provinceId: "anhui" },

          // 福建省
          { id: "fuzhou", label: lang === 'en' ? "Fuzhou" : "福州", provinceId: "fujian" },
          { id: "xiamen", label: lang === 'en' ? "Xiamen" : "厦门", provinceId: "fujian" },
          { id: "quanzhou", label: lang === 'en' ? "Quanzhou" : "泉州", provinceId: "fujian" },

          // 江西省
          { id: "nanchang", label: lang === 'en' ? "Nanchang" : "南昌", provinceId: "jiangxi" },
          { id: "jingdezhen", label: lang === 'en' ? "Jingdezhen" : "景德镇", provinceId: "jiangxi" },

          // 山东省
          { id: "jinan", label: lang === 'en' ? "Jinan" : "济南", provinceId: "shandong" },
          { id: "qingdao", label: lang === 'en' ? "Qingdao" : "青岛", provinceId: "shandong" },
          { id: "yantai", label: lang === 'en' ? "Yantai" : "烟台", provinceId: "shandong" },
          { id: "weifang", label: lang === 'en' ? "Weifang" : "潍坊", provinceId: "shandong" },

          // 河南省
          { id: "zhengzhou", label: lang === 'en' ? "Zhengzhou" : "郑州", provinceId: "henan" },
          { id: "luoyang", label: lang === 'en' ? "Luoyang" : "洛阳", provinceId: "henan" },

          // 湖北省
          { id: "wuhan", label: lang === 'en' ? "Wuhan" : "武汉", provinceId: "hubei" },
          { id: "yichang", label: lang === 'en' ? "Yichang" : "宜昌", provinceId: "hubei" },

          // 湖南省
          { id: "changsha", label: lang === 'en' ? "Changsha" : "长沙", provinceId: "hunan" },
          { id: "zhuzhou", label: lang === 'en' ? "Zhuzhou" : "株洲", provinceId: "hunan" },

          // 广东省
          { id: "guangzhou", label: lang === 'en' ? "Guangzhou" : "广州", provinceId: "guangdong" },
          { id: "shenzhen", label: lang === 'en' ? "Shenzhen" : "深圳", provinceId: "guangdong" },
          { id: "zhuhai", label: lang === 'en' ? "Zhuhai" : "珠海", provinceId: "guangdong" },
          { id: "foshan", label: lang === 'en' ? "Foshan" : "佛山", provinceId: "guangdong" },
          { id: "dongguan", label: lang === 'en' ? "Dongguan" : "东莞", provinceId: "guangdong" },

          // 广西壮族自治区
          { id: "nanning", label: lang === 'en' ? "Nanning" : "南宁", provinceId: "guangxi" },
          { id: "guilin", label: lang === 'en' ? "Guilin" : "桂林", provinceId: "guangxi" },

          // 海南省
          { id: "haikou", label: lang === 'en' ? "Haikou" : "海口", provinceId: "hainan" },
          { id: "sanya", label: lang === 'en' ? "Sanya" : "三亚", provinceId: "hainan" },

          // 四川省
          { id: "chengdu", label: lang === 'en' ? "Chengdu" : "成都", provinceId: "sichuan" },
          { id: "mianyang", label: lang === 'en' ? "Mianyang" : "绵阳", provinceId: "sichuan" },

          // 贵州省
          { id: "guiyang", label: lang === 'en' ? "Guiyang" : "贵阳", provinceId: "guizhou" },
          { id: "zunyi", label: lang === 'en' ? "Zunyi" : "遵义", provinceId: "guizhou" },

          // 云南省
          { id: "kunming", label: lang === 'en' ? "Kunming" : "昆明", provinceId: "yunnan" },
          { id: "dali", label: lang === 'en' ? "Dali" : "大理", provinceId: "yunnan" },

          // 陕西省
          { id: "xian", label: lang === 'en' ? "Xi'an" : "西安", provinceId: "shaanxi" },
          { id: "baoji", label: lang === 'en' ? "Baoji" : "宝鸡", provinceId: "shaanxi" },

          // 甘肃省
          { id: "lanzhou", label: lang === 'en' ? "Lanzhou" : "兰州", provinceId: "gansu" },
          { id: "jiayuguan", label: lang === 'en' ? "Jiayuguan" : "嘉峪关", provinceId: "gansu" },

          // 青海省
          { id: "xining", label: lang === 'en' ? "Xining" : "西宁", provinceId: "qinghai" },

          // 台湾省
          { id: "taibei", label: lang === 'en' ? "Taipei" : "台北", provinceId: "taiwan" },
          { id: "gaoxiong", label: lang === 'en' ? "Kaohsiung" : "高雄", provinceId: "taiwan" },

          // 内蒙古自治区
          { id: "huhehaote", label: lang === 'en' ? "Hohhot" : "呼和浩特", provinceId: "neimenggu" },
          { id: "baotou", label: lang === 'en' ? "Baotou" : "包头", provinceId: "neimenggu" },

          // 西藏自治区
          { id: "lasa", label: lang === 'en' ? "Lhasa" : "拉萨", provinceId: "xizang" },

          // 宁夏回族自治区
          { id: "yinchuan", label: lang === 'en' ? "Yinchuan" : "银川", provinceId: "ningxia" },

          // 新疆维吾尔自治区
          { id: "wulumuqi", label: lang === 'en' ? "Urumqi" : "乌鲁木齐", provinceId: "xinjiang" },

          // 香港特别行政区
          { id: "xianggang", label: lang === 'en' ? "Hong Kong" : "香港", provinceId: "xianggang" },

          // 澳门特别行政区
          { id: "aomen", label: lang === 'en' ? "Macau" : "澳门", provinceId: "aomen" },

          // 其他
          { id: "other", label: lang === 'en' ? "Other" : "其他", provinceId: "other" }
        ],
        programTypes: [
          { id: "summer", label: lang === 'en' ? "Summer Programs" : "夏季项目" },
          { id: "semester", label: lang === 'en' ? "Semester Programs" : "学期项目" },
          { id: "year", label: lang === 'en' ? "Academic Year" : "学年项目" },
          { id: "language", label: lang === 'en' ? "Language Immersion" : "语言浸注" },
          { id: "university", label: lang === 'en' ? "University Preparation" : "大学准备" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        destinations: [
          { id: "usa", label: lang === 'en' ? "United States" : "美国" },
          { id: "uk", label: lang === 'en' ? "United Kingdom" : "英国" },
          { id: "canada", label: lang === 'en' ? "Canada" : "加拿大" },
          { id: "australia", label: lang === 'en' ? "Australia" : "澳大利亚" },
          { id: "newzealand", label: lang === 'en' ? "New Zealand" : "新西兰" },
          { id: "europe", label: lang === 'en' ? "Europe" : "欧洲" },
          { id: "singapore", label: lang === 'en' ? "Singapore" : "新加坡" },
          { id: "malaysia", label: lang === 'en' ? "Malaysia" : "马来西亚" },
          { id: "japan", label: lang === 'en' ? "Japan" : "日本" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        interests: [
          { id: "academics", label: lang === 'en' ? "Academic Programs" : "学术项目" },
          { id: "culture", label: lang === 'en' ? "Cultural Experiences" : "文化体验" },
          { id: "sports", label: lang === 'en' ? "Sports Programs" : "体育项目" },
          { id: "arts", label: lang === 'en' ? "Arts & Music" : "艺术与音乐" },
          { id: "stem", label: lang === 'en' ? "STEM Programs" : "STEM项目" },
          { id: "business", label: lang === 'en' ? "Business & Entrepreneurship" : "商业与创业" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
      },
      contactSection: {
        title: lang === 'en' ? "Still have questions?" : "还有疑问？",
        description: lang === 'en'
          ? "Contact our education consultants for personalized assistance"
          : "联系我们的教育顾问以获取个性化帮助",
        buttonText: lang === 'en' ? "Contact Us" : "联系我们",
        buttonUrl: "/contact",
      }
    };
  };

  // 定义 API 响应的类型
  interface ApiResponse {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
    responseTime?: string;
    phoneContact?: string;
    options?: {
      roles?: FormOption[];
      gradeLevels?: FormOption[];
      provinces?: FormOption[];
      cities?: FormOption[];
      programTypes?: FormOption[];
      destinations?: FormOption[];
      interests?: FormOption[];
    };
    contactSection?: {
      title?: string;
      description?: string;
      buttonText?: string;
      buttonUrl?: string;
    };
  }

  // 将 API 响应映射到我们的 FormContent 类型
  const mapApiResponseToFormContent = (apiResponse: ApiResponse, lang: string): FormContent => {
    // 先获取默认数据，然后用API响应中的数据覆盖
    const defaultData = getDefaultFormContent(lang);
    // 使用默认数据作为基础，然后用API响应中的数据覆盖
    const formContent: FormContent = {
      ...defaultData,
      hero: {
        title: apiResponse.title || defaultData.hero.title,
        subtitle: apiResponse.subtitle || defaultData.hero.subtitle,
        backgroundImage: apiResponse.backgroundImage || defaultData.hero.backgroundImage,
      },
      formSection: {
        title: apiResponse.title || defaultData.formSection.title,
        responseTimeText: apiResponse.responseTime || defaultData.formSection.responseTimeText,
        phoneContact: apiResponse.phoneContact || defaultData.formSection.phoneContact,
      },
      options: {
        roles: apiResponse.options?.roles || defaultData.options.roles,
        gradeLevels: apiResponse.options?.gradeLevels || defaultData.options.gradeLevels,
        provinces: apiResponse.options?.provinces || defaultData.options.provinces,
        cities: apiResponse.options?.cities || defaultData.options.cities,
        programTypes: apiResponse.options?.programTypes || defaultData.options.programTypes,
        destinations: apiResponse.options?.destinations || defaultData.options.destinations,
        interests: apiResponse.options?.interests || defaultData.options.interests,
      },
    };

    // 添加可选的 contactSection（如果可用）
    if (apiResponse.contactSection) {
      formContent.contactSection = {
        title: apiResponse.contactSection.title || "",
        description: apiResponse.contactSection.description || "",
        buttonText: apiResponse.contactSection.buttonText || "",
        buttonUrl: apiResponse.contactSection.buttonUrl || "",
      };
    }

    return formContent;
  };

  // 使用 React Query 获取表单内容数据
  return useQuery({
    queryKey: ['formContent', language],
    queryFn: async () => {
      try {
        console.info("Fetching form page content...");
        const data = await getFrontendFormContent(language);

        if (data) {
          console.info("Form content loaded successfully");
          // 将 API 响应映射到我们的内部 FormContent 格式
          return mapApiResponseToFormContent(data as ApiResponse, language);
        } else {
          console.warn("Invalid form content format, using defaults");
          // 使用基于语言的默认数据
          return getDefaultFormContent(language);
        }
      } catch (err) {
        console.error("Error fetching form content:", err);
        // 出错时使用默认数据
        return getDefaultFormContent(language);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 分钟缓存
    refetchOnWindowFocus: false, // 窗口聚焦时不重新获取
  });
}

/**
 * 处理规划表单提交的自定义Hook
 * @param {string} [language='en'] - 语言，默认为'en'
 * @returns {Object} 包含提交函数、加载状态和错误信息的对象
 */
export function usePlanningFormSubmit(language = 'en') {
  return useMutation<
    { success: boolean; data?: unknown; error?: unknown },
    Error,
    PlanningFormData
  >({
    mutationFn: async (formData: PlanningFormData) => {
      // 调用真实API提交表单
      console.log('表单数据将提交到API:', formData);

      // 使用formService中的方法提交表单
      return await submitPlanningForm(formData);
    },
    onSuccess: () => {
      toast.success(
        language === 'en'
          ? "Form submitted successfully! We'll contact you within 2 business days."
          : "表单提交成功！我们将在2个工作日内与您联系。"
      );
    },
    onError: (error) => {
      console.error("Error submitting form:", error);
      toast.error(
        language === 'en'
          ? "An error occurred while submitting the form. Please try again."
          : "提交表单时出错。请重试。"
      );
    }
  });
}

/**
 * 处理邮件订阅提交的自定义Hook
 * @param {string|object} emailOrOptions - 电子邮件地址或包含邮件和语言的对象
 * @param {string} [language='en'] - 语言，默认为'en'
 * @returns {Object} 包含提交函数、加载状态和错误信息的对象
 */
export function useNewsletterSubscription(language = 'en') {
  return useMutation({
    mutationFn: (emailOrOptions: string | { email: string; language?: 'en' | 'zh' }) => {
      // 兼容两种调用方式：直接传入邮件地址或传入对象
      if (typeof emailOrOptions === 'string') {
        return submitNewsletterSubscription(emailOrOptions, language);
      } else {
        const { email, language: optionLanguage = language } = emailOrOptions;
        return submitNewsletterSubscription(email, optionLanguage);
      }
    },
    onSuccess: () => {
      toast.success(
        language === 'en'
          ? "Successfully subscribed to our newsletter!"
          : "成功订阅我们的通讯！"
      );
    },
    onError: (error) => {
      console.error("Error subscribing to newsletter:", error);
      toast.error(
        language === 'en'
          ? "Failed to subscribe. Please try again."
          : "订阅失败，请重试。"
      );
    }
  });
}
