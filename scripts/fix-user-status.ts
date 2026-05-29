import { PrismaClient } from "../lib/generated/prisma/client"
import { neonConfig } from "@neondatabase/serverless"
import { PrismaNeon } from "@prisma/adapter-neon"

neonConfig.webSocketConstructor = globalThis.WebSocket

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

import bcrypt from "bcryptjs"

async function main() {
  const email = "doosung71@gmail.com"

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { status: "ACTIVE", role: "DIRECTOR" },
    })
    console.log(`기존 계정 업데이트: ${email} → ACTIVE / DIRECTOR`)
  } else {
    const passwordHash = await bcrypt.hash("admin1234!", 10)
    await prisma.user.create({
      data: {
        email,
        name: "두성",
        passwordHash,
        role: "DIRECTOR",
        status: "ACTIVE",
        nickname: "Dennis",
      },
    })
    console.log(`새 계정 생성: ${email} / 임시 비밀번호: admin1234!`)
  }

  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true, status: true },
  })
  console.log("\n=== 최종 유저 목록 ===")
  console.table(users)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
