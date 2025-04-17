import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFrontendFeaturedPrograms } from '@/hooks';
import { Program } from '@/types/programTypes';

/**
 * 程序数据类型接口
 *
 * @interface ProgramData
 * @property {string} id - 程序唯一标识符
 * @property {string} title_en - 英文标题
 * @property {string} title_zh - 中文标题
 * @property {string} description_en - 英文描述
 * @property {string} description_zh - 中文描述
 * @property {string} image - 程序图片URL
 * @property {string} location_en - 英文位置信息
 * @property {string} location_zh - 中文位置信息
 * @property {string} duration - 持续时间
 * @property {string} [duration_en] - 英文持续时间（可选）
 * @property {string} [duration_zh] - 中文持续时间（可选）
 * @property {string} country - 国家
 * @property {Array<{id: string, name_en: string, name_zh: string}>} tags - 程序标签数组
 */
interface ProgramData {
  id: string;
  title_en: string;
  title_zh: string;
  description_en: string;
  description_zh: string;
  image: string;
  location_en: string;
  location_zh: string;
  duration: string;
  duration_en?: string;
  duration_zh?: string;
  country: string;
  tags: Array<{
    id: string;
    name_en: string;
    name_zh: string;
  }>;
}

/**
 * 特色课程组件属性接口
 *
 * @interface FeaturedProgramsProps
 * @property {'en'|'zh'} currentLanguage - 当前语言设置，用于切换显示的语言
 */
interface FeaturedProgramsProps {
  currentLanguage: 'en' | 'zh';
}

/**
 * 首页特色课程展示组件
 *
 * 该组件在首页上展示三个特色课程，包含课程图片、标题、位置、持续时间和简短描述。
 * 组件会从指定的JSON文件中加载固定的三个课程数据。支持多语言显示，会根据当前语言
 * 设置自动切换显示的文本内容。每个课程卡片都可以点击跳转到相应的课程详情页面。
 *
 * @component
 * @example
 * ```tsx
 * import { FeaturedPrograms } from '@/components/frontend/home/FeaturedPrograms';
 * import { useLanguage } from '@/context/LanguageContext';
 *
 * // 使用示例
 * function HomePage() {
 *   const { currentLanguage } = useLanguage();
 *
 *   return (
 *     <div className="home-page">
 *       <HeroSection />
 *       <FeaturedPrograms currentLanguage={currentLanguage} />
 *       <AboutSection />
 *     </div>
 *   );
 * }
 * ```
 *
 * @param {FeaturedProgramsProps} props - 组件属性
 * @returns {JSX.Element} 渲染的特色课程展示区域
 */
