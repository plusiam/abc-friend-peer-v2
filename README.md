# 🌈 ABC 친구 도우미 v2

> 초등학생 또래 상담 도구 — Soft Playground 디자인

## 소개

ABC 모델(Ellis의 합리적 정서행동치료)을 기반으로 한 4단계 또래 상담 도구입니다.
초등학생이 친구의 고민을 듣고, 공감하고, 도움을 찾고, 격려할 수 있도록 안내합니다.

## 4단계 상담 프로세스

| 단계 | 이름 | 설명 |
|------|------|------|
| 1단계 | 🩵 마음 공감하기 | 친구의 감정 인식 (10개 감정 카드 + 직접 입력) |
| 2단계 | 💜 공감 표현하기 | ABC 기반 공감 표현 자동 생성 + 편집 |
| 3단계 | 🧡 도움 찾기 | 새로운 생각 + 도움 방법 체크리스트 |
| 4단계 | 💗 격려하기 | 격려 메시지 뽑기 + 나만의 메시지 + 실천 약속 |

## 디자인 시스템: Soft Playground

- **베이스**: #FAFAF6 (따뜻한 아이보리)
- **악센트**: #FF7E5F → #FEB47B (코랄 그라데이션)
- **단계별 색상**: 민트틸, 라벤더, 앰버, 로즈
- **타이포**: 36px 볼드 헤드라인, 좌측 정렬 비대칭
- **인터랙션**: 다층 효과 (컬러바, 글로우, 스케일)

## 기술 스택

- React (함수형 컴포넌트 + Hooks)
- 인라인 스타일 (CSS-in-JS)
- 반응형 레이아웃 (max-width: 480px)

## 프로젝트 구조

```
abc-friend-peer-v2/
├── prototype/
│   └── abc-friend-v2-full.jsx   ← React 프로토타입 (678줄)
├── README.md
```

## 원본 저장소

- **v1**: [abc-friend-peer](https://github.com/plusiam/abc-friend-peer)
- **Live v1**: https://plusiam.github.io/abc-friend-peer/

## 라이선스

MIT License
