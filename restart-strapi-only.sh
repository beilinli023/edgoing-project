#!/bin/bash

# 只重启Strapi服务器的脚本，不影响其他服务

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
STRAPI_LOG="$LOG_DIR/strapi.log"

# 清空日志文件
> $STRAPI_LOG

# 记录日志的函数
log() {
  local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$message"
}

log "${BLUE}=== 重启Strapi服务器 ===${NC}"

# 检查是否有Strapi进程在运行
if pgrep -f "npm.*develop.*strapi" > /dev/null || pgrep -f "node.*my-strapi-backend" > /dev/null; then
  log "${YELLOW}发现正在运行的Strapi进程，正在终止...${NC}"
  pkill -f "npm.*develop.*strapi" || true
  pkill -f "node.*my-strapi-backend" || true
  sleep 2
fi

# 启动Strapi后端
log "${GREEN}启动Strapi后端 (端口1337)...${NC}"
cd my-strapi-backend
npm run develop > $STRAPI_LOG 2>&1 &
STRAPI_PID=$!
cd ..

# 等待Strapi启动
log "${YELLOW}等待Strapi启动 (最多120秒)...${NC}"
if npx wait-on -t 120000 http://localhost:1337; then
  log "${GREEN}✓ Strapi已成功启动${NC}"
else
  log "${RED}✗ Strapi启动超时或失败${NC}"
  log "${YELLOW}查看日志: $STRAPI_LOG${NC}"
  exit 1
fi

# 显示启动的进程
log ""
log "${BLUE}=== Strapi服务器已启动 ===${NC}"
log "${GREEN}Strapi后端 (PID: $STRAPI_PID): http://localhost:1337${NC}"
log ""
log "${BLUE}日志文件:${NC}"
log "- Strapi: $STRAPI_LOG"
log ""
log "${YELLOW}提示: 使用'pkill -f \"npm.*develop.*strapi\"'命令可以停止Strapi服务${NC}"
log "${BLUE}=== 完成 ===${NC}"

# 显示最近的日志
log ""
log "${BLUE}最近的Strapi日志:${NC}"
tail -20 $STRAPI_LOG

# 继续显示日志
log ""
log "${BLUE}正在实时显示Strapi日志 (按Ctrl+C退出)...${NC}"
tail -f $STRAPI_LOG
