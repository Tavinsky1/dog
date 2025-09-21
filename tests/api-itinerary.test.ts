import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getCities } from '@/app/api/cities/route'
import { GET as getCityPlaces } from '@/app/api/[city]/places/route'
import { POST as postItinerary } from '@/app/api/itinerary/route'

async function sampleCityPayload() {
  const citiesResponse = await getCities()
  const cities: Array<{ slug: string; name: string }> = await citiesResponse.json()
  if (!cities.length) throw new Error('No cities available for itinerary test')

  const city = cities[0]
  const placesResponse = await getCityPlaces(new NextRequest(`http://localhost/${city.slug}/places`), {
    params: { city: city.slug },
  })
  const places: { items: Array<{ id: string; name: string; type: string; shortDescription?: string }> } = await placesResponse.json()
  if (!places.items.length) throw new Error('No places available for itinerary test')

  return {
    city: { name: city.name, slug: city.slug },
    places: places.items.slice(0, 3).map((place) => ({
      id: place.id,
      name: place.name,
      type: place.type,
      shortDescription: place.shortDescription ?? undefined,
    })),
  }
}

describe('API Contracts - Itinerary', () => {
  it('POST /api/itinerary returns segments', async () => {
    const payload = await sampleCityPayload()
    const request = new NextRequest('http://localhost/api/itinerary', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'content-type': 'application/json' },
    })

    const response = await postItinerary(request)
    expect(response.status).toBe(200)

    const body = await response.json()
    expect(Array.isArray(body.segments)).toBe(true)
    expect(body.segments.length).toBeGreaterThan(0)
  })
})
