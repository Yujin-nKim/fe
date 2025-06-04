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
log_info "🚀 Frontend 배포를 시작합니다..."

# 현재 디렉토리 확인
cd /home/ubuntu

# Docker 이미지 로드
if [ -f "frontend-image.tar.gz" ]; then
    log_info "Docker 이미지를 로드합니다..."
    docker load < frontend-image.tar.gz
    if [ $? -eq 0 ]; then
        log_success "Docker 이미지 로드 완료"
        rm -f frontend-image.tar.gz
    else
        log_error "Docker 이미지 로드 실패"
        exit 1
    fi
else
    log_warning "frontend-image.tar.gz 파일이 없습니다. 기존 이미지를 사용합니다."
fi

# 기존 컨테이너 중지 및 제거
log_info "기존 컨테이너들을 중지합니다..."
docker-compose -f seurasaeng_fe/docker-compose.yml down --remove-orphans

# 사용하지 않는 이미지 정리
log_info "사용하지 않는 Docker 이미지를 정리합니다..."
docker image prune -f

# 로그 디렉토리 생성
mkdir -p /home/ubuntu/logs/nginx

# Nginx 설정 파일 확인
if [ ! -d "frontend/nginx" ]; then
    log_error "Nginx 설정 파일이 없습니다."
    exit 1
fi

# 새 컨테이너 시작
log_info "새로운 컨테이너를 시작합니다..."
docker-compose -f seurasaeng_fe/docker-compose.yml up -d

# 헬스체크 대기
log_info "서비스가 정상적으로 시작될 때까지 대기합니다..."
sleep 10

# 서비스 상태 확인
check_health() {
    local max_attempts=20
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f http://localhost/health >/dev/null 2>&1; then
            log_success "Frontend 서비스가 정상적으로 시작되었습니다."
            return 0
        fi
        
        log_info "Frontend 상태 확인 중... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_error "Frontend 서비스 시작에 실패했습니다."
    return 1
}

# 헬스체크 실행
check_health

# 백엔드 연결 테스트
log_info "백엔드 서버 연결을 테스트합니다..."
if curl -f http://10.0.2.165:8080/api/actuator/health >/dev/null 2>&1; then
    log_success "백엔드 서버 연결 정상"
else
    log_warning "백엔드 서버 연결을 확인할 수 없습니다. 백엔드가 실행 중인지 확인하세요."
fi

# SSL 인증서 상태 확인
log_info "SSL 인증서 상태를 확인합니다..."
if command -v certbot >/dev/null 2>&1; then
    CERT_STATUS=$(sudo certbot certificates 2>/dev/null | grep -c "seurasaeng.site" || echo "0")
    if [ "$CERT_STATUS" -gt 0 ]; then
        log_success "SSL 인증서가 설치되어 있습니다."
    else
        log_warning "SSL 인증서가 없습니다. 다음 명령어로 설치하세요:"
        log_warning "sudo certbot --nginx -d seurasaeng.site -d www.seurasaeng.site"
    fi
else
    log_warning "Certbot이 설치되지 않았습니다. SSL 설정이 필요합니다."
fi

# 포트 상태 확인
log_info "포트 상태를 확인합니다..."
if netstat -tuln | grep -q ":80 "; then
    log_success "포트 80이 정상적으로 바인딩되었습니다."
else
    log_error "포트 80 바인딩에 실패했습니다."
fi

# 최종 상태 확인
log_info "전체 서비스 상태를 확인합니다..."
docker-compose -f seurasaeng_fe/docker-compose.yml ps

# 배포 완료 메시지
log_success "🎉 Frontend 배포가 완료되었습니다!"
log_info "🌐 웹사이트 접속: https://seurasaeng.site"
log_info "🔍 헬스체크: https://seurasaeng.site/health"
log_info "📊 서비스 상태 확인: docker-compose -f seurasaeng_fe/docker-compose.yml ps"
log_info "📋 로그 확인: docker-compose -f seurasaeng_fe/docker-compose.yml logs -f"

# 배포 정보 기록
echo "$(date): Frontend deployment completed" >> /home/ubuntu/deployment.log