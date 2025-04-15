import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getFrontendFormContent } from "@/services/frontend/formService";
import { FormOption, FormContent } from "@/types/formTypes";

// 重新导出类型，以保持兼容性
export type { FormOption, FormContent };

/**
 * API 响应的接口定义
 */
interface ApiFormContentResponse {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  formTitle?: string;
  responseTimeText?: string;
  phoneContact?: string;
  options?: {
    roles?: Array<{ id: string; label: string; provinceId?: string }>;
    gradeLevels?: Array<{ id: string; label: string; provinceId?: string }>;
    provinces?: Array<{ id: string; label: string; provinceId?: string }>;
    cities?: Array<{ id: string; label: string; provinceId?: string }>;
    programTypes?: Array<{ id: string; label: string; provinceId?: string }>;
    destinations?: Array<{ id: string; label: string; provinceId?: string }>;
    interests?: Array<{ id: string; label: string; provinceId?: string }>;
  };
  contactSection?: {
    title?: string;
    description?: string;
    buttonText?: string;
    buttonUrl?: string;
  };
}

const defaultFormContent: FormContent = {
  hero: {
    title: "",
    subtitle: "",
    backgroundImage: "/lovable-uploads/47bf9bbe-157b-4ebd-8119-331c7101bce3.png",
  },
  formSection: {
    title: "",
    responseTimeText: "",
    phoneContact: "",
  },
  options: {
    roles: [],
    gradeLevels: [],
    provinces: [],
    cities: [],
    programTypes: [],
    destinations: [],
    interests: [],
  }
};

