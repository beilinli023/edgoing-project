/**
 * 表单选项接口 - 前端表单使用
 * 用于表示下拉菜单、复选框等选项
 */
export type FormOption = {
  id: string;
  label: string;
  provinceId?: string; // 可选的省份ID，用于城市与省份的关联
};

/**
 * 表单内容接口 - 前端表单使用
 * 用于表示完整的表单内容结构
 */
export interface FormContent {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  formSection: {
    title: string;
    responseTimeText: string;
    phoneContact: string;
  };
  options: {
    roles: FormOption[];
    gradeLevels: FormOption[];
    provinces: FormOption[];
    cities: FormOption[];
    programTypes: FormOption[];
    destinations: FormOption[];
    interests: FormOption[];
  };
  contactSection?: {
    title: string;
    description: string;
    buttonText: string;
    buttonUrl: string;
  };
}

/**
 * 规划表单数据接口 - 前端表单使用
 * 用于表示用户提交的表单数据
 */
export interface PlanningFormData {
  role: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolName: string;
  gradeLevel: string;
  province: string;
  city: string;
  programTypes: string[];
  destinations: string[];
  interests: string[];
  questions: string;
  agreeToReceiveInfo: boolean;
  agreeToPrivacyPolicy: boolean;
}

/**
 * 管理后台表单选项接口
 * 用于表示管理后台的表单选项，包含多语言支持和启用状态
 */
export interface AdminFormOption {
  id: string;
  text_en: string;
  text_zh: string;
  enabled: boolean;
  order: number;
}

/**
 * 表单介绍文本接口 - 管理后台使用
 */
export interface FormIntroText {
  en: string;
  zh: string;
}

/**
 * 表单响应时间接口 - 管理后台使用
 */
export interface FormResponseTime {
  en: string;
  zh: string;
}
