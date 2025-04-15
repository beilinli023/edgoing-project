#!/bin/bash

# 启动所有服务的脚本
echo "启动所有服务..."

# 启动Strapi (后台运行)
echo "启动Strapi CMS..."
cd my-strapi-backend
npm run develop &
STRAPI_PID=$!
cd ..

# 等待Strapi启动
echo "等待Strapi启动..."
sleep 10

# 启动Express中间层 (后台运行)
echo "启动Express中间层..."
cd server-express
npm start &
EXPRESS_PID=$!
cd ..

# 等待Express启动
echo "等待Express中间层启动..."
sleep 5

# 启动前端开发服务器
echo "启动前端开发服务器..."
npm run dev

# 当前端服务器停止时，清理其他进程
echo "清理进程..."
kill $EXPRESS_PID
kill $STRAPI_PID
echo "所有服务已停止"
