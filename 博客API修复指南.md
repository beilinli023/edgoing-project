# 博客API修复指南

## 问题描述

前端应用在访问博客详情页面时出现404错误。根据控制台日志，前端尝试访问 `/api/api/blog/blogpost-1` 路径，这表明路径中有重复的 `/api` 前缀。

## 原因分析

1. 前端的API客户端配置了 `baseURL: '/api'`，导致所有请求都会添加 `/api` 前缀。
2. 在前端代码中，请求博客详情时使用了 `/api/blog/${slugOrId}` 路径，这导致最终请求路径变成了 `/api/api/blog/${slugOrId}`。
3. Express服务器没有处理这种重复前缀的路径，导致404错误。

## 解决方案

### 方案1：修改前端API客户端配置

在 `src/services/frontend/blogService.ts` 文件中，修改获取博客详情的代码，移除重复的 `/api` 前缀：

```javascript
// 修改前
const postData: BlogPost | null = await apiClient.get<BlogPost | null>(`/api/blog/${slugOrId}`, { params });

// 修改后
const postData: BlogPost | null = await apiClient.get<BlogPost | null>(`blog/${slugOrId}`, { params });
```

### 方案2：在Express服务器中添加重定向处理

在 `server-express/index.mjs` 文件中，添加一个中间件来处理重复的 `/api` 前缀：

```javascript
// 添加在其他中间件之后，路由注册之前
app.use((req, res, next) => {
  // 检查是否有重复的/api前缀
  if (req.url.startsWith('/api/api/')) {
    // 移除重复的/api前缀
    req.url = req.url.replace('/api/api/', '/api/');
    console.log(`修正重复的API前缀，新路径: ${req.url}`);
  }
  next();
});
```

### 方案3：使用提供的修复脚本

1. 确保Express服务器已停止运行
2. 运行修复脚本：
   ```bash
   chmod +x fix-blog-api.sh
   ./fix-blog-api.sh
   ```
3. 脚本会启动Express服务器并测试博客详情API
4. 如果测试成功，在浏览器中访问您的应用，测试博客详情页面

## 验证修复

修复后，您应该能够正常访问博客详情页面，不再出现404错误。如果问题仍然存在，请检查：

1. 前端API客户端配置
2. Express服务器路由注册
3. 服务器日志中的错误信息

## 长期解决方案

为了避免类似问题再次发生，建议：

1. 统一API路径约定，避免重复前缀
2. 在API客户端中添加路径检查，自动处理重复前缀
3. 在服务器端添加更健壮的路径处理逻辑
4. 添加API测试，确保关键API端点正常工作
