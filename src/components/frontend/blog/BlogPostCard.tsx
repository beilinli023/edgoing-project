import React from "react";
import { Link } from "react-router-dom";
import { FrontendBlogPost, ProgramTypeData, GradeData } from "@/types/blogTypes";
import { format } from "date-fns";
import { getImageUrl } from "@/utils/blogUtils";

/**
 * BlogPostCard组件的属性接口
 * 
 * @interface BlogPostCardProps
 * @property {FrontendBlogPost} post - 博客文章数据对象
 * @property {Function} getLocalizedText - 多语言文本获取函数，根据当前语言返回相应的文本
 */
interface BlogPostCardProps {
  post: FrontendBlogPost;
  getLocalizedText: (en: string, zh: string) => string;
  currentLanguage?: string; // 当前语言
}

/**
 * 博客文章卡片组件
 * 
 * 该组件用于在博客列表页面展示单篇博客文章的信息卡片。卡片包含文章的特色图片、标题、
 * 发布日期和摘要等信息，并支持点击跳转到文章详情页面。组件支持多语言显示，
 * 会根据传入的getLocalizedText函数自动选择当前语言的文本内容。
 */
const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, getLocalizedText, currentLanguage = 'en' }) => {
  // 增加日志，确认接收到的 post 数据，特别是 author 和 program
  console.log("BlogPostCard received post:", post);

  if (!post) return null;

  // 使用帮助函数确保我们获得正确的URL
  const imageUrl = post.image ? getImageUrl(post.image) : '';
  const title = post.title || '';
  const excerpt = post.excerpt || '';
  
  // 格式化日期
  const formattedDate = post.date 
    ? format(new Date(post.date), "yyyy-MM-dd")
    : "";
    
  // 获取作者名字
  const authorName = post.authorName || null;
  
  // 获取 Program Type Name
  const programTypeName = post.programType?.name || null;
  
  // 获取年级信息 (如果 Grade 结构还存在并需要显示)
  const gradeName = post.grade?.name || null;
  
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <Link to={`/blog/${post.slug}`} className="block group">
        <div className="h-48 overflow-hidden relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
          {formattedDate && (
            <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent px-2 py-1">
                <span className="text-xs text-white font-medium">{formattedDate}</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/blog/${post.slug}`} className="block mb-2">
          <h3 className="text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2" title={title}>
            {title}
          </h3>
        </Link>
        
        <div className="text-xs text-gray-500 mb-2 flex items-center flex-wrap gap-x-2">
          {authorName && (
             <span className="inline-flex items-center"> 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              {authorName}
            </span>
          )}
          {authorName && programTypeName && <span>·</span>}
          {programTypeName && (
            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
              {programTypeName}
            </span>
          )}
        </div>
        
        {excerpt && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3 flex-grow" title={excerpt}>
            {excerpt}
          </p>
        )}
        
        <div className="mt-auto text-xs text-gray-500">
          {gradeName && (
            <span className="inline-block bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
              {gradeName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
