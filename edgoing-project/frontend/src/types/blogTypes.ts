// Blog related type definitions

export interface BlogTag {
  id: string | number;
  name_en: string;
  name_zh: string;
  slug: string;
  color?: string;
}

export interface BlogCategory {
  id: string | number;
  name_en: string;
  name_zh: string;
  slug: string;
  description_en?: string;
  description_zh?: string;
}

export interface ImageData {
  id: number | string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  created_at?: string;
}

export interface BlogPost {
  id: string | number;
  documentId?: string;
  title_en: string;
  title_zh: string;
  slug: string;
  publishedAt: string;
  authorName?: string | null;
  featured_image?: string | null;
  content_en: unknown;
  content_zh: unknown;
  slideshow?: Array<{ url: string }> | null;
  grade_en?: string | null;
  grade_zh?: string | null;
  program_type_en?: string | null;
  program_type_zh?: string | null;
}

export interface NormalizedBlogPost extends Omit<BlogPost, 'category' | 'tags'> {
  category: string | number;
  tags: string[];
}

export interface BlogVideo {
  id: string | number;
  title_en: string;
  title_zh: string;
  youtube_url: string;
  thumbnail: string | ImageData;
  category?: BlogCategory;
  file_url?: string; // 本地视频文件路径
}

export interface BlogHero {
  title_en: string;
  title_zh: string;
  subtitle_en: string;
  subtitle_zh: string;
  background_image: string;
}

export interface BlogContent {
  hero?: BlogHero;
  posts?: BlogPost[];
  videos?: BlogVideo[];
}

// 博客文章表单数据结构
export interface BlogPostFormData {
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
  author: string;
  category: string;
  tags: string[];
  summary_en: string;
  summary_zh: string;
  date: string;
  category_id: string;
  seo_title_en?: string;
  seo_title_zh?: string;
  seo_description_en?: string;
  seo_description_zh?: string;
  [key: string]: string | string[] | null | undefined; // 使用更具体的类型来替代any
}

export interface BlogPostData {
  post: BlogPost;
  categories: BlogCategory[];
  tags: BlogTag[];
  isLoading: boolean;
  isError: boolean;
}

export interface TaglineData {
  title: string;
  description: string;
}

export interface TaglineContent {
  content: {
    title: string;
    description: string;
  };
  isLoading: boolean;
  error: Error | null;
}

// Define a more specific type for Strapi Rich Text content if possible,
// otherwise use a generic object structure or keep `any` if truly variable.
// For now, let's define a basic structure often seen.
interface RichTextBlock {
  type: string;
  children: { type: string; text?: string; [key: string]: unknown }[];
  [key: string]: unknown; // Allow other properties but require type checks
}

// Reusing the backend structure definitions for clarity
// REMOVE AuthorData interface
// export interface AuthorData {
//  id: number;
//  attributes: {
//    name: string;
//  };
// }

// UPDATE ProgramTypeData interface
export interface ProgramTypeData {
  id: number;
  name: string; // Changed from attributes.programname to name
}

// ADD GradeData interface
export interface GradeData {
  id: number;
  name: string; // Added to match backend response
}

/**
 * Defines the structure for a blog post expected by the frontend components,
 * after being transformed or directly received from the proxy/backend.
 */
export interface FrontendBlogPost {
  id: number | string;
  title: string;
  slug: string;
  content?: RichTextBlock[] | null; // Keep optional content
  excerpt?: string | null;
  image?: string | null; // Changed from coverImageUrl for consistency with backend
  authorName?: string | null; // Changed from author: AuthorData to flat authorName
  // Remove categories?: { name: string | null; }[];
  publishedAt: string; // Keep publishedAt
  date?: string; // Keep date
  documentId?: string; // Keep documentId
  slideshow?: { url: string }[] | null; // Keep slideshow

  grade?: GradeData | null; // Use GradeData interface
  programType?: ProgramTypeData | null; // Use updated ProgramTypeData interface
}

// Update API response types to use FrontendBlogPost
export interface BlogPostsApiResponse {
  posts: FrontendBlogPost[]; // Changed from data
  totalPages?: number;
  totalPosts?: number;
}

export interface BlogPostApiResponse {
  post: FrontendBlogPost | null; // Changed from data
}
