# API 文档

本文档详细说明了CMS系统的API接口规范和集成方式。

## RESTful API 规范

### 基础端点
- GET /api/resource - 获取资源列表
- GET /api/resource/:id - 获取单个资源
- POST /api/resource - 创建资源
- PUT /api/resource/:id - 更新资源
- DELETE /api/resource/:id - 删除资源

### API 命名规范
- 路径：使用 kebab-case（例如：/api/content-types）
- 查询参数：camelCase（例如：?pageSize=10）
- 返回字段：camelCase（例如：{ createdAt, updatedAt }）

### 响应格式
```json
{
    "success": true,
    "data": {},
    "message": "操作成功",
    "code": 200
}
```

### 错误处理
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "错误信息"
    }
}
```

## 存储实现

系统支持两种存储实现方式：

1. **JSON文件存储**：简单易用，适合原型开发和小型应用
2. **PostgreSQL数据库存储**：高性能、高可靠性存储，适合生产环境

### 数据库模式

系统使用的PostgreSQL数据库模式如下：

#### 内容类型表 (content_types)

```sql
CREATE TABLE content_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  fields JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 标签表 (tags)

```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 分类表 (categories)

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(100) NOT NULL,
  name_zh VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  type VARCHAR(50) NOT NULL,
  parent_id INTEGER REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### 内容表 (contents)

```sql
CREATE TABLE contents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content_type_id INTEGER REFERENCES content_types(id),
  data JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE
);
```

#### 内容与标签关联表 (content_tags)

```sql
CREATE TABLE content_tags (
  content_id INTEGER REFERENCES contents(id),
  tag_id INTEGER REFERENCES tags(id),
  PRIMARY KEY (content_id, tag_id)
);
```

#### 内容与分类关联表 (content_categories)

```sql
CREATE TABLE content_categories (
  content_id INTEGER REFERENCES contents(id),
  category_id INTEGER REFERENCES categories(id),
  PRIMARY KEY (content_id, category_id)
);
```

## 内容 API

内容API提供对系统中所有内容项的CRUD功能。内容数据已集成到PostgreSQL数据库进行持久化存储。

### 数据模型

```typescript
interface Content {
  id: string;                // 唯一标识符
  type_id: string;           // 内容类型ID
  title: string;             // 内容标题
  slug: string;              // URL友好名称，唯一
  content: string;           // 内容正文
  excerpt: string;           // 内容摘要
  featured_image: string;    // 特色图片URL
  status: string;            // 状态：published, draft, archived
  category_ids: string[];    // 关联的分类ID数组
  tag_ids: string[];         // 关联的标签ID数组
  metadata: object;          // 元数据，如SEO信息
  created_at: string;        // 创建时间
  updated_at: string;        // 更新时间
  published_at: string;      // 发布时间
}
```

### 获取内容列表

```
GET /api/contents
```

**查询参数**:
- `typeId`: 按内容类型筛选
- `status`: 按状态筛选 (published, draft, archived)
- `categoryId`: 按分类筛选
- `tagId`: 按标签筛选
- `page`: 页码，默认1
- `limit`: 每页数量，默认10
- `sort`: 排序字段，默认created_at
- `order`: 排序方向，默认desc

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "type_id": "1",
      "title": "示例内容",
      "slug": "example-content",
      "content": "内容详情...",
      "excerpt": "内容摘要",
      "featured_image": "/images/example.jpg",
      "status": "published",
      "category_ids": ["1", "2"],
      "tag_ids": ["1", "3"],
      "metadata": {
        "seo": {
          "title": "SEO标题",
          "description": "SEO描述"
        }
      },
      "created_at": "2025-03-01T12:00:00Z",
      "updated_at": "2025-03-02T14:30:00Z",
      "published_at": "2025-03-02T14:30:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

### 获取单个内容

```
GET /api/contents/:id
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": "1",
    "type_id": "1",
    "title": "示例内容",
    "slug": "example-content",
    "content": "内容详情...",
    "excerpt": "内容摘要",
    "featured_image": "/images/example.jpg",
    "status": "published",
    "category_ids": ["1", "2"],
    "tag_ids": ["1", "3"],
    "metadata": {
      "seo": {
        "title": "SEO标题",
        "description": "SEO描述"
      }
    },
    "created_at": "2025-03-01T12:00:00Z",
    "updated_at": "2025-03-02T14:30:00Z",
    "published_at": "2025-03-02T14:30:00Z"
  }
}
```

### 按Slug获取内容

```
GET /api/contents/slug/:slug
```

### 创建内容

```
POST /api/contents
```

**请求体**:
```json
{
  "typeId": "1",
  "title": "新内容",
  "slug": "new-content",
  "content": "内容详情...",
  "excerpt": "内容摘要",
  "featuredImage": "/images/new.jpg",
  "status": "draft",
  "categoryIds": ["1", "2"],
  "tagIds": ["1", "3"],
  "metadata": {
    "seo": {
      "title": "SEO标题",
      "description": "SEO描述"
    }
  }
}
```

### 更新内容

```
PUT /api/contents/:id
```

### 删除内容

```
DELETE /api/contents/:id
```

### 更新内容状态

```
PATCH /api/contents/:id/status
```

**请求体**:
```json
{
  "status": "published"
}
```

### 内容搜索

```
GET /api/contents/search?query=关键词&typeId=1
```

## 标签 API

标签API提供对系统中所有标签的CRUD功能。标签数据已集成到PostgreSQL数据库进行持久化存储。

### 数据模型

```typescript
interface Tag {
  id: string;            // UUID标识符
  name_en: string;       // 英文名称
  name_zh: string;       // 中文名称
  slug: string;          // URL友好名称，唯一
  type: string;          // 标签类型
  created_at: string;    // 创建时间
  updated_at: string;    // 更新时间
}
```

### 获取所有标签

```
GET /api/tags
```

查询参数：
- `type`：可选，按标签类型过滤

响应示例：
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name_en": "Technology",
      "name_zh": "技术",
      "slug": "technology",
      "type": "blog",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ],
  "success": true
}
```

### 获取单个标签(按ID)

```
GET /api/tags/:id
```

### 获取单个标签(按Slug)

```
GET /api/tags/slug/:slug
```

### 创建标签

```
POST /api/tags
```

请求体：
```json
{
  "name_en": "Technology",
  "name_zh": "技术",
  "slug": "technology",
  "type": "blog"
}
```

### 更新标签

```
PUT /api/tags/:id
```

### 删除标签

```
DELETE /api/tags/:id
```

### 批量创建标签

```
POST /api/tags/batch
```

请求体：
```json
{
  "tags": [
    {
      "name_en": "Technology",
      "name_zh": "技术",
      "slug": "technology"
    },
    {
      "name_en": "Education",
      "name_zh": "教育",
      "slug": "education"
    }
  ],
  "type": "blog"
}
```

## 前端集成

### API调用封装
```typescript
const apiService = {
    get: async (url: string) => {
        const response = await fetch(url);
        return response.json();
    },
    post: async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    }
};

// 使用示例
const getContent = async (id: string) => {
    return apiService.get(`/api/contents/${id}`);
};
```

## 数据缓存

### Redis缓存示例
```typescript
const cacheService = {
    get: async (key: string) => {
        return redis.get(key);
    },
    set: async (key: string, value: any, ttl: number) => {
        return redis.set(key, value, 'EX', ttl);
    }
};
```
