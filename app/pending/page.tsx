export default function PendingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">⏳</span>
        </div>
        <h1 className="text-lg font-bold text-slate-800 mb-2">승인 대기 중</h1>
        <p className="text-sm text-slate-500">
          가입 신청이 접수되었습니다.<br />
          관리자 승인 후 로그인할 수 있습니다.
        </p>
        <p className="text-xs text-slate-400 mt-4">문의: doosung71@gmail.com</p>
      </div>
    </div>
  )
}
