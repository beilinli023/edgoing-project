import React from "react";
import { BlogPost } from "@/types/blogTypes";
import BlogPostCard from "./BlogPostCard";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 最新博客文章列表组件的属性接口
 * 
 * @interface LatestBlogPostsProps
 * @property {BlogPost[]} posts - 博客文章数组
 * @property {boolean} isLoading - 加载状态标记，用于显示加载骨架屏
 * @property {Function} getLocalizedText - 多语言文本获取函数，根据当前语言返回相应的文本
 * @property {string} currentLanguage - 当前语言
 */
interface LatestBlogPostsProps {
  posts: BlogPost[];
  isLoading: boolean;
  getLocalizedText: (en: string, zh: string) => string;
  currentLanguage?: string;
}

/**
 * 最新博客文章列表组件
 * 
 * 该组件用于展示最新的博客文章列表，以网格形式展示多篇博客文章卡片。
 * 组件包含加载状态处理，在数据加载时显示骨架屏，在没有文章时显示提示信息。
 * 支持多语言显示，会根据传入的getLocalizedText函数自动选择当前语言的文本内容。
 * 
 * @component
 * @example
 * ```tsx
 * import { LatestBlogPosts } from '@/components/frontend/blog/LatestBlogPosts';
 * import { useLanguage } from '@/context/LanguageContext';
 * import { useBlogPosts } from '@/hooks/useBlogPosts';
 * 
 * // 使用示例
 * function BlogPage() {
 *   const { getLocalizedText } = useLanguage();
 *   const { posts, isLoading } = useBlogPosts();
 *   
 *   return (
 *     <div className="container mx-auto py-8">
 *       <h2 className="text-2xl font-bold mb-6">最新文章</h2>
 *       <LatestBlogPosts 
 *         posts={posts} 
 *         isLoading={isLoading} 
 *         getLocalizedText={getLocalizedText} 
 *       />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param {LatestBlogPostsProps} props - 组件属性
 * @returns {JSX.Element} 渲染的博客文章列表
 */
const LatestBlogPosts: React.FC<LatestBlogPostsProps> = ({
  posts,
  isLoading,
  getLocalizedText,
  currentLanguage = 'en'
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array(3).fill(0).map((_, index) => (
          <div key={index} className="flex flex-col h-full">
            <Skeleton className="w-full h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-4" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{getLocalizedText('No articles available', '暂无文章')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {posts.map((post) => (
        <BlogPostCard 
          key={post.id} 
          post={post} 
          getLocalizedText={getLocalizedText}
          currentLanguage={currentLanguage}
        />
      ))}
    </div>
  );
};

export default LatestBlogPosts;
