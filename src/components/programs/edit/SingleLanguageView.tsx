
import React from "react";
import { CardContent } from "@/components/ui/card";

interface SingleLanguageViewProps {
  formData: any;
  language: "en" | "zh";
}

const SingleLanguageView: React.FC<SingleLanguageViewProps> = ({ formData, language }) => {
  // 根据语言选择标题和内容
  const title = language === "en" ? formData.titleEn : formData.title;
  const description = language === "en" ? formData.descriptionEn : formData.description;
  const highlights = language === "en" ? formData.highlightsEn : formData.highlights;
  const itinerary = language === "en" ? formData.itineraryEn : formData.itinerary;
  const features = language === "en" ? formData.featuresEn : formData.features;
  const information = language === "en" ? formData.informationEn : formData.information;

  return (
    <CardContent className="p-6">
      <div className="prose prose-blue dark:prose-invert max-w-none">
        {formData.thumbnail && (
          <img 
            src={formData.thumbnail} 
            alt={title || "Program image"}
            className="w-full h-64 object-cover rounded-lg mb-6 shadow-md"
          />
        )}
        
        <h1 className="text-3xl font-bold mb-4 text-blue-800">{title}</h1>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {formData.category && (
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
              {formData.category}
            </span>
          )}
          {formData.location && (
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
              {formData.location}
            </span>
          )}
          {formData.duration && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
              {formData.duration}
            </span>
          )}
          {formData.gradeLevel && (
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
              {formData.gradeLevel}
            </span>
          )}
        </div>
        
        {formData.tags && formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {formData.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            {description && (
              <div>
                <h2 className="text-xl font-bold mb-2 text-blue-700">
                  {language === "en" ? "Description" : "描述"}
                </h2>
                <div className="prose-headings:text-blue-700" dangerouslySetInnerHTML={{ __html: description }}></div>
              </div>
            )}
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-fit">
            <h3 className="text-lg font-semibold mb-2">
              {language === "en" ? "Program Details" : "项目详情"}
            </h3>
            
            <div className="space-y-2">
              {formData.location && (
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">
                    {language === "en" ? "Location" : "地点"}
                  </p>
                  <p className="font-medium">{formData.location}</p>
                </div>
              )}
              
              {formData.duration && (
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">
                    {language === "en" ? "Duration" : "时长"}
                  </p>
                  <p className="font-medium">{formData.duration}</p>
                </div>
              )}
              
              {formData.gradeLevel && (
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">
                    {language === "en" ? "Grade Levels" : "适用年级"}
                  </p>
                  <p className="font-medium">{formData.gradeLevel}</p>
                </div>
              )}
              
              {formData.price && (
                <div>
                  <p className="text-sm text-gray-500 mb-0.5">
                    {language === "en" ? "Price" : "价格"}
                  </p>
                  <p className="font-medium text-blue-700">{formData.price}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {highlights && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              {language === "en" ? "Highlights" : "项目亮点"}
            </h2>
            <div className="prose-headings:text-blue-700" dangerouslySetInnerHTML={{ __html: highlights }}></div>
          </div>
        )}
        
        {itinerary && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              {language === "en" ? "Itinerary" : "行程安排"}
            </h2>
            <div className="prose-headings:text-blue-700" dangerouslySetInnerHTML={{ __html: itinerary }}></div>
          </div>
        )}
        
        {features && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              {language === "en" ? "Features" : "项目特色"}
            </h2>
            <div className="prose-headings:text-blue-700" dangerouslySetInnerHTML={{ __html: features }}></div>
          </div>
        )}
        
        {information && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              {language === "en" ? "Information" : "项目信息"}
            </h2>
            <div className="prose-headings:text-blue-700" dangerouslySetInnerHTML={{ __html: information }}></div>
          </div>
        )}
        
        {formData.price && (
          <div className="mt-6 p-3 bg-blue-50 rounded-lg inline-block">
            <h2 className="text-xl font-bold text-blue-800">
              {language === "en" ? "Price" : "价格"}: {formData.price}
            </h2>
          </div>
        )}
        
        {formData.images && formData.images.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2 text-blue-700">
              {language === "en" ? "Gallery" : "图片库"}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.images.slice(0, 10).map((image: string, index: number) => (
                <img 
                  key={index}
                  src={image}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg shadow-md"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </CardContent>
  );
};

export default SingleLanguageView;
