"use client";

import { cn } from "@/lib/utils";
import type { TestStatus, TestCategory } from "@/types/test";
import type { ComputedStatus } from "@/lib/facilities-utils";

export function HallStatusBadge({ status }: { status: string }) {
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

export function TypeChip({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600">
      {type}
    </span>
  );
}

export function TestStatusBadge({ status }: { status: TestStatus }) {
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

export function TestCategoryChip({ category }: { category: TestCategory }) {
  const map: Record<TestCategory, string> = {
    Type: "bg-purple-50 text-purple-700 ring-purple-200",
    EQ:   "bg-orange-50 text-orange-700 ring-orange-200",
    PQ:   "bg-rose-50 text-rose-700 ring-rose-200",
    양산:  "bg-teal-50 text-teal-700 ring-teal-200",
    개발:  "bg-indigo-50 text-indigo-700 ring-indigo-200",
  };
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset", map[category])}>
      {category}
    </span>
  );
}

export function EquipStatusBadge({ status }: { status: ComputedStatus }) {
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
