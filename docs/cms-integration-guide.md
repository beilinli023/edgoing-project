
# YouNiKco 网站与 CMS 后台集成指南

## 概述

本文档提供了 YouNiKco 教育网站前端与内容管理系统 (CMS) 后台的集成指南。该指南适用于开发人员和网站管理员，详细说明了如何将前端页面与 CMS 管理的内容连接起来。

## 系统架构

YouNiKco 教育网站采用以下技术栈:

- **前端**: Next.js 15 (App Router), TypeScript, Tailwind CSS, 响应式设计
- **国际化**: next-intl (支持中英文双语)
- **用户认证**: NextAuth
- **数据库**: Prisma ORM + PostgreSQL
- **API**: RESTful API 接口

## API 接口总览

系统通过 API 接口在前端和 CMS 后台之间通信。主要接口包括:

### 通用内容接口

- `GET /api/content/navigation` - 获取导航菜单
- `POST /api/content/navigation` - 更新导航菜单
- `GET /api/content/footer/links` - 获取页脚快速链接
- `POST /api/content/footer/links` - 更新页脚快速链接
- `GET /api/content/footer/contact` - 获取页脚联系信息
- `POST /api/content/footer/contact` - 更新页脚联系信息
- `GET /api/content/social-media` - 获取社交媒体链接
- `POST /api/content/social-media` - 更新社交媒体链接
- `POST /api/content/footer-logo` - 上传页脚 Logo

### 首页内容接口

- `GET /api/home/hero-slides` - 获取首页轮播图
- `POST /api/home/hero-slides` - 更新首页轮播图
- `GET /api/home/tagline` - 获取标语部分内容
- `POST /api/home/tagline` - 更新标语部分内容
- `GET /api/home/why-choose` - 获取"为什么选择"部分内容
- `POST /api/home/why-choose` - 更新"为什么选择"部分内容
- `GET /api/home/benefits` - 获取"好处/特点"部分内容
- `POST /api/home/benefits` - 更新"好处/特点"部分内容
- `GET /api/home/student-stories` - 获取学生故事
- `POST /api/home/student-stories` - 更新学生故事
- `GET /api/home/call-to-action` - 获取行动召唤区域内容
- `POST /api/home/call-to-action` - 更新行动召唤区域内容
- `GET /api/home/featured-programs` - 获取特色项目
- `POST /api/home/featured-programs` - 更新特色项目

### 博客内容接口

- `GET /api/blog/posts` - 获取博客文章列表
- `GET /api/blog/posts/:id` - 获取指定博客文章
- `POST /api/blog/posts` - 创建新博客文章
- `PUT /api/blog/posts/:id` - 更新博客文章
- `DELETE /api/blog/posts/:id` - 删除博客文章
- `GET /api/blog/categories` - 获取博客分类
- `POST /api/blog/categories` - 创建博客分类
- `GET /api/blog/tags` - 获取博客标签
- `POST /api/blog/tags` - 创建博客标签
- `POST /api/blog/media/upload` - 上传博客媒体文件

### 项目内容接口

- `GET /api/programs` - 获取项目列表
- `GET /api/programs/:id` - 获取指定项目详情
- `POST /api/programs` - 创建新项目
- `PUT /api/programs/:id` - 更新项目
- `DELETE /api/programs/:id` - 删除项目
- `GET /api/programs/categories` - 获取项目分类
- `GET /api/programs/locations` - 获取项目地点
- `GET /api/programs/grade-levels` - 获取适用年级

### 表单提交接口

- `POST /api/forms/planning` - 提交计划表单
- `GET /api/forms/submissions` - 获取表单提交记录
- `PUT /api/forms/submissions/:id` - 更新表单提交状态
- `GET /api/forms/options` - 获取表单选项配置
- `POST /api/forms/options` - 更新表单选项配置

## 数据模型说明

### 多语言内容管理

所有面向用户的内容都支持中英文双语，采用以下命名规范:

- 英文内容字段: `field_name_en`
- 中文内容字段: `field_name_zh`

例如:
```json
{
  "title_en": "About Us",
  "title_zh": "关于我们",
  "content_en": "We are an international education company...",
  "content_zh": "我们是一家国际教育公司..."
}
```

### 内容关联关系

- 博客文章与分类/标签是多对多关系
- 项目与分类/地点/年级是多对多关系
- 导航菜单项可以有父子关系（支持子菜单）

## 前端集成方式

前端通过 React Query 库与后端 API 通信，主要使用以下几个 hooks:

### 1. API 服务调用

```typescript
// 使用 apiService 进行 API 调用
import apiService from '@/services/api/apiService';

// GET 请求示例
const data = await apiService.get('/api/blog/posts');

// POST 请求示例
const result = await apiService.post('/api/blog/posts', newPostData);
```

### 2. React Query Hooks

```typescript
// 使用 React Query 获取数据
import { useQuery, useMutation } from '@tanstack/react-query';

// 读取数据
const { data, isLoading, error } = useQuery({
  queryKey: ['blogPosts'],
  queryFn: () => apiService.get('/api/blog/posts')
});

// 更新数据
const mutation = useMutation({
  mutationFn: (newPost) => apiService.post('/api/blog/posts', newPost),
  onSuccess: () => {
    // 数据成功更新后的操作
    queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
  }
});
```

### 3. 自定义业务 Hooks

系统提供了多个自定义 hooks 来简化前端与 CMS 的集成:

