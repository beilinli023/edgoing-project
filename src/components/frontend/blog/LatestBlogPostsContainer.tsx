import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { BlogPost } from "@/types/blogTypes";
import { useBlogPosts } from "@/hooks/useBlog";
import LatestBlogPosts from "./LatestBlogPosts";
import localBlogService from "@/services/blog/localBlogService";

/**
 * 最新博客文章容器组件的属性接口
 * 
 * @interface LatestBlogPostsContainerProps
 * @property {number} [limit=6] - 要显示的博客文章数量
 * @property {number} [page=1] - 页码
 * @property {string} [category] - 可选的分类过滤
 * @property {string} [tag] - 可选的标签过滤
 */
interface LatestBlogPostsContainerProps {
  limit?: number;
  page?: number;
  category?: string;
  tag?: string;
}

/**
 * 最新博客文章容器组件
 * 
 * 该组件使用 React Query 的 useBlogPosts hook 获取博客文章数据，
 * 并将数据传递给 LatestBlogPosts 组件进行渲染。
 * 增加了本地数据回退功能，在API请求失败时自动使用本地数据。
 * 
 * @component
 * @example
 * ```tsx
 * import { LatestBlogPostsContainer } from '@/components/frontend/blog/LatestBlogPostsContainer';
 * 
 * // 使用示例
 * function BlogPage() {
 *   return (
 *     <div className="container mx-auto py-8">
 *       <h2 className="text-2xl font-bold mb-6">最新文章</h2>
 *       <LatestBlogPostsContainer limit={6} />
 *     </div>
 *   );
 * }
 * ```
 * 
 * @param {LatestBlogPostsContainerProps} props - 组件属性
 * @returns {JSX.Element} 渲染的博客文章列表容器
 */
const LatestBlogPostsContainer: React.FC<LatestBlogPostsContainerProps> = ({
  limit = 6,
  page = 1,
  category,
  tag
}) => {
  const { currentLanguage } = useLanguage();
  const [localPosts, setLocalPosts] = useState<BlogPost[]>([]);
  const [isUsingLocalData, setIsUsingLocalData] = useState(false);
  
  // 本地化文本辅助函数
  const getLocalizedText = (en: string, zh: string) => {
    return currentLanguage === 'zh' ? zh : en;
  };
  
  // 使用 React Query 的 useBlogPosts hook 获取博客文章数据
  const { 
    data, 
    isLoading, 
    error 
  } = useBlogPosts(currentLanguage, page, limit, category, tag);
  
  // 尝试加载本地数据作为回退方案
  useEffect(() => {
    // 只在API请求出错且尚未使用本地数据时尝试获取本地数据
    if (error && !isUsingLocalData) {
      const loadLocalPosts = async () => {
        try {
          console.log('API错误，尝试从本地加载博客文章...');
          // 从本地文件获取博客文章数据
          // 修正：移除 currentLanguage 参数，正确传递参数
          // localBlogService.getLocalBlogPosts 的参数顺序是 (page, limit, categoryId, tagId)
          const response = await localBlogService.getLocalBlogPosts(page, limit, category, tag);
          if (response && response.posts) {
            console.log('成功从本地加载博客文章:', response.posts.length);
            setLocalPosts(response.posts);
            setIsUsingLocalData(true);
          }
        } catch (localError) {
          console.error('加载本地博客文章失败:', localError);
        }
      };
      
      loadLocalPosts();
    }
  }, [error, isUsingLocalData, currentLanguage, page, limit, category, tag]);
  
  // 确保 posts 是数组类型
  // 先尝试使用API数据，如果有错误且已加载本地数据，则使用本地数据
  const posts: BlogPost[] = !error 
    ? (Array.isArray(data) 
        ? data 
        : (data?.posts && Array.isArray(data.posts) ? data.posts : [])) 
    : (isUsingLocalData ? localPosts : []);

  // 如果有错误，记录到控制台，但现在我们有本地数据作为回退
  if (error && !isUsingLocalData) {
    console.error("Error fetching blog posts:", error);
  }

  return (
    <LatestBlogPosts
      posts={posts}
      isLoading={isLoading && !isUsingLocalData}
      getLocalizedText={getLocalizedText}
      currentLanguage={currentLanguage}
    />
  );
};

export default LatestBlogPostsContainer;
