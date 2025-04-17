
import React from "react";

interface SplitLanguageViewProps {
  formData: any;
}

const SplitLanguageView: React.FC<SplitLanguageViewProps> = ({ formData }) => {
  // 中英文标签
  const enLabel = "Description";
  const zhLabel = "描述";
  const enHighlights = "Highlights";
  const zhHighlights = "项目亮点";
  const enItinerary = "Itinerary";
  const zhItinerary = "行程安排";
  const enFeatures = "Features";
  const zhFeatures = "项目特色";
  const enInfo = "Information";
  const zhInfo = "项目信息";
  const enPrice = "Price";
  const zhPrice = "价格";
  const enGallery = "Gallery";
  const zhGallery = "图片库";

  return (
    <div className="grid grid-cols-2 divide-x">
      {/* 英文内容 */}
      <div className="p-6 overflow-auto">
        <div className="bg-blue-50 text-primary font-bold py-1 px-3 rounded-full inline-block mb-2 text-sm">EN</div>
        <div className="prose prose-blue dark:prose-invert max-w-none prose-sm">
          {formData.thumbnail && (
            <img 
              src={formData.thumbnail} 
              alt={formData.titleEn || "Program image"}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-3 text-blue-800">{formData.titleEn}</h1>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {formData.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.category}
              </span>
            )}
            {formData.tags && formData.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          {formData.descriptionEn && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{enLabel}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.descriptionEn }}></div>
            </div>
          )}
          
          {formData.highlightsEn && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{enHighlights}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.highlightsEn }}></div>
            </div>
          )}
          
          {formData.itineraryEn && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{enItinerary}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.itineraryEn }}></div>
            </div>
          )}
          
          {formData.featuresEn && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{enFeatures}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.featuresEn }}></div>
            </div>
          )}
          
          {formData.informationEn && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{enInfo}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.informationEn }}></div>
            </div>
          )}
          
          {formData.price && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-md font-bold text-blue-800">{enPrice}: {formData.price}</h3>
            </div>
          )}
        </div>
      </div>
      
      {/* 中文内容 */}
      <div className="p-6 overflow-auto">
        <div className="bg-red-50 text-red-600 font-bold py-1 px-3 rounded-full inline-block mb-2 text-sm">中文</div>
        <div className="prose prose-blue dark:prose-invert max-w-none prose-sm">
          {formData.thumbnail && (
            <img 
              src={formData.thumbnail} 
              alt={formData.title || "项目图片"}
              className="w-full h-48 object-cover rounded-lg mb-4 shadow-md"
            />
          )}
          
          <h1 className="text-2xl font-bold mb-3 text-blue-800">{formData.title}</h1>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {formData.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                {formData.category}
              </span>
            )}
            {formData.tags && formData.tags.map((tag: string, index: number) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs">
                {tag}
              </span>
            ))}
          </div>
          
          {formData.description && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{zhLabel}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.description }}></div>
            </div>
          )}
          
          {formData.highlights && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{zhHighlights}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.highlights }}></div>
            </div>
          )}
          
          {formData.itinerary && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{zhItinerary}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.itinerary }}></div>
            </div>
          )}
          
          {formData.features && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{zhFeatures}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.features }}></div>
            </div>
          )}
          
          {formData.information && (
            <div className="mt-4">
              <h2 className="text-lg font-bold mb-1 text-blue-700">{zhInfo}</h2>
              <div className="prose-headings:text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: formData.information }}></div>
            </div>
          )}
          
          {formData.price && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="text-md font-bold text-blue-800">{zhPrice}: {formData.price}</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SplitLanguageView;
