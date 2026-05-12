# Quality Director Board

품질부문장의 5개 핵심 업무 영역을 한 화면에 통합한 PoC 대시보드.
2026년 9월 품질전략기능회의(CEO 주관) 시연 목표.

## 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인.

---

## 현재 상태

| 영역 | 상태 |
|------|------|
| 프로젝트 셋업 + 공통 레이아웃 | ✅ 완료 |
| ① 시험장·시험 현황 | ✅ 완료 (2026-05-12) |
| ② 고객 클레임 트래커 | 🔲 6월 예정 |
| ③ 협력업체 카드 풀 | 🔲 7월 예정 |
| ④ 품질부문 인사·면담 | 🔲 8월 예정 |
| ⑤ 경쟁사·고객·기타 정보 | 🔲 8월 예정 |
| 통합 메인 대시보드 | 🔲 8월 예정 |

---

## 파일 구조

```
app/
  layout.tsx                         루트 레이아웃
  (dashboard)/
    layout.tsx                       대시보드 공통 레이아웃
    page.tsx                         통합 메인
    facilities/page.tsx              ① 시험장·시험 현황 ✅
    claims/                          ② 클레임 (예정)
    vendors/                         ③ 협력업체 (예정)
    hr/                              ④ 인사 (예정)
    intelligence/                    ⑤ 외부정보 (예정)

components/
  layout/
    sidebar.tsx
    header.tsx
  facilities/
    facilities-view.tsx
  ui/
    button.tsx

data/
  facility.json                      구미·동해 시험장·설비 시드 데이터

types/
  facility.ts                        TypeScript 타입 정의
```

---

## 기술 스택

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| UI | Tailwind CSS + shadcn/ui + Tremor |
| 데이터 | 로컬 JSON (`/data/`) → 추후 Notion API |
| 배포 | Vercel |
| 개발 환경 | Surface Pro 11 (Windows 11 ARM64) |

→ 상세 기획은 [PRD.md](PRD.md) 참조
