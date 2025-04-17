import React, { useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Program } from '@/types/programTypes';
import { Card } from '@/components/ui/card';
import { MapPin, Clock, BookOpen, Calendar, Timer, Tag } from 'lucide-react';

// 多语言文本配置
const TEXT = {
  en: {
    programInfo: 'Program Information',
    programType: 'Program Type',
    duration: 'Duration',
    destination: 'Destination',
    gradeLevel: 'Grade Level',
    campPeriod: 'Program Date',
    deadline: 'Application Deadline'
  },
  zh: {
    programInfo: '项目信息',
    programType: '项目类型',
    duration: '时长',
    destination: '目的地',
    gradeLevel: '年级水平',
    campPeriod: '营期',
    deadline: '截止日期'
  }
};

// 信息项组件
interface InfoItemProps {
  label: string;
  value: React.ReactNode;
  isDeadline?: boolean;
  icon: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, isDeadline = false, icon }) => (
  <div className="flex items-start">
    <div className="text-blue-500 mr-3 mt-0.5">{icon}</div>
    <div>
      <h3 className="font-medium text-gray-700">{label}</h3>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

interface ProgramInfoSidebarProps {
  program: Program;
}

const ProgramInfoSidebar: React.FC<ProgramInfoSidebarProps> = ({ program }) => {
  const { currentLanguage } = useLanguage();
  const t = TEXT[currentLanguage as keyof typeof TEXT];

  // 调试日志以查看数据
  useEffect(() => {
    console.log('Program data:', program);
    console.log('Deadline:', program.deadline);
    console.log('Camp Period:', program.camp_period);
    if (program.grade_level_zh) {
      console.log('原始grade_level_zh:', program.grade_level_zh);
    }
    if (program.grade_levels) {
      console.log('原始grade_levels:', program.grade_levels);
    }
  }, [program]);

  // 获取当前语言的内容，优先使用专用字段，有回退策略
  const getProgramContent = () => {
    // 打印程序数据以便调试
    console.log('Program data in ProgramInfoSidebar:', {
      id: program.id,
      program_type_en: program.program_type_en,
      program_type_zh: program.program_type_zh,
      grade_level_en: program.grade_level_en,
      grade_level_zh: program.grade_level_zh,
      destination_en: program.destination_en,
      destination_zh: program.destination_zh,
      country_en: program.country_en,
      country_zh: program.country_zh,
      camp_period: program.camp_period,
      deadline: program.deadline
    });

    // 项目类型 - 优先使用对应语言的值，如果没有则使用另一种语言的值
    let programType = '';
    if (currentLanguage === 'en') {
      if (program.program_type_en && program.program_type_en.length > 0) {
        programType = program.program_type_en.join(', ');
      } else if (program.program_type_zh && program.program_type_zh.length > 0) {
        // 如果没有英文值，使用中文值
        programType = program.program_type_zh.join(', ');
      } else {
        programType = '';
      }
    } else {
      if (program.program_type_zh && program.program_type_zh.length > 0) {
        programType = program.program_type_zh.join(', ');
      } else if (program.program_type_en && program.program_type_en.length > 0) {
        // 如果没有中文值，使用英文值
        programType = program.program_type_en.join(', ');
      } else {
        programType = '';
      }
    }

    // 目的地 - 优先使用对应语言的值，如果没有则使用另一种语言的值
    let destination = currentLanguage === 'en'
      ? program.destination_en || program.location_en
      : program.destination_zh || program.location_zh;

    // 如果中文环境下没有中文地点信息，尝试翻译英文地点
    if (currentLanguage === 'zh' && !destination) {
      const englishDestination = program.destination_en || program.location_en;
      if (englishDestination) {
        // 常见地点的英文到中文映射
        const locationMap: Record<string, string> = {
          'Singapore': '新加坡',
          'Shanghai': '上海',
          'Beijing': '北京',
          'Hong Kong': '香港',
          'London': '伦敦',
          'New York': '纽约',
          'Tokyo': '东京',
          'Paris': '巴黎',
          'Sydney': '悉尼',
          'Melbourne': '墨尔本',
          'Toronto': '多伦多',
          'Vancouver': '温哥华',
          'Boston': '波士顿',
          'Chicago': '芝加哥',
          'San Francisco': '旧金山',
          'Los Angeles': '洛杉矶',
          'Washington': '华盛顿',
          'Seattle': '西雅图',
          'Miami': '迈阿密',
          'Dallas': '达拉斯',
          'Houston': '休斯顿',
          'Philadelphia': '费城',
          'Atlanta': '亚特兰大',
          'Denver': '丹佛',
          'Phoenix': '凤凰城',
          'San Diego': '圣地亚哥',
          'Austin': '奥斯汀',
          'Berlin': '柏林',
          'Munich': '慕尼黑',
          'Frankfurt': '法兰克福',
          'Rome': '罗马',
          'Milan': '米兰',
          'Madrid': '马德里',
          'Barcelona': '巴塞罗那',
          'Amsterdam': '阿姆斯特丹',
          'Brussels': '布鲁塞尔',
          'Vienna': '维也纳',
          'Zurich': '苏黎世',
          'Geneva': '日内瓦',
          'Seoul': '首尔',
          'Bangkok': '曼谷',
          'Kuala Lumpur': '吉隆坡',
          'Jakarta': '雅加达',
          'Manila': '马尼拉',
          'Hanoi': '河内',
          'Ho Chi Minh City': '胡志明市',
          'Dubai': '迪拜',
          'Abu Dhabi': '阿布扎比',
          'Doha': '多哈',
          'Cairo': '开罗',
          'Johannesburg': '约翰内斯堡',
          'Cape Town': '开普敦',
          'Nairobi': '内罗毕',
          'Mexico City': '墨西哥城',
          'Sao Paulo': '圣保罗',
          'Rio de Janeiro': '里约热内卢',
          'Buenos Aires': '布宜诺斯艾利斯',
          'Santiago': '圣地亚哥',
          'Lima': '利马'
        };

        // 尝试直接匹配
        if (locationMap[englishDestination]) {
          destination = locationMap[englishDestination];
        } else {
          // 如果没有直接匹配，尝试查找部分匹配
          for (const [en, zh] of Object.entries(locationMap)) {
            if (englishDestination.includes(en)) {
              destination = englishDestination.replace(en, zh);
              break;
            }
          }

          // 如果仍然没有匹配，使用英文地点
          if (!destination) {
            destination = englishDestination;
          }
        }
      }
    }

    // 时长 - 优先使用对应语言的值
    let duration = currentLanguage === 'en'
      ? program.duration_en || program.duration
      : program.duration_zh || program.duration;

    // 检查是否包含中文字符，如果当前是中文模式但duration是英文，则尝试转换
    if (currentLanguage === 'zh' && duration && !(/[\u4e00-\u9fa5]/.test(duration))) {
      // 将英文时长转为中文时长的简单逻辑
      if (duration.includes('week')) {
        const weeks = duration.replace(/[^0-9]/g, '');
        duration = `${weeks}周`;
      } else if (duration.includes('day')) {
        const days = duration.replace(/[^0-9]/g, '');
        duration = `${days}天`;
      }
    }

    // 年级水平 - 根据语言选择合适的年级显示
    let gradeLevel = '';

    console.log('Processing grade levels in ProgramInfoSidebar:', {
      en: program.grade_level_en,
      zh: program.grade_level_zh,
      generic: program.grade_levels
    });

    if (currentLanguage === 'en' && program.grade_level_en?.length) {
      // 英文环境，有英文年级水平
      gradeLevel = program.grade_level_en.join(', ');
    } else if (currentLanguage === 'en' && program.grade_level_zh?.length) {
      // 英文环境，没有英文年级水平，但有中文年级水平
      gradeLevel = program.grade_level_zh.join(', ');
    } else if (currentLanguage === 'en' && program.grade_levels?.length) {
      // 英文环境，没有专用字段，但有通用字段
      gradeLevel = findSuitableGradeLevel(program.grade_levels, true);
    } else {
      // 中文环境
      if (program.grade_level_zh && program.grade_level_zh.length > 0) {
        // 中文环境，有中文年级水平，确保解码Unicode编码
        const processedLevels = program.grade_level_zh.map(level => {
          console.log('处理中文年级:', level);

          // 处理含有分隔符的情况
          if (level.includes('；') || level.includes(';')) {
            const parts = level.split(/[;；]/);
            return parts.map(part => decodeIfUnicode(part.trim())).join('，');
          }

          return decodeIfUnicode(level);
        });

        gradeLevel = processedLevels.join(', ');
        console.log('最终中文年级显示:', gradeLevel);
      } else if (program.grade_level_en && program.grade_level_en.length > 0) {
        // 中文环境，没有中文年级水平，但有英文年级水平，尝试转换
        const processedLevels = program.grade_level_en.map(level => {
          console.log('将英文年级转换为中文:', level);
          if (level === 'Elementary School') return '小学';
          if (level === 'Middle School') return '初中';
          if (level === 'High School') return '高中';
          if (level === 'University') return '大学';
          return level;
        });

        gradeLevel = processedLevels.join(', ');
        console.log('转换后的年级显示:', gradeLevel);
      } else if (program.grade_levels && program.grade_levels.length > 0) {
        // 中文环境，没有专用字段，但有通用字段
        gradeLevel = findSuitableGradeLevel(program.grade_levels, false);
      } else {
        // 没有任何年级水平信息
        gradeLevel = '';
      }
    }

    // 营期和截止日期
    const campPeriod = currentLanguage === 'en'
      ? program.camp_period_en || program.camp_period || ''
      : program.camp_period_zh || program.camp_period || '';

    const deadline = program.deadline || '';

    return { programType, destination, duration, gradeLevel, campPeriod, deadline };
  };

  // 解码Unicode编码字符串的新函数
  const decodeIfUnicode = (text: string): string => {
    if (!text) return '';

    console.log('尝试解码:', text);

    // 检查是否是Unicode编码（如 u5c0fu5b66）
    if (text === 'u5c0fu5b66') {
      return '小学';
    } else if (text === 'u521du4e2d') {
      return '初中';
    } else if (text === 'u9ad8u4e2d') {
      return '高中';
    }

    // 尝试使用正则表达式解码连续的Unicode编码
    if (text.includes('u') && /u[0-9a-f]{4,}/i.test(text)) {
      let result = text;

      // 替换所有的Unicode编码
      const unicodePattern = /u([0-9a-f]{4,})/gi;
      result = result.replace(unicodePattern, (match, hexCode) => {
        try {
          const codePoint = parseInt(hexCode, 16);
          if (isNaN(codePoint)) return match;
          return String.fromCodePoint(codePoint);
        } catch (e) {
          console.error('解码失败:', match, e);
          return match;
        }
      });

      console.log(`解码结果: ${text} -> ${result}`);
      return result;
    }

    return text;
  };

  // 辅助函数：根据语言找到合适的年级
  const findSuitableGradeLevel = (gradeLevels: string[], isEnglish: boolean): string => {
    if (!gradeLevels || gradeLevels.length === 0) {
      return '';
    }

    console.log('查找年级水平，原始列表:', gradeLevels);

    // 处理可能的Unicode编码字符串
    const decodedLevels = gradeLevels.map(level => {
      if (!level) return '';

      // 如果是中文模式，尝试解码可能的Unicode
      if (!isEnglish) {
        return decodeIfUnicode(level);
      }

      return level;
    });

    console.log('处理后的年级水平列表:', decodedLevels);

    // 英文环境查找英文年级，中文环境查找中文年级
    const suitable = isEnglish
      ? decodedLevels.find(level => /[a-zA-Z]/.test(level))
      : decodedLevels.find(level => /[\u4e00-\u9fa5]/.test(level));

    // 找不到合适的就用第一个
    return suitable || decodedLevels[0] || '';
  };

  const { programType, destination, duration, gradeLevel, campPeriod, deadline } = getProgramContent();

  return (
    <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg h-fit">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">{t.programInfo}</h2>
      <div className="space-y-4">
        {/* 地点 */}
        <InfoItem
          label={t.destination}
          value={destination}
          icon={<MapPin className="h-5 w-5" />}
        />

        {/* 时长 */}
        <InfoItem
          label={t.duration}
          value={duration}
          icon={<Clock className="h-5 w-5" />}
        />

        {/* 年级水平 */}
        <InfoItem
          label={t.gradeLevel}
          value={gradeLevel}
          icon={<BookOpen className="h-5 w-5" />}
        />

        {/* 营期 */}
        {campPeriod && (
          <InfoItem
            label={t.campPeriod}
            value={campPeriod}
            icon={<Calendar className="h-5 w-5" />}
          />
        )}

        {/* 截止日期 */}
        {deadline && (
          <InfoItem
            label={t.deadline}
            value={deadline}
            isDeadline={true}
            icon={<Timer className="h-5 w-5" />}
          />
        )}

        {/* 项目类型 - 移动到最后 */}
        <InfoItem
          label={t.programType}
          value={programType}
          icon={<Tag className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default ProgramInfoSidebar;
