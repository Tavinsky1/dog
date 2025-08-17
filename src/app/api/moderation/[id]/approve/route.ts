import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { awardPoints } from "@/lib/points";

const prisma = new PrismaClient();

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub) return NextResponse.json({ error: "not found" }, { status: 404 });

  // Approve submission
  await prisma.submission.update({ where: { id }, data: { status: "approved" } });

  // If a place is linked, publish it
  if (sub.placeId) {
    await prisma.place.update({
      where: { id: sub.placeId },
      data: { status: "published" }
    });
  }

  // Award points to submitter if exists
  if (sub.userId) {
    let kind: "new_place" | "edit" | "photo" | "review" = "edit";
    if (sub.type === "new_place") kind = "new_place";
    if (sub.type === "photo") kind = "photo";
    if (sub.type === "review") kind = "review";
    await awardPoints(sub.userId, kind);
  }

  return NextResponse.json({ ok: true });
}
