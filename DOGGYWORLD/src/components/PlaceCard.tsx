import Link from 'next/link'

type Place = {
  id: string
  slug: string
  name: string
  type: string
  shortDescription: string
  dogFriendlyLevel?: number | null
  imageUrl?: string | null
  rating?: number | null
  city: {
    slug: string
  }
}

export default function PlaceCard({ place }: { place: Place }) {
  return (
    <Link 
      href={`/${place.city.slug}/p/${place.slug}`} 
      className="block rounded-xl border p-4 hover:shadow-md transition-shadow"
    >
      {place.imageUrl && (
        <div className="aspect-video w-full mb-3 rounded-lg overflow-hidden bg-gray-100">
          <img 
            src={place.imageUrl} 
            alt={place.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold line-clamp-2">{place.name}</h3>
          {place.rating && (
            <div className="flex items-center text-sm text-yellow-600 ml-2">
              <span>★ {place.rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {place.type}
          </span>
          {place.dogFriendlyLevel && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              Dog Level {place.dogFriendlyLevel}/5
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {place.shortDescription}
        </p>
      </div>
    </Link>
  )
}