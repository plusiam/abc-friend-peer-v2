# ABC 친구 도우미 v2

## 프로젝트 구조

```
abc-friend-peer-v2/
├── index.html              ← 새 디자인 메인 페이지
├── css/
│   └── style.css           ← 스타일 분리
├── js/
│   ├── app.js              ← 메인 앱 로직
│   ├── data.js             ← 상담 데이터 (고민사례, 체크리스트, 감정 등)
│   ├── ui.js               ← UI 컨트롤러 (단계 전환, 애니메이션 등)
│   ├── storage.js          ← LocalStorage 관리
│   ├── export.js           ← 결과 출력 (PNG/PDF/인쇄)
│   └── silent-spell-helper.js ← 조용한 맞춤법 도우미
├── data/
│   └── checklists.json     ← 상황별 체크리스트 데이터
├── chatbot/
│   └── abc-chatbot-prompt.md
├── _original/              ← v1 원본 참조
└── README.md
```

## 개선 포인트 (v1 → v2)

### 1. UI/UX 전면 리디자인
- 온보딩 화면 (캐릭터 일러스트 + 시작하기)
- 프로그레스 스텝퍼 (원형 스텝 + 연결선 + 진행률)
- 카드 레이아웃 현대화 (글래스모피즘, 부드러운 그림자)
- 감정 선택 UI 개선 (큰 이모지 카드 + 감정 색상 매핑)
- 전환 애니메이션 (슬라이드/페이드 트랜지션)

### 2. 코드 구조 모듈화
- 1200줄 단일 파일 → 역할별 모듈 분리
- CSS 변수 활용 강화
- 데이터 JSON 분리

### 3. 결과 리포트 강화
- 감정 변화 시각화
- 인포그래픽 스타일 요약

### 4. 접근성 강화
- ARIA 라벨
- 키보드 네비게이션

## 원본 저장소
- GitHub: https://github.com/plusiam/abc-friend-peer
- Live: https://plusiam.github.io/abc-friend-peer/
