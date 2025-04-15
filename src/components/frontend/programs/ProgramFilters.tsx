import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface FilterOption {
  en: string;
  zh: string;
  value: string;
}

interface ProgramFiltersProps {
  selectedTypes: string[];
  selectedCountries: string[];
  selectedGradeLevels: string[];
  onTypeChange: (type: string) => void;
  onCountryChange: (country: string) => void;
  onGradeLevelChange: (level: string) => void;
  onClearAll: () => void;
}

const programTypes: FilterOption[] = [
  { en: 'Language Intensive', zh: '语言强化', value: 'language-intensive' },
  { en: 'STEM & Science', zh: 'STEM与科学创新', value: 'stem-science' },
  { en: 'Heritage & Arts Exploration', zh: '民俗与艺术探索', value: 'heritage-arts' },
  { en: 'Academic Enrichment', zh: '学术拓展', value: 'academic-enrichment' }
];

const countries: FilterOption[] = [
  { en: 'Singapore', zh: '新加坡', value: 'singapore' },
  { en: 'Malaysia', zh: '马来西亚', value: 'malaysia' },
  { en: 'United Kingdom', zh: '英国', value: 'uk' },
  { en: 'United States', zh: '美国', value: 'us' },
  { en: 'Japan', zh: '日本', value: 'japan' }
];

const gradeLevels: FilterOption[] = [
  { en: 'Primary School', zh: '小学', value: 'primary' },
  { en: 'Middle School', zh: '初中', value: 'middle' },
  { en: 'High School', zh: '高中', value: 'high' }
];

export const ProgramFilters: React.FC<ProgramFiltersProps> = ({
  selectedTypes,
  selectedCountries,
  selectedGradeLevels,
  onTypeChange,
  onCountryChange,
  onGradeLevelChange,
  onClearAll
}) => {
  const { currentLanguage } = useLanguage();

  const hasFilters = selectedTypes.length > 0 || selectedCountries.length > 0 || selectedGradeLevels.length > 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        {/* 筛选标题和清除按钮 */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {currentLanguage === 'en' ? 'Filter Programs' : '筛选项目'}
          </h3>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-blue-600 hover:text-blue-700"
            >
              {currentLanguage === 'en' ? 'Clear All' : '清除全部'}
            </Button>
          )}
        </div>

        <Separator />

        {/* 项目类型筛选 */}
        <div className="space-y-2">
          <h4 className="font-medium">
            {currentLanguage === 'en' ? 'Program Type' : '项目类型'}
          </h4>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {programTypes.map((type) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${type.value}`}
                    checked={selectedTypes.includes(type.value)}
                    onCheckedChange={() => onTypeChange(type.value)}
                  />
                  <Label htmlFor={`type-${type.value}`}>
                    {currentLanguage === 'en' ? type.en : type.zh}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* 国家筛选 */}
        <div className="space-y-2">
          <h4 className="font-medium">
            {currentLanguage === 'en' ? 'Country' : '国家'}
          </h4>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {countries.map((country) => (
                <div key={country.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`country-${country.value}`}
                    checked={selectedCountries.includes(country.value)}
                    onCheckedChange={() => onCountryChange(country.value)}
                  />
                  <Label htmlFor={`country-${country.value}`}>
                    {currentLanguage === 'en' ? country.en : country.zh}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        {/* 年级水平筛选 */}
        <div className="space-y-2">
          <h4 className="font-medium">
            {currentLanguage === 'en' ? 'Grade Level' : '年级水平'}
          </h4>
          <ScrollArea className="h-[120px]">
            <div className="space-y-2">
              {gradeLevels.map((level) => (
                <div key={level.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.value}`}
                    checked={selectedGradeLevels.includes(level.value)}
                    onCheckedChange={() => onGradeLevelChange(level.value)}
                  />
                  <Label htmlFor={`level-${level.value}`}>
                    {currentLanguage === 'en' ? level.en : level.zh}
                  </Label>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

export default ProgramFilters; 