-- PostgreSQL 초기화 스크립트
-- 데이터베이스: seuraseung
-- 스키마: seurasaeng-prod, seurasaeng-test

-- UTF-8 인코딩 설정
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- 스키마 생성
CREATE SCHEMA IF NOT EXISTS "seurasaeng-prod";
CREATE SCHEMA IF NOT EXISTS "seurasaeng-test";

-- 권한 설정
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-prod" TO seuraseung;
GRANT ALL PRIVILEGES ON SCHEMA "seurasaeng-test" TO seuraseung;

-- 각 스키마에 대한 사용 권한 부여
GRANT USAGE ON SCHEMA "seurasaeng-prod" TO seuraseung;
GRANT USAGE ON SCHEMA "seurasaeng-test" TO seuraseung;

-- 미래에 생성될 테이블들에 대한 권한 부여
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL PRIVILEGES ON TABLES TO seuraseung;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL PRIVILEGES ON TABLES TO seuraseung;

-- 시퀀스에 대한 권한 부여
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL PRIVILEGES ON SEQUENCES TO seuraseung;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL PRIVILEGES ON SEQUENCES TO seuraseung;

-- 함수에 대한 권한 부여
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-prod" GRANT ALL PRIVILEGES ON FUNCTIONS TO seuraseung;
ALTER DEFAULT PRIVILEGES IN SCHEMA "seurasaeng-test" GRANT ALL PRIVILEGES ON FUNCTIONS TO seuraseung;

-- 확장 기능 설치 (필요한 경우)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 로깅을 위한 함수 생성
CREATE OR REPLACE FUNCTION log_schema_activity()
RETURNS event_trigger AS $$
BEGIN
    RAISE NOTICE 'Schema activity detected: %', tg_tag;
END;
$$ LANGUAGE plpgsql;

-- 이벤트 트리거 생성 (선택사항)
-- CREATE EVENT TRIGGER schema_activity_log ON ddl_command_end
--     EXECUTE FUNCTION log_schema_activity();

-- 초기 테이블 생성 예시 (실제 애플리케이션에서는 Hibernate가 처리)
-- 이 부분은 Spring Boot의 schema.sql이나 Hibernate DDL이 처리하므로 주석 처리

/*
-- prod 스키마 기본 테이블들
CREATE TABLE IF NOT EXISTS "seurasaeng-prod".users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- test 스키마 기본 테이블들
CREATE TABLE IF NOT EXISTS "seurasaeng-test".users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_users_username_prod ON "seurasaeng-prod".users(username);
CREATE INDEX IF NOT EXISTS idx_users_email_prod ON "seurasaeng-prod".users(email);

CREATE INDEX IF NOT EXISTS idx_users_username_test ON "seurasaeng-test".users(username);
CREATE INDEX IF NOT EXISTS idx_users_email_test ON "seurasaeng-test".users(email);
*/

-- 연결 정보 로그
DO $$
BEGIN
    RAISE NOTICE 'PostgreSQL 초기화 완료';
    RAISE NOTICE '생성된 스키마: seurasaeng-prod, seurasaeng-test';
    RAISE NOTICE '데이터베이스: %', current_database();
    RAISE NOTICE '현재 사용자: %', current_user;
    RAISE NOTICE '현재 시간: %', now();
END $$;