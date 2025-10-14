'use client';

/**
 * Admin Photo Review Page
 * 
 * Moderates PENDING photos - approve or reject with notes
 */

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface PlacePhoto {
  id: string;
  placeId: string;
  place: {
    slug: string;
    name: string;
    city: { name: string };
    country: string;
  };
  cdnUrl: string;
  width: number;
  height: number;
  author: string | null;
  license: string;
  sourceUrl: string | null;
  source: string | null;
  status: string;
  createdAt: string;
}

interface ReviewFilters {
  city?: string;
  country?: string;
  license?: string;
  status: string;
}

export default function PhotoReviewPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [photos, setPhotos] = useState<PlacePhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ReviewFilters>({ status: 'PENDING' });
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  // Check admin access
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/api/auth/signin');
    } else if (session?.user && (session.user as any).role !== 'ADMIN') {
      router.push('/');
    }
  }, [session, status, router]);

  // Load photos
  useEffect(() => {
    loadPhotos();
  }, [filters]);

  async function loadPhotos() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.city) params.set('city', filters.city);
      if (filters.country) params.set('country', filters.country);
      if (filters.license) params.set('license', filters.license);
      params.set('status', filters.status);

      const response = await fetch(`/api/admin/photos?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data.photos);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(photoId: string, approved: boolean) {
    setReviewingId(photoId);
    try {
      const response = await fetch(`/api/admin/photos/${photoId}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved, notes })
      });

      if (response.ok) {
        setNotes('');
        loadPhotos(); // Reload list
      } else {
        alert('Failed to review photo');
      }
    } catch (error) {
      console.error('Review failed:', error);
      alert('Review failed');
    } finally {
      setReviewingId(null);
    }
  }

  if (status === 'loading' || loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Photo Review Queue</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={filters.city || ''}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                placeholder="Filter by city"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={filters.country || ''}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                placeholder="Filter by country"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">License</label>
              <input
                type="text"
                value={filters.license || ''}
                onChange={(e) => setFilters({ ...filters, license: e.target.value })}
                placeholder="Filter by license"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <div className="space-y-8">
          {photos.length === 0 ? (
            <div className="bg-white p-12 rounded-lg shadow text-center text-gray-500">
              No photos to review
            </div>
          ) : (
            photos.map((photo) => (
              <div key={photo.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  {/* Image */}
                  <div className="relative aspect-video bg-gray-100 rounded overflow-hidden">
                    <Image
                      src={photo.cdnUrl}
                      alt={photo.place.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{photo.place.name}</h3>
                      <p className="text-gray-600">
                        {photo.place.city.name}, {photo.place.country}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Dimensions:</span>{' '}
                        {photo.width} × {photo.height}
                      </div>
                      <div>
                        <span className="font-medium">License:</span>{' '}
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {photo.license}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Author:</span> {photo.author || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Source:</span> {photo.source || 'Unknown'}
                      </div>
                    </div>

                    {photo.sourceUrl && (
                      <div>
                        <a
                          href={photo.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View original source →
                        </a>
                      </div>
                    )}

                    {/* Review Form */}
                    {photo.status === 'PENDING' && (
                      <div className="pt-4 border-t">
                        <label className="block text-sm font-medium mb-2">Review Notes</label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Optional notes about this photo..."
                          className="w-full border rounded px-3 py-2 mb-4"
                          rows={3}
                        />

                        <div className="flex gap-4">
                          <button
                            onClick={() => handleReview(photo.id, true)}
                            disabled={reviewingId === photo.id}
                            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
                          >
                            {reviewingId === photo.id ? 'Processing...' : '✓ Approve'}
                          </button>
                          <button
                            onClick={() => handleReview(photo.id, false)}
                            disabled={reviewingId === photo.id}
                            className="flex-1 bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
                          >
                            {reviewingId === photo.id ? 'Processing...' : '✗ Reject'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    {photo.status !== 'PENDING' && (
                      <div className="pt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            photo.status === 'APPROVED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {photo.status}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
