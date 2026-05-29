import { auth } from "@/auth"
import { NextResponse } from "next/server"
import { isAdmin } from "@/lib/admin"

export async function requireActiveSession() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { status, restrictedUntil, email } = session.user
  const restrictionExpired = status === "RESTRICTED" && !!restrictedUntil && new Date(restrictedUntil) < new Date()

  if (!isAdmin(email) && status !== "ACTIVE" && !restrictionExpired) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return session
}
