#!/bin/bash

# 创建打包脚本
echo "开始创建项目打包文件..."

# 创建临时目录
TEMP_DIR="edgoing-package"
mkdir -p $TEMP_DIR

# 复制前端和Express中间层代码
echo "复制前端和Express中间层代码..."
rsync -av --progress ./ $TEMP_DIR/ --exclude node_modules --exclude .git --exclude my-strapi-backend/node_modules --exclude my-strapi-backend/.tmp --exclude my-strapi-backend/.cache --exclude my-strapi-backend/build --exclude dist --exclude .DS_Store --exclude "*.zip" --exclude $TEMP_DIR

# 导出Strapi数据
echo "导出Strapi数据..."
cd my-strapi-backend
npx strapi export --no-encrypt --file="../$TEMP_DIR/strapi-data-export.tar.gz"
cd ..

# 创建package.json文件，包含所有必要的依赖
echo "创建安装说明文档..."
cat > $TEMP_DIR/INSTALL.md << 'EOL'
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
EOL

# 创建环境变量示例文件
if [ ! -f .env.example ]; then
  echo "创建环境变量示例文件..."
  cat > $TEMP_DIR/.env.example << 'EOL'
# 前端环境变量
VITE_API_URL=http://localhost:3001
VITE_STRAPI_URL=http://localhost:1337
EOL
fi

# 为Express服务器创建环境变量示例文件
if [ ! -f server-express/.env.example ]; then
  echo "创建Express服务器环境变量示例文件..."
  mkdir -p $TEMP_DIR/server-express
  cat > $TEMP_DIR/server-express/.env.example << 'EOL'
# Express服务器环境变量
PORT=3001
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your_strapi_api_token_here
EOL
fi

# 创建启动脚本
echo "创建启动脚本..."
cat > $TEMP_DIR/start-all-services.sh << 'EOL'
#!/bin/bash

# 启动所有服务的脚本
echo "启动所有服务..."

# 启动Strapi (后台运行)
echo "启动Strapi CMS..."
cd my-strapi-backend
npm run develop &
STRAPI_PID=$!
cd ..

# 等待Strapi启动
echo "等待Strapi启动..."
sleep 10

# 启动Express中间层 (后台运行)
echo "启动Express中间层..."
cd server-express
npm start &
EXPRESS_PID=$!
cd ..

# 等待Express启动
echo "等待Express中间层启动..."
sleep 5

# 启动前端开发服务器
echo "启动前端开发服务器..."
npm run dev

# 当前端服务器停止时，清理其他进程
echo "清理进程..."
kill $EXPRESS_PID
kill $STRAPI_PID
echo "所有服务已停止"
EOL

# 使启动脚本可执行
chmod +x $TEMP_DIR/start-all-services.sh

# 创建README文件
cat > $TEMP_DIR/README.md << 'EOL'
# EdGoing项目

这是EdGoing教育旅行网站项目的完整代码包。

## 项目结构

- `/` - 前端React应用
- `/server-express` - Express中间层API服务器
- `/my-strapi-backend` - Strapi CMS后端

## 快速开始

请参阅`INSTALL.md`文件获取详细的安装和启动说明。

## 许可证

本项目为私有项目，未经授权不得使用或分发。
EOL

# 打包整个目录
echo "创建最终ZIP包..."
zip -r edgoing-package.zip $TEMP_DIR

# 清理临时目录
echo "清理临时文件..."
rm -rf $TEMP_DIR

echo "打包完成！文件已保存为 edgoing-package.zip"
