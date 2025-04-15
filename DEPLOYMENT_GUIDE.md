# EdGoing项目部署指南

本文档提供了在新电脑上部署EdGoing项目的详细步骤，包括开发环境和生产环境的配置。

## 目录

1. [系统要求](#系统要求)
2. [开发环境部署](#开发环境部署)
3. [生产环境部署](#生产环境部署)
4. [数据迁移](#数据迁移)
5. [故障排除](#故障排除)
6. [维护指南](#维护指南)

## 系统要求

### 最低配置
- 操作系统：Windows 10/11、macOS 10.15+、Ubuntu 20.04+
- CPU：双核处理器
- 内存：8GB RAM
- 存储：20GB可用空间
- Node.js v16+ (推荐v18或更高版本)
- npm v8+ 或 yarn v1.22+
- Git

### 推荐配置
- 操作系统：macOS 12+、Ubuntu 22.04+
- CPU：四核处理器
- 内存：16GB RAM
- 存储：SSD，50GB可用空间
- Node.js v18+
- npm v9+ 或 yarn v1.22+
- Git

## 开发环境部署

### 1. 准备工作

1. 安装Node.js和npm：
   - 访问[Node.js官网](https://nodejs.org/)下载并安装最新的LTS版本
   - 验证安装：`node -v` 和 `npm -v`

2. 安装Git：
   - 访问[Git官网](https://git-scm.com/)下载并安装
   - 验证安装：`git --version`

### 2. 解压项目文件

将`edgoing-package.zip`解压到您选择的目录。

### 3. 安装依赖

```bash
# 在项目根目录执行
npm install

# 安装Express中间层依赖
cd server-express
npm install
cd ..

# 安装Strapi依赖
cd my-strapi-backend
npm install
cd ..
```

### 4. 恢复Strapi数据

```bash
cd my-strapi-backend
npx strapi import --file="../strapi-data-export.tar.gz" --force
cd ..
```

### 5. 配置环境变量

1. 在项目根目录复制`.env.example`为`.env`：
   ```bash
   cp .env.example .env
   ```

2. 在`server-express`目录复制`.env.example`为`.env`：
   ```bash
   cd server-express
   cp .env.example .env
   cd ..
   ```

3. 根据需要编辑这些`.env`文件。

### 6. 启动开发服务器

使用提供的启动脚本：

```bash
chmod +x start-all-services.sh
./start-all-services.sh
```

或分别启动各个服务：

```bash
# 终端1：启动Strapi
cd my-strapi-backend
npm run develop

# 终端2：启动Express中间层
cd server-express
npm start

# 终端3：启动前端开发服务器
npm run dev
```

### 7. 访问应用

- 前端应用：http://localhost:8083
- Strapi管理面板：http://localhost:1337/admin
  - 默认管理员账号：admin@example.com
  - 默认密码：Admin123!
- Express API：http://localhost:3001

## 生产环境部署

### 1. 构建前端应用

```bash
# 在项目根目录执行
npm run build
```

构建后的文件将位于`dist`目录中。

### 2. 构建Strapi

```bash
cd my-strapi-backend
npm run build
cd ..
```

### 3. 配置生产环境变量

为生产环境创建适当的环境变量文件：

```bash
# 前端生产环境变量
cat > .env.production << EOL
VITE_API_URL=https://api.yourdomain.com
VITE_STRAPI_URL=https://cms.yourdomain.com
EOL

# Strapi生产环境变量
cat > my-strapi-backend/.env.production << EOL
HOST=0.0.0.0
PORT=1337
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
EOL

# Express中间层生产环境变量
cat > server-express/.env.production << EOL
PORT=3001
STRAPI_API_URL=https://cms.yourdomain.com
STRAPI_API_TOKEN=your-strapi-api-token-here
EOL
```

### 4. 使用PM2部署服务

安装PM2：

```bash
npm install -g pm2
```

创建PM2配置文件：

```bash
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [
    {
      name: 'strapi',
      cwd: './my-strapi-backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'express-api',
      cwd: './server-express',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production'
      }
    },
    {
      name: 'frontend-server',
      script: 'npx',
      args: 'serve -s dist -l 8083',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOL
```

启动所有服务：

```bash
pm2 start ecosystem.config.js
```

### 5. 配置Nginx（可选）

如果您使用Nginx作为反向代理，可以使用以下配置：

```nginx
# 前端应用
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:8083;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Express API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Strapi CMS
server {
    listen 80;
    server_name cms.yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 数据迁移

### 备份数据

使用提供的备份脚本：

```bash
chmod +x backup-strapi-data.sh
./backup-strapi-data.sh
```

这将创建包含Strapi数据库和上传文件的备份。

### 恢复数据

1. 恢复Strapi数据：
   ```bash
   cd my-strapi-backend
   npx strapi import --file="../path/to/strapi-data-export.tar.gz" --force
   cd ..
   ```

2. 恢复上传的文件：
   ```bash
   cd my-strapi-backend
   tar -xzf "../path/to/uploads-backup.tar.gz" -C .
   cd ..
   ```

## 故障排除

### 常见问题

1. **端口冲突**
   - 症状：服务无法启动，报告端口已被占用
   - 解决方案：修改相应服务的端口配置，或关闭占用端口的应用

2. **数据库连接错误**
   - 症状：Strapi无法启动，报告数据库连接错误
   - 解决方案：检查数据库配置，确保数据库文件存在且可访问

3. **API连接问题**
   - 症状：前端无法获取数据
   - 解决方案：检查Express中间层是否正常运行，验证API URL配置是否正确

4. **Strapi管理员账号问题**
   - 症状：无法登录Strapi管理面板
   - 解决方案：使用Strapi的密码重置功能，或直接在数据库中修改管理员账号

### 日志位置

- Strapi日志：`my-strapi-backend/logs`
- Express日志：`server-express/logs`（如果配置了日志）
- PM2日志：`~/.pm2/logs/`

## 维护指南

### 定期备份

建议每周至少进行一次完整备份：

```bash
./backup-strapi-data.sh
```

### 更新依赖

定期更新依赖以修复安全漏洞：

```bash
# 更新前端依赖
npm update

# 更新Express中间层依赖
cd server-express
npm update
cd ..

# 更新Strapi依赖
cd my-strapi-backend
npm update
cd ..
```

### 监控

使用PM2监控应用状态：

```bash
pm2 monit
```

### 系统资源

定期检查系统资源使用情况，特别是：
- 磁盘空间：确保有足够空间存储上传的媒体文件
- 内存使用：Node.js应用可能随时间增长内存使用
- CPU使用：高负载可能影响应用性能

---

如有任何问题，请联系技术支持团队。
