import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BlogPost, BlogPostFormData, ImageData } from '@/types/blogTypes';
import { getBlogPostById, updateBlogPost } from '@/services/blog/postService';
import { PageHeader } from "@/components/common/PageHeader";
import { useLanguage } from '@/context/LanguageContext';
import BlogPostForm from '@/components/blog/posts/BlogPostForm';
import { Skeleton } from '@/components/ui/skeleton';

// 为SEO元数据定义接口
interface SEOData {
  seo_title_en?: string;
  seo_title_zh?: string;
  seo_description_en?: string;
  seo_description_zh?: string;
}

// 定义扩展的BlogPost类型，包含可能的SEO字段
type ExtendedBlogPost = BlogPost & SEOData;

const BlogPostEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const postData = await getBlogPostById(id, currentLanguage) as ExtendedBlogPost;
        
        if (postData) {
          // 转换为表单数据格式
          const formData: BlogPostFormData = {
            title_en: postData.title_en || '',
            title_zh: postData.title_zh || '',
            content_en: postData.content_en || '',
            content_zh: postData.content_zh || '',
            excerpt_en: postData.excerpt_en || '',
            excerpt_zh: postData.excerpt_zh || '',
            slug: postData.slug || '',
            featured_image: typeof postData.featured_image === 'string' 
              ? postData.featured_image 
              : (postData.featured_image as ImageData)?.url || '',
            status: postData.status || 'draft',
            published_at: postData.published_at || null,
            author: postData.author || '',
            category: typeof postData.category === 'string' 
              ? postData.category 
              : (postData.category as { slug: string })?.slug || '',
            tags: Array.isArray(postData.tags) 
              ? postData.tags.map(tag => typeof tag === 'string' ? tag : tag.slug) 
              : [],
            summary_en: '',
            summary_zh: '',
            date: postData.date || postData.published_at || '',
            category_id: typeof postData.category === 'object' 
              ? String(postData.category.id) 
              : '',
            seo_title_en: postData.seo_title_en || '',
            seo_title_zh: postData.seo_title_zh || '',
            seo_description_en: postData.seo_description_en || '',
            seo_description_zh: postData.seo_description_zh || ''
          };
          
          setPost(formData);
        } else {
          toast.error(
            currentLanguage === 'zh' ? '文章不存在' : 'Post not found',
            {
              description: currentLanguage === 'zh' 
                ? `找不到ID为 ${id} 的文章` 
                : `Could not find post with ID ${id}`
            }
          );
          navigate('/admin/blog');
        }
      } catch (error) {
        console.error('获取博客文章失败:', error);
        toast.error(
          currentLanguage === 'zh' ? '加载失败' : 'Loading failed',
          {
            description: currentLanguage === 'zh'
              ? '无法加载博客文章数据'
              : 'Unable to load blog post data'
          }
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPost();
  }, [id, currentLanguage, navigate]);

  const handleSubmit = async (formData: BlogPostFormData) => {
    if (!id) return;
    
    setIsSaving(true);
    try {
      await updateBlogPost(id, formData);
      toast.success(
        currentLanguage === 'zh' ? '更新成功！' : 'Updated successfully!',
        {
          description: currentLanguage === 'zh' 
            ? '博客文章已更新' 
            : 'Blog post has been updated'
        }
      );
    } catch (error) {
      console.error('更新博客文章失败:', error);
      toast.error(
        currentLanguage === 'zh' ? '更新失败！' : 'Update failed!',
        {
          description: currentLanguage === 'zh'
            ? '更新博客文章时发生错误'
            : 'An error occurred while updating the blog post'
        }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title={currentLanguage === 'zh' ? '编辑文章' : 'Edit Blog Post'}
        description={currentLanguage === 'zh' ? '修改博客文章内容，支持中英文' : 'Edit blog post content, supporting both English and Chinese'}
        backUrl="/admin/blog"
      />
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        ) : post ? (
          <BlogPostForm 
            initialData={post}
            onSubmit={handleSubmit}
            isLoading={isSaving}
            isEditMode={true}
          />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              {currentLanguage === 'zh' ? '找不到文章' : 'Post not found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostEdit;
