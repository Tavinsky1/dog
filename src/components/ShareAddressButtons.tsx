'use client';

import { useToast } from './Toast';
import { Share2, Copy, MapPin } from 'lucide-react';

interface ShareAddressProps {
  address: string;
  placeName: string;
  placeId: string;
}

export function ShareAddressButtons({ address, placeName, placeId }: ShareAddressProps) {
  const { addToast } = useToast();

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address);
      addToast('Address copied to clipboard!', 'success');
    } catch (err) {
      addToast('Failed to copy address', 'error');
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/places/${placeId}`;
    
    // Use native share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: placeName,
          text: `Check out ${placeName} on Dog Atlas!`,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled share, silently ignore
      }
    } else {
      // Fallback: show share menu
      showShareMenu(shareUrl, placeName);
    }
  };

  const showShareMenu = (url: string, name: string) => {
    // Copy link as fallback
    navigator.clipboard.writeText(url);
    addToast('Share link copied!', 'info');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={handleCopyAddress}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        title="Copy address"
      >
        <Copy size={16} />
        <span className="hidden sm:inline">Copy Address</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
        title="Share place"
      >
        <Share2 size={16} />
        <span className="hidden sm:inline">Share</span>
      </button>

      <a
        href={`https://maps.google.com/maps?q=${encodeURIComponent(address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-sm bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
        title="Get directions"
      >
        <MapPin size={16} />
        <span className="hidden sm:inline">Directions</span>
      </a>
    </div>
  );
}
