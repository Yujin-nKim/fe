#!/bin/bash

# 서버 초기 설정 스크립트 (백엔드/프론트엔드 서버 공통)
# Ubuntu 22.04에서 실행

set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_TYPE=${1:-"backend"}  # backend 또는 frontend

echo -e "${BLUE}🔧 $SERVER_TYPE 서버 설정 시작...${NC}"

# 시스템 업데이트
echo -e "${YELLOW}�� 시스템 패키지 업데이트...${NC}"
sudo apt update && sudo apt upgrade -y

# 기본 패키지 설치
echo -e "${YELLOW}📦 기본 패키지 설치...${NC}"
sudo apt install -y curl wget unzip vim htop git software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Docker 설치
echo -e "${YELLOW}🐳 Docker 설치 중...${NC}"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker 서비스 시작
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER

# Docker Compose 설치
echo -e "${YELLOW}🐳 Docker Compose 설치 중...${NC}"
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 네트워크 생성
sudo docker network create seuraseung-network || echo "네트워크가 이미 존재합니다."

if [ "$SERVER_TYPE" == "backend" ]; then
    echo -e "${YELLOW}🗄️ 백엔드 서버 전용 설정...${NC}"
    
    # Java 21 설치
    echo -e "${YELLOW}☕ Java 21 설치 중...${NC}"
    sudo apt install -y openjdk-21-jdk
    
    # PostgreSQL 15 설치
    echo -e "${YELLOW}🐘 PostgreSQL 15 설치 중...${NC}"
    sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    sudo apt update
    sudo apt install -y postgresql-15 postgresql-client-15
    
    # PostgreSQL 서비스 시작
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # PostgreSQL 기본 설정
    sudo -u postgres psql << SQL
ALTER USER postgres PASSWORD 'password';
CREATE DATABASE seurasaeng;
\q
SQL

    # Redis 설치
    echo -e "${YELLOW}🗄️ Redis 설치 중...${NC}"
    sudo apt install -y redis-server
    sudo systemctl start redis-server
    sudo systemctl enable redis-server
    
    # 방화벽 설정
    sudo ufw allow 8080  # Spring Boot
    sudo ufw allow 5432  # PostgreSQL
    sudo ufw allow 6379  # Redis
    
    echo -e "${GREEN}✅ 백엔드 서버 설정 완료!${NC}"
    echo "Java 버전: $(java -version)"
    echo "PostgreSQL 상태: $(sudo systemctl is-active postgresql)"
    echo "Redis 상태: $(sudo systemctl is-active redis-server)"
fi

if [ "$SERVER_TYPE" == "frontend" ]; then
    echo -e "${YELLOW}🌐 프론트엔드 서버 전용 설정...${NC}"
    
    # Node.js 18 설치 (디버깅용)
    echo -e "${YELLOW}📦 Node.js 18 설치 중...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
    
    # 방화벽 설정
    sudo ufw allow 80    # HTTP
    sudo ufw allow 443   # HTTPS
    
    echo -e "${GREEN}✅ 프론트엔드 서버 설정 완료!${NC}"
    echo "Node.js 버전: $(node --version)"
    echo "npm 버전: $(npm --version)"
fi

# 공통 방화벽 설정
sudo ufw allow ssh
sudo ufw --force enable

# 시스템 리소스 최적화
echo -e "${YELLOW}⚡ 시스템 최적화 중...${NC}"

# Swap 설정 (1GB)
if [ ! -f /swapfile ]; then
    sudo fallocate -l 1G /swapfile
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
fi

# 자동 정리 cron 설정
(crontab -l 2>/dev/null; echo "0 2 * * * docker system prune -f") | crontab -

echo ""
echo -e "${GREEN}🎉 $SERVER_TYPE 서버 설정 완료!${NC}"
echo ""
echo -e "${BLUE}📋 확인사항:${NC}"
echo "Docker 버전: $(docker --version)"
echo "Docker Compose 버전: $(docker-compose --version)"
echo "디스크 사용량: $(df -h / | tail -1 | awk '{print $5}')"
echo "메모리 사용량: $(free -h | grep Mem | awk '{print $3"/"$2}')"
echo ""
echo -e "${YELLOW}⚠️ 중요: 로그아웃 후 재로그인하여 Docker 그룹 권한을 적용하세요.${NC}"
echo "재로그인 후 'docker ps' 명령어가 sudo 없이 실행되는지 확인하세요."
