import apiClient from './apiClient';
import {
  MenuItem,
  QuickLink,
  SocialMedia,
  ContactInfo,
  HeroSlide,
  ProgramCategory,
  BlogTag,
  BlogCategory,
  BlogPost,
  FaqItem,
  FaqCategory,
  FormSubmission,
  MediaItem,
  PaginatedResponse,
  ApiResponse,
  DashboardStats
} from '@/types/cmsTypes';

// 基础CRUD操作函数生成器
const createCrudService = <T extends { id: number }>(endpoint: string) => {
  return {
    getAll: async (params?: Record<string, any>): Promise<PaginatedResponse<T>> => {
      return apiClient.get(`/${endpoint}`, { params });
    },

    getById: async (id: number): Promise<ApiResponse<T>> => {
      return apiClient.get(`/${endpoint}/${id}`);
    },

    create: async (data: Omit<T, 'id'>): Promise<ApiResponse<T>> => {
      return apiClient.post(`/${endpoint}`, data);
    },

    update: async (id: number, data: Partial<T>): Promise<ApiResponse<T>> => {
      return apiClient.put(`/${endpoint}/${id}`, data);
    },

    delete: async (id: number): Promise<ApiResponse<{ success: boolean }>> => {
      return apiClient.delete(`/${endpoint}/${id}`);
    }
  };
};

// 导航菜单服务
export const navigationService = {
  ...createCrudService<MenuItem>('navigation'),

  updateOrder: async (items: { id: number, order: number }[]): Promise<ApiResponse<MenuItem[]>> => {
    return apiClient.put('/navigation/order', { items });
  }
};

// 页脚快速链接服务
export const quickLinksService = createCrudService<QuickLink>('quick-links');

// 社交媒体链接服务
export const socialMediaService = createCrudService<SocialMedia>('social-media');

// 联系信息服务
export const contactInfoService = {
  get: async (): Promise<ApiResponse<ContactInfo>> => {
    // 修复：移除重复的 /api 前缀
    console.log('%c✅ 请求联系信息数据，路径: contact-info', 'color: green; font-weight: bold');
    return apiClient.get('contact-info');
  },

  update: async (data: Partial<ContactInfo>): Promise<ApiResponse<ContactInfo>> => {
    // 修复：移除重复的 /api 前缀
    console.log('%c✅ 更新联系信息数据，路径: contact-info', 'color: green; font-weight: bold');
    return apiClient.put('contact-info', data);
  }
};

// 首页轮播图服务
export const heroSlideService = {
  ...createCrudService<HeroSlide>('hero-slides'),

  updateOrder: async (items: { id: number, order: number }[]): Promise<ApiResponse<HeroSlide[]>> => {
    return apiClient.put('/hero-slides/order', { items });
  }
};

// 项目分类服务
export const programCategoryService = createCrudService<ProgramCategory>('program-categories');

// 博客标签服务
export const blogTagService = createCrudService<BlogTag>('blog-tags');

// 博客分类服务
export const blogCategoryService = createCrudService<BlogCategory>('blog-categories');

// 博客文章服务
export const blogPostService = {
  ...createCrudService<BlogPost>('blog-posts'),

  getBySlug: async (slug: string): Promise<ApiResponse<BlogPost>> => {
    return apiClient.get(`/blog-posts/slug/${slug}`);
  },

  updateStatus: async (id: number, status: 'draft' | 'published'): Promise<ApiResponse<BlogPost>> => {
    return apiClient.put(`/blog-posts/${id}/status`, { status });
  }
};

// FAQ服务
export const faqService = {
  ...createCrudService<FaqItem>('faqs'),

  updateOrder: async (items: { id: number, order: number }[]): Promise<ApiResponse<FaqItem[]>> => {
    return apiClient.put('/faqs/order', { items });
  },

  getByCategory: async (categoryId: number): Promise<ApiResponse<FaqItem[]>> => {
    return apiClient.get(`/faqs/category/${categoryId}`);
  }
};

// FAQ分类服务
export const faqCategoryService = createCrudService<FaqCategory>('faq-categories');

// 表单提交服务
export const formSubmissionService = {
  ...createCrudService<FormSubmission>('form-submissions'),

  updateStatus: async (id: number, status: 'new' | 'contacted' | 'completed'): Promise<ApiResponse<FormSubmission>> => {
    return apiClient.put(`/form-submissions/${id}/status`, { status });
  },

  export: async (format: 'csv' | 'excel'): Promise<Blob> => {
    return apiClient.get(`/form-submissions/export?format=${format}`, {
      responseType: 'blob'
    });
  }
};

// 媒体服务
export const mediaService = {
  ...createCrudService<MediaItem>('media'),

  upload: async (file: File, title?: string, altText?: string): Promise<ApiResponse<MediaItem>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (altText) formData.append('alt_text', altText);

    return apiClient.post('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  getByType: async (type: string): Promise<ApiResponse<MediaItem[]>> => {
    return apiClient.get(`/media/type/${type}`);
  }
};

// 仪表盘统计数据服务
export const dashboardService = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    return apiClient.get('/dashboard/stats');
  }
};

// 导出所有服务
export const cmsService = {
  navigation: navigationService,
  quickLinks: quickLinksService,
  socialMedia: socialMediaService,
  contactInfo: contactInfoService,
  heroSlides: heroSlideService,
  programCategories: programCategoryService,
  blogTags: blogTagService,
  blogCategories: blogCategoryService,
  blogPosts: blogPostService,
  faqs: faqService,
  faqCategories: faqCategoryService,
  formSubmissions: formSubmissionService,
  media: mediaService,
  dashboard: dashboardService
};

export default cmsService;
