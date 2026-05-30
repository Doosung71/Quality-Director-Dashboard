"use client"
import { useActionState } from "react"
import { updateNickname } from "./actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NicknameForm({ currentNickname }: { currentNickname: string | null }) {
  const [state, formAction, isPending] = useActionState(updateNickname, undefined)

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <Input
        name="nickname"
        placeholder="닉네임 (비워두면 실명 표시)"
        defaultValue={currentNickname ?? ""}
        maxLength={30}
      />
      <p className="text-xs text-zinc-400">
        UI 전체에서 이름 대신 표시됩니다. 변경은 다시 로그인 후 헤더에 반영됩니다.
      </p>
      {state?.success && <p className="text-xs text-green-600">저장되었습니다.</p>}
      {state?.error && <p className="text-xs text-red-500">{state.error}</p>}
      <Button type="submit" disabled={isPending} className="w-fit">
        {isPending ? "저장 중…" : "저장"}
      </Button>
    </form>
  )
}
