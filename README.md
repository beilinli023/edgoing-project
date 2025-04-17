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
