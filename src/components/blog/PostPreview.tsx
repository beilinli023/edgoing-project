
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { BlogPostFormData } from "./mockData";
import PreviewHeader from "./preview/PreviewHeader";
import SingleLanguageView from "./preview/SingleLanguageView";
import SplitLanguageView from "./preview/SplitLanguageView";

interface PostPreviewProps {
  formData: BlogPostFormData;
  onClose: () => void;
  language: "en" | "zh";
}

const PostPreview: React.FC<PostPreviewProps> = ({ formData, onClose, language: initialLanguage }) => {
  const [viewMode, setViewMode] = useState<"single" | "split">("single");
  const [language, setLanguage] = useState<"en" | "zh">(initialLanguage);
  
  // 获取相应语言内容
  const getTitle = (lang: "en" | "zh") => lang === "en" ? formData.title_en : formData.title_zh;
  const getContent = (lang: "en" | "zh") => lang === "en" ? formData.content_en : formData.content_zh;
  const getSummary = (lang: "en" | "zh") => lang === "en" ? formData.summary_en : formData.summary_zh;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-xl border-blue-100 flex flex-col">
        <PreviewHeader 
          onClose={onClose}
          viewMode={viewMode}
          setViewMode={setViewMode}
          language={language}
          setLanguage={setLanguage}
        />
        
        <div className="overflow-auto flex-1">
          {viewMode === "single" ? (
            <SingleLanguageView 
              title={getTitle(language)}
              content={getContent(language)}
              summary={getSummary(language)}
              featuredImage={formData.featured_image}
              language={language}
            />
          ) : (
            <SplitLanguageView 
              titleEn={formData.title_en}
              titleZh={formData.title_zh}
              contentEn={formData.content_en}
              contentZh={formData.content_zh}
              summaryEn={formData.summary_en}
              summaryZh={formData.summary_zh}
              featuredImage={formData.featured_image}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default PostPreview;
