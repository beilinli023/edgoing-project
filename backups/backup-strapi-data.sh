#!/bin/bash

# 创建备份目录
BACKUP_DIR="backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p $BACKUP_DIR

echo "开始备份Strapi数据..."

# 进入Strapi目录
cd my-strapi-backend

# 导出Strapi数据
echo "导出Strapi数据库..."
npx strapi export --no-encrypt --file="../$BACKUP_DIR/strapi-data-export.tar.gz"

# 备份上传的文件
echo "备份上传的媒体文件..."
if [ -d "public/uploads" ]; then
  tar -czf "../$BACKUP_DIR/uploads-backup.tar.gz" public/uploads
fi

cd ..

echo "备份完成！文件已保存到 $BACKUP_DIR 目录"
echo "备份文件列表:"
ls -la $BACKUP_DIR
