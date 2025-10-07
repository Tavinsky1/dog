import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedSession } from "@/types/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!isAuthenticatedSession(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { placeId, url, width, height, alt } = await request.json();

    if (!placeId || !url) {
      return NextResponse.json(
        { error: "Missing placeId or url" },
        { status: 400 }
      );
    }

    // Verify the place exists
    const place = await prisma.place.findUnique({
      where: { id: placeId },
    });

    if (!place) {
      return NextResponse.json({ error: "Place not found" }, { status: 404 });
    }

    // Create the photo record
    const photo = await prisma.photo.create({
      data: {
        placeId,
        url,
        width: width || null,
        height: height || null,
        alt: alt || null,
        uploadedBy: session.user.id,
        status: "pending", // Photos need moderation
      },
    });

    // Create a submission for moderation
    await prisma.submission.create({
      data: {
        type: "photo",
        entityId: photo.id,
        submittedBy: session.user.id,
        data: {
          placeId,
          url,
          width,
          height,
          alt,
        },
      },
    });

    return NextResponse.json({ photo, message: "Photo submitted for approval" });
  } catch (error) {
    console.error("Error creating photo:", error);
    return NextResponse.json(
      { error: "Failed to create photo" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get("placeId");
    const status = searchParams.get("status") || "approved";

    if (!placeId) {
      return NextResponse.json(
        { error: "Missing placeId parameter" },
        { status: 400 }
      );
    }

    const photos = await prisma.photo.findMany({
      where: {
        placeId,
        status,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    return NextResponse.json(
      { error: "Failed to fetch photos" },
      { status: 500 }
    );
  }
}