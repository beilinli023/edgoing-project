# EdGoing项目打包与部署说明

本文档提供了如何打包EdGoing项目并将其部署到新电脑的详细说明。

## 打包项目

### 使用打包脚本

项目提供了一个自动化打包脚本，可以创建一个包含所有必要文件的压缩包：

```bash
# 确保脚本有执行权限
chmod +x create-package.sh

# 运行打包脚本
./create-package.sh
```

脚本将创建一个名为`edgoing-package.zip`的文件，其中包含：
- 前端代码
- Express中间层代码
- Strapi数据导出
- 安装说明
- 启动脚本

### 手动打包

如果您想手动打包项目，请按照以下步骤操作：

1. **导出Strapi数据**：
   ```bash
   cd my-strapi-backend
   npx strapi export --no-encrypt
   cd ..
   ```

2. **创建项目副本，排除不必要的文件**：
   ```bash
   rsync -av --progress ./ edgoing-package/ --exclude node_modules --exclude .git --exclude my-strapi-backend/node_modules --exclude my-strapi-backend/.tmp --exclude my-strapi-backend/.cache --exclude my-strapi-backend/build --exclude dist --exclude .DS_Store
   ```

3. **复制Strapi导出文件到包中**：
   ```bash
   cp my-strapi-backend/exports/export_*.tar.gz edgoing-package/strapi-data-export.tar.gz
   ```

4. **创建ZIP压缩包**：
   ```bash
   zip -r edgoing-package.zip edgoing-package
   ```

## 部署到新电脑

### 系统要求

确保新电脑满足以下要求：
- Node.js v16+ (推荐v18或更高版本)
- npm v8+ 或 yarn v1.22+
- 至少8GB RAM
- 至少20GB可用磁盘空间

### 安装步骤

1. **解压项目文件**：
   ```bash
   unzip edgoing-package.zip
   cd edgoing-package
   ```

2. **安装依赖**：
   ```bash
   # 安装前端依赖
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

3. **导入Strapi数据**：
   ```bash
   cd my-strapi-backend
   npx strapi import --file="../strapi-data-export.tar.gz" --force
   cd ..
   ```

4. **配置环境变量**：
   ```bash
   # 前端环境变量
   cp .env.example .env

   # Express中间层环境变量
   cp server-express/.env.example server-express/.env
   ```

   根据需要编辑这些`.env`文件。

5. **启动服务**：
   ```bash
   # 使用提供的启动脚本
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

6. **访问应用**：
   - 前端应用：http://localhost:8083
   - Strapi管理面板：http://localhost:1337/admin
   - Express API：http://localhost:3001

## 生产环境部署

对于生产环境部署，请参考`DEPLOYMENT_GUIDE.md`文件中的详细说明。

## 数据迁移

对于数据库迁移的详细说明，请参考`DATABASE_MIGRATION.md`文件。

## 故障排除

### 常见问题

1. **依赖安装失败**：
   - 尝试清除npm缓存：`npm cache clean --force`
   - 使用`--legacy-peer-deps`参数：`npm install --legacy-peer-deps`

2. **端口冲突**：
   - 修改相应服务的端口配置
   - 检查并关闭占用端口的其他应用

3. **Strapi导入失败**：
   - 确保Strapi版本兼容
   - 检查磁盘空间和权限
   - 查看Strapi日志获取详细错误信息

4. **前端无法连接到API**：
   - 确认Express中间层正在运行
   - 检查环境变量中的API URL配置
   - 验证网络连接和防火墙设置

## 备份建议

即使在新电脑上，也建议定期备份数据：

```bash
# 使用备份脚本
./backup-strapi-data.sh
```

## 其他资源

- [Node.js官网](https://nodejs.org/)
- [Strapi文档](https://docs.strapi.io/)
- [Express文档](https://expressjs.com/)
- [Vite文档](https://vitejs.dev/guide/)

---

如有任何问题，请参考项目文档或联系技术支持团队。