```typescript
// 示例: 使用博客内容 hook
import { useBlogContent } from '@/hooks/useBlogContent';

function BlogPage() {
  const { posts, categories, isLoading, error } = useBlogContent();
  
  if (isLoading) return <LoadingComponent />;
  if (error) return <ErrorComponent error={error} />;
  
  return (
    <div>
      {posts.map(post => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

## 多语言内容渲染

前端使用 `useLanguage` hook 获取当前语言，并根据语言选择显示对应内容:

```typescript
import { useLanguage } from '@/context/LanguageContext';

function Component({ data }) {
  const { currentLanguage } = useLanguage();
  
  // 根据当前语言获取文本
  const title = currentLanguage === 'en' ? data.title_en : data.title_zh;
  const content = currentLanguage === 'en' ? data.content_en : data.content_zh;
  
  return (
    <div>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

或使用辅助函数:

```typescript
function getLocalizedText(en, zh) {
  return currentLanguage === 'en' ? en : zh;
}

const title = getLocalizedText(data.title_en, data.title_zh);
```

## 图片管理

系统使用统一的图片上传和管理机制:

```typescript
// 上传图片
const result = await mediaService.uploadImage(file);
const imageUrl = result.url;

// 显示图片
import OptimizedImage from '@/components/OptimizedImage';

<OptimizedImage 
  src={imageUrl} 
  alt={imageAlt}
  width={800}
  height={600}
  className="rounded-lg"
/>
```

## 富文本内容管理

系统使用 TipTap 编辑器来管理富文本内容:

```typescript
// 在 CMS 中使用富文本编辑器
import { RichTextEditor } from '@/components/wysiwyg/RichTextEditor';

<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="输入内容..."
/>

// 在前端渲染富文本内容
<div dangerouslySetInnerHTML={{ __html: content }} />
```

## 分页和筛选

列表数据支持分页和筛选功能:

```typescript
// 获取分页博客数据
const { data } = useQuery({
  queryKey: ['blogPosts', page, filters],
  queryFn: () => apiService.get('/api/blog/posts', { 
    params: { page, limit: 10, ...filters } 
  })
});
```

## 缓存与刷新策略

使用 React Query 的缓存机制优化性能:

```typescript
// 定义适当的缓存时间
const { data } = useQuery({
  queryKey: ['blogPosts'],
  queryFn: fetchBlogPosts,
  staleTime: 1000 * 60 * 5, // 5分钟
  cacheTime: 1000 * 60 * 30 // 30分钟
});

// 手动刷新数据
queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
```

## 错误处理与降级策略

1. **API 错误处理**:
   ```typescript
   try {
     const data = await apiService.get('/api/content/navigation');
     return data;
   } catch (error) {
     console.error("获取导航菜单失败:", error);
     // 返回默认数据作为降级处理
     return defaultNavigationData;
   }
   ```

2. **前端错误显示**:
   ```tsx
   {error && (
     <Alert variant="destructive">
       <AlertCircle className="h-4 w-4" />
       <AlertTitle>加载失败</AlertTitle>
       <AlertDescription>
         {error.message || "无法加载数据，请稍后再试"}
       </AlertDescription>
     </Alert>
   )}
   ```

## 后台 CMS 使用指南

### 1. 登录与认证

访问 `/login` 页面使用管理员账号登录系统。管理员账号由系统管理员创建，首次使用时需要修改初始密码。

### 2. 内容管理流程

1. **创建内容**: 在相应的管理页面创建新内容。
2. **编辑内容**: 可以随时编辑已发布的内容。
3. **预览内容**: 部分内容支持在保存前预览。
4. **发布内容**: 内容可以保存为草稿或直接发布。
5. **修改已发布内容**: 已发布内容可以继续修改和更新。

### 3. 多语言内容编辑

所有内容均支持中英文双语编辑:
- 使用切换标签页在中英文之间切换
- 或使用并排编辑模式同时编辑中英文内容

### 4. 图片管理

1. 在媒体库中上传和管理图片
2. 在内容编辑界面中选择已上传的图片
3. 图片会自动优化为不同尺寸，适应不同设备

### 5. SEO 管理

为各类内容设置 SEO 相关信息:
- 页面标题
- Meta 描述
- 社交媒体分享图片和描述

## 开发者集成指南

### 1. 添加新的内容类型

当需要添加新的内容类型时，需要完成以下步骤:

1. 在 Prisma Schema 中定义数据模型
2. 实现 API 接口 (CRUD 操作)
3. 创建前端组件和页面
4. 创建 CMS 管理界面
5. 连接前端和 CMS

### 2. 添加新的前端页面

当添加新的前端页面时:

1. 创建页面组件
2. 定义数据获取逻辑
3. 注册路由
4. 更新导航菜单 (可选)

### 3. 添加新的 CMS 功能

当扩展 CMS 功能时:

1. 创建管理界面组件
2. 实现相关的 API 接口
3. 更新内容模型 (如需要)
4. 添加权限控制 (如需要)

## 常见问题与解决方案

### 1. 内容更新不显示在前端

可能原因:
- API 请求失败
- 缓存未刷新
- 数据转换错误

解决方法:
- 检查网络请求和响应
- 手动刷新缓存: `queryClient.invalidateQueries()`
- 检查数据格式是否正确

### 2. 图片上传失败

可能原因:
- 文件过大
- 格式不支持
- 服务器存储问题

解决方法:
- 压缩图片
- 检查支持的图片格式
- 检查服务器存储配置

### 3. 富文本编辑器问题

可能原因:
- HTML 格式不一致
- 图片引用路径错误
- 样式冲突

解决方法:
- 统一 HTML 清理规则
- 使用绝对 URL 路径
- 隔离编辑器样式

## 联系与支持

若有任何集成或使用问题，请联系技术支持团队:

- 电子邮件: tech-support@younikco.com
- 技术文档: [内部链接]
- 问题跟踪: [JIRA 链接]
