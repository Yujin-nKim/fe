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

# 데이터베이스 설정 시작
log_info "🗄️ 데이터베이스 초기 설정을 시작합니다..."

# 현재 디렉토리 확인
cd /home/ubuntu

# 환경변수 로드
if [ -f .env ]; then
    source .env
    log_info "환경변수 파일을 로드했습니다."
else
    log_warning "환경변수 파일이 없습니다. 기본값을 사용합니다."
    POSTGRES_USER=${POSTGRES_USER:-seuraseung}
    POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-seuraseung123!}
    REDIS_PASSWORD=${REDIS_PASSWORD:-redis123!}
fi

# PostgreSQL 연결 대기
wait_for_postgres() {
    local max_attempts=30
    local attempt=1
    
    log_info "PostgreSQL 연결을 확인합니다..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec seuraseung-postgres pg_isready -U $POSTGRES_USER -d seuraseung >/dev/null 2>&1; then
            log_success "PostgreSQL 연결 성공"
            return 0
        fi
        
        log_info "PostgreSQL 연결 대기 중... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_error "PostgreSQL 연결에 실패했습니다."
    return 1
}

# Redis 연결 대기
wait_for_redis() {
    local max_attempts=30
    local attempt=1
    
    log_info "Redis 연결을 확인합니다..."
    
    while [ $attempt -le $max_attempts ]; do
        if docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD ping >/dev/null 2>&1; then
            log_success "Redis 연결 성공"
            return 0
        fi
        
        log_info "Redis 연결 대기 중... ($attempt/$max_attempts)"
        sleep 5
        ((attempt++))
    done
    
    log_error "Redis 연결에 실패했습니다."
    return 1
}

# PostgreSQL 스키마 확인 및 생성
setup_postgres_schemas() {
    log_info "PostgreSQL 스키마를 설정합니다..."
    
    # 스키마 존재 확인
    PROD_SCHEMA_EXISTS=$(docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -t -c "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'seurasaeng-prod';" 2>/dev/null | xargs)
    TEST_SCHEMA_EXISTS=$(docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -t -c "SELECT 1 FROM information_schema.schemata WHERE schema_name = 'seurasaeng-test';" 2>/dev/null | xargs)
    
    if [ "$PROD_SCHEMA_EXISTS" = "1" ]; then
        log_info "seurasaeng-prod 스키마가 이미 존재합니다."
    else
        log_info "seurasaeng-prod 스키마를 생성합니다..."
        docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -c "CREATE SCHEMA IF NOT EXISTS \"seurasaeng-prod\";"
        docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -c "GRANT ALL PRIVILEGES ON SCHEMA \"seurasaeng-prod\" TO $POSTGRES_USER;"
    fi
    
    if [ "$TEST_SCHEMA_EXISTS" = "1" ]; then
        log_info "seurasaeng-test 스키마가 이미 존재합니다."
    else
        log_info "seurasaeng-test 스키마를 생성합니다..."
        docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -c "CREATE SCHEMA IF NOT EXISTS \"seurasaeng-test\";"
        docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -c "GRANT ALL PRIVILEGES ON SCHEMA \"seurasaeng-test\" TO $POSTGRES_USER;"
    fi
    
    log_success "PostgreSQL 스키마 설정 완료"
}

# Redis 데이터베이스 설정
setup_redis_databases() {
    log_info "Redis 데이터베이스를 설정합니다..."
    
    # Redis 데이터베이스 0: prod 환경
    # Redis 데이터베이스 1: test 환경
    
    # 기본 키-값 설정 (설정 확인용)
    docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD -n 0 SET "seurasaeng:prod:initialized" "$(date)" EX 86400 >/dev/null 2>&1
    docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD -n 1 SET "seurasaeng:test:initialized" "$(date)" EX 86400 >/dev/null 2>&1
    
    # Redis 정보 확인
    REDIS_INFO=$(docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD INFO server 2>/dev/null | grep redis_version)
    log_info "Redis 버전: $REDIS_INFO"
    
    log_success "Redis 데이터베이스 설정 완료"
}

# 데이터베이스 상태 확인
check_database_status() {
    log_info "데이터베이스 상태를 확인합니다..."
    
    # PostgreSQL 스키마 확인
    log_info "PostgreSQL 스키마 목록:"
    docker exec seuraseung-postgres psql -U $POSTGRES_USER -d seuraseung -c "\dn" 2>/dev/null
    
    # Redis 데이터베이스 확인
    log_info "Redis 키 확인 (DB 0 - prod):"
    docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD -n 0 KEYS "*seurasaeng*" 2>/dev/null
    
    log_info "Redis 키 확인 (DB 1 - test):"
    docker exec seuraseung-redis redis-cli -a $REDIS_PASSWORD -n 1 KEYS "*seurasaeng*" 2>/dev/null
}

# 백업 스크립트 생성
create_backup_script() {
    log_info "데이터베이스 백업 스크립트를 생성합니다..."
    
    cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash

# 백업 디렉토리 생성
mkdir -p /home/ubuntu/backups/$(date +%Y%m%d)

# PostgreSQL 백업
docker exec seuraseung-postgres pg_dump -U seuraseung -d seuraseung --schema="seurasaeng-prod" > /home/ubuntu/backups/$(date +%Y%m%d)/postgres-prod-$(date +%H%M).sql
docker exec seuraseung-postgres pg_dump -U seuraseung -d seuraseung --schema="seurasaeng-test" > /home/ubuntu/backups/$(date +%Y%m%d)/postgres-test-$(date +%H%M).sql

# Redis 백업
docker exec seuraseung-redis redis-cli -a redis123! --rdb /data/dump-$(date +%Y%m%d-%H%M).rdb BGSAVE

echo "백업 완료: $(date)"
EOF

    chmod +x /home/ubuntu/backup-db.sh
    log_success "백업 스크립트 생성 완료: /home/ubuntu/backup-db.sh"
}

# 메인 실행 흐름
main() {
    # 데이터베이스 연결 대기
    wait_for_postgres
    if [ $? -ne 0 ]; then
        log_error "PostgreSQL 연결 실패로 인해 설정을 중단합니다."
        exit 1
    fi
    
    wait_for_redis
    if [ $? -ne 0 ]; then
        log_error "Redis 연결 실패로 인해 설정을 중단합니다."
        exit 1
    fi
    
    # 스키마 및 데이터베이스 설정
    setup_postgres_schemas
    setup_redis_databases
    
    # 상태 확인
    check_database_status
    
    # 백업 스크립트 생성
    create_backup_script
    
    # 완료 메시지
    log_success "🎉 데이터베이스 초기 설정이 완료되었습니다!"
    log_info "📊 PostgreSQL 스키마: seurasaeng-prod, seurasaeng-test"
    log_info "📊 Redis 데이터베이스: 0 (prod), 1 (test)"
    log_info "💾 백업 스크립트: /home/ubuntu/backup-db.sh"
    
    # 설정 정보 기록
    echo "$(date): Database setup completed" >> /home/ubuntu/deployment.log
}

# 스크립트 실행
main "$@"