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

  // Check if user already reviewed this place
  const existingReview = await prisma.review.findFirst({
    where: {
      placeId,
      userId: user.id
    }
  });

  if (existingReview) {
    return NextResponse.json({ error: "You have already reviewed this place" }, { status: 409 });
  }

  const review = await prisma.review.create({
    data: {
      placeId,
      userId: user.id,
      rating,
      body,
      tags: tags ?? [],
      source: "dogatlas_user",
      status: "published" // Auto-approve user reviews
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    }
  });

  // Recalculate place rating
  const allReviews = await prisma.review.findMany({
    where: { 
      placeId,
      status: 'published'
    },
    select: { rating: true }
  });

  const totalRating = allReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
  const avgRating = totalRating / allReviews.length;

  await prisma.place.update({
    where: { id: placeId },
    data: {
      rating: Math.round(avgRating * 10) / 10,
      ratingCount: allReviews.length
    }
  });

  return NextResponse.json({ 
    ok: true, 
    id: review.id,
    review: {
      id: review.id,
      rating: review.rating,
      body: review.body,
      tags: review.tags,
      createdAt: review.createdAt,
      user: {
        name: review.user?.name || 'Anonymous'
      }
    }
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const placeId = url.searchParams.get('placeId');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = 10;

  if (!placeId) {
    return NextResponse.json({ error: 'Place ID required' }, { status: 400 });
  }

  const reviews = await prisma.review.findMany({
    where: {
      placeId,
      status: 'published'
    },
    include: {
      user: {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    skip: (page - 1) * limit,
    take: limit
  });

  const totalReviews = await prisma.review.count({
    where: {
      placeId,
      status: 'published'
    }
  });

  return NextResponse.json({
    reviews: reviews.map((review: any) => ({
      id: review.id,
      rating: review.rating,
      body: review.body,
      tags: review.tags,
      source: review.source,
      createdAt: review.createdAt,
      publishedAt: review.publishedAt,
      user: {
        name: review.user?.name || review.author || 'Anonymous'
      }
    })),
    pagination: {
      page,
      limit,
      total: totalReviews,
      pages: Math.ceil(totalReviews / limit)
    }
  });
}
