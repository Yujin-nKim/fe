# 멀티 스테이지 빌드
FROM openjdk:21-jdk-slim as builder

WORKDIR /app

# Maven wrapper와 pom.xml 복사
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# 의존성 다운로드 (캐싱 최적화)
RUN chmod +x ./mvnw && ./mvnw dependency:go-offline -B

# 소스 코드 복사 및 빌드
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# 운영 환경 이미지
FROM openjdk:21-jre-slim

# 시간대 설정
RUN ln -snf /usr/share/zoneinfo/Asia/Seoul /etc/localtime && echo Asia/Seoul > /etc/timezone

# 사용자 추가 (보안)
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

# 빌드된 JAR 파일 복사
COPY --from=builder /app/target/*.jar app.jar

# 권한 설정
RUN chown -R appuser:appuser /app
USER appuser

# 포트 노출
EXPOSE 8080

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# 애플리케이션 실행
ENTRYPOINT ["java", "-Djava.security.egd=file:/dev/./urandom", "-jar", "app.jar"]