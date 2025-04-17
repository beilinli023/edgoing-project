# PartnerUniversitiesSection 组件

## 组件概述

`PartnerUniversitiesSection` 是一个用于展示教育机构合作大学信息的React组件。该组件支持分页浏览、多语言显示，并在右侧显示"更多大学准备中"的提示块。

## 技术特点

- 支持中英文双语切换
- 分页功能，支持自定义每页显示数量
- 响应式布局，适配不同屏幕尺寸
- 使用Tailwind CSS进行样式设计

## 组件属性

| 属性名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| universities | PartnerUniversity[] | 是 | 合作大学数组，包含所有要显示的大学信息 |

### PartnerUniversity 类型定义

```typescript
interface PartnerUniversity {
  id: number;
  name_en: string;
  name_zh: string;
  location_en: string;
  location_zh: string;
  programs_en: string[];
  programs_zh: string[];
  image: string;
}
```

## 使用示例

```tsx
import { PartnerUniversitiesSection } from '@/components/frontend/study-abroad/PartnerUniversitiesSection';

// 使用示例
const universities = [
  { 
    id: 1, 
    name_en: 'Harvard University', 
    name_zh: '哈佛大学', 
    location_en: 'United States', 
    location_zh: '美国', 
    programs_en: ['Business', 'Law'], 
    programs_zh: ['商业', '法律'], 
    image: '/images/harvard.png' 
  },
  { 
    id: 2, 
    name_en: 'Oxford University', 
    name_zh: '牛津大学', 
    location_en: 'United Kingdom', 
    location_zh: '英国', 
    programs_en: ['Literature', 'Science'], 
    programs_zh: ['文学', '科学'], 
    image: '/images/oxford.png' 
  },
];

// 在组件中使用
function StudyAbroadPage() {
  return (
    <div>
      <h1>Study Abroad</h1>
      <PartnerUniversitiesSection universities={universities} />
    </div>
  );
}
```

## 组件内部结构

1. **标题区域** - 显示"合作大学"标题和描述文本
2. **大学卡片区域** - 展示当前页的大学卡片
3. **提示块** - 右侧显示"更多大学准备中"提示
4. **分页控制区** - 底部的分页导航按钮

## 注意事项

- 组件内部已处理空数据情况，但建议传入非空的大学数组以获得最佳显示效果
- 组件使用`useLanguage` hook获取当前语言环境，确保应用中已设置语言上下文
- 分页默认每页显示3所大学，可通过修改`universitiesPerPage`变量调整

## 相关组件

- `PartnerUniversityCard` - 用于显示单个大学卡片
- `PartnerUniversityListItem` - 用于列表形式显示大学信息

## 维护与扩展

当需要修改组件时，请注意以下几点：

1. 保持多语言支持，所有文本都应有中英文版本
2. 分页逻辑位于组件顶部，可根据需要调整
3. 样式使用Tailwind CSS类，遵循项目的设计规范
