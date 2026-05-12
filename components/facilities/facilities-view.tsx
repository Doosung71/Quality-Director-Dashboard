"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FacilityData, SiteId, Equipment, TestHall, TestYard } from "@/types/facility";
import type { Test, TestsData, TestStatus } from "@/types/test";

type AnySpace = TestHall | TestYard;
type ComputedStatus = "new" | "normal" | "aging" | "planned";

const CURRENT_YEAR = 2026;

function computeStatus(eq: Equipment): ComputedStatus {
  if (eq.status === "planned") return "planned";
  const age = CURRENT_YEAR - eq.yearIntroduced;
  if (age > 20) return "aging";
  if (age > 10) return "normal";
  return "new";
}

function getSpaceEquipment(data: FacilityData, spaceId: string): Equipment[] {
  return data.equipment.filter((e) => e.hallId === spaceId || e.yardId === spaceId);
}

function formatSpec(spec: Record<string, string>): string {
  const parts: string[] = [];
  if (spec.voltage) parts.push(spec.voltage);
  if (spec.current) parts.push(spec.current);
  if (spec.energy) parts.push(spec.energy);
  return parts.join(" / ");
}

// 2026년 기준 날짜 → 가로 위치 % (간트 차트용)
const GANTT_START = new Date("2026-01-01").getTime();
const GANTT_END   = new Date("2026-12-31").getTime();
const GANTT_TOTAL = GANTT_END - GANTT_START;

function dateToPct(dateStr: string): number {
  const t = new Date(dateStr).getTime();
  return Math.max(0, Math.min(100, ((t - GANTT_START) / GANTT_TOTAL) * 100));
}

function getEquipmentTests(tests: Test[], equipmentId: string): Test[] {
  return tests.filter((t) => t.equipmentId === equipmentId);
}

// ─── Status & Type badges ────────────────────────────────────────────────────

function HallStatusBadge({ status }: { status: string }) {
  const style =
    status === "가동중"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", style)}>
      {status}
    </span>
  );
}

function EquipStatusBadge({ status }: { status: ComputedStatus }) {
  const map: Record<ComputedStatus, { label: string; style: string }> = {
    new:     { label: "신규",     style: "bg-blue-50 text-blue-700 ring-blue-200" },
    normal:  { label: "정상",     style: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    aging:   { label: "노후",     style: "bg-red-50 text-red-700 ring-red-200" },
    planned: { label: "도입예정", style: "bg-slate-50 text-slate-600 ring-slate-200" },
  };
  const { label, style } = map[status];
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", style)}>
      {label}
    </span>
  );
}

function TypeChip({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
      {type}
    </span>
  );
}

