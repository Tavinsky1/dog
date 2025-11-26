import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/newsletter
 * Subscribe to newsletter / notify list
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, source } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      // Update source if different
      const existingSources = (existing.sources as string[]) || [];
      if (source && !existingSources.includes(source)) {
        await prisma.newsletterSubscriber.update({
          where: { email: normalizedEmail },
          data: {
            sources: [...existingSources, source],
          },
        });
      }
      
      return NextResponse.json({
        success: true,
        message: "You're already on our list! We'll keep you updated.",
      });
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: normalizedEmail,
        sources: source ? [source] : ["general"],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Thanks for signing up! We'll notify you when we launch.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
