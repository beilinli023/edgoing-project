// PM2配置文件 | PM2 Configuration File
module.exports = {
  apps: [
    {
      name: "strapi", // Strapi后端 | Strapi Backend
      cwd: "./my-strapi-backend",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/www/wwwlogs/edgoing/strapi-error.log",
      out_file: "/www/wwwlogs/edgoing/strapi-out.log"
    },
    {
      name: "express", // Express中间层 | Express Middleware
      cwd: "./server-express",
      script: "index.mjs",
      env: {
        NODE_ENV: "production",
        EXPRESS_PORT: 3001,
        STRAPI_URL: "http://localhost:1337"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/www/wwwlogs/edgoing/express-error.log",
      out_file: "/www/wwwlogs/edgoing/express-out.log"
    },
    {
      name: "frontend", // 前端应用 | Frontend Application
      script: "npm",
      args: "run preview", // 使用Vite的preview模式运行构建后的前端 | Run built frontend using Vite's preview mode
      env: {
        NODE_ENV: "production"
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/www/wwwlogs/edgoing/frontend-error.log",
      out_file: "/www/wwwlogs/edgoing/frontend-out.log"
    }
  ]
};
