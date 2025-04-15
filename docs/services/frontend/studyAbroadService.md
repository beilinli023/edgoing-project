# 留学服务模块 (studyAbroadService)

## 模块概述

`studyAbroadService` 是一个提供留学相关数据服务的模块，负责获取和处理留学页面所需的所有数据，包括合作大学信息、留学优势等内容。该模块支持多语言，可根据语言参数返回对应语言的内容。

## 主要功能

- 获取留学页面所需的全部内容数据
- 处理大学数据的获取和转换
- 提供留学优势相关信息
- 支持中英文双语内容

## API 接口

### getStudyAbroadContent

获取留学页面内容，包括标题、描述、合作大学和留学优势等数据。

#### 参数

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| language | 'en' \| 'zh' | 是 | 语言选项，支持英文(en)或中文(zh) |

#### 返回值

返回一个 Promise，解析为 `StudyAbroadPageContent` 类型的对象，包含所有留学页面内容。

```typescript
interface StudyAbroadPageContent {
  title: string;
  description: string;
  universities: PartnerUniversity[];
  benefits: StudyAbroadBenefit[];
}
```

#### 示例

```typescript
// 获取中文版留学页面内容
const contentZh = await getStudyAbroadContent('zh');

// 获取英文版留学页面内容
const contentEn = await getStudyAbroadContent('en');
```

## 数据处理流程

1. 调用 `getAllUniversities()` 获取所有大学数据
2. 将大学数据转换为前端所需的 `PartnerUniversity` 类型
3. 处理可能的数据缺失情况，确保返回有效数据
4. 添加预定义的留学优势数据
5. 根据语言参数返回相应的标题和描述

## 错误处理

该服务包含完善的错误处理机制：

- 当大学数据为空时，会使用空数组代替，避免前端渲染错误
- 使用 try-catch 捕获数据获取过程中可能出现的异常
- 记录详细的错误日志，便于调试

## 依赖关系

- `universityService` - 用于获取大学数据
- `StudyAbroadPageContent`, `PartnerUniversity`, `StudyAbroadBenefit` 类型定义

## 使用场景

该服务主要在以下场景中使用：

1. 留学页面初始加载时获取所有必要数据
2. 用户切换语言时重新获取对应语言的内容
3. 管理后台更新留学相关内容后刷新数据

## 注意事项

- 确保 `public/content/universities/` 目录下有正确格式的大学数据文件
- 服务内部已处理数据缺失情况，但建议保持数据完整性
- 添加新的留学优势时，需要同时提供中英文内容
