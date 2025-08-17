import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { requireRole } from "@/lib/session";

const prisma = new PrismaClient();

export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireRole(["MOD","ADMIN"]);
  const { id } = params;
  const { reason } = await req.json().catch(() => ({ reason: undefined as string | undefined }));

  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub) return NextResponse.json({ error: "not found" }, { status: 404 });

  // merge reason into payload JSON so we keep a record without schema changes
  const newPayload =
    typeof sub.payload === "object" && sub.payload !== null
      ? { ...(sub.payload as any), moderationReason: reason ?? "Not provided" }
      : { moderationReason: reason ?? "Not provided", original: sub.payload };

  await prisma.submission.update({
    where: { id },
    data: { status: "rejected", payload: newPayload as any },
  });

  // If it was a new place, mark the linked place as rejected too
  if (sub.type === "new_place" && sub.placeId) {
    await prisma.place.update({
      where: { id: sub.placeId },
      data: { status: "rejected" as any },
    });
  }

  return NextResponse.json({ ok: true });
}
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireRole } from "@/lib/session";

const prisma = new PrismaClient();
const bodySchema = z.object({ reason: z.string().min(3).max(500) });

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireRole(["MOD","ADMIN"]);
  if (!auth.ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { id } = params;
  const json = await req.json().catch(() => ({}));
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const sub = await prisma.submission.findUnique({ where: { id } });
  if (!sub) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Mark submission rejected with reason
  await prisma.submission.update({
    where: { id },
    data: { status: "rejected", notes: parsed.data.reason }
  });

  // If it created a new place, archive it (optional policy)
  if (sub.placeId && sub.type === "new_place") {
    await prisma.place.update({ where: { id: sub.placeId }, data: { status: "archived" } });
  }

  return NextResponse.json({ ok: true });
}
