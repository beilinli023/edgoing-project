# EdGoing项目安装指南

本文档提供了在新电脑上安装和运行EdGoing项目的详细步骤。

## 系统要求

- Node.js v16+ (推荐v18或更高版本)
- npm v8+ 或 yarn v1.22+
- Git (可选，用于版本控制)

## 安装步骤

### 1. 安装Node.js和npm

访问 [Node.js官网](https://nodejs.org/) 下载并安装最新的LTS版本。

### 2. 解压项目文件

将`edgoing-package.zip`解压到您选择的目录。

### 3. 安装前端依赖

```bash
# 在项目根目录执行
npm install
```

### 4. 安装Express中间层依赖

```bash
# 进入Express服务器目录
cd server-express
npm install
cd ..
```

### 5. 安装Strapi并恢复数据

```bash
# 进入Strapi目录
cd my-strapi-backend
npm install

# 恢复Strapi数据
npx strapi import --file="../strapi-data-export.tar.gz" --force
cd ..
```

### 6. 配置环境变量

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

3. 根据需要编辑这些`.env`文件，设置正确的API URL和其他配置。

### 7. 启动所有服务

使用提供的启动脚本启动所有服务：

```bash
# 确保脚本有执行权限
chmod +x start-services-express.sh
./start-services-express.sh
```

或者分别启动各个服务：

1. 启动Strapi：
   ```bash
   cd my-strapi-backend
   npm run develop
   ```

2. 在新终端启动Express中间层：
   ```bash
   cd server-express
   npm start
   ```

3. 在新终端启动前端开发服务器：
   ```bash
   npm run dev
   ```

### 8. 访问应用

- 前端应用：http://localhost:8083
- Strapi管理面板：http://localhost:1337/admin
- Express API：http://localhost:3001

### 9. 生产环境部署

对于生产环境部署，请执行以下步骤：

1. 构建前端：
   ```bash
   npm run build
   ```

2. 构建Strapi：
   ```bash
   cd my-strapi-backend
   npm run build
   ```

3. 使用PM2或其他进程管理器启动服务。

## 故障排除

- 如果遇到端口冲突，请修改相应服务的端口配置。
- 确保所有环境变量正确设置。
- 检查数据库连接是否正常。

## 数据备份

定期备份Strapi数据：

```bash
cd my-strapi-backend
npx strapi export --no-encrypt
```

备份文件将保存在`my-strapi-backend/exports`目录中。
