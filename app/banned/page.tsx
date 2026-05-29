export default function BannedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">🚫</span>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">접근 제한</h1>
        <p className="text-sm text-slate-500">
          계정이 정지 또는 강퇴 처리되었습니다.<br />
          자세한 내용은 관리자에게 문의하세요.
        </p>
        <p className="text-xs text-slate-400 mt-4">문의: doosung71@gmail.com</p>
      </div>
    </div>
  )
}
