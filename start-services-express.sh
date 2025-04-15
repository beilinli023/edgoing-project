#!/bin/bash

# 启动服务脚本 - 按正确顺序启动所有服务

echo "=== 启动服务 ==="
echo "确保按顺序启动: Strapi后端 -> Express代理 -> 前端应用"

# 终止所有现有Node.js进程
echo "正在终止所有现有Node.js进程..."
pkill -f node || true
sleep 2

# 1. 启动Strapi后端
echo "1. 启动Strapi后端 (端口1337)..."
cd my-strapi-backend
npm run develop > /tmp/strapi.log 2>&1 &
STRAPI_PID=$!
cd ..

# 等待Strapi启动
echo "   等待Strapi启动 (10秒)..."
sleep 10

# 2. 启动Express代理服务器
echo "2. 启动Express代理服务器 (端口3001)..."
cd server-express
node index.mjs > /tmp/express-proxy.log 2>&1 &
EXPRESS_PID=$!
cd ..

# 等待Express代理启动
echo "   等待Express代理启动 (5秒)..."
sleep 5

# 3. 启动前端应用
echo "3. 启动前端应用 (端口8083)..."
npm run dev:frontend > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!

# 显示所有启动的进程
echo ""
echo "=== 所有服务已启动 ==="
echo "Strapi后端 (PID: $STRAPI_PID): http://localhost:1337"
echo "Express代理 (PID: $EXPRESS_PID): http://localhost:3001"
echo "前端应用 (PID: $FRONTEND_PID): http://localhost:8083"
echo ""
echo "日志文件:"
echo "- Strapi: /tmp/strapi.log"
echo "- Express代理: /tmp/express-proxy.log"
echo "- 前端: /tmp/frontend.log"
echo ""
echo "提示: 使用'pkill -f node'命令可以停止所有服务"
echo "=== 完成 ==="
