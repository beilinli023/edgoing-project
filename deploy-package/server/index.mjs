import express from 'express';
import cors from 'cors';

// 导入路由模块
import contentTypesRouter from './routes/contentTypes.mjs';
import categoriesRouter from './routes/categories.mjs';
import tagsRouter from './routes/tags.mjs';
import contentsRouter from './routes/contents.mjs';
import programsRouter from './routes/programs.mjs';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 简单的日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API路由
app.get('/', (req, res) => {
  res.json({
    message: 'API服务运行正常',
    success: true
  });
});

// 注册内容类型系统相关路由
app.use('/content-types', contentTypesRouter);
app.use('/categories', categoriesRouter);
app.use('/tags', tagsRouter);
app.use('/contents', contentsRouter);
app.use('/programs', programsRouter);

// 博客文章API (保留向后兼容性)
app.get('/blog-posts', (req, res) => {
  res.json({
    data: [
      {
        id: 1,
        title: '第一篇博客文章',
        slug: 'first-blog-post',
        content: '这是第一篇博客文章的内容...',
        publishedAt: new Date().toISOString()
      },
      {
        id: 2,
        title: '第二篇博客文章',
        slug: 'second-blog-post',
        content: '这是第二篇博客文章的内容...',
        publishedAt: new Date().toISOString()
      }
    ],
    success: true
  });
});

// 导航菜单API (保留向后兼容性)
app.get('/navigation', (req, res) => {
  res.json({
    data: [
      { id: 1, title: '首页', url: '/' },
      { id: 2, title: '博客', url: '/blog' },
      { id: 3, title: '关于', url: '/about' },
      { id: 4, title: '联系', url: '/contact' }
    ],
    success: true
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`API服务器运行在 http://localhost:${PORT}`);
  console.log('已注册以下API路由:');
  console.log('- 内容类型: /content-types');
  console.log('- 分类: /categories');
  console.log('- 标签: /tags');
  console.log('- 内容: /contents');
  console.log('- 程序: /programs');
});
