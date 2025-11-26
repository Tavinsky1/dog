'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'

interface Review {
  id: string
  rating: number
  body?: string
  tags: string[]
  source?: string
  helpfulCount?: number
  createdAt: string
  publishedAt?: string
  user: {
    name: string
  }
}

interface ReviewsListProps {
  placeId: string
  newReview?: Review | null // For adding new reviews immediately
}

export default function ReviewsList({ placeId, newReview }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [votingReviewId, setVotingReviewId] = useState<string | null>(null)

  const fetchReviews = async (pageNum: number = 1) => {
    try {
      const response = await fetch(`/api/reviews?placeId=${placeId}&page=${pageNum}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      
      if (pageNum === 1) {
        setReviews(data.reviews)
      } else {
        setReviews(prev => [...prev, ...data.reviews])
      }
      
      setHasMore(data.pagination.page < data.pagination.pages)
      setPage(pageNum)
      
    } catch (err: any) {
      setError(err.message || 'Failed to load reviews')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [placeId])

  // Add new review to the top of the list
  useEffect(() => {
    if (newReview) {
      setReviews(prev => [newReview, ...prev])
    }
  }, [newReview])

  const loadMore = async () => {
    setLoadingMore(true)
    await fetchReviews(page + 1)
  }

  const handleHelpfulVote = async (reviewId: string) => {
    setVotingReviewId(reviewId)
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        // Update the review's helpful count in local state
        setReviews(prev => prev.map(r => 
          r.id === reviewId 
            ? { ...r, helpfulCount: data.helpfulCount }
            : r
        ))
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to vote')
      }
    } catch (err) {
      console.error('Vote error:', err)
    } finally {
      setVotingReviewId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getSourceLabel = (source?: string) => {
    switch (source) {
      case 'dogatlas_user':
        return 'DogAtlas User'
      case 'google':
        return 'Google Reviews'
      case 'reddit':
        return 'Reddit'
      case 'tripadvisor':
        return 'TripAdvisor'
      default:
        return 'User Review'
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 h-20 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-4">
        {error}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-gray-500 text-center py-8">
        <p>No reviews yet. Be the first to review this place!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h4 className="font-medium text-gray-900">
                  {review.user.name}
                </h4>
                <span className="text-sm text-gray-500">
                  {getSourceLabel(review.source)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <StarRating rating={review.rating} readonly size="sm" />
                <span className="text-sm text-gray-600">
                  {formatDate(review.publishedAt || review.createdAt)}
                </span>
              </div>
            </div>
          </div>

          {review.body && (
            <p className="text-gray-700 mb-4 leading-relaxed">
              {review.body}
            </p>
          )}

          {review.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {review.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          )}

          {/* Helpful vote button */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <button
              onClick={() => handleHelpfulVote(review.id)}
              disabled={votingReviewId === review.id}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              {votingReviewId === review.id ? 'Voting...' : 'Helpful'}
            </button>
            {(review.helpfulCount ?? 0) > 0 && (
              <span className="text-xs text-gray-400">
                {review.helpfulCount} {review.helpfulCount === 1 ? 'person' : 'people'} found this helpful
              </span>
            )}
          </div>
        </div>
      ))}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  )
}
