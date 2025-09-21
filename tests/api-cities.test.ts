import { describe, it, expect } from 'vitest'
import { GET as getCities } from '@/app/api/cities/route'

describe('API Contracts - Cities', () => {
  it('GET /api/cities returns array of city objects', async () => {
    const response = await getCities()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(Array.isArray(data)).toBe(true)

    if (data.length > 0) {
      const city = data[0]
      expect(typeof city.id).toBe('string')
      expect(typeof city.slug).toBe('string')
      expect(typeof city.name).toBe('string')
      expect(typeof city.country).toBe('string')
    }
  })
})
