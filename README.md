# ECHOES OF AETHER — 게임 공식 홈페이지

빌드 도구 없이 동작하는 정적 게임 홈페이지입니다. HTML, CSS, 바닐라 JavaScript만 사용합니다.
게임 이름, 문구, 이미지는 모두 임시(placeholder)이며 실제 내용으로 교체하면 됩니다.

## 페이지 구성

| 섹션 | 내용 |
|---|---|
| 히어로 | 게임 로고, 태그라인, 트레일러 버튼, 사전 등록 버튼, 플랫폼, 이용 등급 |
| 게임 소개 | 세계관 · 스토리, 장르 · 플레이 타임 등 기본 정보, 키 아트 |
| 특징 | 핵심 시스템 4가지 카드 |
| 캐릭터 | 탭으로 전환되는 캐릭터 소개 (키보드 방향키 지원) |
| 미디어 | 트레일러 카드(모달), 스크린샷 6장 갤러리(라이트박스) |
| 소식 | 공지 · 개발 노트 · 이벤트 카드 |
| 사양 | PC 최소 · 권장 사양 |
| FAQ | 아코디언 |
| 사전 등록 | 이메일 폼, 스토어 바로가기 |
| 푸터 | 소셜 링크, 약관 링크 |

## 파일

```
index.html        # 메인 페이지
404.html          # 404 페이지
css/style.css     # 스타일 (상단 :root 변수에서 색상·폰트 변경)
js/main.js        # 내비게이션, 탭, 모달, 라이트박스, 폼
assets/           # 로고, 파비콘
.github/workflows # GitHub Pages 자동 배포
```

## 교체해야 할 것

- **게임 이름 · 문구**: `index.html` 전체 (`ECHOES OF AETHER`, `Aether Studio` 검색)
- **키 아트 · 캐릭터 · 스크린샷**: 현재 CSS 그라데이션으로 자리만 잡혀 있음. `css/style.css`의 `.keyart-*`, `.av-*`, `.shot-*`, `.nt-*`를 `background: url(이미지경로)`로 교체
- **트레일러**: `index.html`의 `#trailer-modal` 안 `.video-placeholder`를 YouTube iframe으로 교체
- **스토어 링크**: `.store-buttons`의 `href="#"`
- **사전 등록 폼 전송**: `js/main.js` Newsletter 부분에 Mailchimp, Formspree 등 연결
- **로고**: `assets/logo.svg`, `assets/favicon.svg`

## 로컬 실행

```bash
python3 -m http.server 8000
```

## 배포

`main` 브랜치에 푸시하면 GitHub Actions가 GitHub Pages로 배포합니다.
저장소 Settings → Pages → Source를 **GitHub Actions**로 설정하세요.
