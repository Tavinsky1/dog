"use client";

import { useState } from "react";

interface FiltersProps {
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

const AVAILABLE_FEATURES = [
  { id: "off_leash", label: "Off-leash area" },
  { id: "water", label: "Water access" },
  { id: "fenced", label: "Fenced area" },
  { id: "small_dogs", label: "Small dog area" },
  { id: "agility", label: "Agility equipment" },
  { id: "waste_bags", label: "Waste bags provided" },
  { id: "parking", label: "Parking available" },
  { id: "cafe", label: "Dog-friendly cafe" },
  { id: "shelter", label: "Shelter/shade" },
  { id: "lighting", label: "Good lighting" }
];

export default function Filters({ selectedFeatures, onFeaturesChange }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = selectedFeatures.includes(featureId)
      ? selectedFeatures.filter(f => f !== featureId)
      : [...selectedFeatures, featureId];
    
    onFeaturesChange(newFeatures);
  };

  const clearAllFilters = () => {
    onFeaturesChange([]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <span className="font-medium">Filters</span>
            <svg
              className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {selectedFeatures.length > 0 && (
            <span className="badge badge-blue">
              {selectedFeatures.length} active
            </span>
          )}
        </div>

        {selectedFeatures.length > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 p-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {AVAILABLE_FEATURES.map((feature) => (
              <label
                key={feature.id}
                className="flex items-center space-x-2 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="filter-checkbox sr-only"
                  checked={selectedFeatures.includes(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                />
                <div className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg border transition-all
                  ${selectedFeatures.includes(feature.id)
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }
                `}>
                  <div className={`
                    w-4 h-4 rounded border-2 flex items-center justify-center transition-all
                    ${selectedFeatures.includes(feature.id)
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {selectedFeatures.includes(feature.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium">{feature.label}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
