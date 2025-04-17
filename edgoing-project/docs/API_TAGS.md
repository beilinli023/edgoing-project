# EdGoing API 文档

## 概述

本文档提供了 EdGoing 网站的 API 接口详细信息，包括 Strapi CMS API、Express 中间层和前端服务之间的集成关系。文档详细说明了每个 API 端点的功能、参数、响应格式以及字段属性。

## 架构概述

EdGoing 网站采用了三层架构：

1. **前端层**：React 应用，使用 TypeScript 和 React Query 进行状态管理
2. **中间层**：Express 服务器，充当前端和 CMS 之间的桥梁
3. **后端层**：Strapi CMS，提供内容管理和 API 服务

数据流程如下：

```
前端 (React) → 前端服务 (TypeScript) → Express 中间层 → Strapi CMS API → 数据库
```

## 主要内容类型

Strapi CMS 中定义了以下主要内容类型：

### 1. 项目 (Program)

#### Strapi CMS 数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Integer | 项目唯一标识符 |
| title | String | 项目标题（根据 locale 显示对应语言） |
| description | Text | 项目描述（根据 locale 显示对应语言） |
| cover_image | Media | 项目封面图片 |
| gallery_images | Media[] | 项目图片画廊 |
| programtypes | Relation[] | 项目类型关联 |
| grades | Relation[] | 年级水平关联 |
| destinations | Relation[] | 目的地关联 |
| countries | Relation[] | 国家关联 |
| camp_period | String | 营期时间 |
| deadline | String | 申请截止日期 |
| display_order | Integer | 显示顺序（用于首页特色项目） |
| documentId | String | 多语言关联ID |
| locale | String | 语言代码 (en/zh) |
| localizations | Relation[] | 其他语言版本关联 |
| created_at | Timestamp | 创建时间 |
| updated_at | Timestamp | 最后更新时间 |

#### Express 中间层转换后的数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | String | 项目唯一标识符 |
| title_en | String | 项目英文标题 |
| title_zh | String | 项目中文标题 |
| slug | String | URL友好名称（如果有） |
| program_id | String | 项目ID（如果有） |
| image | String | 项目封面图片URL |
| gallery_images | String[] | 项目图片画廊URL数组 |
| program_type_en | String[] | 项目类型英文名称数组 |
| program_type_zh | String[] | 项目类型中文名称数组 |
| grade_level_en | String[] | 年级水平英文名称数组 |
| grade_level_zh | String[] | 年级水平中文名称数组 |
| destination_en | String | 目的地英文名称 |
| destination_zh | String | 目的地中文名称 |
| duration_en | String | 项目时长英文 |
| duration_zh | String | 项目时长中文 |
| camp_period | String | 营期时间 |
| camp_period_en | String | 营期时间英文 |
| camp_period_zh | String | 营期时间中文 |
| deadline | String | 申请截止日期 |
| display_order | Number | 显示顺序（用于首页特色项目）

### 2. 博客文章 (Blog Post)

#### Strapi CMS 数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Integer | 博客文章唯一标识符 |
| title | String | 博客文章标题（根据 locale 显示对应语言） |
| content | Text | 博客文章内容（根据 locale 显示对应语言） |
| slug | String | URL友好名称，唯一 |
| image | Media | 博客文章封面图片 |
| author | String | 作者名称 |
| publishedAt | Date | 发布日期 |
| Date | Date | 文章日期 |
| grade | Relation[] | 年级关联 |
| programtype | Relation[] | 项目类型关联 |
| Slideshow | Media[] | 幻灯片图片 |
| documentId | String | 多语言关联ID |
| locale | String | 语言代码 (en/zh) |
| localizations | Relation[] | 其他语言版本关联 |
| created_at | Timestamp | 创建时间 |
| updated_at | Timestamp | 最后更新时间 |

