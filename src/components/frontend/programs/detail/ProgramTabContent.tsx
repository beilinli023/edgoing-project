import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';
import { TabsContent } from '@/components/ui/tabs';

interface ProgramTabContentProps {
  program: Program;
  programImages: string[];
}

// 标准化文本内容 - 确保段落之间的换行格式统一
const formatContentText = (content: string) => {
  if (!content) return '';
  
  // 检查内容是否包含HTML标签
  const containsHtml = /<[a-z][\s\S]*>/i.test(content);
  
  // 如果包含HTML标签，则直接返回内容
  if (containsHtml) {
    return content;
  }
  
  // 查找标题和内容的模式：标题：内容
  return content.split('\n\n').map(paragraph => {
    const parts = paragraph.split('：');
    if (parts.length > 1) {
      // 这是一个带标题的段落
      return `<div class="mb-4">
                <h4 class="font-bold text-lg mb-1">${parts[0]}：</h4>
                <p class="ml-0">${parts.slice(1).join('：')}</p>
              </div>`;
    }
    // 普通段落
    return `<p class="mb-4">${paragraph}</p>`;
  }).join('');
};

// 通用的内容展示组件
const ContentSection = ({ content, fallbackMessage }: { content: string, fallbackMessage: string }) => {
  if (!content) {
    return <p className="text-gray-500">{fallbackMessage}</p>;
  }
  
  return <div dangerouslySetInnerHTML={{ __html: formatContentText(content) }} />;
};

const ProgramTabContent: React.FC<ProgramTabContentProps> = ({ program, programImages }) => {
  const { currentLanguage } = useLanguage();
  const location = currentLanguage === 'en' ? program.location_en : program.location_zh;
  
  // 多语言文本
  const texts = {
    noHighlights: currentLanguage === 'en' ? 'No highlights available' : '暂无亮点信息',
    noItinerary: currentLanguage === 'en' ? 'Detailed itinerary will be provided upon registration.' : '详细行程将在注册后提供。',
    noFeatures: currentLanguage === 'en' ? 'Features information not available' : '特色信息不可用',
    programDetails: currentLanguage === 'en' ? 'Program Details' : '项目详情',
    duration: currentLanguage === 'en' ? `Duration: ${program.duration || 'N/A'}` : `时长: ${program.duration || '暂无'}`,
    location: currentLanguage === 'en' ? `Location: ${location || 'N/A'}` : `地点: ${location || '暂无'}`,
    price: program.price ? (currentLanguage === 'en' ? `Price: ${program.price}` : `价格: ${program.price}`) : '',
    noImages: currentLanguage === 'en' ? 'No additional images available' : '暂无额外图片'
  };
  
  // 获取当前语言的内容
  const getContent = (enContent: string, zhContent: string) => {
    return currentLanguage === 'en' ? (enContent || '') : (zhContent || '');
  };
  
  return (
    <>
      <TabsContent value="highlights" className="mt-0">
        <div className="prose prose-blue max-w-none bg-white p-6 rounded-lg shadow-sm">
          <ContentSection 
            content={getContent(program.highlights_en, program.highlights_zh)} 
            fallbackMessage={texts.noHighlights} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="itinerary" className="mt-0">
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
          <ContentSection 
            content={getContent(program.itinerary_en, program.itinerary_zh)} 
            fallbackMessage={texts.noItinerary} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="features" className="mt-0">
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
          <ContentSection 
            content={getContent(program.features_en, program.features_zh)} 
            fallbackMessage={texts.noFeatures} 
          />
        </div>
      </TabsContent>
      
      <TabsContent value="info" className="mt-0">
        <div className="prose max-w-none bg-white p-6 rounded-lg shadow-sm">
          {program.information_en || program.information_zh ? (
            <ContentSection 
              content={getContent(program.information_en, program.information_zh)} 
              fallbackMessage="" 
            />
          ) : (
            <div>
              <h3>{texts.programDetails}</h3>
              <ul>
                <li>{texts.duration}</li>
                <li>{texts.location}</li>
                {program.price && <li>{texts.price}</li>}
              </ul>
            </div>
          )}
        </div>
      </TabsContent>
      
      <TabsContent value="gallery" className="mt-0">
        {programImages.length > 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {programImages.map((img, index) => (
              <div key={index} className="relative aspect-[4/3] rounded-md overflow-hidden">
                <img 
                  src={img} 
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">{texts.noImages}</p>
        )}
      </TabsContent>
    </>
  );
};

export default ProgramTabContent;
