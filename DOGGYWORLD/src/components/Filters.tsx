'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

const PLACE_TYPES = [
  'trail', 'park', 'cafe', 'vet', 'grooming', 
  'activity', 'beach', 'hotel', 'store', 'event'
]

const COMMON_AMENITIES = [
  'water bowl', 'off-leash area', 'parking', 'shade', 
  'seating', 'restroom', 'waste bags', 'fenced'
]

export default function Filters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '')
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities')?.split(',') || []
  )

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    router.push(`?${params.toString()}`)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    updateFilters({ q: value || null })
  }

  const handleTypeChange = (type: string) => {
    const newType = type === selectedType ? '' : type
    setSelectedType(newType)
    updateFilters({ type: newType || null })
  }

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity]
    
    setSelectedAmenities(newAmenities)
    updateFilters({ amenities: newAmenities.length > 0 ? newAmenities.join(',') : null })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedType('')
    setSelectedAmenities([])
    router.push(window.location.pathname)
  }

  return (
    <div className="bg-white border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <button
          onClick={clearFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear all
        </button>
      </div>

      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Search
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search places..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Place Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Place Type
        </label>
        <div className="flex flex-wrap gap-2">
          {PLACE_TYPES.map(type => (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedType === type
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {COMMON_AMENITIES.map(amenity => (
            <button
              key={amenity}
              onClick={() => handleAmenityToggle(amenity)}
              className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                selectedAmenities.includes(amenity)
                  ? 'bg-green-500 text-white border-green-500'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}