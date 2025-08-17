import Link from "next/link";

export default function PlaceCard({
  id, name, category, district, neighborhood, badges = []
}: {
  id: string; name: string; category: string; district?: string|null; neighborhood?: string|null; badges?: string[];
}) {
  return (
    <div className="card-hover p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-amber-100 text-amber-800 border border-amber-200">
          🐕 {category.replace(/_/g, " ")}
        </span>
      </div>
      
      <Link href={`/places/${id}`} className="block mb-4 group">
        <h3 className="text-2xl font-display font-extrabold text-gray-800 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {name}
        </h3>
      </Link>
      
      <div className="flex items-center text-gray-600 mb-4 text-lg">
        <svg className="w-5 h-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{district}{neighborhood ? ` • ${neighborhood}` : ""}</span>
      </div>
      
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {badges.map(badge => (
            <span 
              key={badge} 
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-800 border border-orange-200"
            >
              ⭐ {badge}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
