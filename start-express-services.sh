#!/bin/bash

# 启动服务脚本 - 使用Express中间层，按正确顺序启动所有服务
# 使用wait-on工具等待服务真正启动，而不是使用固定的sleep时间

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
EXPRESS_LOG="$LOG_DIR/express.log"
FRONTEND_LOG="$LOG_DIR/frontend.log"
MASTER_LOG="$LOG_DIR/master.log"

# 清空日志文件
> $STRAPI_LOG
> $EXPRESS_LOG
> $FRONTEND_LOG
> $MASTER_LOG

# 记录日志的函数
log() {
  local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$message" | tee -a $MASTER_LOG
}

log "${BLUE}=== 启动服务 ===${NC}"
log "${BLUE}确保按顺序启动: Strapi后端 -> Express中间层 -> 前端应用${NC}"

# 检查wait-on是否安装
if ! command -v npx &> /dev/null || ! npx wait-on --version &> /dev/null; then
  log "${YELLOW}wait-on工具未安装，正在安装...${NC}"
  npm install -g wait-on
fi

# 终止所有现有Node.js进程
log "${YELLOW}正在终止所有现有Node.js进程...${NC}"
pkill -f node || true
sleep 2

# 1. 启动Strapi后端
log "${GREEN}1. 启动Strapi后端 (端口1337)...${NC}"
cd my-strapi-backend
npm run develop > $STRAPI_LOG 2>&1 &
STRAPI_PID=$!
cd ..

# 等待Strapi启动 (使用wait-on)
log "${YELLOW}   等待Strapi启动 (最多120秒)...${NC}"
if npx wait-on -t 120000 http://localhost:1337; then
  log "${GREEN}   ✓ Strapi已成功启动${NC}"
else
  log "${RED}   ✗ Strapi启动超时或失败${NC}"
  log "${YELLOW}   查看日志: $STRAPI_LOG${NC}"
  log "${YELLOW}   尝试继续启动其他服务...${NC}"
fi

# 2. 启动Express中间层
log "${GREEN}2. 启动Express中间层 (端口3001)...${NC}"
cd server-express
node index.mjs > $EXPRESS_LOG 2>&1 &
EXPRESS_PID=$!
cd ..

# 等待Express中间层启动 (使用wait-on)
log "${YELLOW}   等待Express中间层启动 (最多30秒)...${NC}"
if npx wait-on -t 30000 http://localhost:3001; then
  log "${GREEN}   ✓ Express中间层已成功启动${NC}"
else
  log "${RED}   ✗ Express中间层启动超时或失败${NC}"
  log "${YELLOW}   查看日志: $EXPRESS_LOG${NC}"
  log "${YELLOW}   尝试继续启动前端...${NC}"
fi

# 3. 启动前端应用
log "${GREEN}3. 启动前端应用 (端口8083)...${NC}"
npm run dev:frontend > $FRONTEND_LOG 2>&1 &
FRONTEND_PID=$!

# 等待前端应用启动 (使用wait-on)
log "${YELLOW}   等待前端应用启动 (最多60秒)...${NC}"
if npx wait-on -t 60000 http://localhost:8083; then
  log "${GREEN}   ✓ 前端应用已成功启动${NC}"
else
  log "${RED}   ✗ 前端应用启动超时或失败${NC}"
  log "${YELLOW}   查看日志: $FRONTEND_LOG${NC}"
fi

# 显示所有启动的进程
log ""
log "${BLUE}=== 所有服务已启动 ===${NC}"
log "${GREEN}Strapi后端 (PID: $STRAPI_PID): http://localhost:1337${NC}"
log "${GREEN}Express中间层 (PID: $EXPRESS_PID): http://localhost:3001${NC}"
log "${GREEN}前端应用 (PID: $FRONTEND_PID): http://localhost:8083${NC}"
log ""
log "${BLUE}日志文件:${NC}"
log "- Strapi: $STRAPI_LOG"
log "- Express中间层: $EXPRESS_LOG"
log "- 前端: $FRONTEND_LOG"
log "- 主日志: $MASTER_LOG"
log ""
log "${YELLOW}提示: 使用'pkill -f node'命令可以停止所有服务${NC}"
log "${BLUE}=== 完成 ===${NC}"

# 监控所有进程并实时显示日志
log ""
log "${BLUE}正在实时显示所有服务的日志 (按Ctrl+C退出)...${NC}"
tail -f $STRAPI_LOG $EXPRESS_LOG $FRONTEND_LOG
