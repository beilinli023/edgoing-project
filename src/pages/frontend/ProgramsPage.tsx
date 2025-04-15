import React, { useState, useMemo } from 'react';
import FrontendLayout from "@/components/frontend/FrontendLayout";
import ProgramsHero from "@/components/frontend/programs/ProgramsHero";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { usePrograms } from "@/hooks/useProgram";
import { Program } from "@/types/programTypes";
import { decodeUnicodeString } from '@/utils/unicodeHelper';
import { formatProgramType } from '@/utils/formatters';
import ProgramFilters from '@/components/frontend/programs/ProgramFilters';

const ProgramsPage: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 每页显示6个项目

  // 筛选状态
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<string[]>([]);

  // 映射前端筛选值到Strapi中的实际值
  const mapFilterValueToStrapi = (value: string, type: 'type' | 'country' | 'grade'): string => {
    if (type === 'type') {
      switch(value) {
        case 'language-intensive': return currentLanguage === 'en' ? 'Language Intensive' : '语言强化';
        case 'stem-science': return currentLanguage === 'en' ? 'STEM & Science' : 'STEM与科学创新';
        case 'heritage-arts': return currentLanguage === 'en' ? 'Heritage & Arts Exploration' : '民俗与艺术探索';
        case 'academic-enrichment': return currentLanguage === 'en' ? 'Academic Enrichment' : '学术拓展';
        default: return value;
      }
    } else if (type === 'country') {
      switch(value) {
        case 'singapore': return currentLanguage === 'en' ? 'Singapore' : '新加坡';
        case 'malaysia': return currentLanguage === 'en' ? 'Malaysia' : '马来西亚';
        case 'uk': return currentLanguage === 'en' ? 'United Kingdom' : '英国';
        case 'us': return currentLanguage === 'en' ? 'United States' : '美国';
        case 'japan': return currentLanguage === 'en' ? 'Japan' : '日本';
        default: return value;
      }
    } else if (type === 'grade') {
      switch(value) {
        case 'primary': return currentLanguage === 'en' ? 'Primary School' : '小学';
        case 'middle': return currentLanguage === 'en' ? 'Middle School' : '初中';
        case 'high': return currentLanguage === 'en' ? 'High School' : '高中';
        default: return value;
      }
    }
    return value;
  };

  // 构建筛选参数
  const filters = {
    page: currentPage,
    limit: itemsPerPage,
    programType: selectedTypes.length > 0 ? mapFilterValueToStrapi(selectedTypes[0], 'type') : undefined,
    country: selectedCountries.length > 0 ? mapFilterValueToStrapi(selectedCountries[0], 'country') : undefined,
    gradeLevel: selectedGradeLevels.length > 0 ? mapFilterValueToStrapi(selectedGradeLevels[0], 'grade') : undefined
  };

  // 使用筛选参数获取数据
  const { data, isLoading: loading, isError: error } = usePrograms(filters, currentLanguage);
  const allPrograms = data?.data || [];

  // 筛选状态已移至上方

  // 处理筛选变化
  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    setCurrentPage(1); // 重置页码
  };

  const handleCountryChange = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country)
        ? prev.filter(c => c !== country)
        : [...prev, country]
    );
    setCurrentPage(1);
  };

  const handleGradeLevelChange = (level: string) => {
    setSelectedGradeLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setSelectedTypes([]);
    setSelectedCountries([]);
    setSelectedGradeLevels([]);
    setCurrentPage(1);
  };

  // 分页逻辑
  const totalPages = data?.totalPages || 1;
  const currentPrograms = allPrograms || [];

  // 如果正在加载，显示加载状态
  if (loading) {
    return (
      <FrontendLayout>
        <ProgramsHero />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">
              {currentLanguage === 'en' ? 'Loading programs...' : '正在加载项目...'}
            </p>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  // 如果有错误，显示错误信息
  if (error) {
    return (
      <FrontendLayout>
        <ProgramsHero />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-red-500">
              {currentLanguage === 'en' ? 'Error loading programs' : '加载项目时出错'}: {error}
            </p>
          </div>
        </div>
      </FrontendLayout>
    );
  }

  return (
    <FrontendLayout>
      <ProgramsHero />

      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 筛选侧边栏 */}
          <div className="w-full md:w-64 shrink-0">
            <ProgramFilters
              selectedTypes={selectedTypes}
              selectedCountries={selectedCountries}
              selectedGradeLevels={selectedGradeLevels}
              onTypeChange={handleTypeChange}
              onCountryChange={handleCountryChange}
              onGradeLevelChange={handleGradeLevelChange}
              onClearAll={handleClearAll}
            />
          </div>

          {/* 程序列表 */}
          <div className="flex-1">
            {currentPrograms.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500">
                  {currentLanguage === 'en' ? 'No matching programs found' : '未找到匹配的项目'}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentPrograms.map((program: Program) => (
                    <Link key={program.id} to={`/programs/${program.id}`} data-testid={`program-card-${program.id}`}>
                      <Card className="overflow-hidden h-full flex flex-col">
                        <div className="h-48 overflow-hidden">
                          <img
                            src={program.image || '/images/programs/default.jpg'}
                            alt={currentLanguage === 'en' ? program.title_en : program.title_zh}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                          <h3 className="text-base font-medium mb-2">
                            {currentLanguage === 'en' ? program.title_en : program.title_zh}
                          </h3>

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
                                  : (Array.isArray(program.country_zh) ? program.country_zh[0] : program.country_zh) || ''
                                }
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

                          <div className="text-sm text-gray-600 line-clamp-2">
                            {currentLanguage === 'en'
                              ? typeof program.overview_en === 'string'
                                ? program.overview_en
                                : ''
                              : typeof program.overview_zh === 'string'
                                ? program.overview_zh
                                : ''}
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>

                {/* 分页控制 */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-md"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {currentLanguage === 'en' ? 'Previous' : '上一页'}
                    </Button>

                    <div className="flex items-center gap-2">
                      {/* 页码列表 */}
                      {(() => {
                        // 计算要显示的页码范围
                        const maxVisiblePages = 5;
                        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                        // 调整起始页码，确保显示最大数量的页码
                        if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
                          startPage = Math.max(1, endPage - maxVisiblePages + 1);
                        }

                        const pages = [];

                        // 添加第一页和省略号
                        if (startPage > 1) {
                          pages.push(
                            <div
                              key="first"
                              onClick={() => setCurrentPage(1)}
                              className="flex items-center justify-center w-10 h-10 rounded-md border cursor-pointer hover:bg-gray-100"
                            >
                              1
                            </div>
                          );

                          if (startPage > 2) {
                            pages.push(
                              <span key="ellipsis1" className="px-1">
                                ...
                              </span>
                            );
                          }
                        }

                        // 添加中间页码
                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <div
                              key={i}
                              onClick={() => setCurrentPage(i)}
                              className={`flex items-center justify-center w-10 h-10 rounded-md cursor-pointer ${
                                i === currentPage
                                  ? 'bg-blue-600 text-white'
                                  : 'border hover:bg-gray-100'
                              }`}
                            >
                              {i}
                            </div>
                          );
                        }

                        // 添加最后一页和省略号
                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(
                              <span key="ellipsis2" className="px-1">
                                ...
                              </span>
                            );
                          }

                          pages.push(
                            <div
                              key="last"
                              onClick={() => setCurrentPage(totalPages)}
                              className="flex items-center justify-center w-10 h-10 rounded-md border cursor-pointer hover:bg-gray-100"
                            >
                              {totalPages}
                            </div>
                          );
                        }

                        return pages;
                      })()}
                    </div>

                    <Button
                      variant="outline"
                      size="default"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-4 py-2 rounded-md"
                    >
                      {currentLanguage === 'en' ? 'Next' : '下一页'}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            {currentLanguage === 'en' ? 'Ready to Start Your Journey?' : '准备开始您的旅程？'}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {currentLanguage === 'en'
              ? 'Take the first step in your international education adventure. Our team is here to help you find the perfect program.'
              : '迈出国际教育冒险的第一步，我们的团队随时为您找到完美的项目提供帮助。'
            }
          </p>
          <Link to="/start-planning">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2">
              {currentLanguage === 'en' ? 'Start Planning' : '开始计划'}
            </Button>
          </Link>
        </div>
      </div>
    </FrontendLayout>
  );
};

export default ProgramsPage;
