"use client"

import { PLACE_CATEGORIES, CATEGORY_GROUPS, getAllGroupsOrdered, getCategoriesByGroup, getCategoryInfo, type PlaceCategory } from "@/lib/categories"

interface CategorySelectorProps {
  selectedCategory?: PlaceCategory | null
  onCategoryChange?: (category: PlaceCategory | null) => void
  showAll?: boolean
  groupBy?: boolean
}

export default function CategorySelector({ 
  selectedCategory, 
  onCategoryChange, 
  showAll = true,
  groupBy = true 
}: CategorySelectorProps) {
  
  if (groupBy) {
    const groups = getAllGroupsOrdered()
    
    return (
      <div className="space-y-6">
        {showAll && (
          <button
            onClick={() => onCategoryChange?.(null)}
            className={`w-full text-left p-4 rounded-lg border transition-all ${
              selectedCategory === null
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🌍</span>
              <div>
                <div className="font-semibold">All Categories</div>
                <div className="text-sm text-gray-600">Show all dog-friendly places</div>
              </div>
            </div>
          </button>
        )}
        
        {groups.map((group) => {
          const categories = getCategoriesByGroup(group.id)
          
          return (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center space-x-2 px-2">
                <span className="text-lg">{group.icon}</span>
                <h3 className="font-semibold text-gray-900">{group.name}</h3>
              </div>
              
              <div className="grid gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange?.(category.id as PlaceCategory)}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{category.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{category.name}</div>
                        <div className="text-sm text-gray-600 truncate">{category.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
  
  // Flat list view
  const allCategories = Object.values(PLACE_CATEGORIES).sort((a, b) => a.order - b.order)
  
  return (
    <div className="space-y-2">
      {showAll && (
        <button
          onClick={() => onCategoryChange?.(null)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedCategory === null
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">🌍</span>
            <span className="font-medium">All Categories</span>
          </div>
        </button>
      )}
      
      {allCategories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange?.(category.id as PlaceCategory)}
          className={`w-full text-left p-3 rounded-lg border transition-all ${
            selectedCategory === category.id
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-3">
            <span className="text-xl">{category.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{category.name}</div>
              <div className="text-sm text-gray-600 truncate">{category.description}</div>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export function CategoryBadge({ category, size = "sm" }: { category: PlaceCategory, size?: "sm" | "md" | "lg" }) {
  const info = getCategoryInfo(category)
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5", 
    lg: "text-base px-4 py-2"
  }
  
  return (
    <span 
      className={`inline-flex items-center space-x-1 rounded-full font-medium border ${sizeClasses[size]}`}
      style={{ 
        backgroundColor: `${info.color}20`, 
        borderColor: `${info.color}40`,
        color: info.color 
      }}
    >
      <span>{info.icon}</span>
      <span>{info.name}</span>
    </span>
  )
}

export function CategoryIcon({ category, size = 20 }: { category: PlaceCategory, size?: number }) {
  const info = getCategoryInfo(category)
  return (
    <span 
      className={`inline-flex items-center justify-center text-${size === 16 ? 'sm' : size === 24 ? 'lg' : 'base'}`}
      title={info.name}
    >
      {info.icon}
    </span>
  )
}