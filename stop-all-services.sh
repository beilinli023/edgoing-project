#!/bin/bash

# 停止所有服务的脚本

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

echo -e "${BLUE}=== 停止所有服务 ===${NC}"

# 查找并显示正在运行的Node.js进程
echo -e "${YELLOW}正在运行的Node.js进程:${NC}"
ps aux | grep -v grep | grep -E "node|npm" | grep -v "stop-all-services.sh"

# 终止所有Node.js进程
echo -e "${YELLOW}正在终止所有Node.js进程...${NC}"
pkill -f node || true
pkill -f npm || true

# 等待进程终止
echo -e "${YELLOW}等待进程终止...${NC}"
sleep 2

# 检查是否还有Node.js进程在运行
if pgrep -f "node" > /dev/null || pgrep -f "npm" > /dev/null; then
  echo -e "${RED}警告: 仍有Node.js进程在运行${NC}"
  ps aux | grep -v grep | grep -E "node|npm"
  
  echo -e "${YELLOW}尝试强制终止这些进程...${NC}"
  pkill -9 -f node || true
  pkill -9 -f npm || true
  sleep 1
fi

# 最终确认
if pgrep -f "node" > /dev/null || pgrep -f "npm" > /dev/null; then
  echo -e "${RED}无法终止所有Node.js进程，请手动检查${NC}"
else
  echo -e "${GREEN}所有Node.js进程已成功终止${NC}"
fi

echo -e "${BLUE}=== 完成 ===${NC}"
