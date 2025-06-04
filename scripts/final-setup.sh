#!/bin/bash

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# 로고 출력
print_logo() {
    echo -e "${PURPLE}"
    echo "╔═══════════════════════════════════════════════════════════╗"
    echo "║                    🚀 SEURASEUNG CI/CD                   ║"
    echo "║               프로젝트 최종 설정 스크립트                    ║"
    echo "╚═══════════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

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

log_step() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# 시작
print_logo

log_info "CI/CD 설정을 시작합니다..."

# 1. 파일 권한 설정
log_step "1. 파일 권한을 설정합니다..."

# 실행 가능한 스크립트들에 권한 부여
chmod +x backend/deploy.sh
chmod +x frontend/deploy.sh
chmod +x database/setup-db.sh
chmod +x scripts/final-setup.sh

log_success "파일 권한 설정 완료"

# 2. 디렉토리 구조 확인
log_step "2. 디렉토리 구조를 확인합니다..."

check_file() {
    if [ -f "$1" ]; then
        log_success "✅ $1"
    else
        log_error "❌ $1 (누락됨)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        log_success "✅ $1/"
    else
        log_error "❌ $1/ (누락됨)"
        return 1
    fi
}

# 필수 파일들 확인
log_info "필수 파일들을 확인합니다..."

# GitHub Actions 워크플로우
check_file ".github/workflows/deploy.yml"

# 백엔드 파일들
check_file "backend/Dockerfile"
check_file "backend/docker-compose.yml"
check_file "backend/deploy.sh"
check_file "backend/src/main/resources/application.yml"

# 프론트엔드 파일들
check_file "frontend/Dockerfile"
check_file "frontend/docker-compose.yml"
check_file "frontend/deploy.sh"
check_file "frontend/package.json"
check_file "frontend/.env"

# Nginx 설정
check_file "frontend/nginx/nginx.conf"
check_file "frontend/nginx/default.conf"

# 데이터베이스 설정
check_file "database/postgresql/init.sql"
check_file "database/redis/redis.conf"
check_file "database/setup-db.sh"

# 기타 스크립트
check_file "scripts/setup-secrets.md"

log_success "디렉토리 구조 확인 완료"

# 3. Git 설정 확인
log_step "3. Git 설정을 확인합니다..."

if [ -d ".git" ]; then
    CURRENT_BRANCH=$(git branch --show-current)
    log_info "현재 브랜치: $CURRENT_BRANCH"
    
    if [ "$CURRENT_BRANCH" = "cicd" ]; then
        log_success "cicd 브랜치에서 작업 중입니다."
    else
        log_warning "현재 브랜치가 cicd가 아닙니다. cicd 브랜치로 전환하세요."
    fi
else
    log_error "Git 저장소가 아닙니다."
fi

# 4. 환경변수 파일 생성
log_step "4. 샘플 환경변수 파일을 생성합니다..."

# Backend .env 샘플 생성
if [ ! -f "backend/.env.example" ]; then
    cat > backend/.env.example << 'EOF'
# 데이터베이스 설정
POSTGRES_USER=seuraseung
POSTGRES_PASSWORD=seuraseung123!
DB_SCHEMA=seurasaeng-prod

# Redis 설정
REDIS_PASSWORD=redis123!
REDIS_DATABASE=0

# Spring 설정
SPRING_PROFILES_ACTIVE=prod
JPA_DDL_AUTO=validate
JPA_SHOW_SQL=false

# 로깅 설정
LOG_LEVEL=INFO
APP_LOG_LEVEL=INFO
EOF
    log_success "Backend .env.example 파일 생성 완료"
fi

# 5. README 파일 생성
log_step "5. 프로젝트 README 파일을 업데이트합니다..."

cat > README.md << 'EOF'
# 🚀 Seuraseung Project

## 📋 프로젝트 개요
- **백엔드**: Spring Boot 3.3.12 + Java 21 + PostgreSQL + Redis
- **프론트엔드**: React 18 + Nginx
- **인프라**: AWS EC2 (Public/Private Subnet)
- **배포**: Docker + GitHub Actions CI/CD

## 🏗️ 아키텍처
```
┌─────────────────┐    ┌─────────────────┐
│   Front Server  │    │   Back Server   │
│  (Public: 80)   │────│ (Private: 8080) │
│ React + Nginx   │    │  Spring Boot    │
└─────────────────┘    └─────────────────┘
                              │
                       ┌──────┴──────┐
                       │ PostgreSQL  │ Redis
                       │ (Port: 5432)│ (Port: 6379)
                       └─────────────┘
```

## 🚀 CI/CD 파이프라인
1. **main** 브랜치에 푸시
2. GitHub Actions 자동 실행
3. 백엔드: Maven 빌드 → Docker 이미지 → Back Server 배포
4. 프론트엔드: npm 빌드 → Docker 이미지 → Front Server 배포
5. 데이터베이스 스키마 자동 설정

## 📁 프로젝트 구조
```
seuraseung/
├── .github/workflows/     # GitHub Actions
├── seurasaeng_be/         # Spring Boot 백엔드
├── seurasaeng_fe/         # React 프론트엔드
├── database/              # DB 초기화 스크립트
└── scripts/               # 설정 스크립트
```

## 🔧 로컬 개발 환경 설정
```bash
# 백엔드 실행
cd seurasaeng_be
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 프론트엔드 실행
cd seurasaeng_fe
npm install
npm start
```

## 🌐 서비스 URL
- **프론트엔드**: https://seurasaeng.site
- **백엔드 API**: https://seurasaeng.site/api
- **헬스체크**: https://seurasaeng.site/api/actuator/health

## 👥 팀원 작업 가이드
1. **백엔드 개발**: `feature/기능명-be` → `be` 브랜치 (`seurasaeng_be/` 폴더)
2. **프론트엔드 개발**: `feature/기능명-fe` → `fe` 브랜치 (`seurasaeng_fe/` 폴더)
3. 개발 완료 후: 통합 브랜치로 PR (팀원 2명 리뷰)
4. 통합: `dev` 브랜치로 PR (팀장 리뷰)
5. 배포: `main` 브랜치로 PR → 자동 배포!

## 📊 모니터링
- **로그 위치**: `/home/ubuntu/logs/`
- **배포 로그**: `/home/ubuntu/deployment.log`
- **컨테이너 상태**: `docker-compose ps`

## 🔐 보안 설정
- SSH Key를 통한 서버 접근
- Private 서브넷에 백엔드 격리
- Redis/PostgreSQL 비밀번호 보호
EOF

log_success "README.md 파일 생성 완료"

# 6. Git ignore 설정
log_step "6. .gitignore 파일을 확인합니다..."

if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# 환경변수 파일
.env
.env.local
.env.production
.env.development

# 로그 파일
*.log
logs/

# Docker 관련
*.tar.gz
docker-compose.override.yml

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Backend (Java/Spring)
backend/target/
backend/.mvn/wrapper/maven-wrapper.jar
backend/mvnw
backend/mvnw.cmd

# Frontend (React/Node)
frontend/node_modules/
frontend/build/
frontend/dist/
frontend/.pnp
frontend/.pnp.js

# 테스트 결과
frontend/coverage/

# 임시 파일
*.tmp
*.temp
*~

# 백업 파일
*.bak
*.backup
EOF
    log_success ".gitignore 파일 생성 완료"
else
    log_info ".gitignore 파일이 이미 존재합니다."
fi

# 7. Maven POM.xml 기본 템플릿 생성
log_step "7. Backend pom.xml 기본 템플릿을 생성합니다..."

if [ ! -f "backend/pom.xml" ]; then
    cat > backend/pom.xml << 'EOF'
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.12</version>
        <relativePath/>
    </parent>
    
    <groupId>onehajo</groupId>
    <artifactId>seuraseung</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    <name>seuraseung</name>
    <description>Seuraseung Backend Application</description>
    
    <properties>
        <java.version>21</java.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-redis</artifactId>
        </dependency>
        
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-actuator</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
EOF
    log_success "Backend pom.xml 템플릿 생성 완료"
else
    log_info "Backend pom.xml 파일이 이미 존재합니다."
fi

# 8. 기본 Java 클래스 생성
log_step "8. 기본 Java 애플리케이션 클래스를 생성합니다..."

mkdir -p backend/src/main/java/onehajo/seuraseung

if [ ! -f "backend/src/main/java/onehajo/seuraseung/SeuraseungApplication.java" ]; then
    cat > backend/src/main/java/onehajo/seuraseung/SeuraseungApplication.java << 'EOF'
package onehajo.seuraseung;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class SeuraseungApplication {

    public static void main(String[] args) {
        SpringApplication.run(SeuraseungApplication.class, args);
    }

    @RestController
    public static class HealthController {
        
        @GetMapping("/")
        public String home() {
            return "Seuraseung Backend Server is running!";
        }
        
        @GetMapping("/health")
        public String health() {
            return "OK";
        }
    }
}
EOF
    log_success "기본 Java 애플리케이션 클래스 생성 완료"
else
    log_info "Java 애플리케이션 클래스가 이미 존재합니다."
fi

# 9. React 기본 파일 생성
log_step "9. React 기본 파일들을 생성합니다..."

# App.js 생성
mkdir -p frontend/src
if [ ! -f "frontend/src/App.js" ]; then
    cat > frontend/src/App.js << 'EOF'
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [backendStatus, setBackendStatus] = useState('확인 중...');

  useEffect(() => {
    // 백엔드 헬스체크
    fetch('/api/health')
      .then(response => response.text())
      .then(data => setBackendStatus(data))
      .catch(error => setBackendStatus('연결 실패'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Seuraseung Project</h1>
        <p>프론트엔드와 백엔드가 성공적으로 연결되었습니다!</p>
        <div className="status-container">
          <div className="status-item">
            <span className="status-label">프론트엔드:</span>
            <span className="status-value running">정상 실행 중</span>
          </div>
          <div className="status-item">
            <span className="status-label">백엔드:</span>
            <span className={`status-value ${backendStatus === 'OK' ? 'running' : 'error'}`}>
              {backendStatus}
            </span>
          </div>
        </div>
        <p className="info">
          이 페이지는 CI/CD 파이프라인이 정상적으로 작동하는지 확인하기 위한 테스트 페이지입니다.
        </p>
      </header>
    </div>
  );
}

export default App;
EOF
    log_success "React App.js 생성 완료"
fi

# App.css 생성
if [ ! -f "frontend/src/App.css" ]; then
    cat > frontend/src/App.css << 'EOF'
.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 40px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
}

.status-container {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3d4349;
  padding: 10px 20px;
  border-radius: 8px;
  min-width: 300px;
}

.status-label {
  font-weight: bold;
  font-size: 18px;
}

.status-value {
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
}

.status-value.running {
  background-color: #4caf50;
  color: white;
}

.status-value.error {
  background-color: #f44336;
  color: white;
}

.info {
  font-size: 16px;
  margin-top: 20px;
  color: #ccc;
  max-width: 600px;
  line-height: 1.5;
}

h1 {
  margin-bottom: 20px;
}
EOF
    log_success "React App.css 생성 완료"
fi

# index.js 생성
if [ ! -f "frontend/src/index.js" ]; then
    cat > frontend/src/index.js << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF
    log_success "React index.js 생성 완료"
fi

# public/index.html 생성
mkdir -p frontend/public
if [ ! -f "frontend/public/index.html" ]; then
    cat > frontend/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="Seuraseung Project - CI/CD Pipeline Test" />
    <title>Seuraseung Project</title>
  </head>
  <body>
    <noscript>JavaScript를 활성화해야 이 앱을 실행할 수 있습니다.</noscript>
    <div id="root"></div>
  </body>
</html>
EOF
    log_success "React index.html 생성 완료"
fi

# 10. 최종 검토
log_step "10. 최종 설정을 검토합니다..."

echo
echo "🎯 다음 단계를 진행하세요:"
echo
echo "1. GitHub Secrets 설정:"
echo "   - Repository Settings → Secrets and variables → Actions"
echo "   - FRONT_SERVER_HOST: 13.125.3.120"
echo "   - SSH_PRIVATE_KEY: EC2 Private Key 내용"
echo
echo "2. 파일 추가 및 커밋:"
echo "   git add ."
echo "   git commit -m \"feat: CI/CD 파이프라인 초기 설정\""
echo "   git push origin cicd"
echo
echo "3. PR 생성:"
echo "   - cicd → dev (팀장 리뷰)"
echo "   - dev → main (팀장 진행)"
echo
echo "4. 배포 확인:"
echo "   - GitHub Actions 워크플로우 실행 확인"
echo "   - 서비스 정상 작동 확인"
echo

log_success "🎉 CI/CD 설정이 완료되었습니다!"
log_info "📖 추가 정보는 scripts/setup-secrets.md를 참고하세요."

# 완료 시간 기록
echo "$(date): CI/CD setup completed" > setup-completion.log

echo
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                     설정 완료! 🎉                         ║${NC}"
echo -e "${GREEN}║          이제 GitHub에 푸시하고 CI/CD를 테스트하세요!        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"