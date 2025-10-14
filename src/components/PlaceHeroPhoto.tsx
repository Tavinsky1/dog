/**
 * PlaceHeroPhoto Component
 * 
 * Displays place primary photo with proper attribution
 */

'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface PlaceHeroPhotoProps {
  slug: string;
  photo?: {
    cdnUrl: string;
    width: number;
    height: number;
    author: string | null;
    license: string;
    sourceUrl: string | null;
  } | null;
  placeName: string;
  fallbackImage?: string;
}

export function PlaceHeroPhoto({
  slug,
  photo,
  placeName,
  fallbackImage = '/images/places/default.jpg'
}: PlaceHeroPhotoProps) {
  const imageUrl = photo?.cdnUrl || fallbackImage;
  const showAttribution = photo && (photo.author || photo.license);

  return (
    <div className="relative w-full aspect-video bg-gray-200 rounded-lg overflow-hidden">
      <Image
        src={imageUrl}
        alt={placeName}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        priority
      />

      {/* Photo Attribution */}
      {showAttribution && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="text-white text-sm flex items-center justify-between">
            <div>
              {photo.author && (
                <span>
                  © <span className="font-medium">{photo.author}</span>
                </span>
              )}
              {photo.license && (
                <span className="ml-2">
                  <span className="font-mono text-xs bg-white/20 px-2 py-1 rounded">
                    {photo.license}
                  </span>
                </span>
              )}
            </div>
            {photo.sourceUrl && (
              <a
                href={photo.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
                title="View original source"
              >
                <span className="text-xs">Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Server-side data fetching helper
 */
export async function getPlacePhoto(slug: string): Promise<PlaceHeroPhotoProps['photo']> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/places/${slug}/photo`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.photo;
  } catch (error) {
    console.error('Failed to fetch place photo:', error);
    return null;
  }
}
