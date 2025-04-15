#!/bin/bash

# 启动Express服务器的脚本

echo "=== 启动Express服务器 ==="

# 终止所有现有Node.js进程
echo "正在终止所有现有Node.js进程..."
pkill -f node || true
sleep 2

# 启动Express服务器
echo "启动Express服务器 (端口3001)..."
cd server-express
node index.mjs > /tmp/express-server.log 2>&1 &
EXPRESS_PID=$!
cd ..

# 等待Express服务器启动
echo "等待Express服务器启动 (5秒)..."
sleep 5

# 显示启动的进程
echo ""
echo "=== Express服务器已启动 ==="
echo "Express服务器 (PID: $EXPRESS_PID): http://localhost:3001"
echo ""
echo "日志文件:"
echo "- Express服务器: /tmp/express-server.log"
echo ""
echo "提示: 使用'pkill -f node'命令可以停止所有服务"
echo "=== 完成 ==="

# 显示最近的日志
echo ""
echo "最近的服务器日志:"
tail -20 /tmp/express-server.log
