#!/bin/bash

# 简化版启动脚本，用于测试
# 这个脚本直接使用原始项目中的文件

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目根目录
ROOT_DIR="/Users/beilin/Downloads/edgoing-package_副本"
SCRIPTS_DIR="$ROOT_DIR/edgoing-project/scripts"

echo -e "${YELLOW}使用项目目录: $ROOT_DIR${NC}"

# 启动 Strapi 后端
echo -e "${GREEN}正在启动 Strapi 后端...${NC}"
cd "$ROOT_DIR/my-strapi-backend" && npm run develop &
STRAPI_PID=$!

# 等待 Strapi 启动完成
echo -e "${YELLOW}等待 Strapi 启动 (10秒)...${NC}"
sleep 10

# 启动 Express 后端
echo -e "${GREEN}正在启动 Express 后端...${NC}"
cd "$ROOT_DIR/server-express" && node index.mjs &
EXPRESS_PID=$!

# 等待 Express 启动完成
echo -e "${YELLOW}等待 Express 启动 (5秒)...${NC}"
sleep 5

# 测试连接
echo -e "${GREEN}测试 Express 到 Strapi 的连接...${NC}"
cd "$SCRIPTS_DIR" && node test-connection.js

echo -e "${GREEN}测试前端到 Express 的连接...${NC}"
cd "$SCRIPTS_DIR" && node test-express.js

# 等待用户输入
echo -e "${YELLOW}服务已启动，按任意键停止服务...${NC}"
read -n 1 -s

# 停止服务
echo -e "${GREEN}正在停止服务...${NC}"
kill $STRAPI_PID
kill $EXPRESS_PID

echo -e "${GREEN}测试完成${NC}"
