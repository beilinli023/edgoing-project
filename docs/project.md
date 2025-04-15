# EdGoing网站架构概览

本文档整理了网站的整体设计结构和文件目录，以帮助你了解项目的组织方式。

## 项目技术栈

- **前端框架**: React + TypeScript
- **构建工具**: Vite
- **样式**: Tailwind CSS + Shadcn UI组件
- **状态管理**: React Query
- **CMS系统**: Strapi
- **中间层**: Express.js
- **路由**: React Router
## 目录结构

### 主要目录

```
/
├── public/                 # 静态资源
├── src/                    # 前端源代码
│   ├── components/         # 组件
│   ├── context/            # React上下文
│   ├── data/               # 静态数据
│   ├── hooks/              # 自定义Hook
│   ├── integrations/       # 第三方集成
│   ├── lib/                # 通用库
│   ├── pages/              # 页面组件
│   ├── services/           # API服务
│   ├── types/              # TypeScript类型定义
│   └── utils/              # 工具函数
├── server-express/          # Express中间层服务器
│   ├── controllers/        # 控制器
│   ├── routes/             # 路由定义
│   ├── middleware/         # 中间件
│   └── utils/              # 工具函数
├── strapi/                 # Strapi CMS系统
│   ├── src/                # Strapi源代码
│   ├── config/             # Strapi配置
│   └── database/           # 数据库配置
└── ...配置文件
```
### 核心页面结构

前端页面都位于 `src/pages/frontend/` 目录下:

- **HomePage.tsx** - 网站首页
- **ProgramsPage.tsx** - 探索项目页面
- **ProgramDetailPage.tsx** - 项目详情页面
- **StudyAbroadPage.tsx** - 精彩留学页面
- **UniversityDetailPage.tsx** - 大学详情页面
- **AboutPage.tsx** - 关于我们页面
- **ContactPage.tsx** - 联系页面
- **LearnHowPage.tsx** - 了解更多页面
- **StartPlanningPage.tsx** - 开始计划页面
- **BlogPage.tsx** - 博客页面
- **BlogPostDetail.tsx** - 博客文章详情页面
- **PrivacyPolicyPage.tsx** - 隐私政策页面
### 核心组件结构

网站的组件按功能分类组织在 `src/components/` 目录下:

- **frontend/** - 前端界面组件
  - **FrontendNavbar.tsx** - 导航栏组件
  - **FrontendLayout.tsx** - 布局组件
  - **home/** - 首页相关组件，包括轮播图等
  - **blog/** - 博客相关组件
  - **programs/** - 项目相关组件
  - **study-abroad/** - 留学相关组件
  - **forms/** - 表单相关组件
  - 其他前端专用组件
- **ui/** - 通用UI组件(基于Shadcn)
  - 按钮、表单、导航等基础组件
- **common/** - 公共组件
  - **HeroSlider.tsx** - 通用轮播组件
  - **ImageGallery.tsx** - 图片画廊组件
  - 其他公共组件
### 服务层结构

API服务和数据处理位于 `src/services/` 目录:

- **api/** - API客户端
  - **apiClient.ts** - 封装的Axios实例
  - **apiService.ts** - API服务类
- **frontend/** - 前端专用服务
  - **navigationService.ts** - 导航服务
  - **footerService.ts** - 页脚服务
  - **blogService.ts** - 博客服务
  - **homeContentService.ts** - 首页内容服务
  - **programService.ts** - 项目服务
  - **studyAbroadService.ts** - 留学服务
  - **formService.ts** - 表单服务
  - 其他前端数据服务
### 自定义Hook

业务逻辑封装在 `src/hooks/` 目录的自定义Hook中:

- **导航相关**
  - **useFrontendNavigation.ts** - 导航数据Hook
  - **useLanguage.ts** - 语言切换Hook

- **内容相关**
  - **useFrontendHeroSlider.ts** - 首页轮播图Hook
  - **useBlog.ts** - 博客数据Hook
  - **useProgram.ts** - 项目数据Hook
  - **useStudyAbroad.ts** - 留学数据Hook

- **表单相关**
  - **useForms.ts** - 表单提交Hook
  - **useFormContent.ts** - 表单内容Hook
  - **useNewsletterSubscription.ts** - 邮件订阅Hook
### Strapi CMS集成

项目使用Strapi作为内容管理系统，包括以下功能：

- **内容类型管理**
  - 项目管理 (programs)
  - 博客文章管理 (blog-posts)
  - 大学信息管理 (universities)
  - 首页内容管理 (home-hero, featured-programs)
  - 留学页面管理 (study-abroad-hero, study-abroad-content)

- **多语言支持**
  - 中文和英文内容管理
  - 使用 locale 参数切换语言
  - 通过 documentId 关联不同语言版本

- **媒体管理**
  - 图片上传和管理
  - 视频内容管理

- **表单管理**
  - 表单提交数据存储
  - 邮件订阅管理

### Express服务器

项目使用Express作为中间层服务器，负责以下功能：

- **API代理**
  - 将前端请求转发到Strapi
  - 处理跨域请求问题
  - 添加认证信息

- **数据转换**
  - 将Strapi数据结构转换为前端所需格式
  - 处理多语言内容
  - 处理图片URL路径

- **表单处理**
  - 接收前端表单提交
  - 将表单数据保存到Strapi
  - 处理邮件订阅请求
### 数据流程

完整的数据流程如下：

1. **用户界面** → React组件通过自定义Hook获取数据
2. **自定义Hook** → 使用React Query管理状态，调用相应的服务进行API请求
3. **服务层** → 处理与后端的交互，使用apiClient发送请求到Express服务器
4. **Express服务器** → 处理请求，转换数据格式，转发到Strapi
5. **Strapi CMS** → 处理数据请求，返回数据
6. **Express服务器** → 接收Strapi响应，转换数据格式，返回给前端
7. **服务层** → 接收并处理响应数据
8. **自定义Hook** → 更新React Query缓存，管理加载状态和错误
9. **用户界面** → 使用更新后的数据渲染界面
### 多语言支持

网站支持中英文切换功能，实现方式如下：

- **前端实现**
  - 使用 `LanguageContext` 管理语言状态
  - 各组件通过 `useLanguage` Hook 获取当前语言
  - 导航栏提供语言切换按钮
  - 使用条件渲染显示不同语言的文本

- **后端实现**
  - Express服务器根据 `locale` 参数请求相应语言的内容
  - Strapi使用内置的国际化功能管理多语言内容
  - 使用 `documentId` 关联不同语言版本的内容

- **数据结构**
  - 内容字段根据语言后缀区分，如 `title_en` 和 `title_zh`
  - 关联字段使用多语言版本，如 `program_type_en` 和 `program_type_zh`
  - 图片和媒体内容在不同语言版本之间共享

## 总结

以上就是 EdGoing 网站的整体架构概览。这个架构采用了现代前端开发的最佳实践，清晰地将 UI 组件、业务逻辑和数据服务分离，并通过 Express 中间层与 Strapi CMS 集成，实现了高效的内容管理和多语言支持。

这种架构设计便于维护和扩展，同时也为用户提供了良好的体验。