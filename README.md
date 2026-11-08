# My Website

빌드 도구 없이 바로 동작하는 반응형 정적 웹사이트입니다. HTML, CSS, 바닐라 JavaScript만 사용합니다.

## 구성

```
.
├── index.html              # 메인 페이지 (소개 · 서비스 · 포트폴리오 · 문의)
├── 404.html                # 404 페이지
├── css/style.css           # 디자인 토큰, 라이트/다크 테마, 레이아웃
├── js/main.js              # 테마 전환, 모바일 메뉴, 스크롤 효과, 폼 검증
├── assets/                 # 로고, 파비콘
└── .github/workflows/      # GitHub Pages 자동 배포
```

## 기능

- 모바일 ~ 데스크톱 반응형 레이아웃
- 라이트/다크 모드 (시스템 설정 자동 감지, 선택값 저장)
- 스크롤 시 섹션 등장 애니메이션, 숫자 카운트업
- 현재 섹션 하이라이트 내비게이션, 맨 위로 버튼
- 접근성: 건너뛰기 링크, ARIA 속성, 키보드 포커스 표시, 모션 감소 설정 지원
- 클라이언트 측 문의 폼 검증

## 로컬 실행

파일을 브라우저에서 바로 열어도 되고, 간단한 서버를 띄워도 됩니다.

```bash
npx serve .
```

또는

```bash
python3 -m http.server 8000
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 자동 배포합니다.
저장소 **Settings → Pages → Source**를 **GitHub Actions**로 설정해 주세요.

## 커스터마이징

- 색상과 글꼴: `css/style.css` 상단의 `:root` 변수
- 문구와 섹션: `index.html`
- 문의 폼 전송: `js/main.js`의 submit 핸들러에 Formspree 등 전송 서비스 연결
