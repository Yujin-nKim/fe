#!/bin/bash

# 배포 상태 확인 스크립트

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📊 Seuraseung 배포 상태 확인${NC}"
echo ""

# 프로덕션 환경 확인
echo -e "${YELLOW}🌐 프로덕션 환경 확인:${NC}"
echo -n "Frontend (13.125.3.120): "
if curl -s --max-time 5 http://13.125.3.120/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo -n "Backend (10.0.2.165:8080): "
if curl -s --max-time 5 http://10.0.2.165:8080/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ OK${NC}"
else
    echo -e "${RED}❌ FAILED${NC}"
fi

echo ""
echo -e "${YELLOW}🔗 접속 링크:${NC}"
echo "🌐 메인 사이트: http://13.125.3.120"
echo "🔧 백엔드 API: http://10.0.2.165:8080/api/health"

echo ""
echo -e "${YELLOW}📋 GitHub Actions 확인:${NC}"
echo "https://github.com/YOUR_USERNAME/Seur-A-Saeng/actions"

echo ""
echo -e "${YELLOW}📋 Docker 상태 (서버에서 실행):${NC}"
echo "백엔드 서버: docker ps | grep seuraseung-backend"
echo "프론트엔드 서버: docker ps | grep seuraseung-frontend"