function TestStatusBadge({ status }: { status: TestStatus }) {
  const map: Record<TestStatus, { style: string }> = {
    "준비중": { style: "bg-slate-50 text-slate-500 ring-slate-200" },
    "시험중": { style: "bg-blue-50 text-blue-700 ring-blue-200" },
    "완료":   { style: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    "지연":   { style: "bg-red-50 text-red-700 ring-red-200" },
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", map[status].style)}>
      {status}
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

interface KpiItem { label: string; value: number; color: string }

function KpiCard({
  title,
  main,
  mainColor = "text-slate-800",
  items,
}: {
  title: string;
  main: string;
  mainColor?: string;
  items: KpiItem[];
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
      <p className={cn("text-3xl font-bold mt-1 mb-3", mainColor)}>{main}</p>
      <div className="flex gap-4">
        {items.map((it) => (
          <div key={it.label}>
            <p className="text-xs text-slate-400">{it.label}</p>
            <p className={cn("text-lg font-semibold", it.color)}>{it.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Hall list row ────────────────────────────────────────────────────────────

function SpaceRow({
  space,
  equipCount,
  agingCount,
  selected,
  onClick,
}: {
  space: AnySpace;
  equipCount: number;
  agingCount: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-4 py-3 border-b border-slate-100 last:border-0 transition-colors",
        selected ? "bg-blue-50" : "hover:bg-slate-50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className={cn("text-sm leading-snug", selected ? "font-medium text-blue-700" : "text-slate-700")}>
          {space.name}
        </p>
        <HallStatusBadge status={space.status} />
      </div>
      <div className="flex items-center gap-2 mt-1.5">
        <TypeChip type={space.type} />
        <span className="text-xs text-slate-400">{space.purpose}</span>
        <span className="ml-auto text-xs text-slate-400">
          설비 {equipCount}개
          {agingCount > 0 && (
            <span className="ml-1 text-red-500">· 노후 {agingCount}</span>
          )}
        </span>
      </div>
    </button>
  );
}

// ─── Equipment table ──────────────────────────────────────────────────────────

function EquipmentTable({ equipment, tests }: { equipment: Equipment[]; tests: Test[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">설비명</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">유형</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">규격</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">제조사</th>
            <th className="text-right px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">도입</th>
            <th className="text-right px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">사용연수</th>
            <th className="text-right px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">대수</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">상태</th>
            <th className="text-left px-3 py-2.5 text-xs font-medium text-slate-500 whitespace-nowrap">시험 현황</th>
            <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">비고</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((eq) => {
            const eqTests = getEquipmentTests(tests, eq.id);
            return (
              <tr key={eq.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                <td className="px-4 py-2.5 font-medium text-slate-700 whitespace-nowrap">{eq.name}</td>
                <td className="px-3 py-2.5">
                  <TypeChip type={eq.type} />
                </td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-mono text-xs">
                  {formatSpec(eq.spec)}
                </td>
                <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                  {eq.maker}
                  {eq.makerCountry && (
                    <span className="ml-1 text-slate-400 text-xs">({eq.makerCountry})</span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-slate-500 text-right whitespace-nowrap">{eq.yearIntroduced}</td>
                <td className="px-3 py-2.5 text-right whitespace-nowrap">
                  {(() => {
                    const s = computeStatus(eq);
                    if (s === "planned") return <span className="text-slate-300">—</span>;
                    const colorMap: Record<string, string> = {
                      new:    "text-blue-600",
                      normal: "text-emerald-600",
                      aging:  "text-red-600",
                    };
                    return <span className={cn("font-medium", colorMap[s])}>{CURRENT_YEAR - eq.yearIntroduced}년</span>;
                  })()}
                </td>
                <td className="px-3 py-2.5 text-slate-700 text-right font-medium">{eq.quantity}</td>
                <td className="px-3 py-2.5">
                  <EquipStatusBadge status={computeStatus(eq)} />
                </td>
                <td className="px-3 py-2.5">
                  {eqTests.length === 0 ? (
                    <span className="text-slate-300 text-xs">—</span>
                  ) : (
                    <div className="space-y-1.5">
                      {eqTests.map((t) => (
                        <div key={t.id} className="flex items-center gap-1.5 min-w-[180px]">
                          <TestStatusBadge status={t.status} />
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden shrink-0">
                            <div
                              className={cn("h-full rounded-full", {
                                "bg-blue-400":    t.status === "시험중",
                                "bg-emerald-400": t.status === "완료",
                                "bg-red-400":     t.status === "지연",
                                "bg-slate-300":   t.status === "준비중",
                              })}
                              style={{ width: `${t.progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500 truncate max-w-[120px]" title={t.projectName}>
                            {t.projectName}
                          </span>
                        </div>
                      ))}
                      {eqTests.length > 1 && (
                        <span className="text-xs text-slate-400">병렬 {eqTests.length}건</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2.5 text-slate-400 text-xs max-w-[200px] truncate" title={eq.notes}>
                  {eq.notes || "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Gantt Chart ─────────────────────────────────────────────────────────────

const MONTHS = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

const STATUS_BAR_COLOR: Record<TestStatus, string> = {
  "준비중": "bg-slate-300",
  "시험중": "bg-blue-400",
  "완료":   "bg-emerald-400",
  "지연":   "bg-red-400",
};

function GanttChart({ tests, equipment }: { tests: Test[]; equipment: Equipment[] }) {
  const testsWithEq = tests.filter((t) => equipment.some((e) => e.id === t.equipmentId));
  if (testsWithEq.length === 0) return null;

  const equipsWithTests = equipment.filter((e) => tests.some((t) => t.equipmentId === e.id));

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-5 py-3 border-b border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700">시험 일정 현황 (2026)</h3>
        <p className="text-xs text-slate-400 mt-0.5">계획 기간 대비 실제 진행률. 진행 중인 시험장 설비 기준.</p>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* 월 헤더 */}
          <div className="flex border-b border-slate-100">
            <div className="w-64 shrink-0 px-4 py-2 text-xs text-slate-400">설비 / 프로젝트</div>
            <div className="flex-1 flex">
              {MONTHS.map((m) => (
                <div key={m} className="flex-1 text-center text-xs text-slate-400 py-2 border-l border-slate-100 first:border-0">
                  {m}
                </div>
              ))}
            </div>
          </div>

          {/* 행: 설비별 → 시험별 */}
          {equipsWithTests.map((eq) => {
            const eqTests = getEquipmentTests(tests, eq.id);
            return eqTests.map((t, idx) => {
              const plannedStartPct = dateToPct(t.plannedStart);
              const plannedEndPct   = dateToPct(t.plannedEnd);
              const plannedWidthPct = Math.max(0.5, plannedEndPct - plannedStartPct);

              return (
                <div
                  key={t.id}
                  className={cn("flex items-center border-b border-slate-50 last:border-0 hover:bg-slate-50")}
                >
                  {/* 좌측 라벨 */}
                  <div className="w-64 shrink-0 px-4 py-2.5">
                    {idx === 0 && (
                      <p className="text-xs font-medium text-slate-700 truncate">{eq.name}</p>
                    )}
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <TestStatusBadge status={t.status} />
                      <span className="text-xs text-slate-500 truncate" title={t.projectName}>
                        {t.projectName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 truncate">{t.sampleDescription}</p>
                  </div>

                  {/* 우측 간트 영역 */}
                  <div className="flex-1 relative h-12 py-4 px-1">
                    {/* 계획 바 (회색 배경) */}
                    <div
                      className="absolute top-3.5 h-5 rounded bg-slate-100 border border-slate-200 overflow-hidden"
                      style={{ left: `${plannedStartPct}%`, width: `${plannedWidthPct}%` }}
                    >
                      {/* 진행 오버레이 */}
                      <div
                        className={cn("h-full rounded", STATUS_BAR_COLOR[t.status])}
                        style={{ width: `${t.progress}%`, opacity: t.status === "준비중" ? 0 : 1 }}
                      />
                    </div>
                    {/* 진행률 라벨 */}
                    {t.progress > 0 && (
                      <span
                        className="absolute top-4 text-[10px] font-medium text-white leading-none pointer-events-none"
                        style={{ left: `calc(${plannedStartPct}% + 4px)` }}
                      >
                        {t.progress}%
                      </span>
                    )}
                    {/* 오늘 기준선 */}
                    <div
                      className="absolute top-2 bottom-2 w-px bg-red-400 opacity-60"
                      style={{ left: `${dateToPct("2026-05-13")}%` }}
                    />
                  </div>
                </div>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main view ────────────────────────────────────────────────────────────────

export function FacilitiesView({ data, testsData }: { data: FacilityData; testsData: TestsData }) {
  const tests = testsData.tests;
  const [activeSite, setActiveSite] = useState<SiteId>("gumi");
  const [selectedSpaceId, setSelectedSpaceId] = useState<string | null>(null);

  // KPI 계산
  const allSpaces = [...data.testHalls, ...data.testYards];
  const totalSpaces = allSpaces.length;
  const activeSpaces = allSpaces.filter((s) => s.status === "가동중").length;
  const constructingSpaces = allSpaces.filter((s) => s.status === "건축중").length;

  const totalEquip = data.equipment.length;
  const newEquip     = data.equipment.filter((e) => computeStatus(e) === "new").length;
  const normalEquip  = data.equipment.filter((e) => computeStatus(e) === "normal").length;
  const agingEquip   = data.equipment.filter((e) => computeStatus(e) === "aging").length;
  const plannedEquip = data.equipment.filter((e) => computeStatus(e) === "planned").length;
  const agingWithReplacement = data.equipment.filter((e) => computeStatus(e) === "aging" && e.replacedBy).length;
  const agingNoAction = agingEquip - agingWithReplacement;

  // 사이트별 필터
  const siteHalls = data.testHalls.filter((h) => h.siteId === activeSite);
  const siteYards = data.testYards.filter((y) => y.siteId === activeSite);

  // 선택된 공간
  const selectedSpace = selectedSpaceId ? allSpaces.find((s) => s.id === selectedSpaceId) ?? null : null;
  const selectedEquipment = selectedSpaceId ? getSpaceEquipment(data, selectedSpaceId) : [];

  const handleSiteChange = (site: SiteId) => {
    setActiveSite(site);
    if (selectedSpace && selectedSpace.siteId !== site) {
      setSelectedSpaceId(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* KPI 카드 */}
      <div className="grid grid-cols-3 gap-4">
        <KpiCard
          title="시험장 현황"
          main={`${totalSpaces}개`}
          items={[
            { label: "가동중", value: activeSpaces, color: "text-emerald-600" },
            { label: "건축중", value: constructingSpaces, color: "text-amber-600" },
          ]}
        />
        <KpiCard
          title="설비 현황"
          main={`${totalEquip}개`}
          items={[
            { label: "신규",     value: newEquip,     color: "text-blue-600" },
            { label: "정상",     value: normalEquip,  color: "text-emerald-600" },
            { label: "노후",     value: agingEquip,   color: "text-red-600" },
            { label: "도입예정", value: plannedEquip, color: "text-slate-500" },
          ]}
        />
        <KpiCard
          title="노후 설비"
          main={`${agingEquip}건`}
          mainColor="text-red-600"
          items={[
            { label: "교체 진행", value: agingWithReplacement, color: "text-amber-600" },
            { label: "미착수", value: agingNoAction, color: "text-red-500" },
          ]}
        />
      </div>

      {/* 메인 패널 */}
      <div className="flex gap-4" style={{ minHeight: 520 }} id="facilities-main-panel">
        {/* 좌측: 시험장 리스트 */}
        <div className="w-80 shrink-0 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          {/* 사이트 탭 */}
          <div className="flex border-b border-slate-200 shrink-0">
            {data.sites.map((site) => (
              <button
                key={site.id}
                onClick={() => handleSiteChange(site.id as SiteId)}
                className={cn(
                  "flex-1 py-3 text-sm font-medium transition-colors",
                  activeSite === site.id
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                )}
              >
                {site.name}
              </button>
            ))}
          </div>

          {/* 리스트 */}
          <div className="flex-1 overflow-y-auto">
            {siteHalls.length > 0 && (
              <>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  옥내 시험장
                </p>
                {siteHalls.map((hall) => {
                  const eqs = getSpaceEquipment(data, hall.id);
                  return (
                    <SpaceRow
                      key={hall.id}
                      space={hall}
                      equipCount={eqs.length}
                      agingCount={eqs.filter((e) => computeStatus(e) === "aging").length}
                      selected={selectedSpaceId === hall.id}
                      onClick={() => setSelectedSpaceId(hall.id)}
                    />
                  );
                })}
              </>
            )}
            {siteYards.length > 0 && (
              <>
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  옥외 시험장
                </p>
                {siteYards.map((yard) => {
                  const eqs = getSpaceEquipment(data, yard.id);
                  return (
                    <SpaceRow
                      key={yard.id}
                      space={yard}
                      equipCount={eqs.length}
                      agingCount={eqs.filter((e) => computeStatus(e) === "aging").length}
                      selected={selectedSpaceId === yard.id}
                      onClick={() => setSelectedSpaceId(yard.id)}
                    />
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* 우측: 설비 상세 */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden">
          {selectedSpace ? (
            <>
              <div className="px-6 py-4 border-b border-slate-200 shrink-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base font-semibold text-slate-800">{selectedSpace.name}</h2>
                  <HallStatusBadge status={selectedSpace.status} />
                  <TypeChip type={selectedSpace.type} />
                  <span className="text-xs text-slate-400 ml-1">목적: {selectedSpace.purpose}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  설비 {selectedEquipment.length}개
                  {selectedEquipment.filter((e) => computeStatus(e) === "aging").length > 0 && (
                    <span className="text-red-500 ml-2">
                      · 노후 {selectedEquipment.filter((e) => computeStatus(e) === "aging").length}건
                    </span>
                  )}
                </p>
              </div>
              <div className="flex-1 overflow-auto">
                {selectedEquipment.length > 0 ? (
                  <EquipmentTable equipment={selectedEquipment} tests={tests} />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                    등록된 설비 없음
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400">
              <svg className="w-10 h-10 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">좌측 시험장을 선택하면 설비 목록이 표시됩니다</p>
            </div>
          )}
        </div>
      </div>

      {/* 간트 차트 */}
      <GanttChart tests={tests} equipment={data.equipment} />
    </div>
  );
}
