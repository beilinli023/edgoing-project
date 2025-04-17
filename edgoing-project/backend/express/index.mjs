import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import net from 'net';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import cookieParser from 'cookie-parser';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入路由模块
import blogRouter from './routes/blog.mjs';
import blogPostsRouter from './routes/blogPosts.mjs';
import healthRouter from './routes/health.mjs';
import blogVideoRouter from './routes/blogVideo.mjs';
import faqRouter from './routes/faq.mjs';
import universityRouter from './routes/university.mjs';
import studentStoryRouter from './routes/studentStory.mjs';
import partnerLogoRouter from './routes/partnerLogo.mjs';
import programRouter from './routes/program.mjs';
import homeRouter from './routes/home.mjs';
import adminRouter from './routes/admin.mjs';
import formSubmissionRouter from './routes/formSubmission.mjs';
import studyAbroadRouter from './routes/studyAbroad.mjs';
import aboutRouter from './routes/about.mjs';
import newsletterSubscriptionRouter from './routes/newsletterSubscription.mjs';

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

// 会话密钥
// 在生产环境中，应该使用环境变量来设置这个密钥
const SESSION_SECRET = process.env.SESSION_SECRET || 'edgoing-api-server-secret-key';

// 中间件
app.use(cors({
  origin: ['http://localhost:8083', 'http://localhost:8084', 'http://localhost:1337'],
  credentials: true,
  exposedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept', 'Cache-Control']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 会话中间件
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // 在生产环境中使用HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  }
}));

// 简单的日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// 处理重复的API前缀中间件
app.use((req, res, next) => {
  // 检查是否有重复的/api前缀
  if (req.url.startsWith('/api/api/')) {
    // 移除重复的/api前缀
    req.url = req.url.replace('/api/api/', '/api/');
    console.log(`修正重复的API前缀，新路径: ${req.url}`);
  }
  next();
});

// 添加调试信息
console.log('=== 注册的路由 ===');
console.log('newsletterSubscriptionRouter:', newsletterSubscriptionRouter);

// API路由
app.get('/', (req, res) => {
  const strapiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
  res.send(`
    <html>
      <head>
        <title>Express API服务</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
          h1 { color: #333; }
          .container { max-width: 800px; margin: 0 auto; }
          .card { background: #f9f9f9; border-radius: 5px; padding: 20px; margin-bottom: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .success { color: green; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .links { margin-top: 30px; }
          .links h2 { border-bottom: 1px solid #eee; padding-bottom: 10px; }
          .links ul { list-style-type: none; padding-left: 0; }
          .links li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <h1>Express API服务</h1>
            <p class="success">✅ 服务运行正常</p>
          </div>

          <div class="links card">
            <h2>管理链接</h2>
            <ul>
              <li><a href="/admin/dashboard">管理员仪表板</a> (需要登录)</li>
              <li><a href="${strapiUrl}/admin/content-manager/collection-types/api::form-submission.form-submission" target="_blank">Strapi后台管理</a> (需要Strapi管理员登录)</li>
              <li><a href="/api/form-submissions" target="_blank">获取表单提交API数据</a> (需要管理员权限)</li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  `);
});

// 注册管理员路由
app.use('/admin', adminRouter);

// 设置全局 API 前缀为 'api'
const apiRouter = express.Router();
app.use('/api', apiRouter);

// 注册API路由
apiRouter.use('/blog', blogRouter);
apiRouter.use('/blog-videos', blogVideoRouter);
apiRouter.use('/health', healthRouter);
apiRouter.use('/faqs', faqRouter);
apiRouter.use('/universities', universityRouter);
apiRouter.use('/student-stories', studentStoryRouter);
apiRouter.use('/partner-logos', partnerLogoRouter);
apiRouter.use('/programs', programRouter);
apiRouter.use('/home', homeRouter);
apiRouter.use('/form-submissions', formSubmissionRouter);
apiRouter.use('/study-abroad', studyAbroadRouter);
apiRouter.use('/about', aboutRouter);
apiRouter.use('/newsletter-subscriptions', newsletterSubscriptionRouter);

// 注册兼容性路由 (不带/api前缀，用于向后兼容)
app.use('/blog-posts', blogPostsRouter);

// 启动服务器并动态分配端口
(async () => {
  try {
    const PORT = await findAvailablePort(initialPort);
    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`Express API服务器运行在 http://localhost:${PORT}`);
      console.log('已注册以下API路由:');
      console.log('- 博客: /api/blog');
      console.log('- 博客视频: /api/blog-videos');
      console.log('- 健康检查: /api/health');
      console.log('- FAQ: /api/faqs');
      console.log('- 大学: /api/universities');
      console.log('- 学生故事: /api/student-stories');
      console.log('- 合作伙伴Logo: /api/partner-logos');
      console.log('- 项目: /api/programs');
      console.log('- 首页内容: /api/home');
      console.log('- 表单提交: /api/form-submissions');
      console.log('- 留学页面: /api/study-abroad');
      console.log('- 关于页面: /api/about');
      console.log('- 邮件订阅: /api/newsletter-subscriptions');
      console.log('- 博客文章(兼容): /blog-posts');
      console.log('');
      console.log('管理员路由:');
      console.log('- 登录页面: /admin/login');
      console.log('- 管理员仪表板: /admin/dashboard');
      console.log('- 表单提交详情: /admin/form-submissions/:id');
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
