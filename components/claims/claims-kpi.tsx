"use client";

import { cn } from "@/lib/utils";
import type { Claim } from "@/types/claim";

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

export function ClaimsKpi({ claims }: { claims: Claim[] }) {
  const total = claims.length;
  const unclosed = claims.filter(c => c.status !== "Closed");
  const highPriorityUnclosed = unclosed.filter(c => c.priority === "High").length;
  const unclosedRate = total > 0 ? Math.round((unclosed.length / total) * 100) : 0;

  // 평균 처리 리드타임: closedAt - receivedAt (일수)
  const closedWithDate = claims.filter(c => c.status === "Closed" && c.closedAt);
  const avgLeadTime = closedWithDate.length > 0
    ? Math.round(
        closedWithDate.reduce((acc, c) => {
          const days = Math.floor(
            (new Date(c.closedAt!).getTime() - new Date(c.receivedAt).getTime()) / 86400000
          );
          return acc + days;
        }, 0) / closedWithDate.length
      )
    : 0;

  // 이번 달 클로징: closedAt 기준
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisMonthClosed = claims.filter(c => c.closedAt?.startsWith(thisMonth)).length;

  // 종결률: Closed / 전체
  const closedCount = claims.filter(c => c.status === "Closed").length;
  const closureRate = total > 0 ? Math.round((closedCount / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard
        title="진행 중 클레임"
        value={`${unclosed.length}건`}
        color="text-blue-600"
        subItems={[
          { label: "High Priority", value: `${highPriorityUnclosed}건`, color: "text-red-500" },
          { label: "전체 대비", value: total > 0 ? `${unclosedRate}%` : "-" }
        ]}
      />
      <KpiCard
        title="평균 처리 리드타임"
        value={closedWithDate.length > 0 ? `${avgLeadTime}일` : "-"}
        subItems={[
          { label: "종결 건수", value: `${closedWithDate.length}건` },
          { label: "목표", value: "10일 이내" }
        ]}
      />
      <KpiCard
        title="이번 달 클로징"
        value={`${thisMonthClosed}건`}
        subItems={[
          {
            label: "종결률",
            value: total > 0 ? `${closureRate}%` : "-",
            color: closureRate >= 50 ? "text-emerald-500" : "text-amber-500"
          }
        ]}
      />
    </div>
  );
}
