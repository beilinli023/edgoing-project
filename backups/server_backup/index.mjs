import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import net from 'net';
import dotenv from 'dotenv';

// 导入路由模块
import contentTypesRouter from './routes/contentTypes.mjs';
import categoriesRouter from './routes/categories.mjs';
import tagsRouter from './routes/tags.mjs';
import contentsRouter from './routes/contents.mjs';
import programsRouter from './routes/programs.mjs';
import blogPostsRouter from './routes/blogPosts.mjs';

// 加载环境变量
dotenv.config();

const app = express();
// 将端口初始值从环境变量获取，如果不存在则使用3001，如果为0则进行自动分配
const initialPort = parseInt(process.env.PROXY_PORT, 10) || 3001;

// 检查端口是否可用的函数
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.once('error', () => {
      // 端口被占用
      resolve(false);
    });
    
    server.once('listening', () => {
      // 端口可用，关闭服务器
      server.close(() => {
        resolve(true);
      });
    });
    
    server.listen(port);
  });
}

// 查找可用端口的函数
async function findAvailablePort(startPort) {
  let port = startPort;
  // 如果初始端口为0，从3001开始寻找可用端口
  if (port === 0) {
    port = 3001;
  }
  
  // 尝试查找可用端口
  while (!(await isPortAvailable(port))) {
    port++;
    // 防止无限循环，设置上限
    if (port > 65535) {
      throw new Error('没有可用的端口');
    }
  }
  
  return port;
}

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
app.use('/blog-posts', blogPostsRouter);

// 博客文章API (保留向后兼容性)
// 注释掉原有的模拟API，使用新的Strapi集成API
/*
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
*/

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

// 启动服务器并动态分配端口
(async () => {
  try {
    const PORT = await findAvailablePort(initialPort);
    const server = createServer(app);
    
    server.listen(PORT, () => {
      console.log(`API服务器运行在 http://localhost:${PORT}`);
      console.log('已注册以下API路由:');
      console.log('- 内容类型: /content-types');
      console.log('- 分类: /categories');
      console.log('- 标签: /tags');
      console.log('- 内容: /contents');
      console.log('- 程序: /programs');
    });
    
    // 处理服务器关闭事件
    process.on('SIGINT', () => {
      console.log('正在关闭服务器...');
      server.close(() => {
        console.log('服务器已安全关闭');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
    process.exit(1);
  }
})();
