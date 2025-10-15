'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Place {
  id: string;
  name: string;
  type: string;
  imageUrl: string | null;
  city: {
    name: string;
    country: string;
  };
}

export default function AdminImagesPage() {
  const { data: session, status } = useSession();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      const response = await fetch('/api/admin/places');
      if (response.ok) {
        const data = await response.json();
        setPlaces(data.places);
      }
    } catch (error) {
      console.error('Failed to fetch places:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (placeId: string, file: File) => {
    setUploadingId(placeId);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append('placeId', placeId);
      formData.append('file', file);

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Image uploaded successfully for ${places.find(p => p.id === placeId)?.name}` });
        // Refresh places to show new image
        fetchPlaces();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploadingId(null);
    }
  };

  const filteredPlaces = places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         place.city.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || place.type === filterType;
    return matchesSearch && matchesType;
  });

  const placeholderPlaces = filteredPlaces.filter(p => p.imageUrl?.includes('picsum.photos'));

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You must be logged in as an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🖼️ Place Image Management</h1>
          <p className="text-gray-600">Upload and manage images for all places</p>
        </div>

        {/* Message Banner */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <p className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {message.text}
            </p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by name or city
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search places..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Types</option>
                <option value="parks">Parks</option>
                <option value="cafes_restaurants">Cafes & Restaurants</option>
                <option value="walks_trails">Walks & Trails</option>
                <option value="shops_services">Shops & Services</option>
                <option value="accommodation">Accommodation</option>
                <option value="tips_local_info">Tips & Info</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>📊 Total: {filteredPlaces.length} places</span>
            <span>⚠️ Placeholders: {placeholderPlaces.length} places</span>
          </div>
        </div>

        {/* Places Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => {
            const isPlaceholder = place.imageUrl?.includes('picsum.photos');
            
            return (
              <div
                key={place.id}
                className={`bg-white rounded-lg shadow-sm overflow-hidden border-2 ${
                  isPlaceholder ? 'border-orange-300' : 'border-gray-200'
                }`}
              >
                {/* Image Preview */}
                <div className="relative h-48 bg-gray-100">
                  {place.imageUrl ? (
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <span className="text-4xl">🖼️</span>
                    </div>
                  )}
                  {isPlaceholder && (
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                      Placeholder
                    </div>
                  )}
                </div>

                {/* Place Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                    {place.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {place.city.name}, {place.city.country}
                  </p>

                  {/* Upload Button */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUpload(place.id, file);
                        }
                      }}
                      disabled={uploadingId === place.id}
                      className="hidden"
                    />
                    <div
                      className={`w-full py-2 px-4 text-center rounded-lg cursor-pointer transition-colors ${
                        uploadingId === place.id
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : isPlaceholder
                          ? 'bg-orange-600 hover:bg-orange-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {uploadingId === place.id ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading...
                        </span>
                      ) : (
                        <span>📤 Upload New Image</span>
                      )}
                    </div>
                  </label>

                  {/* Current Image URL */}
                  {place.imageUrl && (
                    <p className="mt-2 text-xs text-gray-500 truncate" title={place.imageUrl}>
                      {place.imageUrl}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredPlaces.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No places found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
