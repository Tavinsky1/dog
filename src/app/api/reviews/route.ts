import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";

const prisma = new PrismaClient();

const reviewSchema = z.object({
  placeId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  body: z.string().max(1000).optional(),
  tags: z.array(z.string()).max(10).optional()
});

// Accept JSON and form-encoded bodies
async function parseBody(req: Request) {
  const ct = req.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    return await req.json();
  }
  if (ct.includes("application/x-www-form-urlencoded")) {
    const form = await req.formData();
    const tagsRaw = String(form.get("tags") ?? "");
    return {
      placeId: String(form.get("placeId") ?? ""),
      rating: Number(form.get("rating") ?? "0"),
      body: (form.get("body") as string) || undefined,
      tags: tagsRaw
        ? tagsRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : []
    };
  }
  return {};
}

export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 });

  const raw = await parseBody(req);
  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { placeId, rating, body, tags } = parsed.data;

  const review = await prisma.review.create({
    data: {
      placeId,
      userId: user.id,
      rating,
      body,
      tags: tags ?? [],
      status: "pending"
    }
  });

  await prisma.submission.create({
    data: {
      type: "review",
      payload: parsed.data as any,
      placeId,
      userId: user.id,
      status: "pending"
    }
  });

  return NextResponse.json({ ok: true, id: review.id });
}