const FeaturedPrograms: React.FC<FeaturedProgramsProps> = ({ currentLanguage }) => {
  // 使用自定义 hook 获取特色课程数据
  const { programs, intro, isLoading, error } = useFrontendFeaturedPrograms(currentLanguage);

  // 如果正在加载，显示加载指示器
  if (isLoading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    );
  }

  // 如果加载出错，显示错误信息
  if (error) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center text-red-500">
          {currentLanguage === 'en' ? 'Failed to load programs' : '加载课程失败'}
        </div>
      </div>
    );
  }

  // 使用从 hook 获取的数据
  console.log('FeaturedPrograms data:', programs);

  // 深度检查数据结构
  if (programs && programs.length > 0) {
    console.log('First program data structure:', JSON.stringify(programs[0], null, 2));
  }

  const programsData = programs || [];

  // 介绍文本数据
  const introData = intro || {
    subtitle: currentLanguage === 'en'
      ? "Every EdGoing program is a carefully crafted adventure, designed to go beyond sightseeing—challenging assumptions, building empathy, and empowering students to see the world, and themselves, in new ways."
      : "每一个 EdGoing 项目都是精心打造的探险之旅，旨在超越简单的观光——挑战固有观念、培养共情能力，并赋予学生以全新的方式看待世界和自我。",
    title: currentLanguage === 'en'
      ? "Study Abroad Reimagined: journeys that inspire, connect, and transform."
      : "留学新视角：激发灵感、建立联系、实现蜕变的旅程。",
    linkText: currentLanguage === 'en' ? "View All Programs" : "查看所有项目",
    linkUrl: "/programs"
  };

  return renderContent(programsData, introData);

  // 渲染内容的辅助函数
  function renderContent(programsData: Program[], introData: {
    subtitle: string;
    title: string;
    linkText: string;
    linkUrl: string;
  }) {
    // 确保我们始终有三个项目
    const displayPrograms = programsData.slice(0, 3);

    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-8 md:px-12">
          <div className="mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              {introData.title}
            </h2>
            <div className="flex justify-center">
              <Button variant="link" className="text-blue-600 p-0 h-auto" asChild>
                <Link to={introData.linkUrl}>
                  {introData.linkText} →
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {displayPrograms.map((program) => (
              <Link to={`/programs/${program.id}`} key={program.id} className="border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 h-full">
                <div className="h-48 overflow-hidden">
                  <img
                    src={program.image}
                    alt={currentLanguage === 'en' ? program.title_en : program.title_zh}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-grow">
                  <h3 className="text-lg font-semibold mb-2 line-clamp-2 h-14">
                    {currentLanguage === 'en' ? program.title_en : program.title_zh}
                  </h3>

                  {/* 项目信息区域 */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mt-1 mb-2">
                    {/* 项目类型 */}
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-1">
                        {currentLanguage === 'en' ? 'Type:' : '类型:'}
                      </span>
                      <span>
                        {currentLanguage === 'en'
                          ? program.program_type_en?.[0] || ''
                          : program.program_type_zh?.[0] || ''}
                      </span>
                    </div>

                    {/* 营期 */}
                    {program.camp_period && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-1">
                          {currentLanguage === 'en' ? 'Program Date:' : '营期:'}
                        </span>
                        <span>
                          {currentLanguage === 'en'
                            ? program.camp_period_en || program.camp_period
                            : program.camp_period_zh || program.camp_period}
                        </span>
                      </div>
                    )}

                    {/* 截止日期 */}
                    {program.deadline && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-1">
                          {currentLanguage === 'en' ? 'Application Deadline:' : '截止日期:'}
                        </span>
                        <span>
                          {program.deadline}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 mb-2">
                    {/* 国家 */}
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-1">
                        {currentLanguage === 'en' ? 'Country:' : '国家:'}
                      </span>
                      <span>
                        {currentLanguage === 'en'
                          ? (Array.isArray(program.country_en) ? program.country_en[0] : program.country_en) || ''
                          : (Array.isArray(program.country_zh) ? program.country_zh[0] : program.country_zh) || ''}
                      </span>
                    </div>

                    {/* 年级 */}
                    {(program.grade_level_en?.length > 0 || program.grade_level_zh?.length > 0) && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-1">
                          {currentLanguage === 'en' ? 'Grade:' : '年级:'}
                        </span>
                        <span>
                          {currentLanguage === 'en'
                            ? program.grade_level_en?.[0] || ''
                            : program.grade_level_zh?.[0] || ''}
                        </span>
                      </div>
                    )}

                    {/* 目的地 */}
                    {(program.destination_en || program.destination_zh) && (
                      <div className="flex items-center">
                        <span className="font-medium text-gray-700 mr-1">
                          {currentLanguage === 'en' ? 'Destination:' : '目的地:'}
                        </span>
                        <span>
                          {currentLanguage === 'en'
                            ? program.destination_en || ''
                            : program.destination_zh || ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-4 pt-0 mt-auto bg-gray-50 text-sm text-gray-500 flex items-center justify-between">
                  <span>{currentLanguage === 'en' ? program.location_en : program.location_zh}</span>
                  <span>
                    {currentLanguage === 'en'
                      ? (program.duration_en || program.duration)
                      : (program.duration_zh || program.duration)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
};

export default FeaturedPrograms;
