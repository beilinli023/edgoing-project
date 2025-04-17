import React from "react";
import { Badge } from "@/components/ui/badge";
import { BlogTag } from "@/types/blogTypes";
import { Link } from "react-router-dom";

interface BlogPostTagsProps {
  tags: (BlogTag | string)[]; // 允许接受字符串或 BlogTag 类型
  tagsLabel?: string;
  getLocalizedText?: (en: string, zh: string) => string; // 改为可选
  currentLanguage?: string; // 添加当前语言属性
  className?: string;
  showHeader?: boolean;
}

const BlogPostTags: React.FC<BlogPostTagsProps> = ({
  tags,
  tagsLabel,
  getLocalizedText,
  currentLanguage = 'en',
  className = "mt-12 pt-6 border-t border-gray-200",
  showHeader = false // 默认不显示标题
}) => {
  if (!tags || tags.length === 0) return null;
  
  // 如果没有提供 getLocalizedText 函数，创建一个默认实现
  const localizeText = getLocalizedText || ((en: string, zh: string) => {
    return currentLanguage === 'zh' ? zh : en;
  });
  
  // 确保所有标签都以 BlogTag 格式处理
  const processTag = (tag: BlogTag | string) => {
    if (typeof tag === 'string') {
      // 如果标签是字符串，创建一个简单的 BlogTag 对象
      return {
        id: `tag-${tag}`,
        name_en: tag,
        name_zh: tag,
        slug: tag.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return tag;
  };
  
  return (
    <div className={className}>
      {/* 只在 showHeader 为 true 并且有 tagsLabel 时才显示标题 */}
      {showHeader && tagsLabel && (
        <h3 className="text-lg font-semibold mb-3">{tagsLabel}</h3>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => {
          const processedTag = processTag(tag);
          return (
            <Link to={`/blog/tag/${processedTag.slug}`} key={processedTag.id || index}>
              <Badge 
                variant="outline" 
                className="px-3 py-1 text-sm hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
              >
                {localizeText(processedTag.name_en, processedTag.name_zh)}
              </Badge>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BlogPostTags;
