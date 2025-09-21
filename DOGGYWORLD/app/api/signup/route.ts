import { NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
})

export async function POST(req: Request) {
  try {
    const { email, password, name } = Body.parse(await req.json())
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
    const passwordHash = await bcrypt.hash(password, 12)
    await prisma.user.create({ data: { email, name, passwordHash, role: 'user' } })
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    if (e?.issues) return NextResponse.json({ error: 'Validation', details: e.issues }, { status: 400 })
    return NextResponse.json({ error: 'Internal' }, { status: 500 })
  }
}