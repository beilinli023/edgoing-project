#!/bin/bash

# EdGoing项目GitHub打包脚本
# 此脚本将准备一个完整的项目包，包括所有必要的数据，用于GitHub部署

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 记录日志的函数
log() {
  local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$message"
}

log "${BLUE}=== 开始准备EdGoing项目GitHub包 ===${NC}"

# 1. 导出Strapi数据
log "${GREEN}1. 导出Strapi数据...${NC}"
mkdir -p strapi-data-export

# 检查是否有现有的导出脚本
if [ -f "export-strapi-data.mjs" ]; then
  node export-strapi-data.mjs || { log "${YELLOW}使用现有脚本导出Strapi数据失败，将尝试手动导出${NC}"; }
else
  log "${YELLOW}未找到导出脚本，将尝试手动导出关键数据${NC}"
  
  # 手动导出关键数据结构
  # 这里可以添加特定的导出命令，例如使用curl或其他工具
  # 例如: curl -H "Authorization: Bearer $STRAPI_API_TOKEN" http://localhost:1337/api/blogs > strapi-data-export/blogs.json
fi

# 2. 导出上传的文件
log "${GREEN}2. 导出上传的文件...${NC}"
mkdir -p strapi-uploads-export
if [ -d "my-strapi-backend/public/uploads" ]; then
  cp -r my-strapi-backend/public/uploads/* strapi-uploads-export/ || log "${YELLOW}复制上传文件失败或没有上传文件${NC}"
else
  log "${YELLOW}未找到上传文件目录${NC}"
fi

# 3. 创建导入脚本（如果不存在）
log "${GREEN}3. 创建数据导入脚本...${NC}"
if [ ! -f "import-strapi-data.mjs" ]; then
  cat > import-strapi-data.mjs << 'EOL'
#!/usr/bin/env node

/**
 * 导入Strapi数据的脚本
 * 此脚本将从JSON文件导入所有内容类型的数据到Strapi
 */

import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// 加载环境变量
dotenv.config({ path: './my-strapi-backend/.env' });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

if (!STRAPI_API_TOKEN) {
  console.error('错误: 未设置STRAPI_API_TOKEN环境变量');
  process.exit(1);
}

// 导入目录
const IMPORT_DIR = './strapi-data-export';
if (!fs.existsSync(IMPORT_DIR)) {
  console.error(`错误: 导入目录 ${IMPORT_DIR} 不存在`);
  process.exit(1);
}

// 设置API请求头
const headers = {
  Authorization: `Bearer ${STRAPI_API_TOKEN}`,
  'Content-Type': 'application/json',
};

// 获取所有内容类型
async function getContentTypes() {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/content-type-builder/content-types`, { headers });
    return response.data.data.filter(type => !type.uid.startsWith('admin::') && !type.uid.startsWith('plugin::'));
  } catch (error) {
    console.error('获取内容类型失败:', error.message);
    return [];
  }
}

// 导入特定内容类型的数据
async function importContentType(contentType) {
  const typeName = contentType.uid.split('.')[1] || contentType.uid;
  const fileName = `${typeName}.json`;
  const filePath = path.join(IMPORT_DIR, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ 文件 ${filePath} 不存在，跳过导入 ${contentType.uid}`);
    return { contentType: contentType.uid, status: 'skipped' };
  }
  
  try {
    const fileData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const apiEndpoint = contentType.uid.replace('api::', '').replace('.', '/');
    
    // 检查是否已有数据
    const checkResponse = await axios.get(`${STRAPI_URL}/api/${apiEndpoint}?pagination[limit]=1`, { headers });
    if (checkResponse.data.data && checkResponse.data.data.length > 0) {
      console.log(`⚠️ ${contentType.uid} 已有数据，跳过导入以避免重复`);
      return { contentType: contentType.uid, status: 'skipped_existing' };
    }
    
    // 导入数据
    let successCount = 0;
    let errorCount = 0;
    
    if (fileData.data && Array.isArray(fileData.data)) {
      for (const item of fileData.data) {
        try {
          // 移除id字段，让Strapi自动生成新id
          const data = { ...item.attributes };
          
          await axios.post(`${STRAPI_URL}/api/${apiEndpoint}`, { data }, { headers });
          successCount++;
        } catch (error) {
          console.error(`导入 ${contentType.uid} 项目失败:`, error.message);
          errorCount++;
        }
      }
    }
    
    console.log(`✅ 已导入 ${contentType.uid}: ${successCount} 成功, ${errorCount} 失败`);
    return { contentType: contentType.uid, success: successCount, error: errorCount };
  } catch (error) {
    console.error(`❌ 导入 ${contentType.uid} 失败:`, error.message);
    return { contentType: contentType.uid, error: error.message };
  }
}

