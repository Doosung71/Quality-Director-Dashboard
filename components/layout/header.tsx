"use client";

import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  "/": "메인 대시보드",
  "/facilities": "시험장·시험 현황",
  "/claims": "고객 클레임",
  "/vendors": "협력업체",
  "/hr": "인사·면담",
  "/intelligence": "외부 정보",
};

export function Header() {
  const pathname = usePathname();
  const title = titles[pathname] ?? "대시보드";

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-6">
      <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
    </header>
  );
}
