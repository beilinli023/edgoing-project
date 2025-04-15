import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { PartnerUniversityDetail } from '@/types/studyAbroadTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Trophy, BookOpen, Building, GraduationCap } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface UniversityDetailContentProps {
  university: PartnerUniversityDetail;
}

const UniversityDetailContent: React.FC<UniversityDetailContentProps> = ({ university }) => {
  const { currentLanguage } = useLanguage();
  const [imageIndex, setImageIndex] = useState(0);

  const name = currentLanguage === 'en' ? university.name_en : university.name_zh;
  const description = currentLanguage === 'en' ? university.description_en || '' : university.description_zh || '';

  // 默认图片，当没有从Strapi获取到图片时使用
  const defaultImages = [
    '/Edgoing/stuy%20board/malaysia/Picture-1.png',
    '/Edgoing/stuy%20board/malaysia/Picture-2.png',
    '/Edgoing/stuy%20board/malaysia/Picture-3.png',
    '/Edgoing/stuy%20board/malaysia/Picture-4.png',
    '/Edgoing/stuy%20board/malaysia/Picture-5%20.png'
  ];

  // 处理图片URL，确保它是有效的URL
  const getValidImageUrl = (url) => {
    // 如果URL为空，返回默认图片
    if (!url) return defaultImages[0];

    // 如果URL已经是完整的URL，直接返回
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // 如果URL是相对路径，确保它以/开头
    return url.startsWith('/') ? url : `/${url}`;
  };

  // 处理图片数组
  const processGalleryImages = () => {
    // 首先检查gallery_images是否存在且有内容
    if (university.gallery_images && university.gallery_images.length > 0) {
      // 确保每个URL都是有效的
      return university.gallery_images.map(img => getValidImageUrl(img));
    }

    // 如果没有gallery_images，但有featured_image，将其作为第一张图片
    if (university.featured_image) {
      return [getValidImageUrl(university.featured_image)];
    }

    // 如果有image，将其作为第一张图片
    if (university.image) {
      return [getValidImageUrl(university.image)];
    }

    // 如果以上都没有，使用默认图片
    return defaultImages;
  };

  // 获取大学图片
  const universityImages = processGalleryImages();

  // 调试信息
  useEffect(() => {
    console.log('University images:', universityImages);
  }, [universityImages]);

  const universityTabs = [
    { id: 'highlights', label_en: 'Highlights', label_zh: '亮点', icon: <Trophy className="h-4 w-4 mr-1" /> },
    { id: 'academics', label_en: 'Academics', label_zh: '学术', icon: <BookOpen className="h-4 w-4 mr-1" /> },
    { id: 'facilities', label_en: 'Facilities', label_zh: '设施', icon: <Building className="h-4 w-4 mr-1" /> },
    { id: 'admission', label_en: 'Admission', label_zh: '入学', icon: <GraduationCap className="h-4 w-4 mr-1" /> }
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 max-w-6xl">
        <div className="max-w-3xl mx-auto mb-10">
          <div>
            {universityImages.length > 1 ? (
              <Carousel
                className="w-full mb-6"
                setApi={(api) => {
                  api?.on("select", () => {
                    setImageIndex(api.selectedScrollSnap());
                  });
                }}
              >
                <CarouselContent>
                  {universityImages.map((img, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={img}
                        alt={`${name} - ${index + 1}`}
                        className="w-full h-80 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          console.error('图片加载失败:', img);
                          e.currentTarget.src = defaultImages[0];
                        }}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />

                <div className="flex justify-center gap-1 mt-2">
                  {universityImages.map((_, index) => (
                    <span
                      key={index}
                      className={`inline-block h-2 w-2 rounded-full transition-colors ${
                        index === imageIndex ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            ) : (
              <img
                src={getValidImageUrl(university.image || university.featured_image)}
                alt={name}
                className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
                onError={(e) => {
                  console.error('图片加载失败:', university.image || university.featured_image);
                  e.currentTarget.src = defaultImages[0];
                }}
              />
            )}

            <p className="text-gray-700 mb-6">{description}</p>
          </div>
        </div>

        <Tabs defaultValue="highlights" className="w-full">
          <TabsList className="mb-8 border-b w-full justify-start bg-transparent h-auto p-0 space-x-8">
            {universityTabs.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="px-6 py-2 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 data-[state=active]:bg-transparent rounded-none border-transparent bg-transparent text-gray-600 hover:text-blue-700 transition-colors flex items-center"
              >
                {tab.icon}
                {currentLanguage === 'en' ? tab.label_en : tab.label_zh}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="highlights" className="mt-0">
            <div className="prose prose-blue max-w-none">
              {(currentLanguage === 'en' ? university.highlights_en : university.highlights_zh) ? (
                <ReactMarkdown>
                  {currentLanguage === 'en' ? university.highlights_en || '' : university.highlights_zh || ''}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">{currentLanguage === 'en' ? 'No highlights available' : '暂无亮点信息'}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="academics" className="mt-0">
            <div className="prose max-w-none">
              {(currentLanguage === 'en' ? university.academics_en : university.academics_zh) ? (
                <ReactMarkdown>
                  {currentLanguage === 'en' ? university.academics_en || '' : university.academics_zh || ''}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">{currentLanguage === 'en' ? 'Academic information not available.' : '学术信息暂不可用。'}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-0">
            <div className="prose max-w-none">
              {(currentLanguage === 'en' ? university.facilities_en : university.facilities_zh) ? (
                <ReactMarkdown>
                  {currentLanguage === 'en' ? university.facilities_en || '' : university.facilities_zh || ''}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">{currentLanguage === 'en' ? 'Facilities information not available' : '设施信息暂不可用'}</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="admission" className="mt-0">
            <div className="prose max-w-none">
              {(currentLanguage === 'en' ? university.admission_en : university.admission_zh) ? (
                <ReactMarkdown>
                  {currentLanguage === 'en' ? university.admission_en || '' : university.admission_zh || ''}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-500">{currentLanguage === 'en' ? 'Admission information not available' : '入学信息暂不可用'}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default UniversityDetailContent;
