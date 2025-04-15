import React from "react";
import FrontendLayout from "@/components/frontend/FrontendLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Search } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BlogPostNotFound: React.FC = () => {
  const { currentLanguage } = useLanguage();
  
  // 创建本地化文本辅助函数
  const getLocalizedText = (en: string, zh: string) => {
    return currentLanguage === 'en' ? en : zh;
  };
  
  return (
    <FrontendLayout>
      <div className="container mx-auto px-4 py-16">
        <Link to="/blog">
          <Button variant="ghost" className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {getLocalizedText('Back to Blog', '返回博客列表')}
          </Button>
        </Link>

        <div className="text-center py-16 max-w-2xl mx-auto">
          <div className="flex justify-center mb-6">
            <Search className="h-16 w-16 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {getLocalizedText('Blog Post Not Found', '未找到博客文章')}
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            {getLocalizedText(
              'The blog post you are looking for may have been removed or is temporarily unavailable.',
              '您查找的博客文章可能已被移除或暂时不可用。'
            )}
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/blog">
              <Button className="px-6">
                {getLocalizedText('Browse All Posts', '浏览所有文章')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default BlogPostNotFound; 