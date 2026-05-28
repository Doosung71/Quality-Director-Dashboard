import { cn } from "@/lib/utils";
import type { ClaimPriority, ClaimStatus } from "@/types/claim";

export function ClaimStatusBadge({ status }: { status: ClaimStatus }) {
  const map: Record<ClaimStatus, { style: string }> = {
    Received:      { style: "bg-slate-50 text-slate-500 ring-slate-200" },
    Investigating: { style: "bg-blue-50 text-blue-700 ring-blue-200" },
    Action:        { style: "bg-amber-50 text-amber-700 ring-amber-200" },
    Verification:  { style: "bg-purple-50 text-purple-700 ring-purple-200" },
    Closed:        { style: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset", map[status].style)}>
      {status === "Received" ? "접수" : 
       status === "Investigating" ? "조사" :
       status === "Action" ? "대책" :
       status === "Verification" ? "검증" : "종결"}
    </span>
  );
}

export function ClaimPriorityBadge({ priority }: { priority: ClaimPriority }) {
  const map: Record<ClaimPriority, { style: string; label: string }> = {
    Low:  { style: "bg-slate-100 text-slate-600", label: "낮음" },
    Mid:  { style: "bg-blue-100 text-blue-600",  label: "보통" },
    High: { style: "bg-red-100 text-red-600",    label: "높음" },
  };
  return (
    <span className={cn("inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", map[priority].style)}>
      {map[priority].label}
    </span>
  );
}
