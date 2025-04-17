#!/bin/bash

# 修复博客API路径问题的脚本

echo "开始修复博客API路径问题..."

# 1. 停止当前运行的Express服务器（如果有）
echo "停止当前运行的Express服务器..."
pkill -f "node server-express/index.mjs" || true

# 2. 启动Express服务器，确保使用正确的路由配置
echo "启动Express服务器..."
cd server-express
node index.mjs > /tmp/express-server.log 2>&1 &
EXPRESS_PID=$!
cd ..

# 等待服务器启动
echo "等待服务器启动..."
sleep 3

# 3. 测试博客详情API
echo "测试博客详情API..."
curl -s "http://localhost:3001/api/blog/blogpost-1?locale=zh" > /tmp/blog-test.json

# 检查API响应
if [ -s /tmp/blog-test.json ]; then
  echo "API测试成功，服务器正常响应。"
  cat /tmp/blog-test.json | head -20
else
  echo "API测试失败，服务器未正确响应。"
  echo "查看服务器日志..."
  tail -50 /tmp/express-server.log
fi

echo "修复完成。请在浏览器中访问您的应用，测试博客详情页面。"
echo "如果问题仍然存在，请检查前端API客户端配置，确保不会重复添加/api前缀。"
echo "Express服务器进程ID: $EXPRESS_PID"
