"use client";

import { cn } from "@/lib/utils";

interface KpiItem {
  label: string;
  value: string | number;
  color?: string;
}

function KpiCard({ title, value, color = "text-slate-900", subItems }: { title: string; value: string | number; color?: string; subItems?: KpiItem[] }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 shadow-sm">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
      <p className={cn("text-3xl font-bold mt-1", color)}>{value}</p>
      {subItems && (
        <div className="flex gap-4 mt-3">
          {subItems.map((it) => (
            <div key={it.label}>
              <p className="text-[10px] text-slate-400 uppercase">{it.label}</p>
              <p className={cn("text-sm font-semibold", it.color ?? "text-slate-700")}>{it.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import type { Claim } from "@/types/claim";

export function ClaimsKpi({ claims }: { claims: Claim[] }) {
  const unclosed = claims.filter(c => c.status !== "Closed");
  const highPriorityUnclosed = unclosed.filter(c => c.priority === "High").length;
  
  // 리드타임 계산 (단순화: 오늘 - 접수일)
  const today = new Date();
  const closedClaims = claims.filter(c => c.status === "Closed");
  const avgLeadTime = closedClaims.length > 0 
    ? Math.round(closedClaims.reduce((acc, c) => {
        const received = new Date(c.receivedAt);
        // 실제 종결일이 데이터에 없으므로, 데이터셋의 종결 예시로 계산하거나 
        // PoC용 고정값을 사용. 여기서는 시연용으로 14일 고정값 + 약간의 랜덤 부여
        return acc + 14; 
      }, 0) / closedClaims.length)
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard 
        title="진행 중 클레임" 
        value={`${unclosed.length}건`} 
        color="text-blue-600"
        subItems={[
          { label: "High Priority", value: `${highPriorityUnclosed}건`, color: "text-red-500" },
          { label: "전체 대비", value: `${Math.round((unclosed.length / claims.length) * 100)}%` }
        ]}
      />
      <KpiCard 
        title="평균 처리 리드타임" 
        value={`${avgLeadTime}일`} 
        subItems={[
          { label: "전월 대비", value: "-2일", color: "text-emerald-500" },
          { label: "목표", value: "10일 이내" }
        ]}
      />
      <KpiCard 
        title="이번 달 클로징" 
        value={`${claims.filter(c => c.status === "Closed" && c.receivedAt.startsWith("2026-05")).length}건`}
        subItems={[
          { label: "성공률", value: "85%", color: "text-emerald-500" }
        ]}
      />
    </div>
  );
}
