"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { generateId, a11yProps, announceToScreenReader } from '@/lib/accessibility';

interface FavoriteButtonProps {
  placeId: string;
  initialIsFavorited: boolean;
  onToggle?: (isFavorited: boolean) => void;
}

export default function FavoriteButton({ placeId, initialIsFavorited, onToggle }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const buttonId = generateId('favorite-btn');

  const handleToggle = async () => {
    if (isLoading) return;

    // Check if user is authenticated
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "loading" || !session) {
      return;
    }

    setIsLoading(true);

    // Optimistic update
    const newIsFavorited = !isFavorited;
    setIsFavorited(newIsFavorited);

    try {
      const response = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ placeId }),
      });

      if (response.ok) {
        const data = await response.json();
        const actualState = data.action === 'added';
        setIsFavorited(actualState);
        onToggle?.(actualState);

        // Announce to screen readers
        announceToScreenReader(
          actualState ? 'Place added to favorites' : 'Place removed from favorites'
        );
      } else {
        // Revert optimistic update on error
        setIsFavorited(!newIsFavorited);
        if (response.status === 401) {
          router.push("/login");
        } else {
          console.error('Failed to toggle favorite');
        }
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsFavorited(!newIsFavorited);
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = isLoading ? 'Processing...' : isFavorited ? 'Remove from favorites' : 'Add to favorites';

  return (
    <button
      id={buttonId}
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      {...a11yProps.button(buttonLabel, isFavorited)}
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isFavorited
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span aria-hidden="true">{isFavorited ? '❤️' : '🤍'}</span>
      <span>{isLoading ? '...' : isFavorited ? 'Saved' : 'Save'}</span>
    </button>
  );
}