export const useFrontendFormContent = () => {
  const { currentLanguage } = useLanguage();
  const [content, setContent] = useState<FormContent>(defaultFormContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Helper function to map API response to our FormContent type
  const mapApiResponseToFormContent = useCallback((apiResponse: ApiFormContentResponse): FormContent => {
    // 先获取默认数据，然后用API响应中的数据覆盖
    const defaultData = getDefaultFormContent(currentLanguage);
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
        responseTimeText: apiResponse.responseTimeText || defaultData.formSection.responseTimeText,
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

    // Add optional contactSection if available
    if (apiResponse.contactSection) {
      formContent.contactSection = {
        title: apiResponse.contactSection.title || "",
        description: apiResponse.contactSection.description || "",
        buttonText: apiResponse.contactSection.buttonText || "",
        buttonUrl: apiResponse.contactSection.buttonUrl || "",
      };
    }

    return formContent;
  }, [currentLanguage]);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.info("Fetching form page content...");
        const data = await getFrontendFormContent(currentLanguage);
        
        if (data) {
          console.info("Form content loaded successfully");
          // Map the API response to our internal FormContent format
          const mappedContent = mapApiResponseToFormContent(data);
          setContent(mappedContent);
        } else {
          console.warn("Invalid form content format, using defaults");
          // Populate with default data based on language
          setContent(getDefaultFormContent(currentLanguage));
        }
      } catch (err) {
        console.error("Error fetching form content:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setContent(getDefaultFormContent(currentLanguage));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [currentLanguage, mapApiResponseToFormContent]);

  const getDefaultFormContent = (lang: string): FormContent => {
    return {
      hero: {
        title: lang === 'en' ? "Start Your Planning" : "开始计划",
        subtitle: lang === 'en' 
          ? "Ready to begin your educational journey? Let us help you create the perfect study abroad experience" 
          : "准备开始您的教育之旅？让我们帮助您创造完美的海外学习体验",
        backgroundImage: "/lovable-uploads/47bf9bbe-157b-4ebd-8119-331c7101bce3.png",
      },
      formSection: {
        title: lang === 'en' ? "Need help with assistance, or just have a question for us?" : "需要帮助或有任何问题？",
        responseTimeText: lang === 'en' ? "Fill out our form and we'll respond within 2 business days" : "填写我们的表单，我们将在2个工作日内回复",
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
          { id: "middleSchool", label: lang === 'en' ? "Middle School" : "初中" },
          { id: "highSchool", label: lang === 'en' ? "High School" : "高中" },
          { id: "university", label: lang === 'en' ? "University" : "大学" },
          { id: "adult", label: lang === 'en' ? "Adult" : "成人" }
        ],
        provinces: [
          // 直辖市
          { id: "beijing", label: lang === 'en' ? "Beijing" : "北京" },
          { id: "shanghai", label: lang === 'en' ? "Shanghai" : "上海" },
          { id: "tianjin", label: lang === 'en' ? "Tianjin" : "天津" },
          { id: "chongqing", label: lang === 'en' ? "Chongqing" : "重庆" },
          
          // 华东地区
          { id: "shandong", label: lang === 'en' ? "Shandong" : "山东" },
          { id: "jiangsu", label: lang === 'en' ? "Jiangsu" : "江苏" },
          { id: "anhui", label: lang === 'en' ? "Anhui" : "安徽" },
          { id: "zhejiang", label: lang === 'en' ? "Zhejiang" : "浙江" },
          { id: "fujian", label: lang === 'en' ? "Fujian" : "福建" },
          { id: "jiangxi", label: lang === 'en' ? "Jiangxi" : "江西" },
          
          // 华南地区
          { id: "guangdong", label: lang === 'en' ? "Guangdong" : "广东" },
          { id: "guangxi", label: lang === 'en' ? "Guangxi" : "广西" },
          { id: "hainan", label: lang === 'en' ? "Hainan" : "海南" },
          
          // 华中地区
          { id: "henan", label: lang === 'en' ? "Henan" : "河南" },
          { id: "hubei", label: lang === 'en' ? "Hubei" : "湖北" },
          { id: "hunan", label: lang === 'en' ? "Hunan" : "湖南" },
          
          // 华北地区
          { id: "hebei", label: lang === 'en' ? "Hebei" : "河北" },
          { id: "shanxi", label: lang === 'en' ? "Shanxi" : "山西" },
          { id: "inner_mongolia", label: lang === 'en' ? "Inner Mongolia" : "内蒙古" },
          
          // 东北地区
          { id: "liaoning", label: lang === 'en' ? "Liaoning" : "辽宁" },
          { id: "jilin", label: lang === 'en' ? "Jilin" : "吉林" },
          { id: "heilongjiang", label: lang === 'en' ? "Heilongjiang" : "黑龙江" },
          
          // 西南地区
          { id: "sichuan", label: lang === 'en' ? "Sichuan" : "四川" },
          { id: "guizhou", label: lang === 'en' ? "Guizhou" : "贵州" },
          { id: "yunnan", label: lang === 'en' ? "Yunnan" : "云南" },
          { id: "tibet", label: lang === 'en' ? "Tibet" : "西藏" },
          
          // 西北地区
          { id: "shaanxi", label: lang === 'en' ? "Shaanxi" : "陕西" },
          { id: "gansu", label: lang === 'en' ? "Gansu" : "甘肃" },
          { id: "qinghai", label: lang === 'en' ? "Qinghai" : "青海" },
          { id: "ningxia", label: lang === 'en' ? "Ningxia" : "宁夏" },
          { id: "xinjiang", label: lang === 'en' ? "Xinjiang" : "新疆" },
          
          // 特别行政区
          { id: "hong_kong", label: lang === 'en' ? "Hong Kong" : "香港" },
          { id: "macau", label: lang === 'en' ? "Macau" : "澳门" },
          { id: "taiwan", label: lang === 'en' ? "Taiwan" : "台湾" },
          
          // 其他
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        // 城市按省份分组
        cities: [
          // 北京
          { id: "beijing_city", label: lang === 'en' ? "Beijing City" : "北京市", provinceId: "beijing" },
          { id: "beijing_haidian", label: lang === 'en' ? "Haidian District" : "海淀区", provinceId: "beijing" },
          { id: "beijing_chaoyang", label: lang === 'en' ? "Chaoyang District" : "朝阳区", provinceId: "beijing" },
          { id: "beijing_dongcheng", label: lang === 'en' ? "Dongcheng District" : "东城区", provinceId: "beijing" },
          { id: "beijing_xicheng", label: lang === 'en' ? "Xicheng District" : "西城区", provinceId: "beijing" },
          
          // 上海
          { id: "shanghai_city", label: lang === 'en' ? "Shanghai City" : "上海市", provinceId: "shanghai" },
          { id: "shanghai_pudong", label: lang === 'en' ? "Pudong New Area" : "浦东新区", provinceId: "shanghai" },
          { id: "shanghai_xuhui", label: lang === 'en' ? "Xuhui District" : "徐汇区", provinceId: "shanghai" },
          { id: "shanghai_jing_an", label: lang === 'en' ? "Jing'an District" : "静安区", provinceId: "shanghai" },
          { id: "shanghai_huangpu", label: lang === 'en' ? "Huangpu District" : "黄浦区", provinceId: "shanghai" },
          
          // 广东省
          { id: "guangzhou", label: lang === 'en' ? "Guangzhou" : "广州", provinceId: "guangdong" },
          { id: "shenzhen", label: lang === 'en' ? "Shenzhen" : "深圳", provinceId: "guangdong" },
          { id: "dongguan", label: lang === 'en' ? "Dongguan" : "东莞", provinceId: "guangdong" },
          { id: "foshan", label: lang === 'en' ? "Foshan" : "佛山", provinceId: "guangdong" },
          { id: "zhuhai", label: lang === 'en' ? "Zhuhai" : "珠海", provinceId: "guangdong" },
          { id: "huizhou", label: lang === 'en' ? "Huizhou" : "惠州", provinceId: "guangdong" },
          
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
          { id: "shaoxing", label: lang === 'en' ? "Shaoxing" : "绍兴", provinceId: "zhejiang" },
          { id: "jiaxing", label: lang === 'en' ? "Jiaxing" : "嘉兴", provinceId: "zhejiang" },
          
          // 四川省
          { id: "chengdu", label: lang === 'en' ? "Chengdu" : "成都", provinceId: "sichuan" },
          { id: "mianyang", label: lang === 'en' ? "Mianyang" : "绵阳", provinceId: "sichuan" },
          { id: "leshan", label: lang === 'en' ? "Leshan" : "乐山", provinceId: "sichuan" },
          { id: "deyang", label: lang === 'en' ? "Deyang" : "德阳", provinceId: "sichuan" },
          { id: "yibin", label: lang === 'en' ? "Yibin" : "宜宾", provinceId: "sichuan" },
          
          // 湖北省
          { id: "wuhan", label: lang === 'en' ? "Wuhan" : "武汉", provinceId: "hubei" },
          { id: "yichang", label: lang === 'en' ? "Yichang" : "宜昌", provinceId: "hubei" },
          { id: "xiangyang", label: lang === 'en' ? "Xiangyang" : "襄阳", provinceId: "hubei" },
          { id: "jingzhou", label: lang === 'en' ? "Jingzhou" : "荆州", provinceId: "hubei" },
          { id: "huangshi", label: lang === 'en' ? "Huangshi" : "黄石", provinceId: "hubei" },
          
          // 山东省
          { id: "jinan", label: lang === 'en' ? "Jinan" : "济南", provinceId: "shandong" },
          { id: "qingdao", label: lang === 'en' ? "Qingdao" : "青岛", provinceId: "shandong" },
          { id: "yantai", label: lang === 'en' ? "Yantai" : "烟台", provinceId: "shandong" },
          { id: "weifang", label: lang === 'en' ? "Weifang" : "潍坊", provinceId: "shandong" },
          { id: "weihai", label: lang === 'en' ? "Weihai" : "威海", provinceId: "shandong" },
          
          // 福建省
          { id: "fuzhou", label: lang === 'en' ? "Fuzhou" : "福州", provinceId: "fujian" },
          { id: "xiamen", label: lang === 'en' ? "Xiamen" : "厦门", provinceId: "fujian" },
          { id: "quanzhou", label: lang === 'en' ? "Quanzhou" : "泉州", provinceId: "fujian" },
          { id: "zhangzhou", label: lang === 'en' ? "Zhangzhou" : "漳州", provinceId: "fujian" },
          { id: "putian", label: lang === 'en' ? "Putian" : "莆田", provinceId: "fujian" },
          
          // 河南省
          { id: "zhengzhou", label: lang === 'en' ? "Zhengzhou" : "郑州", provinceId: "henan" },
          { id: "luoyang", label: lang === 'en' ? "Luoyang" : "洛阳", provinceId: "henan" },
          { id: "kaifeng", label: lang === 'en' ? "Kaifeng" : "开封", provinceId: "henan" },
          { id: "nanyang", label: lang === 'en' ? "Nanyang" : "南阳", provinceId: "henan" },
          { id: "xinxiang", label: lang === 'en' ? "Xinxiang" : "新乡", provinceId: "henan" },
          
          // 河北省
          { id: "shijiazhuang", label: lang === 'en' ? "Shijiazhuang" : "石家庄", provinceId: "hebei" },
          { id: "tangshan", label: lang === 'en' ? "Tangshan" : "唐山", provinceId: "hebei" },
          { id: "baoding", label: lang === 'en' ? "Baoding" : "保定", provinceId: "hebei" },
          { id: "langfang", label: lang === 'en' ? "Langfang" : "廊坊", provinceId: "hebei" },
          { id: "qinhuangdao", label: lang === 'en' ? "Qinhuangdao" : "秦皇岛", provinceId: "hebei" },
          
          // 湖南省
          { id: "changsha", label: lang === 'en' ? "Changsha" : "长沙", provinceId: "hunan" },
          { id: "zhuzhou", label: lang === 'en' ? "Zhuzhou" : "株洲", provinceId: "hunan" },
          { id: "xiangtan", label: lang === 'en' ? "Xiangtan" : "湘潭", provinceId: "hunan" },
          { id: "yueyang", label: lang === 'en' ? "Yueyang" : "岳阳", provinceId: "hunan" },
          { id: "changde", label: lang === 'en' ? "Changde" : "常德", provinceId: "hunan" },
          
          // 安徽省
          { id: "hefei", label: lang === 'en' ? "Hefei" : "合肥", provinceId: "anhui" },
          { id: "wuhu", label: lang === 'en' ? "Wuhu" : "芜湖", provinceId: "anhui" },
          { id: "bengbu", label: lang === 'en' ? "Bengbu" : "蚌埠", provinceId: "anhui" },
          { id: "anqing", label: lang === 'en' ? "Anqing" : "安庆", provinceId: "anhui" },
          { id: "maanshan", label: lang === 'en' ? "Ma'anshan" : "马鞍山", provinceId: "anhui" },
          
          // 辽宁省
          { id: "shenyang", label: lang === 'en' ? "Shenyang" : "沈阳", provinceId: "liaoning" },
          { id: "dalian", label: lang === 'en' ? "Dalian" : "大连", provinceId: "liaoning" },
          { id: "anshan", label: lang === 'en' ? "Anshan" : "鞍山", provinceId: "liaoning" },
          { id: "fushun", label: lang === 'en' ? "Fushun" : "抚顺", provinceId: "liaoning" },
          { id: "dandong", label: lang === 'en' ? "Dandong" : "丹东", provinceId: "liaoning" },
          
          // 陕西省
          { id: "xian", label: lang === 'en' ? "Xi'an" : "西安", provinceId: "shaanxi" },
          { id: "baoji", label: lang === 'en' ? "Baoji" : "宝鸡", provinceId: "shaanxi" },
          { id: "xianyang", label: lang === 'en' ? "Xianyang" : "咸阳", provinceId: "shaanxi" },
          { id: "weinan", label: lang === 'en' ? "Weinan" : "渭南", provinceId: "shaanxi" },
          { id: "hanzhong", label: lang === 'en' ? "Hanzhong" : "汉中", provinceId: "shaanxi" },
          
          // 江西省
          { id: "nanchang", label: lang === 'en' ? "Nanchang" : "南昌", provinceId: "jiangxi" },
          { id: "jiujiang", label: lang === 'en' ? "Jiujiang" : "九江", provinceId: "jiangxi" },
          { id: "ganzhou", label: lang === 'en' ? "Ganzhou" : "赣州", provinceId: "jiangxi" },
          { id: "jingdezhen", label: lang === 'en' ? "Jingdezhen" : "景德镇", provinceId: "jiangxi" },
          { id: "yichun_jiangxi", label: lang === 'en' ? "Yichun" : "宜春", provinceId: "jiangxi" },
          
          // 广西壮族自治区
          { id: "nanning", label: lang === 'en' ? "Nanning" : "南宁", provinceId: "guangxi" },
          { id: "guilin", label: lang === 'en' ? "Guilin" : "桂林", provinceId: "guangxi" },
          { id: "liuzhou", label: lang === 'en' ? "Liuzhou" : "柳州", provinceId: "guangxi" },
          { id: "beihai", label: lang === 'en' ? "Beihai" : "北海", provinceId: "guangxi" },
          { id: "fangchenggang", label: lang === 'en' ? "Fangchenggang" : "防城港", provinceId: "guangxi" },
          
          // 云南省
          { id: "kunming", label: lang === 'en' ? "Kunming" : "昆明", provinceId: "yunnan" },
          { id: "dali", label: lang === 'en' ? "Dali" : "大理", provinceId: "yunnan" },
          { id: "lijiang", label: lang === 'en' ? "Lijiang" : "丽江", provinceId: "yunnan" },
          { id: "xishuangbanna", label: lang === 'en' ? "Xishuangbanna" : "西双版纳", provinceId: "yunnan" },
          { id: "shangri_la", label: lang === 'en' ? "Shangri-La" : "香格里拉", provinceId: "yunnan" },
          
          // 其他
          { id: "other_city", label: lang === 'en' ? "Other City" : "其他城市", provinceId: "other" }
        ],
        programTypes: [
          { id: "shortTerm", label: lang === 'en' ? "Short-term Study" : "短期学习" },
          { id: "semester", label: lang === 'en' ? "Semester Exchange" : "学期交换" },
          { id: "degree", label: lang === 'en' ? "Degree Program" : "学位项目" },
          { id: "summerCamp", label: lang === 'en' ? "Summer Camp" : "夏令营" },
          { id: "winterCamp", label: lang === 'en' ? "Winter Camp" : "冬令营" },
          { id: "language", label: lang === 'en' ? "Language Course" : "语言课程" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        destinations: [
          { id: "australia", label: lang === 'en' ? "Australia" : "澳大利亚" },
          { id: "france", label: lang === 'en' ? "France" : "法国" },
          { id: "japan", label: lang === 'en' ? "Japan" : "日本" },
          { id: "uk", label: lang === 'en' ? "UK" : "英国" },
          { id: "usa", label: lang === 'en' ? "USA" : "美国" },
          { id: "singapore", label: lang === 'en' ? "Singapore" : "新加坡" },
          { id: "malaysia", label: lang === 'en' ? "Malaysia" : "马来西亚" },
          { id: "other", label: lang === 'en' ? "Other" : "其他" }
        ],
        interests: [
          { id: "academic", label: lang === 'en' ? "Academic Enrichment" : "学术拓展" },
          { id: "heritage", label: lang === 'en' ? "Heritage & Arts Exploration" : "传统与艺术探索" },
          { id: "performing", label: lang === 'en' ? "Performing Arts" : "表演艺术" },
          { id: "lifestyle", label: lang === 'en' ? "Language & Lifestyle" : "语言与生活" },
          { id: "language", label: lang === 'en' ? "Language Intensive" : "语言强化" },
          { id: "history", label: lang === 'en' ? "History & Civic" : "历史与公民" },
          { id: "stem", label: lang === 'en' ? "STEM & Science" : "STEM与科学创新" },
          { id: "religion", label: lang === 'en' ? "Religion & Belief" : "宗教与信仰" },
          { id: "community", label: lang === 'en' ? "Community Service" : "社区服务" },
          { id: "sports", label: lang === 'en' ? "Sports" : "体育" },
          { id: "courses", label: lang === 'en' ? "Academic Courses" : "专业发展" }
        ]
      }
    };
  };

  return {
    content,
    loading,
    error,
    currentLanguage
  };
};
