# EdGoing 项目

这是 EdGoing 项目的重组版本，采用了更清晰的项目结构。

## 项目结构

```
edgoing-project/
├── backend/                    # 后端代码
│   ├── strapi/                 # Strapi 后端
│   │   ├── config/             # Strapi 配置
│   │   ├── src/                # Strapi 源代码
│   │   └── scripts/            # Strapi 相关脚本
│   └── express/                # Express 后端
│       ├── config/             # Express 配置
│       ├── routes/             # Express 路由
│       ├── controllers/        # Express 控制器
│       ├── middleware/         # Express 中间件
│       └── utils/              # Express 工具函数
├── frontend/                   # 前端代码
│   ├── src/                    # 前端源代码
│   │   ├── components/         # React 组件
│   │   ├── pages/              # 页面组件
│   │   ├── services/           # 服务
│   │   └── ...
│   └── public/                 # 静态资源
├── scripts/                    # 项目脚本
│   ├── deployment/             # 部署脚本
│   └── data-import/            # 数据导入脚本
├── config/                     # 项目配置
│   └── env/                    # 环境变量
└── docs/                       # 项目文档
```

## 启动项目

### 安装依赖

```bash
npm install
```

### 启动前端

```bash
npm run start:frontend
```

### 启动 Strapi 后端

```bash
npm run start:strapi
```

### 启动 Express 后端

```bash
npm run start:express
```

### 启动所有服务

```bash
npm run start:all
```

## 构建项目

### 构建前端

```bash
npm run build:frontend
```

### 构建 Strapi 后端

```bash
npm run build:strapi
```
