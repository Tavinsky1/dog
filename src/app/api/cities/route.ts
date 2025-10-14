import { NextResponse } from 'next/server'
import { getCountries, getCities } from '@/lib/data'

export async function GET() {
  try {
    // Get all countries and their cities
    const countries = await getCountries()
    const allCities = await Promise.all(
      countries.map(async (country) => {
        const cities = await getCities(country.slug)
        return cities.map(city => ({
          id: city.slug,
          slug: city.slug,
          name: city.name,
          country: country.slug,
        }))
      })
    )

    // Flatten and sort by name
    const cities = allCities.flat().sort((a, b) => a.name.localeCompare(b.name))

    return NextResponse.json(cities)
  } catch (error) {
    console.error('Error fetching cities:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}