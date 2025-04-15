# Express 代理服务器

这是一个使用 Express.js 构建的代理服务器，用于替代原有的 NestJS 代理服务器。

## 功能

- 提供与 NestJS 服务器相同的 API 端点
- 与 Strapi CMS 集成，获取博客文章数据
- 提供健康检查端点
- 支持向后兼容的 API 路径

## 目录结构

```
server-express/
├── config/             # 配置文件
│   └── strapi.mjs      # Strapi 配置
├── controllers/        # 控制器
│   ├── blogController.mjs       # 博客控制器
│   ├── blogPostsController.mjs  # 兼容性博客控制器
│   └── healthController.mjs     # 健康检查控制器
├── routes/             # 路由
│   ├── blog.mjs        # 博客路由
│   ├── blogPosts.mjs   # 兼容性博客路由
│   └── health.mjs      # 健康检查路由
├── index.mjs           # 主入口文件
├── package.json        # 项目依赖
└── README.md           # 项目说明
```

## 安装

```bash
cd server-express
npm install
```

## 环境变量

创建 `.env` 文件，设置以下环境变量：

```
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token
PROXY_PORT=3001
```

## 运行

```bash
# 开发模式
npm run dev

# 生产模式
npm start
```

## API 端点

### 博客 API

- `GET /api/blog` - 获取博客文章列表
- `GET /api/blog/:slug` - 根据 slug 获取单个博客文章
- `GET /api/blog/ping` - 简单的 ping 测试
- `GET /api/blog/test-strapi` - 测试 Strapi 连接
- `GET /api/blog/raw-strapi` - 获取原始 Strapi 响应
- `GET /api/blog/raw-strapi-data` - 获取原始 Strapi 数据

### 兼容性 API

- `GET /blog-posts` - 获取博客文章列表（兼容旧 API）
- `GET /blog-posts/:slug` - 根据 slug 获取单个博客文章（兼容旧 API）
- `GET /blog-posts/explore-api` - 探索 Strapi API 结构

### 健康检查 API

- `GET /api/health` - 基本健康检查
- `GET /api/health/strapi` - Strapi 健康检查
