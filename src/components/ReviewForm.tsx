'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import StarRating from './StarRating'

interface ReviewFormProps {
  placeId: string
  onReviewSubmitted?: (review: any) => void
}

export default function ReviewForm({ placeId, onReviewSubmitted }: ReviewFormProps) {
  const { data: session } = useSession()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const suggestedTags = [
    'dog_friendly_staff',
    'water_bowls',
    'treats_available',
    'outdoor_seating',
    'off_leash_allowed',
    'busy_area',
    'quiet_spot',
    'good_for_puppies',
    'large_dogs_welcome',
    'small_dogs_only'
  ]

  const handleTagAdd = (tag: string) => {
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag])
    }
    setTagInput('')
  }

  const handleTagRemove = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!session) {
      setError('Please sign in to leave a review')
      return
    }

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          placeId,
          rating,
          body: comment.trim() || undefined,
          tags
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review')
      }

      setSuccess(true)
      setRating(0)
      setComment('')
      setTags([])
      
      if (onReviewSubmitted && data.review) {
        onReviewSubmitted(data.review)
      }

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (err: any) {
      setError(err.message || 'Failed to submit review')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600 mb-4">Sign in to leave a review for this place</p>
        <button 
          onClick={() => window.location.href = '/api/auth/signin'}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <p className="text-green-800 font-medium">Thank you for your review!</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating *
        </label>
        <StarRating 
          rating={rating} 
          onRatingChange={setRating}
          size="lg"
        />
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
          Your Experience
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell other dog owners about your experience..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          maxLength={1000}
        />
        <p className="text-sm text-gray-500 mt-1">
          {comment.length}/1000 characters
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags (optional)
        </label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagAdd(tag)}
                disabled={tags.includes(tag) || tags.length >= 5}
                className={`
                  px-3 py-1 text-sm rounded-full border transition-colors
                  ${tags.includes(tag) 
                    ? 'bg-blue-100 border-blue-300 text-blue-700 cursor-not-allowed' 
                    : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }
                  ${tags.length >= 5 && !tags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {tag.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600">Selected:</span>
              {tags.map(tag => (
                <span 
                  key={tag}
                  className="inline-flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag.replace(/_/g, ' ')}
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting || rating === 0}
        className={`
          w-full py-2 px-4 rounded-md font-medium transition-colors
          ${rating === 0 || isSubmitting
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
          }
        `}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}
