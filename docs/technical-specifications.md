# 技术规范文档

本文档定义了CMS系统开发中使用的技术规范，包括命名规范、代码风格和开发规范。

## 命名规范

### 数据库命名
请参考 [数据库设计文档](database-design.md#数据库命名规范) 中的命名规范。

### API 命名
- 路径：使用 kebab-case（例如：/api/content-types）
- 查询参数：camelCase（例如：?pageSize=10）
- 返回字段：camelCase（例如：{ createdAt, updatedAt }）

### 多语言内容
- 中文字段后缀：_zh（例如：title_zh）
- 英文字段后缀：_en（例如：title_en）

## 代码风格指南

### TypeScript 规范
- 使用 TypeScript 的严格模式（strict mode）
- 所有变量和函数都要定义类型
- 使用接口（Interface）定义数据结构
- 使用枚举（Enum）定义常量集合

### React 组件规范
- 使用函数式组件和 Hooks
- 组件文件使用 PascalCase 命名
- Props 接口使用 ComponentNameProps 命名
- 样式文件使用 ComponentName.module.css 命名

### 文件组织
- 按功能模块组织文件
- 共用组件放在 components/common 目录
- 工具函数放在 utils 目录
- 类型定义放在 types 目录

## 开发规范

### Git 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式修改
- refactor: 重构
- test: 测试用例
- chore: 构建过程或辅助工具的变动

### 代码审查标准
- 代码是否符合项目规范
- 是否有适当的注释和文档
- 是否有适当的错误处理
- 是否有适当的测试覆盖
- 是否有性能问题
- 是否有安全隐患

### 测试规范
- 单元测试覆盖率要求 > 80%
- 每个组件都要有快照测试
- 关键功能要有集成测试
- API 接口要有端到端测试
