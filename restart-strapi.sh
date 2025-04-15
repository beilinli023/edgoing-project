#!/bin/bash

# 重启Strapi服务器的脚本

echo "=== 重启Strapi服务器 ==="

# 终止所有现有Node.js进程
echo "正在终止所有现有Node.js进程..."
pkill -f node || true
sleep 2

# 启动Strapi后端
echo "启动Strapi后端 (端口1337)..."
cd my-strapi-backend
npm run develop > /tmp/strapi.log 2>&1 &
STRAPI_PID=$!
cd ..

# 等待Strapi启动
echo "等待Strapi启动 (10秒)..."
sleep 10

# 显示启动的进程
echo ""
echo "=== Strapi服务器已启动 ==="
echo "Strapi后端 (PID: $STRAPI_PID): http://localhost:1337"
echo ""
echo "日志文件:"
echo "- Strapi: /tmp/strapi.log"
echo ""
echo "提示: 使用'pkill -f node'命令可以停止所有服务"
echo "=== 完成 ==="

# 显示最近的日志
echo ""
echo "最近的服务器日志:"
tail -20 /tmp/strapi.log
