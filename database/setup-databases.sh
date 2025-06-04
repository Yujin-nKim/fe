# database/setup-databases.sh 생성 (터미널 방법)
tee database/setup-databases.sh > /dev/null << 'SCRIPT_END'
#!/bin/bash

# 데이터베이스 및 Redis 설정 스크립트
set -e

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Seuraseung 데이터베이스 설정 시작...${NC}"

# 환경 변수 기본값 설정
POSTGRES_HOST=${POSTGRES_HOST:-localhost}
POSTGRES_PORT=${POSTGRES_PORT:-5432}
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-password}
POSTGRES_DB=${POSTGRES_DB:-seurasaeng}

REDIS_HOST=${REDIS_HOST:-localhost}
REDIS_PORT=${REDIS_PORT:-6379}

# PostgreSQL 연결 확인
echo -e "${YELLOW}📊 PostgreSQL 연결 확인 중...${NC}"
until PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -c '\q' 2>/dev/null; do
  echo -e "${RED}PostgreSQL이 아직 준비되지 않았습니다. 5초 후 재시도...${NC}"
  sleep 5
done

echo -e "${GREEN}✅ PostgreSQL 연결 성공!${NC}"

# 데이터베이스 생성 (이미 존재하면 무시)
echo -e "${YELLOW}📊 데이터베이스 생성 중...${NC}"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -c "CREATE DATABASE $POSTGRES_DB;" 2>/dev/null || echo "데이터베이스가 이미 존재합니다."

# PostgreSQL 스키마 생성
echo -e "${YELLOW}📊 PostgreSQL 스키마 생성 중...${NC}"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB << 'SQL_END'
-- seurasaeng-prod 스키마
CREATE SCHEMA IF NOT EXISTS "seurasaeng-prod";

-- seurasaeng-test 스키마
CREATE SCHEMA IF NOT EXISTS "seurasaeng-test";

-- 권한 설정
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-prod" TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-test" TO postgres;

-- 기본 권한 설정 (향후 생성될 테이블용)
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL ON SEQUENCES TO postgres;

-- 스키마 확인
SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'seurasaeng%';
SQL_END

echo -e "${GREEN}✅ PostgreSQL 스키마 생성 완료!${NC}"

# Redis 연결 확인
echo -e "${YELLOW}🗄️ Redis 연결 확인 중...${NC}"
until redis-cli -h $REDIS_HOST -p $REDIS_PORT ping > /dev/null 2>&1; do
  echo -e "${RED}Redis가 아직 준비되지 않았습니다. 5초 후 재시도...${NC}"
  sleep 5
done

echo -e "${GREEN}✅ Redis 연결 성공!${NC}"

# Redis 데이터베이스 설정
echo -e "${YELLOW}🗄️ Redis 데이터베이스 설정 중...${NC}"

# DB 0: seurasaeng-prod (프로덕션)
redis-cli -h $REDIS_HOST -p $REDIS_PORT << 'REDIS_END'
SELECT 0
SET seurasaeng:schema "seurasaeng-prod"
SET seurasaeng:environment "production"
SET seurasaeng:created_at "2025-01-01T00:00:00Z"
REDIS_END

# DB 1: seurasaeng-test (테스트)
redis-cli -h $REDIS_HOST -p $REDIS_PORT << 'REDIS_TEST_END'
SELECT 1
SET seurasaeng:schema "seurasaeng-test"
SET seurasaeng:environment "test"
SET seurasaeng:created_at "2025-01-01T00:00:00Z"
REDIS_TEST_END

echo -e "${GREEN}✅ Redis 데이터베이스 설정 완료!${NC}"

# 설정 확인
echo -e "${BLUE}📋 설정 확인 중...${NC}"

echo "PostgreSQL 스키마 목록:"
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'seurasaeng%';"

echo ""
echo "Redis 데이터베이스 확인:"
echo "DB 0 (prod): $(redis-cli -h $REDIS_HOST -p $REDIS_PORT -n 0 GET seurasaeng:schema)"
echo "DB 1 (test): $(redis-cli -h $REDIS_HOST -p $REDIS_PORT -n 1 GET seurasaeng:schema)"

echo ""
echo -e "${GREEN}🎉 데이터베이스 설정 완료!${NC}"
echo ""
echo "다음 설정이 완료되었습니다:"
echo "✅ PostgreSQL 데이터베이스: $POSTGRES_DB"
echo "✅ PostgreSQL 스키마: seurasaeng-prod, seurasaeng-test"
echo "✅ Redis DB 0: seurasaeng-prod (production)"
echo "✅ Redis DB 1: seurasaeng-test (test)"
echo ""
echo "이제 애플리케이션을 시작할 수 있습니다!"
SCRIPT_END

# 실행 권한 부여
chmod +x database/setup-databases.sh

echo "✅ 데이터베이스 설정 스크립트 생성 완료!"