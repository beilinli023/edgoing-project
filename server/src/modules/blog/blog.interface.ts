// Strapi API 常见数据结构类型定义

// Strapi API 通用响应结构
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Strapi API 属性的通用接口
export interface StrapiAttributes {
  [key: string]: unknown;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
  locale?: string;
  title?: string;
  author?: string;
  content?: Array<Record<string, unknown>>;
  slug?: string;
  Date?: string;
  documentId?: string;
  localizations?: {
    data: Array<{
      id: number | string;
      attributes?: StrapiAttributes;
    }>;
  };
}

// Strapi 博客条目
export interface StrapiBlog {
  id: number | string;
  attributes?: StrapiAttributes;
}

// Strapi 媒体格式
export interface StrapiMediaFormat {
  url: string;
  width?: number;
  height?: number;
  size?: number;
  mime?: string;
  name?: string;
}

// Strapi 媒体对象
export interface StrapiMedia {
  id: number | string;
  attributes?: {
    url?: string;
    width?: number;
    height?: number;
    size?: number;
    mime?: string;
    name?: string;
    formats?: {
      thumbnail?: StrapiMediaFormat;
      small?: StrapiMediaFormat;
      medium?: StrapiMediaFormat;
      large?: StrapiMediaFormat;
      [key: string]: StrapiMediaFormat | undefined;
    };
    [key: string]: any;
  };
}

// Strapi 关联字段通用结构
export interface StrapiRelation<T> {
  data: T | T[] | null;
}

// 博客数据接口 (格式化后供前端使用)
export interface BlogData {
  id: string;
  documentId: string;
  attributes: StrapiAttributes;
  title_en: string;
  title_zh: string;
  slug: string;
  publishedAt: string;
  author_en: string;
  author_zh: string;
  content_en: Array<Record<string, unknown>>;
  content_zh: Array<Record<string, unknown>>;
  coverImage: string | null;
  images: string[];
  grade: string | null;
  program_type: string | null;
  grade_en: string | null;
  grade_zh: string | null;
  program_type_en: string | null;
  program_type_zh: string | null;
} 