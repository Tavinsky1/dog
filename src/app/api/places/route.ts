import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAuthenticatedSession } from "@/types/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!isAuthenticatedSession(session)) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      type,
      city,
      shortDescription,
      fullDescription,
      websiteUrl,
      phone,
      amenities,
      rules,
      imageUrl,
      lat,
      lng,
      // Dog-specific attributes
      dogSizeAllowed,
      hasWaterBowl,
      offLeashAllowed,
      hasOutdoorSeating,
      petFee,
      maxDogsAllowed,
    } = body;

    // Validate required fields
    if (!name || !type || !city || !shortDescription) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find city
    let cityRecord = await prisma.city.findFirst({
      where: {
        name: city,
        active: true,
      },
    });

    if (!cityRecord) {
      return NextResponse.json(
        { error: "City not found. Please contact support to add new cities." },
        { status: 400 }
      );
    }

    // Generate slug from name
    const baseSlug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let counter = 1;
    
    // Ensure unique slug
    while (await prisma.place.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Create the place
    const place = await prisma.place.create({
      data: {
        slug,
        name: name.trim(),
        type,
        cityId: cityRecord.id,
        region: cityRecord.name,
        country: cityRecord.country,
        lat: lat || 0, // Use provided coords or default
        lng: lng || 0, // Use provided coords or default
        shortDescription: shortDescription.trim(),
        fullDescription: fullDescription?.trim(),
        imageUrl: imageUrl?.trim(),
        websiteUrl: websiteUrl?.trim(),
        phone: phone?.trim(),
        amenities: amenities || [],
        rules: rules?.trim(),
        source: "user_submission",
        // Dog-specific attributes
        dogSizeAllowed: dogSizeAllowed || null,
        hasWaterBowl: hasWaterBowl || null,
        offLeashAllowed: offLeashAllowed || null,
        hasOutdoorSeating: hasOutdoorSeating || null,
        petFee: petFee || null,
        maxDogsAllowed: maxDogsAllowed || null,
      },
    });

    return NextResponse.json({
      success: true,
      place: {
        id: place.id,
        name: place.name,
      },
    });
  } catch (error) {
    console.error("Place submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}