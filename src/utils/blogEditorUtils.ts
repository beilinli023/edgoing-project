
import { BlogPost, ImageData, BlogPostFormData } from '@/types/blogTypes';
import { MediaImageData, convertToBlogImageData } from '@/services/blog/mediaService';

// Convert from API BlogPost format to editable form data
export const blogPostToFormData = (post: BlogPost): BlogPostFormData => {
  return {
    title_en: post.title_en || '',
    title_zh: post.title_zh || '',
    content_en: post.content_en || '',
    content_zh: post.content_zh || '',
    excerpt_en: post.excerpt_en || '',
    excerpt_zh: post.excerpt_zh || '',
    slug: post.slug || '',
    featured_image: typeof post.featured_image === 'string' 
      ? post.featured_image 
      : post.featured_image?.url || '',
    status: post.status || 'draft',
    published_at: post.published_at || new Date().toISOString(),
    category: typeof post.category === 'object' 
      ? post.category.id.toString() 
      : post.category?.toString() || '',
    tags: Array.isArray(post.tags) 
      ? post.tags.map(tag => typeof tag === 'object' ? tag.id.toString() : tag.toString()) 
      : [],
    author: post.author || '',
    summary_en: '',
    summary_zh: '',
    date: post.date || new Date().toISOString(),
    category_id: typeof post.category === 'object' 
      ? post.category.id.toString() 
      : post.category?.toString() || '',
    seo_title_en: '',
    seo_title_zh: '',
    seo_description_en: '',
    seo_description_zh: ''
  };
};

// Convert form data back to BlogPost format for API
export const formDataToBlogPost = (formData: BlogPostFormData): Partial<BlogPost> => {
  return {
    title_en: formData.title_en,
    title_zh: formData.title_zh,
    content_en: formData.content_en,
    content_zh: formData.content_zh,
    excerpt_en: formData.excerpt_en,
    excerpt_zh: formData.excerpt_zh,
    slug: formData.slug,
    featured_image: formData.featured_image,
    status: formData.status,
    published_at: formData.published_at,
    category: formData.category_id || formData.category,
    tags: formData.tags,
    author: formData.author,
    date: formData.date
  };
};

// Validate required form fields
export const validateBlogPostForm = (formData: BlogPostFormData): string[] => {
  const errors: string[] = [];
  
  if (!formData.title_en) errors.push('英文标题不能为空');
  if (!formData.title_zh) errors.push('中文标题不能为空');
  if (!formData.slug) errors.push('URL别名不能为空');
  if (!formData.content_en) errors.push('英文内容不能为空');
  if (!formData.content_zh) errors.push('中文内容不能为空');
  
  return errors;
};

// Format date for display
export const formatBlogDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Date formatting error:', error);
    return dateString;
  }
};

// Get safe image URL
export const getSafeImageUrl = (image: string | ImageData | undefined): string => {
  if (!image) return '/placeholder.svg';
  if (typeof image === 'string') return image;
  return image.url || '/placeholder.svg';
};
