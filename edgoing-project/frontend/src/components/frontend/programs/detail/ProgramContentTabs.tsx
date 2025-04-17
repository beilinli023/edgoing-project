import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RichTextRenderer from '@/components/common/RichTextRenderer';
import './ProgramTabs.css'; // 导入CSS样式文件

// 选项卡配置
const TAB_CONFIG = [
  {
    id: 'highlights',
    label_en: 'Highlights',
    label_zh: '项目亮点'
  },
  {
    id: 'features',
    label_en: 'Features',
    label_zh: '项目特色'
  },
  {
    id: 'itinerary',
    label_en: 'Itinerary',
    label_zh: '行程安排'
  },
  {
    id: 'other',
    label_en: 'Other Information',
    label_zh: '额外信息'
  }
];

interface ProgramContentTabsProps {
  program: Program;
}

const ProgramContentTabs: React.FC<ProgramContentTabsProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();

  // 我们已经使用 RichTextRenderer 组件替换了这些格式化函数

  // 获取各个标签的内容
  const getTabContent = (key: string) => {
    // 获取当前标签的内容
    const fieldKey = key === 'other' ? 'other_info' : key;

    // 根据当前语言获取对应的字段
    const langFieldKey = `${fieldKey}_${currentLanguage}` as keyof typeof program;
    const content = program[langFieldKey];

    // 如果内容为空，显示默认消息
    if (!content || (typeof content === 'string' && content.trim() === '')) {
      return (
        <p className="text-gray-500 italic">
          {currentLanguage === 'en'
            ? 'No information available.'
            : '暂无相关信息。'
          }
        </p>
      );
    }

    // 使用富文本渲染器渲染内容
    return <RichTextRenderer content={content} />;
  };

  return (
    <Tabs defaultValue="highlights" className="w-full">
      <TabsList className="w-full justify-start border-b mb-6 bg-transparent">
        {TAB_CONFIG.map(tab => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-700"
          >
            {currentLanguage === 'en' ? tab.label_en : tab.label_zh}
          </TabsTrigger>
        ))}
      </TabsList>

      {TAB_CONFIG.map(tab => (
        <TabsContent key={tab.id} value={tab.id} className="mt-0">
          <div className="prose prose-lg max-w-none">
            {getTabContent(tab.id === 'other' ? 'other_info' : tab.id)}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProgramContentTabs;