#### Express 中间层转换后的数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | String | 博客文章唯一标识符 |
| title_en | String | 博客文章英文标题 |
| title_zh | String | 博客文章中文标题 |
| content_en | Text | 博客文章英文内容 |
| content_zh | Text | 博客文章中文内容 |
| slug | String | URL友好名称 |
| featured_image | String | 博客文章封面图片URL |
| slideshow | Array<{url: string}> | 幻灯片图片URL数组 |
| authorName | String | 作者名称 |
| publishedAt | String | 发布日期 |
| grade_en | String | 年级英文名称 |
| grade_zh | String | 年级中文名称 |
| program_type_en | String | 项目类型英文名称 |
| program_type_zh | String | 项目类型中文名称 |
| documentId | String | 多语言关联ID

### 3. 大学 (University)

#### Strapi CMS 数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Integer | 大学唯一标识符 |
| name | String | 大学名称（根据 locale 显示对应语言） |
| description | Text | 大学描述（根据 locale 显示对应语言） |
| logo | Media | 大学标志 |
| cover_image | Media | 大学封面图片 |
| country | Relation | 国家关联 |
| city | String | 城市 |
| website | String | 官方网站 |
| ranking | Integer | 排名 |
| documentId | String | 多语言关联ID |
| locale | String | 语言代码 (en/zh) |
| localizations | Relation[] | 其他语言版本关联 |
| created_at | Timestamp | 创建时间 |
| updated_at | Timestamp | 最后更新时间 |

#### Express 中间层转换后的数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | String | 大学唯一标识符 |
| name_en | String | 大学英文名称 |
| name_zh | String | 大学中文名称 |
| description_en | Text | 大学英文描述 |
| description_zh | Text | 大学中文描述 |
| logo | String | 大学标志URL |
| cover_image | String | 大学封面图片URL |
| country_en | String | 国家英文名称 |
| country_zh | String | 国家中文名称 |
| city | String | 城市 |
| website | String | 官方网站 |
| ranking | Number | 排名 |
| documentId | String | 多语言关联ID

### 4. 表单提交 (Form Submission)

#### Strapi CMS 数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Integer | 表单提交唯一标识符 |
| name | String | 提交者姓名 |
| email | String | 提交者邮箱 |
| phone | String | 提交者电话 |
| message | Text | 提交的消息内容 |
| form_type | String | 表单类型 |
| preferred_language | String | 首选语言 |
| interested_programs | JSON | 感兴趣的项目 |
| student_grade | String | 学生年级 |
| submission_time | Timestamp | 提交时间 |
| created_at | Timestamp | 创建时间 |
| updated_at | Timestamp | 最后更新时间 |

#### Express 中间层转换后的数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | String | 表单提交唯一标识符 |
| name | String | 提交者姓名 |
| email | String | 提交者邮箱 |
| phone | String | 提交者电话 |
| message | String | 提交的消息内容 |
| form_type | String | 表单类型 |
| preferred_language | String | 首选语言 |
| interested_programs | String[] | 感兴趣的项目 |
| student_grade | String | 学生年级 |
| submission_time | String | 提交时间 |

### 5. 邮件订阅 (Newsletter Subscription)

#### Strapi CMS 数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | Integer | 订阅唯一标识符 |
| email | String | 订阅者邮箱 |
| status | String | 订阅状态 |
| subscription_date | Timestamp | 订阅日期 |
| created_at | Timestamp | 创建时间 |
| updated_at | Timestamp | 最后更新时间 |

#### Express 中间层转换后的数据结构

| 字段名 | 类型 | 描述 |
|-------|------|------|
| id | String | 订阅唯一标识符 |
| email | String | 订阅者邮箱 |
| status | String | 订阅状态 |
| subscription_date | String | 订阅日期

## API 集成架构

系统的 API 集成采用了以下架构：

1. **Strapi CMS API**：提供原始数据的 RESTful API
   - 基础URL：`http://localhost:1337/api`
   - 使用 `locale` 参数指定语言
   - 使用 `populate` 参数加载关联字段

2. **Express 中间层**：将 Strapi API 转换为前端可用的格式
   - 基础URL：`http://localhost:3001/api`
   - 处理多语言内容合并
   - 转换数据结构为前端友好格式

3. **前端服务**：封装 API 调用逻辑
   - 使用 Axios 进行 HTTP 请求
   - 使用 React Query 管理状态和缓存
   - 提供类型安全的数据访问

