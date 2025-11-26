import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAuthenticatedSession } from "@/types/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/reviews/[id]/helpful
 * Mark a review as helpful (increment helpfulCount)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!isAuthenticatedSession(session)) {
      return NextResponse.json(
        { error: "Login required to vote" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Find the review
    const review = await prisma.review.findUnique({
      where: { id },
    });

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Prevent voting on own review
    if (review.userId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot vote on your own review" },
        { status: 400 }
      );
    }

    // Increment helpful count
    // Note: In a production app, you'd track who voted to prevent double-voting
    const updated = await prisma.review.update({
      where: { id },
      data: {
        helpfulCount: { increment: 1 },
      },
      select: {
        id: true,
        helpfulCount: true,
      },
    });

    return NextResponse.json({
      success: true,
      helpfulCount: updated.helpfulCount,
    });
  } catch (error) {
    console.error("Helpful vote error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
