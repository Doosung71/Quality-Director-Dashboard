# Research Result: 시험장·설비 현황 UX 고도화

LS전선 품질부문장 대시보드의 시험장·설비 현황 페이지 UX/UI 고도화를 위한 조사 결과입니다.

## 결론

- **진행 권장**: Q1(자동 선택), Q2(KPI 프로그레스 바), Q5(리스트 미니 시각화)는 즉시 도입을 권장합니다. 사용자 인지 부하를 줄이고 데이터 시각화를 효과적으로 강화할 수 있습니다.
- **전략 변경 제안**: 
  - Q3(간트 차트)는 현재의 커스텀 구현에 그리드라인을 추가하는 것이 가장 가볍지만, 향후 확장성(드래그, 줌 등)을 고려한다면 `gantt-task-react` 도입을 검토하십시오.
  - Q4(테이블)는 '컬럼 접기'보다는 **'핵심 컬럼 고정 + 나머지 컬럼 자유 스크롤'** 방식이 비교 분석에 더 유리합니다(NN/g 가이드).

---

## 항목별 조사 결과

### Q1. 자동 선택 패턴 (Master-Detail)
- **권장 여부**: **강력히 권장됨**. 
- **이유**:
    - **Blank State 방지**: 우측 상세 패널이 비어 있으면 사용자는 시스템 오류로 오해하거나 무엇을 해야 할지 혼란을 느낍니다 (Nielsen Norman Group).
    - **인터랙션 비용 감소**: 대시보드 사용자의 목적은 '확인'입니다. 첫 번째 항목을 보여줌으로써 클릭 한 번을 줄여줍니다.
- **주의사항**: 
    - 리스트에서 선택된 항목에 명확한 시각적 강조(Active State)가 있어야 합니다.
    - 데이터가 없는 경우 "데이터가 없습니다"라는 명시적 안내가 상세 영역에 표시되어야 합니다.
- **출처**: [NN/g - Split View Best Practices](https://www.nngroup.com/articles/split-view-best-practices/)

### Q2. KPI 카드 시각화 (Stacked Progress Bar)
- **추천 방식**:
    1. **Tremor UI `CategoryBar`**: 가장 세련되고 대시보드에 최적화된 컴포넌트입니다.
    2. **Tailwind 직접 구현**: 라이브러리 없이 구현할 경우 `flex`와 `overflow-hidden`을 활용한 컨테이너 방식을 권장합니다.
- **Tailwind 코드 예시**:
    ```tsx
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-secondary">
      <div className="bg-emerald-500" style={{ width: '60%' }} /> {/* 정상 */}
      <div className="bg-yellow-400" style={{ width: '25%' }} />  {/* 주의 */}
      <div className="bg-rose-500" style={{ width: '15%' }} />    {/* 노후 */}
    </div>
    ```
- **출처**: [Tremor CategoryBar Docs](https://www.tremor.so/docs/visualizations/category-bar)

### Q3. 간트 차트 개선
- **세로 그리드라인 구현**:
    - 현재의 `%` 방식 구조라면 부모 컨테이너에 `repeating-linear-gradient`를 배경으로 깔거나, 별도의 `absoulte` 그리드 레이어를 추가하는 것이 가장 성능 면에서 좋습니다.
- **경량 라이브러리 추천**:
    1. **`gantt-task-react`**: 순수 React 기반, Next.js 15 호환성 높음, 가볍고 커스텀이 용이함. (추천)
    2. **`frappe-gantt`**: 디자인이 가장 수려하지만 SVG 직접 제어 방식이라 React 래퍼(`react-frappe-gantt`)가 필요함.
- **한국어 지원**: 대부분의 라이브러리에서 `locale="ko"` 설정이나 `date-fns` 연동으로 요일/월 한국어 표시가 가능합니다.

### Q4. 대형 테이블 UX (컬럼 관리)
- **모범 사례 (NN/g)**: **"Hybrid" 접근법** 권장.
    - **핵심**: 첫 번째 컬럼(시험장/설비명)을 `sticky left-0`으로 고정.
    - **제어**: `shadcn/ui`의 Data Table 내 'Column Visibility' 기능을 사용하여 사용자가 덜 중요한 컬럼을 직접 끄고 켤 수 있게 함.
- **구현 패턴**:
    - `shadcn/ui`의 `DropdownMenuCheckboxItem`을 사용하여 컬럼 노출 여부를 제어하는 툴바를 테이블 상단에 배치하십시오.
- **출처**: [shadcn/ui Data Table - Column Visibility](https://ui.shadcn.com/docs/components/data-table#column-visibility)

### Q5. 미니 시각화 (Status Dots/Bars)
- **사용 사례**: 리스트 행의 좁은 공간에서 전체 상태 분포를 한눈에 보여줄 때 매우 효과적입니다 (예: Github Actions의 작업 상태 바).
- **디자인 패턴**:
    - **도트**: 설비가 적을 때 (예: ○○○●○)
    - **세그먼트 바**: 설비가 많을 때 비율로 표시 (Q2의 미니 버전)
- **구현 팁**: Tailwind의 `gap-0.5`를 활용하여 각 상태 블록 사이에 미세한 간격을 주면 더 세련된 느낌을 줍니다.

---

## 추천 구현 순서

1.  **Step 1 (UX 기초)**: 탭 전환 시 자동 선택 로직 추가 (Q1)
2.  **Step 2 (데이터 시각화)**: KPI 카드 및 리스트 행에 스택형 프로그레스 바 적용 (Q2, Q5)
3.  **Step 3 (테이블 고도화)**: 핵심 컬럼 고정(Sticky) 및 컬럼 가시성 토글 기능 추가 (Q4)
4.  **Step 4 (간트 강화)**: 그리드라인 추가. 필요 시 라이브러리(`gantt-task-react`) 교체 검토 (Q3)

## 리스크 및 주의사항

- **번들 크기**: `gantt-task-react` 등 추가 라이브러리 도입 시 `npm bundle size`를 체크하십시오. PoC 단계에서는 직접 구현한 CSS 그리드라인이 더 안전할 수 있습니다.
- **접근성(A11y)**: 프로그레스 바의 색상만으로 상태를 구분하지 말고, 툴팁이나 텍스트 라벨을 병행하여 색약 사용자도 구분할 수 있게 하십시오.

## Claude에게 권장하는 다음 행동

1.  `app/(dashboard)/facilities/page.tsx`에서 탭 상태 변경 시 `selectedFacility`의 기본값을 첫 번째 데이터로 설정하는 로직을 먼저 적용하세요.
2.  `components/ui/progress.tsx`를 확장하거나 별도의 `StackedProgress` 컴포넌트를 만들어 KPI 카드에 적용해 보세요.
3.  테이블에 `sticky` 클래스를 적용하여 가로 스크롤 시에도 설비명이 보이도록 수정하세요.
