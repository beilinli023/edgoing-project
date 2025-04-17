import React from "react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";
import { BlogCategory, BlogTag } from "@/types/blogTypes";
import { User, Calendar, Tag } from "lucide-react";
import { Link } from "react-router-dom";
import BlogPostTags from "./BlogPostTags";

interface BlogPostHeaderProps {
  title: string;
  author: string;
  publishedDate: string;
  primaryCategory?: BlogCategory;
  currentLanguage?: string;
  tags?: BlogTag[];
  tagsLabel?: string;
  getLocalizedText?: (en: string, zh: string) => string;
}

const BlogPostHeader: React.FC<BlogPostHeaderProps> = ({
  title,
  author,
  publishedDate,
  primaryCategory,
  currentLanguage,
  tags,
  tagsLabel,
  getLocalizedText = (en, zh) => currentLanguage === 'zh' ? zh : en
}) => {
  const formattedDate = formatLocalizedDate(publishedDate, currentLanguage);
  
  // 使用 formatLocalizedDate 而不是原来的 formatDate
  function formatLocalizedDate(dateString: string, locale: string = 'en'): string {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      return date.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', options);
    } catch (error) {
      console.error('Error formatting localized date:', error);
      return dateString;
    }
  }
  
  // 打印组件接收到的参数，以进行调试
  console.log('BlogPostHeader props:', { title, author, publishedDate, tags });
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>
      
      <div className="flex flex-wrap items-center text-sm text-gray-600 gap-4">
        <div className="flex items-center">
          <User className="w-4 h-4 mr-1" />
          <span>{author}</span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formattedDate}</span>
        </div>
        
        {/* 主分类标签已移除 */}
        
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => {
                // 根据tag类型选择正确的属性
                const tagName = typeof tag === 'string' 
                  ? tag 
                  : (currentLanguage === 'zh' ? tag.name_zh : tag.name_en);
                
                return (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="px-3 py-1 text-sm hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
                  >
                    {tagName}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostHeader;