// 主函数
async function main() {
  console.log('开始导入Strapi数据...');
  
  // 获取内容类型
  const contentTypes = await getContentTypes();
  console.log(`找到 ${contentTypes.length} 个内容类型`);
  
  const results = [];
  for (const contentType of contentTypes) {
    const result = await importContentType(contentType);
    results.push(result);
  }
  
  // 创建导入摘要
  const summaryPath = path.join(IMPORT_DIR, 'import-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    results
  }, null, 2));
  
  console.log('Strapi数据导入完成!');
}

main().catch(error => {
  console.error('导入过程中发生错误:', error);
  process.exit(1);
});
EOL
  chmod +x import-strapi-data.mjs
  log "${GREEN}已创建导入脚本: import-strapi-data.mjs${NC}"
else
  log "${GREEN}导入脚本已存在${NC}"
fi

# 4. 创建部署指南
log "${GREEN}4. 创建GitHub部署指南...${NC}"
cat > GITHUB_DEPLOY.md << 'EOL'
# EdGoing项目GitHub部署指南

本文档提供了从GitHub克隆并部署EdGoing项目的详细步骤，包括数据导入和配置。

## 一、克隆项目

1. 在服务器上安装Git：
   ```bash
   # CentOS
   yum install -y git
   
   # Ubuntu/Debian
   apt-get update && apt-get install -y git
   ```

2. 克隆GitHub仓库：
   ```bash
   git clone https://github.com/beilinli023/edgoing-project.git
   cd edgoing-project
   ```

## 二、安装依赖

1. 安装Node.js（如果尚未安装）：
   ```bash
   # 使用nvm安装Node.js
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
   source ~/.bashrc
   nvm install 16
   nvm use 16
   ```

2. 安装项目依赖：
   ```bash
   # 安装根项目依赖
   npm install
   
   # 安装Strapi依赖
   cd my-strapi-backend
   npm install
   cd ..
   
   # 安装Express中间层依赖
   cd server-express
   npm install
   cd ..
   ```

## 三、配置环境变量

1. 配置Strapi环境：
   ```bash
   # 创建Strapi环境配置
   cp my-strapi-backend/.env.example my-strapi-backend/.env
   ```

2. 编辑`my-strapi-backend/.env`文件，填入数据库信息：
   ```
   # 数据库配置
   DATABASE_CLIENT=sqlite  # 或mysql，取决于您的需求
   DATABASE_FILENAME=.tmp/data.db  # 仅适用于sqlite
   # 如果使用MySQL，请配置以下内容：
   # DATABASE_HOST=localhost
   # DATABASE_PORT=3306
   # DATABASE_NAME=edgoing_db
   # DATABASE_USERNAME=edgoing_user
   # DATABASE_PASSWORD=your-secure-password
   ```

3. 配置前端和Express中间层环境：
   ```bash
   # 创建根项目环境配置
   cp .env.example .env
   
   # 创建Express中间层环境配置
   cp server-express/.env.example server-express/.env
   ```

## 四、导入数据

1. 启动Strapi并创建管理员账户：
   ```bash
   cd my-strapi-backend
   npm run develop
   ```
   
   在浏览器中访问`http://your-server-ip:1337/admin`，按照提示创建管理员账户。

2. 生成Strapi API Token：
   - 登录Strapi管理面板
   - 进入"设置" -> "API Tokens"
   - 点击"创建新的API Token"
   - 名称：填写"Frontend Access"
   - 类型：选择"Full access"
   - 点击"保存"
   - 复制生成的Token

3. 更新环境变量中的API Token：
   - 编辑`.env`文件，添加：
     ```
     STRAPI_API_TOKEN=your-token-here
     ```
   - 编辑`server-express/.env`文件，添加：
     ```
     STRAPI_API_TOKEN=your-token-here
     ```

4. 恢复上传的文件：
   ```bash
   # 确保上传目录存在
   mkdir -p my-strapi-backend/public/uploads
   
   # 复制导出的文件
   cp -r strapi-uploads-export/* my-strapi-backend/public/uploads/
   ```

5. 导入Strapi数据：
   ```bash
   node import-strapi-data.mjs
   ```

## 五、构建和启动项目

1. 构建前端：
   ```bash
   npm run build
   ```

2. 启动所有服务：
   ```bash
   # 如果您使用PM2
   pm2 start ecosystem.config.js
   
   # 或者使用提供的启动脚本
   chmod +x start-express-services.sh
   ./start-express-services.sh
   ```

## 六、访问应用

启动后，各服务的访问地址为：
- 前端应用：http://your-server-ip:8083
- Strapi管理面板：http://your-server-ip:1337/admin
- Express API：http://your-server-ip:3001

## 七、常见问题解决

1. **端口被占用**：
   - 检查是否有其他应用占用了1337、3001或8083端口
   - 可以修改相应服务的端口配置

2. **数据导入失败**：
   - 检查Strapi API Token是否正确配置
   - 确保Strapi服务正在运行
   - 查看导入脚本的错误日志

