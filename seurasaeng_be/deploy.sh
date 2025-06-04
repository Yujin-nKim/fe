#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 로그 함수들
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 배포 시작
log_info "🚀 Backend 배포를 시작합니다..."

# 현재 디렉토리 확인
cd /home/ubuntu

# 환경변수 파일 생성 (존재하지 않을 경우)
if [ ! -f .env ]; then
    log_info "환경변수 파일(.env)을 생성합니다..."
    cat > .env << EOF
# Database Configuration
POSTGRES_USER=seuraseung
POSTGRES_PASSWORD=seuraseung123!
DB_SCHEMA=seurasaeng-prod

# Redis Configuration  
REDIS_PASSWORD=redis123!
REDIS_DATABASE=0

# Spring Configuration
SPRING_PROFILES_ACTIVE=prod
JPA_DDL_AUTO=update
JPA_SHOW_SQL=false

# Logging Configuration
LOG_LEVEL=INFO
APP_LOG_LEVEL=INFO
EOF
    log_success "환경변수 파일이 생성되었습니다."
fi

# Docker 이미지 로드
if [ -f "seurasaeng_be-image.tar.gz" ]; then
    log_info "Docker 이미지를 로드합니다..."
    docker load < seurasaeng_be-image.tar.gz
    if [ $? -eq 0 ]; then
        log_success "Docker 이미지 로드 완료"
        rm -f seurasaeng_be-image.tar.gz
    else
        log_error "Docker 이미지 로드 실패"
        exit 1
    fi
else
    log_warning "seurasaeng_be-image.tar.gz 파일이 없습니다. 기존 이미지를 사용합니다."
fi

# 기존 컨테이너 중지 및 제거
log_info "기존 컨테이너들을 중지합니다..."
docker-compose -f docker-compose.yml down --remove-orphans

# 사용하지 않는 이미지 정리
log_info "사용하지 않는 Docker 이미지를 정리합니다..."
docker image prune -f

# 새 컨테이너 시작
log_info "새로운 컨테이너들을 시작합니다..."
docker-compose -f docker-compose.yml up -d

# 헬스체크 대기
log_info "서비스가 정상적으로 시작될 때까지 대기합니다..."
sleep 30

# 서비스 상태 확인
check_health() {
    local service_name=$1
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if docker-compose ps $service_name | grep -q "healthy\|Up"; then
            log_success "$service_name 서비스가 정상적으로 시작되었습니다."
            return 0
        fi
        
        log_info "$service_name 상태 확인 중... ($attempt/$max_attempts)"
        sleep 10
        ((attempt++))
    done
    
    log_error "$service_name 서비스 시작에 실패했습니다."
    return 1
}

# 각 서비스 헬스체크
log_info "서비스 상태를 확인합니다..."
check_health "postgres"
check_health "redis" 
check_health "backend"

# 최종 상태 확인
log_info "전체 서비스 상태를 확인합니다..."
docker-compose ps

# 로그 디렉토리 생성
mkdir -p /home/ubuntu/logs

# 배포 완료 메시지
log_success "🎉 Backend 배포가 완료되었습니다!"
log_info "📊 서비스 상태 확인: docker-compose ps"
log_info "📋 로그 확인: docker-compose logs -f [서비스명]"
log_info "🔍 Backend API Health Check: http://10.0.2.165:8080/api/actuator/health"
log_info "🌐 External API Access: https://seurasaeng.site/api/actuator/health"

# 배포 정보 기록
echo "$(date): Backend deployment completed" >> /home/ubuntu/deployment.log