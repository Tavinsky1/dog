import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getCities } from '@/app/api/cities/route'
import { GET as getCityPlaces } from '@/app/api/[city]/places/route'
import { GET as getPlaceDetail } from '@/app/api/[city]/places/[slug]/route'

async function pickCityAndPlaceSlug() {
  const citiesResponse = await getCities()
  const cities: Array<{ slug: string }> = await citiesResponse.json()
  if (!cities.length) throw new Error('No active cities found in test database')

  const citySlug = cities[0].slug
  const placesRequest = new NextRequest(`http://localhost/${citySlug}/places`)
  const placesResponse = await getCityPlaces(placesRequest, { params: { city: citySlug } })
  const placesPayload: { items: Array<{ slug: string }> } = await placesResponse.json()
  if (!placesPayload.items.length) throw new Error(`No places found for city ${citySlug}`)

  return { citySlug, placeSlug: placesPayload.items[0].slug }
}

describe('API Contracts - Place Detail', () => {
  it('GET /api/{city}/places/{slug} returns full place with city details', async () => {
    const { citySlug, placeSlug } = await pickCityAndPlaceSlug()
    const request = new NextRequest(`http://localhost/${citySlug}/places/${placeSlug}`)

    const response = await getPlaceDetail(request, { params: { city: citySlug, slug: placeSlug } })
    expect(response.status).toBe(200)

    const place = await response.json()
    expect(place).toHaveProperty('name')
    expect(place).toHaveProperty('type')
    expect(place).toHaveProperty('city')
    expect(place.city).toHaveProperty('name')
  })
})
