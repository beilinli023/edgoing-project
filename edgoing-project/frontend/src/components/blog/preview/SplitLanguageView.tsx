
import React from "react";

interface SplitLanguageViewProps {
  titleEn: string;
  titleZh: string;
  contentEn: string;
  contentZh: string;
  summaryEn: string;
  summaryZh: string;
  featuredImage?: string;
}

const SplitLanguageView: React.FC<SplitLanguageViewProps> = ({ 
  titleEn, titleZh, contentEn, contentZh, summaryEn, summaryZh, featuredImage 
}) => {
  return (
    <div className="grid grid-cols-2 divide-x">
      {/* 英文内容 */}
      <div className="p-6 overflow-auto">
        <div className="bg-blue-50 text-primary font-bold py-1 px-3 rounded-full inline-block mb-2 text-sm">EN</div>
        <div className="prose prose-blue dark:prose-invert max-w-none">
          {featuredImage && (
            <img 
              src={featuredImage} 
              alt={titleEn || "Featured image"}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-3 text-blue-800">{titleEn}</h1>
          
          {summaryEn && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 italic border-l-4 border-blue-300 text-sm">
              {summaryEn}
            </div>
          )}

          <div className="mt-4 prose-sm prose-headings:text-blue-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: contentEn }}></div>
        </div>
      </div>
      
      {/* 中文内容 */}
      <div className="p-6 overflow-auto">
        <div className="bg-red-50 text-red-600 font-bold py-1 px-3 rounded-full inline-block mb-2 text-sm">中文</div>
        <div className="prose prose-blue dark:prose-invert max-w-none">
          {featuredImage && (
            <img 
              src={featuredImage} 
              alt={titleZh || "特色图片"}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-3 text-blue-800">{titleZh}</h1>
          
          {summaryZh && (
            <div className="bg-blue-50 p-3 rounded-md mb-4 italic border-l-4 border-blue-300 text-sm">
              {summaryZh}
            </div>
          )}

          <div className="mt-4 prose-sm prose-headings:text-blue-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: contentZh }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplitLanguageView;
