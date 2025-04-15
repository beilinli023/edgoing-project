
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogPost } from "@/types/blogTypes";
import { blogService } from "@/services/blog";
import { normalizeCategory } from "@/utils/blogUtils";

import BlogPostsHeader from "./posts/BlogPostsHeader";
import BlogPostsList from "./posts/BlogPostsList";
import BlogPostsLoading from "./posts/BlogPostsLoading";
import BlogPostsError from "./posts/BlogPostsError";

// 定义本地使用的简化BlogPost类型
interface LocalBlogPost {
  id: number | string;
  title_en: string;
  title_zh: string;
  slug: string;
  content_en: string;
  content_zh: string;
  excerpt_en: string;
  excerpt_zh: string;
  featured_image: string;
  status: 'draft' | 'published';
  published_at: string;
  author: string;
  date: string;
  category: string;
  primary_category?: any;
  tags: string[];
}

const BlogPostsManager = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const [currentLanguage, setCurrentLanguage] = useState<'zh' | 'en'>('zh');

  // 使用 React Query 获取博客文章
  const { data: rawBlogPosts = [], isLoading, error } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: () => blogService.postService.getAllBlogPosts(),
    staleTime: 1000 * 60 * 5, // 5分钟的缓存时间
  });

  // 转换数据以确保类型兼容性，特别是将所有category字段标准化为字符串
  const blogPosts: LocalBlogPost[] = React.useMemo(() => {
    if (!rawBlogPosts || !Array.isArray(rawBlogPosts)) return [];
    
    return rawBlogPosts.map((post: any) => {
      // 将复杂的tags对象转换为简单的字符串数组
      let normalizedTags: string[] = [];
      if (Array.isArray(post.tags)) {
        normalizedTags = post.tags.map((tag: any) => {
          if (typeof tag === 'string') return tag;
          return tag.name_en || tag.name || '';
        });
      }

      // 确保category是字符串类型
      const categoryStr = normalizeCategory(post.category);

      return {
        id: post.id,
        title_en: post.title_en,
        title_zh: post.title_zh,
        slug: post.slug || '',
        content_en: post.content_en || '',
        content_zh: post.content_zh || '',
        excerpt_en: post.excerpt_en || '',
        excerpt_zh: post.excerpt_zh || '',
        featured_image: post.featured_image || '',
        status: post.status || 'draft',
        published_at: post.published_at || '',
        author: post.author || '',
        date: post.date || '',
        category: categoryStr,
        primary_category: post.primary_category,
        tags: normalizedTags
      };
    });
  }, [rawBlogPosts]);

  // 使用 React Query 处理删除操作
  const deleteMutation = useMutation({
    mutationFn: (id: string) => blogService.postService.deleteBlogPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      toast({
        title: currentLanguage === 'zh' ? "删除成功" : "Delete Successful",
        description: currentLanguage === 'zh' ? "文章已成功删除" : "Article has been successfully deleted",
      });
    },
    onError: (error) => {
      toast({
        title: currentLanguage === 'zh' ? "删除失败" : "Delete Failed",
        description: currentLanguage === 'zh' ? "无法删除博客文章，请稍后再试" : "Failed to delete the article, please try again later",
        variant: "destructive"
      });
    }
  });

  const handleEdit = (id: number | string) => {
    navigate(`/admin/blog/posts/edit/${id}`);
  };

  const handleDelete = async (id: number | string) => {
    if (window.confirm(currentLanguage === 'zh' ? "确定要删除这篇文章吗？" : "Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id.toString());
    }
  };

  const handleAddNew = () => {
    navigate("/admin/blog/posts/add");
  };

  const handleLanguageSwitch = () => {
    setCurrentLanguage(currentLanguage === 'zh' ? 'en' : 'zh');
  };

  // 如果加载出错，显示错误信息
  if (error) {
    return (
      <Card>
        <BlogPostsError 
          message={currentLanguage === 'zh' ? "加载失败，请刷新页面重试" : "Loading failed, please refresh the page"}
          currentLanguage={currentLanguage}
        />
      </Card>
    );
  }

  return (
    <Card>
      <BlogPostsHeader 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddNew={handleAddNew}
        currentLanguage={currentLanguage}
        onLanguageSwitch={handleLanguageSwitch}
      />
      <CardContent>
        {isLoading ? (
          <BlogPostsLoading />
        ) : (
          <BlogPostsList 
            posts={blogPosts}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            searchTerm={searchTerm}
            currentLanguage={currentLanguage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPostsManager;
