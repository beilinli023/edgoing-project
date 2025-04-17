# Strapi数据库迁移指南

本文档提供了如何在不同环境之间迁移Strapi数据库的详细说明，包括数据导出、导入和可能遇到的问题解决方案。

## 目录

1. [数据导出](#数据导出)
2. [数据导入](#数据导入)
3. [媒体文件迁移](#媒体文件迁移)
4. [常见问题](#常见问题)
5. [数据库维护](#数据库维护)

## 数据导出

### 使用Strapi导出工具

Strapi提供了内置的导出功能，可以创建包含所有内容类型数据、配置和媒体文件的压缩包。

```bash
cd my-strapi-backend
npx strapi export --no-encrypt
```

导出文件将保存在`my-strapi-backend/exports`目录中，格式为`export_YYYYMMDD-HHMMSS.tar.gz`。

### 使用备份脚本

项目提供了一个备份脚本，可以自动执行导出过程并将文件保存到指定位置：

```bash
chmod +x backup-strapi-data.sh
./backup-strapi-data.sh
```

### 手动备份SQLite数据库

如果需要直接备份SQLite数据库文件：

```bash
# 确保Strapi已停止运行
cp my-strapi-backend/.tmp/data.db my-strapi-backend/.tmp/data.db.backup
```

## 数据导入

### 使用Strapi导入工具

将导出的数据导入到新环境：

```bash
cd my-strapi-backend
npx strapi import --file="path/to/export_file.tar.gz" --force
```

`--force`参数将覆盖现有数据，请谨慎使用。

### 导入过程中的注意事项

1. 确保目标Strapi版本与源Strapi版本兼容
2. 导入前停止Strapi服务
3. 导入后可能需要重建索引或清除缓存

## 媒体文件迁移

### 使用Strapi导出/导入工具

Strapi的导出/导入功能会自动包含上传的媒体文件。

### 手动迁移媒体文件

如果需要单独迁移媒体文件：

```bash
# 备份上传文件
tar -czf uploads-backup.tar.gz my-strapi-backend/public/uploads

# 在新环境中恢复
tar -xzf uploads-backup.tar.gz -C /path/to/new/strapi/public/
```

### 更新媒体文件引用

如果媒体文件的URL发生变化，可能需要更新内容中的引用：

1. 在Strapi管理面板中，转到设置 > 媒体库
2. 检查媒体库设置，确保URL配置正确
3. 如有必要，使用数据库查询更新内容中的媒体引用

## 常见问题

### 导入失败

**问题**: 导入过程中出现错误或失败

**解决方案**:
1. 检查Strapi版本兼容性
2. 确保有足够的磁盘空间
3. 检查权限问题
4. 尝试使用`--force`参数
5. 查看Strapi日志获取详细错误信息

### 数据不完整

**问题**: 导入后发现数据不完整或关系丢失

**解决方案**:
1. 确保使用了完整的导出文件
2. 检查内容类型模型是否匹配
3. 验证关系字段配置
4. 可能需要手动修复关系数据

### 媒体文件丢失

**问题**: 导入后媒体文件无法访问

**解决方案**:
1. 确认媒体文件是否包含在导入包中
2. 检查`public/uploads`目录权限
3. 验证媒体库配置
4. 可能需要手动复制媒体文件

## 数据库维护

### 定期备份

建议设置自动备份计划：

```bash
# 创建cron作业，每天凌晨2点执行备份
0 2 * * * /path/to/project/backup-strapi-data.sh
```

### 数据库优化

对于SQLite数据库：

```bash
# 进入SQLite命令行
sqlite3 my-strapi-backend/.tmp/data.db

# 执行VACUUM命令优化数据库
VACUUM;

# 退出
.exit
```

### 数据清理

定期清理不再需要的数据：

1. 删除未使用的媒体文件
2. 清理草稿内容
3. 归档旧内容

### 数据库健康检查

定期执行以下检查：

1. 验证数据库文件大小是否合理
2. 检查索引性能
3. 测试备份和恢复过程

---

如有任何数据库相关问题，请联系技术支持团队。
