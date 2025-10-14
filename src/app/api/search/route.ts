import { NextRequest, NextResponse } from 'next/server';
import { searchPlaces, getSearchSuggestions } from '@/lib/searchIndex';

export const dynamic = 'force-dynamic'; // Always run fresh for search

/**
 * GET /api/search
 * 
 * Query parameters:
 * - q: Search query (required)
 * - category: Filter by category (optional)
 * - country: Filter by country slug (optional)
 * - city: Filter by city slug (optional)
 * - verified: Filter verified places only (optional)
 * - limit: Max results (default: 20)
 * - suggestions: Return suggestions instead of full results (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const category = searchParams.get('category') || undefined;
    const country = searchParams.get('country') || undefined;
    const city = searchParams.get('city') || undefined;
    const verified = searchParams.get('verified') === 'true' ? true : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');
    const suggestions = searchParams.get('suggestions') === 'true';

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // Return suggestions for autocomplete
    if (suggestions) {
      const suggestionList = await getSearchSuggestions(query, limit);
      return NextResponse.json({
        query,
        suggestions: suggestionList,
      });
    }

    // Full search
    const results = await searchPlaces({
      query,
      category,
      country,
      city,
      verified,
      limit,
    });

    return NextResponse.json({
      query,
      filters: { category, country, city, verified },
      total: results.length,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
