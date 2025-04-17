
// 通用内容类型
export interface BaseContent {
  id: number;
  created_at?: string;
  updated_at?: string;
}

// 双语文本类型
export interface BilingualText {
  zh: string;
  en: string;
}

// 导航菜单项
export interface MenuItem extends BaseContent {
  title_en: string;
  title_zh: string;
  url: string;
  order: number;
  parent_id: number | null;
  is_visible: boolean;
}

// 页脚快速链接
export interface QuickLink extends BaseContent {
  text_en: string;
  text_zh: string;
  url: string;
  order: number;
}

// 社交媒体链接
export interface SocialMedia extends BaseContent {
  platform: string;
  url: string;
  icon: string;
  order: number;
  name: string;
}

// 联系信息
export interface ContactInfo {
  id: number;
  phone: string; // 保留此字段用于向后兼容
  phone_en: string;
  phone_zh: string;
  email: string;
  address: string; // 保留此字段用于向后兼容
  address_en: string;
  address_zh: string;
  hours_en: string;
  hours_zh: string;
}

// 首页轮播图
export interface HeroSlide extends BaseContent {
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  image_url: string;
  button_text_en: string;
  button_text_zh: string;
  button_url: string;
  order: number;
}

// 项目类别
export interface ProgramCategory extends BaseContent {
  name_en: string;
  name_zh: string;
  slug: string;
  description_en: string;
  description_zh: string;
}

// 博客标签
export interface BlogTag extends BaseContent {
  name_en: string;
  name_zh: string;
  slug: string;
  color: string;
}

// 博客分类
export interface BlogCategory extends BaseContent {
  name_en: string;
  name_zh: string;
  slug: string;
  description_en: string;
  description_zh: string;
}

// 博客文章
export interface BlogPost extends BaseContent {
  title_en: string;
  title_zh: string;
  slug: string;
  content_en: string;
  content_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  featured_image: string;
  status: 'draft' | 'published';
  published_at: string | null;
  author_id: number;
  category_id: number;
  tags: string[];
}

// FAQ项目
export interface FaqItem extends BaseContent {
  question_en: string;
  question_zh: string;
  answer_en: string;
  answer_zh: string;
  category_id: number;
  order: number;
  is_featured: boolean;
}

// FAQ分类
export interface FaqCategory extends BaseContent {
  name_en: string;
  name_zh: string;
  slug: string;
}

// 表单提交记录
export interface FormSubmission extends BaseContent {
  name: string;
  email: string;
  role: string;
  grade_level: string;
  program_type: string;
  destination: string;
  interests: string[];
  message: string;
  status: 'new' | 'contacted' | 'completed';
}

// 媒体文件
export interface MediaItem extends BaseContent {
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  alt_text?: string;
}

// 仪表盘统计类型
export interface DashboardStats extends BaseContent {
  programCount: number;
  blogPostCount: number;
  faqCount: number;
  mediaCount: number;
  newSubmissions: number;
  completedSubmissions: number;
  totalSubmissions: number;
  quickActions?: Array<{
    label: string;
    icon: string;
    path: string;
  }>;
}

// API响应格式
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// 分页响应
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}