### 多语言支持

系统采用了多层次的多语言支持机制：

1. **Strapi CMS 层面**
   - 使用 `locale` 查询参数指定语言（例如 `?locale=zh`）
   - 每个内容类型都有 `documentId` 字段关联不同语言版本
   - 使用 `localizations` 字段存储其他语言版本的关联

2. **Express 中间层**
   - 接收 `language` 参数（默认为 'en'）
   - 将 Strapi 的 `locale` 参数映射为前端的 `language` 参数
   - 处理关联字段的多语言版本，如 `programtypes`、`grades` 等
   - 将字段转换为前端友好的格式，例如 `title_en`、`title_zh`

3. **前端层面**
   - 使用 `LanguageContext` 管理当前语言
   - 根据当前语言选择相应的字段（例如 `title_en` 或 `title_zh`）
   - 在 API 请求中传递 `language` 参数

## API 端点

以下是主要 API 端点的详细信息，包括 Strapi 原始 API、Express 中间层和前端调用方式。

### 1. 项目 API

#### 1.1 获取项目列表

**Strapi API:**
```
GET http://localhost:1337/api/programs?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/programs
```

**前端服务:**
```typescript
// src/services/frontend/programService.ts
export const getPrograms = async (params = {}) => {
  const response = await apiClient.get('/api/programs', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useProgram.ts
export const usePrograms = (params = {}) => {
  return useQuery(['programs', params], () => getPrograms(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| page | Number | 否 | 页码，默认为 1 |
| pageSize | Number | 否 | 每页数量，默认为 6 |
| programType | String | 否 | 按项目类型过滤 |
| gradeLevel | String | 否 | 按年级水平过滤 |
| destination | String | 否 | 按目的地过滤 |
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "data": [
    {
      "id": "1",
      "title_en": "Summer Camp in Singapore",
      "title_zh": "新加坡夏令营",
      "slug": "summer-camp-singapore",
      "program_id": "SG2023",
      "image": "https://example.com/images/program1.jpg",
      "program_type_en": ["Summer Camp"],
      "program_type_zh": ["夏令营"],
      "grade_level_en": ["Middle School"],
      "grade_level_zh": ["初中"],
      "destination_en": "Singapore",
      "destination_zh": "新加坡",
      "duration_en": "2 weeks",
      "duration_zh": "2周",
      "camp_period": "2025-07-01 to 2025-07-15",
      "camp_period_en": "July 1-15, 2025",
      "camp_period_zh": "2025年7月1日-15日",
      "deadline": "2025-05-01",
      "display_order": 1
    },
    // ...更多项目
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 6,
      "pageCount": 3,
      "total": 15
    }
  }
}
```

#### 1.2 获取单个项目详情

**Strapi API:**
```
GET http://localhost:1337/api/programs?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/programs/:id
```

**前端服务:**
```typescript
// src/services/frontend/programService.ts
export const getProgramById = async (id, params = {}) => {
  const response = await apiClient.get(`/api/programs/${id}`, { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useProgram.ts
export const useProgram = (id, params = {}) => {
  return useQuery(['program', id, params], () => getProgramById(id, params));
};
```

**路径参数:**

