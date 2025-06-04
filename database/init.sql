-- Seuraseung 프로젝트 데이터베이스 초기화
-- PostgreSQL 15.12용

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS "seurasaeng-prod";
CREATE SCHEMA IF NOT EXISTS "seurasaeng-test";

-- 권한 설정
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-prod" TO postgres;
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-test" TO postgres;

-- 기본 권한 설정 (향후 생성될 테이블용)
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL ON SEQUENCES TO postgres;

-- 확인 로그
DO $$
BEGIN
    RAISE NOTICE '✅ Seuraseung 데이터베이스 스키마 생성 완료!';
    RAISE NOTICE '📋 생성된 스키마: seurasaeng-prod, seurasaeng-test';
END $$;
