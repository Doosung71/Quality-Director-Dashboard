# Phase 2: 고객 클레임 트래커 (Claims Tracker) 설계안

**작성일**: 2026-05-28
**작성자**: Gemini CLI (품질 기획자)
**상태**: Draft (Phase 2 착수용)

---

## 1. 개요
품질부문장의 핵심 업무 중 하나인 '고객 클레임'의 처리 현황을 칸반 보드 형태로 시각화하여, 적체 구간(Bottleneck)을 파악하고 해결 속도를 관리하는 것을 목적으로 함.

## 2. 주요 기능 및 UI 구성

### A. 핵심 KPI 바 (Claims KPI Bar)
- **Unclosed Claims**: 현재 진행 중인(Closed 제외) 클레임 총 수.
- **Average Lead Time**: 접수부터 종료까지 걸리는 평균 일수.
- **High Priority**: 중요도가 'High'인 미결 건수.

### B. 클레임 칸반 보드 (Claims Kanban Board)
- **5단계 컬럼**: 접수(Received) → 조사(Investigating) → 대책(Action) → 검증(Verification) → 클로징(Closed)
- **드래그 앤 드롭 (PoC 생략 가능)**: 우선은 상태 필터링 또는 이동 버튼으로 구현.
- **카드 구성**: 클레임명, 고객사명, 발생일, 담당자(Avatar), 중요도 배지.

### C. 상세 정보 사이드바 (Detail Panel)
- 카드 클릭 시 우측에서 슬라이드 인.
- 상세 발생 경위, 현재까지의 조치 사항(Timeline), 관련 문서 링크.

## 3. 데이터 스키마 (`data/claims.json`)

```json
[
  {
    "id": "CLM-2026-001",
    "title": "A사 변전소 케이블 피복 균열",
    "customer": "A-Power",
    "priority": "High",
    "status": "Investigating",
    "receivedAt": "2026-05-10",
    "assignee": "김철수",
    "description": "설치 3년차 현장에서 외피 균열 발생 보고됨.",
    "timeline": [
      { "date": "2026-05-10", "action": "클레임 접수" },
      { "date": "2026-05-12", "action": "현장 샘플 수거 완료" }
    ]
  }
]
```

## 4. 컴포넌트 구조 제안

- `app/(dashboard)/claims/page.tsx`: 서버 컴포넌트 (데이터 페칭)
- `components/claims/claims-kanban.tsx`: 메인 칸반 컨테이너
- `components/claims/claim-card.tsx`: 개별 클레임 카드
- `components/claims/claims-kpi.tsx`: 상단 KPI 요약 바

---

## 5. 구현 우선순위

1. **Step 1**: `data/claims.json` 시드 데이터 12건 구축
2. **Step 2**: 기본 칸반 레이아웃 (5컬럼) 및 카드 UI 구현
3. **Step 3**: KPI 바 연동 (진행 중 건수, 평균 일수 계산 로직)
4. **Step 4**: 카드 클릭 시 상세 정보를 보여주는 사이드바 연동
