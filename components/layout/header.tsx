"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const titles: Record<string, string> = {
  "/": "메인 대시보드",
  "/facilities": "시험장·시험 현황",
  "/claims": "고객 클레임",
  "/vendors": "협력업체",
  "/hr": "인사·면담",
  "/intelligence": "외부 정보",
};

interface HeaderProps {
  onMenuOpen: () => void;
}

export function Header({ onMenuOpen }: HeaderProps) {
  const pathname = usePathname();
  const title = titles[pathname] ?? "대시보드";

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center px-4 lg:px-6 gap-3 shrink-0">
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 -ml-1 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        aria-label="메뉴 열기"
      >
        <Menu className="w-5 h-5" />
      </button>
      <h1 className="text-sm font-semibold text-slate-800">{title}</h1>
    </header>
  );
}
