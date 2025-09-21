import { describe, it, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { GET as getCities } from '@/app/api/cities/route'
import { GET as getCityPlaces } from '@/app/api/[city]/places/route'

async function pickActiveCitySlug() {
  const response = await getCities()
  const data: Array<{ slug: string }> = await response.json()
  if (!data.length) throw new Error('No active cities found in test database')
  return data[0].slug
}

describe('API Contracts - City Places', () => {
  it('GET /api/{city}/places returns filtered places with pagination', async () => {
    const citySlug = await pickActiveCitySlug()
    const request = new NextRequest(`http://localhost/${citySlug}/places`)
    const response = await getCityPlaces(request, { params: { city: citySlug } })

    expect(response.status).toBe(200)
    const payload = await response.json()
    expect(typeof payload.total).toBe('number')
    expect(Array.isArray(payload.items)).toBe(true)
  })

  it('GET /api/{city}/places with query params filters correctly', async () => {
    const citySlug = await pickActiveCitySlug()
    const requestUrl = new URL(`http://localhost/${citySlug}/places`)
    requestUrl.searchParams.set('minLevel', '4')
    const request = new NextRequest(requestUrl)

    const response = await getCityPlaces(request, { params: { city: citySlug } })
    expect(response.status).toBe(200)

    const payload = await response.json()
    expect(Array.isArray(payload.items)).toBe(true)
    payload.items.forEach((place: { dogFriendlyLevel?: number }) => {
      if (typeof place.dogFriendlyLevel === 'number') {
        expect(place.dogFriendlyLevel).toBeGreaterThanOrEqual(4)
      }
    })
  })
})
