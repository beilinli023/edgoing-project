#!/bin/bash

# 只启动Express中间层的脚本

# 设置颜色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色

# 日志目录
LOG_DIR="/tmp/edgoing-logs"
mkdir -p $LOG_DIR

# 日志文件
EXPRESS_LOG="$LOG_DIR/express.log"

# 清空日志文件
> $EXPRESS_LOG

# 记录日志的函数
log() {
  local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$message"
}

log "${BLUE}=== 启动Express中间层 ===${NC}"

# 检查是否需要终止现有的Express进程
if pgrep -f "node.*server-express/index.mjs" > /dev/null; then
  log "${YELLOW}发现正在运行的Express进程，正在终止...${NC}"
  pkill -f "node.*server-express/index.mjs" || true
  sleep 2
fi

# 启动Express中间层
log "${GREEN}启动Express中间层 (端口3001)...${NC}"
cd server-express
node index.mjs > $EXPRESS_LOG 2>&1 &
EXPRESS_PID=$!
cd ..

# 等待Express中间层启动
log "${YELLOW}等待Express中间层启动 (最多30秒)...${NC}"
for i in {1..30}; do
  if curl -s http://localhost:3001 > /dev/null; then
    log "${GREEN}✓ Express中间层已成功启动${NC}"
    break
  fi
  
  if [ $i -eq 30 ]; then
    log "${RED}✗ Express中间层启动超时或失败${NC}"
    log "${YELLOW}查看日志: $EXPRESS_LOG${NC}"
    exit 1
  fi
  
  sleep 1
  echo -n "."
done

# 显示启动的进程
log ""
log "${BLUE}=== Express中间层已启动 ===${NC}"
log "${GREEN}Express中间层 (PID: $EXPRESS_PID): http://localhost:3001${NC}"
log ""
log "${BLUE}日志文件:${NC}"
log "- Express中间层: $EXPRESS_LOG"
log ""
log "${YELLOW}提示: 使用'pkill -f \"node.*server-express/index.mjs\"'命令可以停止Express服务${NC}"
log "${BLUE}=== 完成 ===${NC}"

# 显示最近的日志
log ""
log "${BLUE}最近的Express中间层日志:${NC}"
tail -20 $EXPRESS_LOG

# 继续显示日志
log ""
log "${BLUE}正在实时显示Express中间层日志 (按Ctrl+C退出)...${NC}"
tail -f $EXPRESS_LOG
