#!/bin/bash

# EdGoing项目宝塔部署脚本 | EdGoing Project Baota Deployment Script
# 此脚本应在宝塔服务器上运行 | This script should be run on the Baota server

# 设置颜色 | Set colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # 无颜色 | No color

# 日志目录 | Log directory
LOG_DIR="/www/wwwlogs/edgoing"
mkdir -p $LOG_DIR

# 记录日志的函数 | Function to log messages
log() {
  local message="[$(date '+%Y-%m-%d %H:%M:%S')] $1"
  echo -e "$message" | tee -a "$LOG_DIR/deploy.log"
}

# 项目目录 | Project directory
PROJECT_DIR="/www/wwwroot/edgoing"
cd $PROJECT_DIR || { log "${RED}项目目录不存在: $PROJECT_DIR${NC} | Project directory does not exist: $PROJECT_DIR"; exit 1; }

log "${BLUE}=== 开始部署EdGoing项目 | Starting deployment of EdGoing project ===${NC}"

# 1. 拉取最新代码 | Pull latest code
log "${GREEN}1. 拉取最新代码... | Pulling latest code...${NC}"
git pull origin main || { log "${RED}拉取代码失败 | Failed to pull code${NC}"; exit 1; }

# 2. 安装依赖 | Install dependencies
log "${GREEN}2. 安装项目依赖... | Installing project dependencies...${NC}"
npm install || { log "${RED}安装依赖失败 | Failed to install dependencies${NC}"; exit 1; }

# 3. 安装Strapi依赖 | Install Strapi dependencies
log "${GREEN}3. 安装Strapi依赖... | Installing Strapi dependencies...${NC}"
cd my-strapi-backend || { log "${RED}Strapi目录不存在 | Strapi directory does not exist${NC}"; exit 1; }
npm install || { log "${RED}安装Strapi依赖失败 | Failed to install Strapi dependencies${NC}"; exit 1; }
cd ..

# 4. 安装Express中间层依赖 | Install Express middleware dependencies
log "${GREEN}4. 安装Express中间层依赖... | Installing Express middleware dependencies...${NC}"
cd server-express || { log "${RED}Express目录不存在 | Express directory does not exist${NC}"; exit 1; }
npm install || { log "${RED}安装Express依赖失败 | Failed to install Express dependencies${NC}"; exit 1; }
cd ..

# 5. 构建前端 | Build frontend
log "${GREEN}5. 构建前端应用... | Building frontend application...${NC}"
npm run build:prod || { log "${RED}构建前端应用失败 | Failed to build frontend application${NC}"; exit 1; }

# 6. 构建Strapi | Build Strapi
log "${GREEN}6. 构建Strapi... | Building Strapi...${NC}"
cd my-strapi-backend || { log "${RED}Strapi目录不存在 | Strapi directory does not exist${NC}"; exit 1; }
npm run build || { log "${RED}构建Strapi失败 | Failed to build Strapi${NC}"; exit 1; }
cd ..

# 7. 使用PM2启动所有服务 | Start all services using PM2
log "${GREEN}7. 使用PM2启动所有服务... | Starting all services using PM2...${NC}"
pm2 delete all || true # 停止所有现有服务 | Stop all existing services
pm2 start ecosystem.config.js || { log "${RED}启动服务失败 | Failed to start services${NC}"; exit 1; }

# 8. 保存PM2配置 | Save PM2 configuration
log "${GREEN}8. 保存PM2配置... | Saving PM2 configuration...${NC}"
pm2 save || { log "${RED}保存PM2配置失败 | Failed to save PM2 configuration${NC}"; exit 1; }

log "${BLUE}=== 部署完成 | Deployment completed ===${NC}"
log "${GREEN}Strapi后端 | Strapi backend: http://localhost:1337${NC}"
log "${GREEN}Express中间层 | Express middleware: http://localhost:3001${NC}"
log "${GREEN}前端应用 | Frontend application: http://localhost:8083${NC}"
log "${YELLOW}请确保在宝塔面板中配置了正确的反向代理 | Please ensure correct reverse proxy is configured in Baota Panel${NC}"
log "${BLUE}=== 完成 | Finished ===${NC}"
