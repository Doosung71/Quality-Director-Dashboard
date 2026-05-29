import type { Role, UserStatus } from "@/lib/generated/prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: Role
      status: UserStatus
      restrictedUntil: string | null
      nickname: string | null
    }
  }
}
