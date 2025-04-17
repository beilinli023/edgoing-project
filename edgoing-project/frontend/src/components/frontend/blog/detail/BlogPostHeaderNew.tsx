import React from "react";
import { BlogPost, BlogCategory } from "@/types/blogTypes";
import { useLanguage } from "@/context/LanguageContext";
import { User, CalendarDays, GraduationCap, Sparkles, Folder } from "lucide-react";

// Export the props interface
export interface BlogPostHeaderNewProps {
  title: string;
  author?: string | null;
  publishedDate?: string | null;
  currentLanguage: string;
  grade?: string | null;
  programType?: string | null;
  primaryCategory?: BlogCategory | null;
}

const BlogPostHeaderNew: React.FC<BlogPostHeaderNewProps> = ({
  title,
  author,
  publishedDate,
  currentLanguage,
  grade,
  programType,
  primaryCategory
}) => {
  const { currentLanguage: contextLanguage } = useLanguage();

  // --- Add console log for received props ---
  console.log('[BlogPostHeaderNew] Received Props:', {
    title,
    author,
    publishedDate,
    currentLanguage, // Log the prop directly
    grade,
    programType,
    primaryCategory
  });
  console.log('[BlogPostHeaderNew] Grade and ProgramType details:', {
    grade: grade,
    programType: programType,
    gradeType: typeof grade,
    programTypeType: typeof programType,
    gradeEmpty: grade === '',
    programTypeEmpty: programType === '',
    gradeNull: grade === null,
    programTypeNull: programType === null,
    gradeUndefined: grade === undefined,
    programTypeUndefined: programType === undefined
  });
  // --- End log ---

  // Robust date formatting
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      // console.warn('formatDate received invalid input:', dateString); // REMOVED WARNING
      // 提供当前日期作为默认值，而不是错误消息
      return new Date().toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    try {
      const date = new Date(dateString);
      // Check if date is valid after parsing
      if (isNaN(date.getTime())) {
        // console.warn('formatDate failed to parse date string:', dateString); // REMOVED WARNING
        // 提供当前日期作为默认值，而不是错误消息
        return new Date().toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return date.toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      // Keep error log for unexpected errors during Date operations
      console.error("日期格式化错误（捕获异常）:", error, "Input:", dateString);
      // 提供当前日期作为默认值，而不是错误消息
      return new Date().toLocaleDateString(currentLanguage === 'zh' ? 'zh-CN' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const formattedDate = formatDate(publishedDate);

  // Simplified category name retrieval
  const categoryName = primaryCategory ? (currentLanguage === 'en' ? primaryCategory.name_en : primaryCategory.name_zh) : null;
  const displayCategory = categoryName && categoryName !== '通用' && categoryName !== 'General';

  return (
    <div className="mb-8 border-b pb-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
        {title}
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400">
        {author && (
          <span className="flex items-center">
            <User className="h-4 w-4 mr-1.5" />
            {author}
          </span>
        )}
        <div className="flex items-center gap-x-2">
          <span className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1.5" />
            {formattedDate}
          </span>
          {grade && grade !== '' && (
            <span className="flex items-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              <GraduationCap className="h-4 w-4 mr-1.5" />
              {grade}
            </span>
          )}
          {programType && programType !== '' && (
            <span className="flex items-center bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded text-blue-800 dark:text-blue-200">
              <Sparkles className="h-4 w-4 mr-1.5" />
              {programType}
            </span>
          )}
        </div>
        {displayCategory && categoryName && (
          <span className="flex items-center">
            <Folder className="h-4 w-4 mr-1.5" />
            {categoryName}
          </span>
        )}
      </div>
    </div>
  );
};

export default BlogPostHeaderNew;