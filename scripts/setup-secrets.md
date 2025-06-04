# GitHub Secrets 설정 가이드

GitHub Actions CI/CD가 정상적으로 작동하려면 다음 Secrets을 설정해야 합니다.

## 🔐 필수 Secrets 설정

### Repository Settings → Secrets and variables → Actions → New repository secret

| Secret Name | 값 | 설명 |
|-------------|-----|------|
| `FRONT_SERVER_HOST` | `13.125.3.120` | Front Server의 Public IP |
| `SSH_PRIVATE_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | EC2 접속용 SSH Private Key |

## 📋 SSH Private Key 설정 방법

### 1. SSH Key 파일 내용 확인
```bash
# 로컬에서 SSH Key 파일 내용 출력
cat ~/.ssh/your-key-file.pem
```

### 2. GitHub Repository에서 Secret 추가
1. GitHub Repository → **Settings** 탭
2. 좌측 메뉴에서 **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. Name: `SSH_PRIVATE_KEY`
5. Secret: SSH Private Key 전체 내용 붙여넣기 (BEGIN부터 END까지 포함)

### 3. Front Server Host 추가
1. **New repository secret** 클릭
2. Name: `FRONT_SERVER_HOST`
3. Secret: `13.125.3.120`

## 🔍 SSH Key 형식 예시
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAlwAAAAdzc2gtcn
NhAAAAAwEAAQAAAIEA1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP
...
(여러 줄의 키 데이터)
...
QRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz=
-----END OPENSSH PRIVATE KEY-----
```

## ⚠️ 주의사항

1. **Private Key 보안**: SSH Private Key는 절대 코드나 공개 저장소에 노출되어서는 안 됩니다.
2. **키 권한**: SSH Key 파일은 600 권한으로 설정되어야 합니다.
3. **키 형식**: OpenSSH 형식의 키를 사용하세요. PuTTY 형식(.ppk)은 지원되지 않습니다.

## 🔧 설정 확인 방법

### 1. Secrets 설정 확인
- Repository Settings → Secrets and variables → Actions에서 설정된 Secrets 목록 확인

### 2. SSH 연결 테스트 (로컬에서)
```bash
# Front Server 연결 테스트
ssh -i ~/.ssh/your-key-file.pem ubuntu@13.125.3.120

# Front Server를 통한 Back Server 연결 테스트
ssh -i ~/.ssh/your-key-file.pem ubuntu@13.125.3.120
ssh ubuntu@10.0.2.165
```

### 3. GitHub Actions 테스트
- 작은 변경사항을 main 브랜치에 푸시하여 워크플로우가 정상 실행되는지 확인

## 🚀 완료 후 단계

1. GitHub Secrets 설정 완료
2. `main` 브랜치에 코드 푸시
3. GitHub Actions 워크플로우 실행 확인
4. EC2 서버들에서 서비스 정상 작동 확인

## 💡 문제 해결

### SSH 연결 오류
- SSH Key 형식 확인 (OpenSSH 형식 사용)
- Key 권한 확인 (600)
- Security Group 설정 확인 (22번 포트)

### GitHub Actions 실패
- Secrets 이름 정확성 확인
- SSH Key 내용 완전성 확인 (BEGIN/END 포함)
- 로그에서 구체적인 오류 메시지 확인