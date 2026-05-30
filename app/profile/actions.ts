"use server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function updateNickname(
  _prev: { error?: string; success?: boolean } | undefined,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const session = await auth()
  if (!session) return { error: "로그인이 필요합니다." }

  const nickname = (formData.get("nickname") as string)?.trim() || null

  await prisma.user.update({
    where: { id: session.user.id },
    data: { nickname },
  })

  revalidatePath("/profile")
  return { success: true }
}