| 参数名 | 类型 | 描述 |
|-------|------|------|
| id | String | 项目 ID |

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "id": "1",
  "title_en": "Summer Camp in Singapore",
  "title_zh": "新加坡夏令营",
  "slug": "summer-camp-singapore",
  "program_id": "SG2023",
  "image": "https://example.com/images/program1.jpg",
  "gallery_images": [
    "https://example.com/images/gallery1.jpg",
    "https://example.com/images/gallery2.jpg"
  ],
  "program_type_en": ["Summer Camp"],
  "program_type_zh": ["夏令营"],
  "grade_level_en": ["Middle School"],
  "grade_level_zh": ["初中"],
  "destination_en": "Singapore",
  "destination_zh": "新加坡",
  "duration_en": "2 weeks",
  "duration_zh": "2周",
  "camp_period": "2025-07-01 to 2025-07-15",
  "camp_period_en": "July 1-15, 2025",
  "camp_period_zh": "2025年7月1日-15日",
  "deadline": "2025-05-01",
  "display_order": 1
}
```

#### 1.3 获取项目筛选选项

**Strapi API:**
```
GET http://localhost:1337/api/programtypes?locale=[en|zh]&populate=*
GET http://localhost:1337/api/grades?locale=[en|zh]&populate=*
GET http://localhost:1337/api/destinations?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/programs/filters
```

**前端服务:**
```typescript
// src/services/frontend/programService.ts
export const getProgramFilters = async (params = {}) => {
  const response = await apiClient.get('/api/programs/filters', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useProgram.ts
export const useProgramFilters = (params = {}) => {
  return useQuery(['programFilters', params], () => getProgramFilters(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "programTypes": [
    { "id": "1", "programname_en": "Summer Camp", "programname_zh": "夏令营" },
    { "id": "2", "programname_en": "Academic Program", "programname_zh": "学术项目" },
    { "id": "3", "programname_en": "Language Program", "programname_zh": "语言项目" }
  ],
  "gradeLevels": [
    { "id": "1", "gradename_en": "Elementary School", "gradename_zh": "小学" },
    { "id": "2", "gradename_en": "Middle School", "gradename_zh": "初中" },
    { "id": "3", "gradename_en": "High School", "gradename_zh": "高中" }
  ],
  "destinations": [
    { "id": "1", "city_en": "Singapore", "city_zh": "新加坡" },
    { "id": "2", "city_en": "London", "city_zh": "伦敦" },
    { "id": "3", "city_en": "New York", "city_zh": "纽约" }
  ],
  "countries": [
    { "id": "1", "countryname_en": "Singapore", "countryname_zh": "新加坡" },
    { "id": "2", "countryname_en": "United Kingdom", "countryname_zh": "英国" },
    { "id": "3", "countryname_en": "United States", "countryname_zh": "美国" }
  ]
}
```

#### 1.4 获取项目页面 Hero 数据

**Strapi API:**
```
GET http://localhost:1337/api/program-hero?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/programs/hero
```

**前端服务:**
```typescript
// src/services/frontend/programService.ts
export const getProgramHero = async (params = {}) => {
  const response = await apiClient.get('/api/programs/hero', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useProgram.ts
export const useProgramHero = (params = {}) => {
  return useQuery(['programHero', params], () => getProgramHero(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "title_en": "Educational Travel Programs",
  "title_zh": "教育旅行项目",
  "subtitle_en": "Explore our programs designed for students of all ages",
  "subtitle_zh": "探索为各年龄段学生设计的项目",
  "image": "https://example.com/images/program-hero.jpg",
  "theme": "light"
}
```

### 2. 博客 API

#### 2.1 获取博客文章列表

**Strapi API:**
```
GET http://localhost:1337/api/blog-posts?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/blog
```

**前端服务:**
```typescript
// src/services/frontend/blogService.ts
export const getBlogPosts = async (params = {}) => {
  const response = await apiClient.get('/api/blog', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useBlog.ts
export const useBlogPosts = (params = {}) => {
  return useQuery(['blogPosts', params], () => getBlogPosts(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| page | Number | 否 | 页码，默认为 1 |
| limit | Number | 否 | 每页数量，默认为 6 |
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "posts": [
    {
      "id": "1",
      "documentId": "blog-post-1",
      "title_en": "How to Prepare for Study Abroad",
      "title_zh": "如何准备留学",
      "slug": "how-to-prepare-for-study-abroad",
      "publishedAt": "2025-01-15T00:00:00.000Z",
      "authorName": "John Doe",
      "featured_image": "https://example.com/images/blog1.jpg",
      "content_en": "<p>Essential tips for students preparing to study abroad...</p>",
      "content_zh": "<p>为准备留学的学生提供的必要提示...</p>",
      "slideshow": [
        { "url": "https://example.com/images/slide1.jpg" },
        { "url": "https://example.com/images/slide2.jpg" }
      ],
      "grade_en": "High School",
      "grade_zh": "高中",
      "program_type_en": "Summer Camp",
      "program_type_zh": "夏令营"
    },
    // ...更多博客文章
  ],
  "totalPages": 3,
  "totalPosts": 15
}
```

#### 2.2 获取博客文章详情

**Strapi API:**
```
GET http://localhost:1337/api/blog-posts?locale=[en|zh]&filters[slug][$eq]=:slug&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/blog/:slug
```

**前端服务:**
```typescript
// src/services/frontend/blogService.ts
export const getBlogPostBySlug = async (slug, params = {}) => {
  const response = await apiClient.get(`/api/blog/${slug}`, { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useBlog.ts
export const useBlogPost = (slug, params = {}) => {
  return useQuery(['blogPost', slug, params], () => getBlogPostBySlug(slug, params));
};
```

**路径参数:**

| 参数名 | 类型 | 描述 |
|-------|------|------|
| slug | String | 博客文章的 slug |

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "id": "1",
  "documentId": "blog-post-1",
  "title_en": "How to Prepare for Study Abroad",
  "title_zh": "如何准备留学",
  "slug": "how-to-prepare-for-study-abroad",
  "publishedAt": "2025-01-15T00:00:00.000Z",
  "authorName": "John Doe",
  "featured_image": "https://example.com/images/blog1.jpg",
  "content_en": "<p>Studying abroad is an exciting opportunity...</p>",
  "content_zh": "<p>留学是一个令人兴奋的机会...</p>",
  "slideshow": [
    { "url": "https://example.com/images/slide1.jpg" },
    { "url": "https://example.com/images/slide2.jpg" }
  ],
  "grade_en": "High School",
  "grade_zh": "高中",
  "program_type_en": "Summer Camp",
  "program_type_zh": "夏令营"
}
```

#### 2.3 测试 Strapi 连接

**Express 中间层:**
```
GET http://localhost:3001/api/blog/test-strapi
```

**成功响应:**

```json
{
  "success": true,
  "message": "Successfully connected to Strapi API",
  "timestamp": "2023-06-01T12:34:56.789Z"
}
```

#### 2.4 获取原始 Strapi 响应

**Express 中间层:**
```
GET http://localhost:3001/api/blog/raw-strapi
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| locale | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "How to Prepare for Study Abroad",
        "content": "<p>Studying abroad is an exciting opportunity...</p>",
        "slug": "how-to-prepare-for-study-abroad",
        "publishedAt": "2025-01-15T00:00:00.000Z",
        "author": "John Doe",
        "createdAt": "2023-06-01T12:34:56.789Z",
        "updatedAt": "2023-06-01T12:34:56.789Z",
        "locale": "en",
        "documentId": "blog-post-1"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### 3. 表单 API

#### 3.1 提交表单数据

**Strapi API:**
```
POST http://localhost:1337/api/form-submissions
```

**Express 中间层:**
```
POST http://localhost:3001/api/form-submissions
```

**前端服务:**
```typescript
// src/services/frontend/formService.ts
export const submitForm = async (formData) => {
  const response = await apiClient.post('/api/form-submissions', formData);
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useForms.ts
export const useFormSubmission = () => {
  return useMutation((formData) => submitForm(formData));
};
```

**请求体:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in the Summer Camp program.",
  "form_type": "contact",
  "preferred_language": "en",
  "interested_programs": ["Summer Camp", "Language Program"],
  "student_grade": "High School",
  "submission_time": "2023-06-01T12:34:56.789Z"
}
```

**成功响应:**

```json
{
  "id": "1",
  "success": true,
  "message": "Form submitted successfully"
}
```

#### 3.2 邮件订阅

**Strapi API:**
```
POST http://localhost:1337/api/newsletter-subscriptions
```

**Express 中间层:**
```
POST http://localhost:3001/api/newsletter-subscriptions
```

**前端服务:**
```typescript
// src/services/frontend/formService.ts
export const subscribeNewsletter = async (email) => {
  const response = await apiClient.post('/api/newsletter-subscriptions', { email });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useForms.ts
export const useNewsletterSubscription = () => {
  return useMutation((email) => subscribeNewsletter(email));
};
```

**请求体:**

```json
{
  "email": "john@example.com"
}
```

**成功响应:**

```json
{
  "id": "1",
  "success": true,
  "message": "Subscription successful",
  "email": "john@example.com",
  "status": "active",
  "subscription_date": "2023-06-01T12:34:56.789Z"
}
```

### 4. 留学页面 API

#### 4.1 获取留学页面内容

**Strapi API:**
```
GET http://localhost:1337/api/studyabroad-hero?locale=[en|zh]&populate=*
GET http://localhost:1337/api/studyabroad-content?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/study-abroad
```

**前端服务:**
```typescript
// src/services/frontend/studyAbroadService.ts
export const getStudyAbroadContent = async (params = {}) => {
  const response = await apiClient.get('/api/study-abroad', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useStudyAbroad.ts
export const useStudyAbroadContent = (params = {}) => {
  return useQuery(['studyAbroadContent', params], () => getStudyAbroadContent(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "hero": {
    "title_en": "Study Abroad Experience",
    "title_zh": "留学体验",
    "subtitle_en": "Expand your horizons with international education",
    "subtitle_zh": "通过国际教育拓展视野",
    "image": "https://example.com/images/study-abroad-hero.jpg",
    "theme": "light"
  },
  "content": {
    "intro_en": "<p>Our study abroad programs offer students the opportunity to...</p>",
    "intro_zh": "<p>我们的留学项目为学生提供了机会...</p>",
    "benefits": [
      {
        "title_en": "Global Perspective",
        "title_zh": "全球视野",
        "description_en": "Gain a broader understanding of the world",
        "description_zh": "获得对世界更广泛的理解",
        "icon": "globe"
      },
      // ...更多目录
    ],
    "featured_universities": [
      {
        "id": "1",
        "name_en": "National University of Singapore",
        "name_zh": "新加坡国立大学",
        "logo": "https://example.com/images/nus-logo.png",
        "country_en": "Singapore",
        "country_zh": "新加坡"
      },
      // ...更多大学
    ]
  }
}
```

#### 4.2 获取合作大学列表

**Strapi API:**
```
GET http://localhost:1337/api/universities?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/university
```

**前端服务:**
```typescript
// src/services/frontend/universityService.ts
export const getUniversities = async (params = {}) => {
  const response = await apiClient.get('/api/university', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useUniversity.ts
export const useUniversities = (params = {}) => {
  return useQuery(['universities', params], () => getUniversities(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| page | Number | 否 | 页码，默认为 1 |
| pageSize | Number | 否 | 每页数量，默认为 6 |
| country | String | 否 | 按国家过滤 |
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "universities": [
    {
      "id": "1",
      "name_en": "National University of Singapore",
      "name_zh": "新加坡国立大学",
      "logo": "https://example.com/images/nus-logo.png",
      "cover_image": "https://example.com/images/nus-cover.jpg",
      "description_en": "A leading global university centered in Asia...",
      "description_zh": "一所以亚洲为中心的全球领先大学...",
      "country_en": "Singapore",
      "country_zh": "新加坡",
      "city": "Singapore",
      "ranking": 11,
      "website": "https://www.nus.edu.sg",
      "documentId": "university-1"
    },
    // ...更多大学
  ],
  "pagination": {
    "page": 1,
    "pageSize": 6,
    "pageCount": 2,
    "total": 10
  },
  "countries": [
    { "countryname_en": "Singapore", "countryname_zh": "新加坡", "count": 2 },
    { "countryname_en": "United Kingdom", "countryname_zh": "英国", "count": 3 },
    { "countryname_en": "United States", "countryname_zh": "美国", "count": 5 }
  ]
}
```

#### 4.3 获取大学详情

**Strapi API:**
```
GET http://localhost:1337/api/universities/:id?locale=[en|zh]&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/university/:id
```

**前端服务:**
```typescript
// src/services/frontend/universityService.ts
export const getUniversityById = async (id, params = {}) => {
  const response = await apiClient.get(`/api/university/${id}`, { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useUniversity.ts
export const useUniversity = (id, params = {}) => {
  return useQuery(['university', id, params], () => getUniversityById(id, params));
};
```

**路径参数:**

| 参数名 | 类型 | 描述 |
|-------|------|------|
| id | String | 大学 ID |

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "id": "1",
  "name_en": "National University of Singapore",
  "name_zh": "新加坡国立大学",
  "logo": "https://example.com/images/nus-logo.png",
  "cover_image": "https://example.com/images/nus-cover.jpg",
  "description_en": "A leading global university centered in Asia...",
  "description_zh": "一所以亚洲为中心的全球领先大学...",
  "country_en": "Singapore",
  "country_zh": "新加坡",
  "city": "Singapore",
  "ranking": 11,
  "website": "https://www.nus.edu.sg",
  "documentId": "university-1",
  "gallery_images": [
    "https://example.com/images/nus-gallery1.jpg",
    "https://example.com/images/nus-gallery2.jpg"
  ],
  "related_programs": [
    {
      "id": "1",
      "title_en": "Summer Camp in Singapore",
      "title_zh": "新加坡夏令营",
      "image": "https://example.com/images/program1.jpg",
      "slug": "summer-camp-singapore"
    }
  ]
}
```

### 5. 首页 API

#### 5.1 获取首页内容

**Strapi API:**
```
GET http://localhost:1337/api/home-heroes?locale=[en|zh]&populate=*
GET http://localhost:1337/api/programs?locale=[en|zh]&filters[display_order][$gt]=0&sort=display_order:asc&populate=*
```

**Express 中间层:**
```
GET http://localhost:3001/api/home
```

**前端服务:**
```typescript
// src/services/frontend/homeContentService.ts
export const getHomeContent = async (params = {}) => {
  const response = await apiClient.get('/api/home', { params });
  return response.data;
};
```

**React Hook:**
```typescript
// src/hooks/useHome.ts
export const useHomeContent = (params = {}) => {
  return useQuery(['homeContent', params], () => getHomeContent(params));
};
```

**查询参数:**

| 参数名 | 类型 | 必需 | 描述 |
|-------|------|------|------|
| language | String | 否 | 语言代码（en/zh），默认为 en |

**成功响应:**

```json
{
  "hero": {
    "slides": [
      {
        "id": "1",
        "title_en": "Discover Educational Travel Programs",
        "title_zh": "探索教育旅行项目",
        "subtitle_en": "Expand your horizons with international education",
        "subtitle_zh": "通过国际教育拓展视野",
        "imageUrl": "https://example.com/images/hero-slide1.jpg",
        "buttonText_en": "Explore Programs",
        "buttonText_zh": "探索项目",
        "buttonLink": "/programs"
      },
      // ...更多轮播图
    ]
  },
  "featuredPrograms": [
    {
      "id": "1",
      "title_en": "Summer Camp in Singapore",
      "title_zh": "新加坡夏令营",
      "slug": "summer-camp-singapore",
      "program_id": "SG2023",
      "image": "https://example.com/images/program1.jpg",
      "program_type_en": ["Summer Camp"],
      "program_type_zh": ["夏令营"],
      "destination_en": "Singapore",
      "destination_zh": "新加坡",
      "display_order": 1
    },
    {
      "id": "2",
      "title_en": "Academic Program in UK",
      "title_zh": "英国学术项目",
      "slug": "academic-program-uk",
      "program_id": "UK2023",
      "image": "https://example.com/images/program2.jpg",
      "program_type_en": ["Academic Program"],
      "program_type_zh": ["学术项目"],
      "destination_en": "United Kingdom",
      "destination_zh": "英国",
      "display_order": 2
    },
    {
      "id": "3",
      "title_en": "Language Program in US",
      "title_zh": "美国语言项目",
      "slug": "language-program-us",
      "program_id": "US2023",
      "image": "https://example.com/images/program3.jpg",
      "program_type_en": ["Language Program"],
      "program_type_zh": ["语言项目"],
      "destination_en": "United States",
      "destination_zh": "美国",
      "display_order": 3
    }
  ]
}
```

## 多语言实现细节

### documentId 关联机制

Strapi 中的多语言内容通过 `documentId` 字段关联不同语言版本的内容。每个内容类型都有以下字段：

- `documentId`: 唯一标识符，用于关联不同语言版本的内容
- `locale`: 语言代码（en/zh）
- `localizations`: 关联到其他语言版本的内容

当使用 `locale` 参数查询内容时，Strapi 会返回指定语言的内容。Express 中间层会处理这些数据，并将不同语言版本的字段合并到一个响应中，使用后缀区分（例如 `title_en` 和 `title_zh`）。

### 关联字段的多语言处理

对于关联字段（例如项目类型、年级水平、目的地等），Express 中间层会根据 `documentId` 查询不同语言版本的关联内容，并将它们合并到响应中。

例如，对于项目类型：

1. 首先获取项目及其关联的项目类型
2. 从关联的项目类型中提取 `documentId` 列表
3. 使用这些 `documentId` 查询中文和英文版本的项目类型
4. 将结果合并到响应中，使用 `program_type_en` 和 `program_type_zh` 字段

## 错误处理

API 可能返回以下错误状态码:

| 状态码 | 描述 |
|-------|------|
| 400 | 请求参数无效 |
| 401 | 未授权（管理员 API 需要认证） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应示例:**

```json
{
  "error": "Not Found",
  "message": "Requested resource does not exist",
  "statusCode": 404
}
```

## 结论

本文档提供了 EdGoing 网站的 API 接口详细信息，包括 Strapi CMS API、Express 中间层和前端服务之间的集成关系。通过这些 API，前端可以从 Strapi CMS 获取数据，并将其呈现给用户。

系统采用了三层架构，确保了数据的清晰分离和有效集成。Express 中间层负责将 Strapi 的原始数据转换为前端可用的格式，并处理多语言内容的集成。

所有 API 都支持多语言，通过 `locale` 参数和 `documentId` 关联机制实现。前端使用 React Query 管理数据状态，确保了高效的数据获取和缓存。

Strapi 中的多语言内容通过 `documentId` 字段关联不同语言版本的内容。每个内容类型都有以下字段：

- `documentId`: 唯一标识符，用于关联不同语言版本的内容
- `locale`: 语言代码（en/zh）
- `localizations`: 关联到其他语言版本的内容

当使用 `locale` 参数查询内容时，Strapi 会返回指定语言的内容。Express 中间层会处理这些数据，并将不同语言版本的字段合并到一个响应中，使用后缀区分（例如 `title_en` 和 `title_zh`）。

### 关联字段的多语言处理

对于关联字段（例如项目类型、年级水平、目的地等），Express 中间层会根据 `documentId` 查询不同语言版本的关联内容，并将它们合并到响应中。

例如，对于项目类型：

1. 首先获取项目及其关联的项目类型
2. 从关联的项目类型中提取 `documentId` 列表
3. 使用这些 `documentId` 查询中文和英文版本的项目类型
4. 将结果合并到响应中，使用 `program_type_en` 和 `program_type_zh` 字段

## 错误处理

API 可能返回以下错误状态码:

| 状态码 | 描述 |
|-------|------|
| 400 | 请求参数无效 |
| 401 | 未授权（管理员 API 需要认证） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

**错误响应示例:**

```json
{
  "error": "Not Found",
  "message": "Requested resource does not exist",
  "statusCode": 404
}
```

## 结论

本文档提供了 EdGoing 网站的 API 接口详细信息，包括 Strapi CMS API、Express 中间层和前端服务之间的集成关系。通过这些 API，前端可以从 Strapi CMS 获取数据，并将其呈现给用户。

系统采用了三层架构，确保了数据的清晰分离和有效集成。Express 中间层负责将 Strapi 的原始数据转换为前端可用的格式，并处理多语言内容的集成。

所有 API 都支持多语言，通过 `locale` 参数和 `documentId` 关联机制实现。前端使用 React Query 管理数据状态，确保了高效的数据获取和缓存。