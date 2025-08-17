import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || !["MOD","ADMIN"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const subs = await prisma.submission.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "asc" },
    take: 100
  });
  return NextResponse.json(subs);
}
