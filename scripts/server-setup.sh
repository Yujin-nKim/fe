#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# 서버 타입 확인 (Front/Back)
if [ "$1" = "front" ]; then
    SERVER_TYPE="front"
    log_info "Front Server 설정을 시작합니다..."
elif [ "$1" = "back" ]; then
    SERVER_TYPE="back"
    log_info "Back Server 설정을 시작합니다..."
else
    log_error "사용법: $0 [front|back]"
    exit 1
fi

# 기본 패키지 업데이트
log_info "시스템 패키지를 업데이트합니다..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
log_info "필수 패키지를 설치합니다..."
sudo apt install -y curl wget git unzip vim htop net-tools

# Docker 설치 확인 및 설치
if ! command -v docker &> /dev/null; then
    log_info "Docker를 설치합니다..."
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt update
    sudo apt install -y docker-ce docker-ce-cli containerd.io
    sudo usermod -aG docker ubuntu
    sudo systemctl enable docker
    sudo systemctl start docker
    log_success "Docker 설치 완료"
else
    log_info "Docker가 이미 설치되어 있습니다."
fi

# Docker Compose 설치 확인 및 설치
if ! command -v docker-compose &> /dev/null; then
    log_info "Docker Compose를 설치합니다..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    log_success "Docker Compose 설치 완료"
else
    log_info "Docker Compose가 이미 설치되어 있습니다."
fi

# 디렉토리 생성
log_info "필요한 디렉토리를 생성합니다..."
mkdir -p /home/ubuntu/logs
mkdir -p /home/ubuntu/backups

# Front Server 전용 설정
if [ "$SERVER_TYPE" = "front" ]; then
    log_info "Front Server 전용 설정을 진행합니다..."
    
    # SSH 설정 (Back Server 접근용)
    if [ ! -f "/home/ubuntu/.ssh/config" ]; then
        log_info "SSH 설정을 구성합니다..."
        cat > /home/ubuntu/.ssh/config << EOF
Host back-server
    HostName 10.0.2.165
    User ubuntu
    StrictHostKeyChecking no
    UserKnownHostsFile /dev/null
EOF
        chmod 600 /home/ubuntu/.ssh/config
        log_success "SSH 설정 완료"
    fi
    
    # Nginx 관련 디렉토리
    mkdir -p /home/ubuntu/logs/nginx
fi

# Back Server 전용 설정
if [ "$SERVER_TYPE" = "back" ]; then
    log_info "Back Server 전용 설정을 진행합니다..."
    
    # 데이터베이스 백업 디렉토리
    mkdir -p /home/ubuntu/backups/postgresql
    mkdir -p /home/ubuntu/backups/redis
    
    # 로그 디렉토리
    mkdir -p /home/ubuntu/logs/spring
    mkdir -p /home/ubuntu/logs/postgresql
    mkdir -p /home/ubuntu/logs/redis
fi

# 로그 로테이션 설정
log_info "로그 로테이션을 설정합니다..."
sudo cat > /etc/logrotate.d/seuraseung << EOF
/home/ubuntu/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload rsyslog > /dev/null 2>&1 || true
    endscript
}

/home/ubuntu/logs/*/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
}
EOF

# 시스템 모니터링 스크립트 생성
log_info "시스템 모니터링 스크립트를 생성합니다..."
cat > /home/ubuntu/system-monitor.sh << 'EOF'
#!/bin/bash

# 시스템 상태 확인 스크립트
echo "=== 시스템 상태 모니터링 $(date) ==="
echo

echo "📊 디스크 사용량:"
df -h

echo
echo "💾 메모리 사용량:"
free -h

echo
echo "🔥 CPU 사용률:"
top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1

echo
echo "🐳 Docker 컨테이너 상태:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo
echo "📋 Docker 이미지:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"

echo
echo "🌐 네트워크 연결:"
netstat -tuln | grep LISTEN

echo
echo "📝 최근 로그 (마지막 5줄):"
tail -5 /home/ubuntu/deployment.log 2>/dev/null || echo "배포 로그 없음"

EOF

chmod +x /home/ubuntu/system-monitor.sh
log_success "시스템 모니터링 스크립트 생성 완료"

# 자동 정리 스크립트 생성
log_info "자동 정리 스크립트를 생성합니다..."
cat > /home/ubuntu/cleanup.sh << 'EOF'
#!/bin/bash

echo "🧹 시스템 정리를 시작합니다..."

# Docker 정리
echo "Docker 컨테이너 및 이미지 정리 중..."
docker container prune -f
docker image prune -f
docker volume prune -f
docker network prune -f

# 로그 파일 정리 (30일 이상 된 압축 로그)
echo "오래된 로그 파일 정리 중..."
find /home/ubuntu/logs -name "*.gz" -mtime +30 -delete

# 임시 파일 정리
echo "임시 파일 정리 중..."
find /tmp -type f -atime +7 -delete 2>/dev/null

# 백업 파일 정리 (90일 이상)
echo "오래된 백업 파일 정리 중..."
find /home/ubuntu/backups -type f -mtime +90 -delete 2>/dev/null

echo "✅ 시스템 정리 완료: $(date)"
EOF

chmod +x /home/ubuntu/cleanup.sh
log_success "자동 정리 스크립트 생성 완료"

# Cron 설정
log_info "정기 작업(Cron)을 설정합니다..."
(crontab -l 2>/dev/null; echo "0 2 * * 0 /home/ubuntu/cleanup.sh >> /home/ubuntu/logs/cleanup.log 2>&1") | crontab -
(crontab -l 2>/dev/null; echo "0 */6 * * * /home/ubuntu/system-monitor.sh >> /home/ubuntu/logs/monitor.log 2>&1") | crontab -
log_success "Cron 작업 설정 완료"

# 방화벽 설정 (기본)
log_info "기본 방화벽 규칙을 확인합니다..."
sudo ufw status
log_info "방화벽 설정은 AWS Security Group에서 관리됩니다."

# 설정 완료
log_success "🎉 $SERVER_TYPE 서버 설정이 완료되었습니다!"

echo
echo "📋 설정된 항목들:"
echo "- Docker 및 Docker Compose 설치"
echo "- 필요한 디렉토리 생성"
echo "- 로그 로테이션 설정"
echo "- 시스템 모니터링 스크립트"
echo "- 자동 정리 스크립트"
echo "- Cron 작업 설정"

if [ "$SERVER_TYPE" = "front" ]; then
    echo "- SSH 설정 (Back Server 접근용)"
fi

echo
echo "🔧 유용한 명령어들:"
echo "- 시스템 상태 확인: ./system-monitor.sh"
echo "- 수동 정리 실행: ./cleanup.sh"
echo "- Docker 상태 확인: docker ps"
echo "- 로그 확인: tail -f /home/ubuntu/logs/deployment.log"

echo
echo "🚀 이제 CI/CD 파이프라인에서 배포를 진행할 수 있습니다!"