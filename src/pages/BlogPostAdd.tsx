import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { BlogPostFormData } from '@/types/blogTypes';
import { createBlogPost } from '@/services/blog/postService';
import { PageHeader } from "@/components/common/PageHeader";
import { useLanguage } from '@/context/LanguageContext';
// 注意：BlogPostForm是我们新创建的组件，如果实际路径不同，请调整
import BlogPostForm from '@/components/blog/posts/BlogPostForm';

const BlogPostAdd: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { currentLanguage } = useLanguage();

  const handleSubmit = async (formData: BlogPostFormData) => {
    setIsLoading(true);
    try {
      await createBlogPost(formData);
      toast.success(
        currentLanguage === 'zh' ? '创建成功！' : 'Created successfully!',
        {
          description: currentLanguage === 'zh' 
            ? '博客文章已创建' 
            : 'Blog post has been created'
        }
      );
      navigate('/admin/blog');
    } catch (error) {
      console.error('创建博客文章失败:', error);
      toast.error(
        currentLanguage === 'zh' ? '创建失败！' : 'Creation failed!',
        {
          description: currentLanguage === 'zh'
            ? '创建博客文章时发生错误'
            : 'An error occurred while creating the blog post'
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <PageHeader
        title={currentLanguage === 'zh' ? '创建新文章' : 'Create New Blog Post'}
        description={currentLanguage === 'zh' ? '创建一篇新的博客文章，支持中英文内容' : 'Create a new blog post, supporting both English and Chinese content'}
        backUrl="/admin/blog"
      />
      
      <div className="mt-6 bg-white p-6 rounded-lg shadow">
        <BlogPostForm 
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default BlogPostAdd;
