# 静态部署策略

## 概述

此策略允许您在API后端尚未准备好的情况下，安全部署前端应用程序。它通过一个零侵入式的API拦截机制，确保在生产环境中自动回退到静态数据，同时保持开发环境的正常API调用行为。

## 工作原理

1. **环境检测**: 系统会自动检测当前运行环境（开发/生产）
2. **API拦截器**: 在生产环境中，自动拦截API请求
3. **静态数据回退**: 如果API调用失败或系统处于静态模式，自动使用本地静态数据
4. **无缝切换**: 当真实API就绪后，只需禁用静态模式，系统将自动使用真实API

## 已实现功能

1. **零侵入式拦截**: 不修改原有API服务调用代码
2. **环境自适应**: 开发环境中保持原有行为，生产环境中启用静态数据
3. **错误处理**: 在API不可用时友好提示用户
4. **数据扩展性**: 可以随时添加更多静态数据模拟接口

## 使用方法

### 1. 环境配置

项目已添加以下环境变量配置：

```
# .env.production
VITE_STATIC_MODE=true
```

- 设置为`true`: 启用静态数据回退机制（用于前端页面尚未连接API的部署）
- 设置为`false`: 禁用静态数据回退，使用真实API（API后端就绪后使用）

### 2. 添加新的静态数据

在`/src/utils/api-fallback.ts`文件中的`staticData`对象中添加新的API端点数据：

```typescript
const staticData: Record<string, ApiResponse<unknown>> = {
  // 已有的API端点

  // 添加新的API端点 - 保持与真实API相同的数据结构
  '/api/new-endpoint': {
    success: true,
    data: {
      // 模拟的API数据结构
    }
  }
};
```

### 3. 运行时添加/更新静态数据

您也可以在运行时动态添加或更新静态数据：

```typescript
import { StaticDataManager } from '@/utils/api-fallback';

// 添加新的静态数据
StaticDataManager.setData('/api/dynamic-endpoint', {
  success: true,
  data: {
    // 数据结构
  }
});

// 检查是否存在静态数据
if (StaticDataManager.hasData('/api/some-endpoint')) {
  // 获取静态数据
  const data = StaticDataManager.getData('/api/some-endpoint');
}
```

## 后续步骤

1. **测试部署**: 启用静态模式进行生产部署，验证页面能够正常显示
2. **逐步集成API**: 当后端API服务就绪后，在静态数据中添加相应的模拟数据，然后逐步集成真实API
3. **切换到真实API**: 当所有API都已就绪，将`VITE_STATIC_MODE`设置为`false`，系统将自动切换到真实API

## 最佳实践

1. **按需添加静态数据**: 只需为关键页面添加必要的静态数据
2. **结构一致性**: 确保静态数据结构与真实API返回结构完全一致
3. **错误处理**: 使用错误边界组件捕获并处理可能的错误

## 实现文件

- `/src/utils/api-fallback.ts`: 静态数据存储和API拦截器实现
- `/src/services/api/fallback-adapter.ts`: 与现有API服务集成的适配器
- `/src/main.tsx`: 在应用启动时引入适配器
- `/.env.production`: 生产环境配置

## 注意事项

- 此机制仅适用于前端部署，不替代后端API的实现
- 写操作（POST/PUT/DELETE）在API不可用时会正常失败并提示用户
- 仅读操作（GET）会在API不可用时回退到静态数据
