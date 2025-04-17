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
