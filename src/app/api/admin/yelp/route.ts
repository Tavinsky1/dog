import { NextRequest, NextResponse } from 'next/server';
import { searchDogFriendlyPlaces, getYelpBusinessDetails, convertYelpToPlace } from '@/lib/yelp';
import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Ensure user is admin (only admins can import from Yelp)
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const businessId = searchParams.get('businessId');

    // Get details for a specific business
    if (businessId) {
      const business = await getYelpBusinessDetails(businessId);
      return NextResponse.json({ business });
    }

    // Search for places
    if (!city) {
      return NextResponse.json(
        { error: 'City parameter is required' },
        { status: 400 }
      );
    }

    const results = await searchDogFriendlyPlaces(
      city,
      category || undefined
    );

    return NextResponse.json({
      businesses: results.businesses,
      total: results.total,
      message: `Found ${results.businesses.length} dog-friendly places in ${city}`,
    });

  } catch (error: any) {
    console.error('Yelp search API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to search Yelp' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure user is admin
    await requireAdmin();

    const body = await request.json();
    const { businessId, cityId } = body;

    if (!businessId || !cityId) {
      return NextResponse.json(
        { error: 'businessId and cityId are required' },
        { status: 400 }
      );
    }

    // Get business details from Yelp
    const business = await getYelpBusinessDetails(businessId);

    // Convert to Dog Atlas format
    const placeData = convertYelpToPlace(business, cityId);

    // Check if place already exists (by name and coordinates)
    const existingPlace = await prisma.place.findFirst({
      where: {
        name: placeData.name,
        lat: {
          gte: placeData.lat - 0.001,
          lte: placeData.lat + 0.001,
        },
        lng: {
          gte: placeData.lng - 0.001,
          lte: placeData.lng + 0.001,
        },
      },
    });

    if (existingPlace) {
      return NextResponse.json(
        { error: 'Place already exists in database', place: existingPlace },
        { status: 409 }
      );
    }

    // Create slug from name
    const slug = placeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    // Create place in database
    const place = await prisma.place.create({
      data: {
        ...placeData,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      place,
      message: `Successfully imported ${place.name} from Yelp`,
    });

  } catch (error: any) {
    console.error('Yelp import API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to import from Yelp' },
      { status: 500 }
    );
  }
}
