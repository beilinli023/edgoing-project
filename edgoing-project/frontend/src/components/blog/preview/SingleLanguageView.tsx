
import React from "react";
import { CardContent } from "@/components/ui/card";

interface SingleLanguageViewProps {
  title: string;
  content: string;
  summary: string;
  featuredImage?: string;
  language: "en" | "zh";
}

const SingleLanguageView: React.FC<SingleLanguageViewProps> = ({ 
  title, content, summary, featuredImage, language 
}) => {
  return (
    <CardContent className="p-6">
      <div className="prose prose-blue dark:prose-invert max-w-none">
        {featuredImage && (
          <img 
            src={featuredImage} 
            alt={title || "Featured image"}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
          />
        )}
        
        <h1 className="text-3xl font-bold mb-4 text-blue-800">{title}</h1>
        
        {summary && (
          <div className="bg-blue-50 p-4 rounded-md mb-6 italic border-l-4 border-blue-300">
            {summary}
          </div>
        )}

        <div className="mt-6 prose-headings:text-blue-800 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-md" dangerouslySetInnerHTML={{ __html: content }}></div>
      </div>
    </CardContent>
  );
};

export default SingleLanguageView;
