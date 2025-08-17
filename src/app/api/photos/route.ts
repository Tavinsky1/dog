import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";

const prisma = new PrismaClient();
const schema = z.object({
  placeId: z.string().min(1),
  url: z.string().url(),
  width: z.number().optional(),
  height: z.number().optional()
});

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const json = await req.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { placeId, url, width, height } = parsed.data;

  const photo = await prisma.photo.create({
    data: { placeId, userId: user.id, url, width: width ?? null, height: height ?? null, status: "pending" }
  });

  await prisma.submission.create({
    data: { type: "photo", payload: parsed.data as any, placeId, userId: user.id, status: "pending" }
  });

  return NextResponse.json({ ok: true, id: photo.id });
}