3. **服务启动失败**：
   - 检查日志文件了解具体错误原因
   - 确保所有依赖已正确安装
   - 确保环境变量已正确配置

4. **前端页面报错**：
   - 确保Strapi数据已成功导入
   - 确保API Token配置正确
   - 检查浏览器控制台的错误信息
EOL

log "${GREEN}已创建GitHub部署指南: GITHUB_DEPLOY.md${NC}"

# 5. 更新README.md
log "${GREEN}5. 更新README.md...${NC}"
if [ -f "README.md" ]; then
  # 备份原README
  cp README.md README.md.bak
fi

cat > README.md << 'EOL'
# EdGoing项目

这是EdGoing项目的完整包，包括前端、后端和所有必要的数据。

## 快速开始

请参考以下文档进行安装和部署：

- [GitHub部署指南](GITHUB_DEPLOY.md) - 从GitHub克隆并部署项目
- [本地开发环境启动说明](启动说明.md) - 在本地开发环境中启动项目
- [宝塔服务器完整安装指南](宝塔完整安装指南.md) - 在宝塔面板上安装项目

## 项目结构

- `my-strapi-backend`: Strapi后端
- `server-express`: Express中间层
- `src`: 前端源代码
- `strapi-data-export`: 导出的Strapi数据
- `strapi-uploads-export`: 导出的上传文件

## 数据导入

项目包含了预先导出的Strapi数据，可以使用以下命令导入：

```bash
# 确保已安装依赖
npm install

# 导入Strapi数据
node import-strapi-data.mjs

# 恢复上传的文件
cp -r strapi-uploads-export/* my-strapi-backend/public/uploads/
```

## 环境配置

请确保正确配置以下环境文件：

1. `my-strapi-backend/.env` - Strapi后端配置
2. `.env` - 项目根目录配置
3. `server-express/.env` - Express中间层配置

## 许可证

[MIT](LICENSE)
EOL

log "${GREEN}已更新README.md${NC}"

# 6. 创建.env示例文件（如果不存在）
log "${GREEN}6. 创建环境变量示例文件...${NC}"

# 根目录.env示例
if [ ! -f ".env.example" ]; then
  cat > .env.example << 'EOL'
# API配置
VITE_API_URL=http://localhost:3001/api
VITE_STRAPI_URL=http://localhost:1337
VITE_PUBLIC_URL=http://localhost:8083

# 关闭模拟数据和文件系统，仅使用Strapi API
VITE_USE_MOCK_DATA=false
VITE_USE_FILE_SYSTEM=false
VITE_STATIC_MODE=false

# Strapi API Token（从Strapi管理面板生成）
STRAPI_API_TOKEN=your-strapi-api-token-here

# Strapi API URL
STRAPI_API_URL=http://localhost:1337

# 代理服务器端口
PROXY_PORT=3001
EOL
  log "${GREEN}已创建.env.example${NC}"
fi

# Strapi .env示例
if [ ! -f "my-strapi-backend/.env.example" ]; then
  cat > my-strapi-backend/.env.example << 'EOL'
# 服务器配置
HOST=0.0.0.0
PORT=1337

# 安全密钥配置
APP_KEYS=your-app-keys-here
API_TOKEN_SALT=your-api-token-salt-here
ADMIN_JWT_SECRET=your-admin-jwt-secret-here
TRANSFER_TOKEN_SALT=your-transfer-token-salt-here
JWT_SECRET=your-jwt-secret-here

# 数据库配置 - SQLite（开发环境）
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# 数据库配置 - MySQL（生产环境）
# DATABASE_CLIENT=mysql
# DATABASE_HOST=localhost
# DATABASE_PORT=3306
# DATABASE_NAME=edgoing_db
# DATABASE_USERNAME=edgoing_user
# DATABASE_PASSWORD=your-secure-password
# DATABASE_SSL=false

# SMTP配置（如果需要发送邮件）
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password-or-app-password

# 管理员邮箱配置
ADMIN_EMAILS=admin@example.com
EOL
  log "${GREEN}已创建my-strapi-backend/.env.example${NC}"
fi

# Express .env示例
if [ ! -f "server-express/.env.example" ]; then
  cat > server-express/.env.example << 'EOL'
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=your-strapi-api-token-here
PROXY_PORT=3001
EOL
  log "${GREEN}已创建server-express/.env.example${NC}"
fi

# 7. 准备Git提交
log "${GREEN}7. 准备Git提交...${NC}"
git add .
git status

log "${BLUE}=== 项目GitHub包准备完成 ===${NC}"
log "${YELLOW}请检查上面的文件列表，确认所有必要的文件都已包含。${NC}"
log "${YELLOW}然后执行以下命令提交并推送到GitHub：${NC}"
log "${GREEN}git commit -m \"完整项目包，包含所有数据和部署文档\"${NC}"
log "${GREEN}git push origin main${NC}"
log "${BLUE}=== 完成 ===${NC}"
