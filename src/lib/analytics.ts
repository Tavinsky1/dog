// Client-side analytics tracking for DogAtlas
'use client'

interface AnalyticsEvent {
  eventType: string
  eventData?: Record<string, any>
  userId?: string
  page?: string
  referrer?: string
  city?: string
  category?: string
  placeId?: string
  searchQuery?: string
}

class Analytics {
  private sessionId: string
  private userId?: string
  private isEnabled: boolean = true

  constructor() {
    this.sessionId = this.getOrCreateSessionId()
    this.setupPageTracking()
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('dogatlas_session_id')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('dogatlas_session_id', sessionId)
    }
    return sessionId
  }

  public setUserId(userId: string) {
    this.userId = userId
  }

  public disable() {
    this.isEnabled = false
  }

  public enable() {
    this.isEnabled = true
  }

  private setupPageTracking() {
    // Track initial page load
    if (typeof window !== 'undefined') {
      this.trackPageView()
      
      // Track page changes for SPA navigation
      const originalPushState = history.pushState
      const originalReplaceState = history.replaceState
      const self = this
      
      history.pushState = function() {
        originalPushState.apply(history, arguments as any)
        setTimeout(() => self.trackPageView(), 100)
      }
      
      history.replaceState = function() {
        originalReplaceState.apply(history, arguments as any)
        setTimeout(() => self.trackPageView(), 100)
      }
      
      window.addEventListener('popstate', () => {
        setTimeout(() => self.trackPageView(), 100)
      })
    }
  }

  public async track(event: AnalyticsEvent) {
    if (!this.isEnabled || typeof window === 'undefined') return

    try {
      const payload = {
        ...event,
        sessionId: this.sessionId,
        userId: this.userId,
        page: event.page || window.location.pathname,
        referrer: event.referrer || document.referrer || undefined
      }

      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.warn('Analytics tracking failed:', error)
    }
  }

  public trackPageView(customData?: Record<string, any>) {
    if (typeof window === 'undefined') return

    const pathname = window.location.pathname
    let city, category, placeId

    // Extract context from URL
    if (pathname.startsWith('/berlin')) {
      city = 'berlin'
      
      // Category pages: /berlin/c/category_name
      const categoryMatch = pathname.match(/\/berlin\/c\/([^\/]+)/)
      if (categoryMatch) {
        category = categoryMatch[1]
      }
    }
    
    // Place pages: /places/place_id
    const placeMatch = pathname.match(/\/places\/([^\/]+)/)
    if (placeMatch) {
      placeId = placeMatch[1]
    }

    this.track({
      eventType: 'page_view',
      eventData: customData,
      city,
      category,
      placeId
    })
  }

  public trackPlaceView(placeId: string, placeName: string, category: string) {
    this.track({
      eventType: 'place_view',
      eventData: { placeName, category },
      placeId,
      category
    })
  }

  public trackCategoryClick(category: string, city: string = 'berlin') {
    this.track({
      eventType: 'category_click',
      eventData: { categoryName: category },
      category,
      city
    })
  }

  public trackSearch(query: string, resultsCount: number, city: string = 'berlin') {
    this.track({
      eventType: 'search',
      eventData: { resultsCount },
      searchQuery: query,
      city
    })
  }

  public trackLocationChange(fromCity: string, toCity: string) {
    this.track({
      eventType: 'location_change',
      eventData: { fromCity, toCity },
      city: toCity
    })
  }

  public trackMapInteraction(action: string, city: string = 'berlin') {
    this.track({
      eventType: 'map_interaction',
      eventData: { action },
      city
    })
  }

  public trackReviewSubmission(placeId: string, rating: number) {
    this.track({
      eventType: 'review_submission',
      eventData: { rating },
      placeId
    })
  }

  public trackPhotoUpload(placeId: string) {
    this.track({
      eventType: 'photo_upload',
      placeId
    })
  }

  public trackUserAction(action: string, data?: Record<string, any>) {
    this.track({
      eventType: 'user_action',
      eventData: { action, ...data }
    })
  }

  public trackError(error: string, context?: Record<string, any>) {
    this.track({
      eventType: 'error',
      eventData: { error, context }
    })
  }

  public trackPerformance(metric: string, value: number, context?: Record<string, any>) {
    this.track({
      eventType: 'performance',
      eventData: { metric, value, context }
    })
  }
}

// Create global analytics instance
const analytics = typeof window !== 'undefined' ? new Analytics() : null

// Export tracking functions for easy use
export const trackPageView = (customData?: Record<string, any>) => {
  analytics?.trackPageView(customData)
}

export const trackPlaceView = (placeId: string, placeName: string, category: string) => {
  analytics?.trackPlaceView(placeId, placeName, category)
}

export const trackCategoryClick = (category: string, city: string = 'berlin') => {
  analytics?.trackCategoryClick(category, city)
}

export const trackSearch = (query: string, resultsCount: number, city: string = 'berlin') => {
  analytics?.trackSearch(query, resultsCount, city)
}

export const trackLocationChange = (fromCity: string, toCity: string) => {
  analytics?.trackLocationChange(fromCity, toCity)
}

export const trackMapInteraction = (action: string, city: string = 'berlin') => {
  analytics?.trackMapInteraction(action, city)
}

export const trackReviewSubmission = (placeId: string, rating: number) => {
  analytics?.trackReviewSubmission(placeId, rating)
}

export const trackPhotoUpload = (placeId: string) => {
  analytics?.trackPhotoUpload(placeId)
}

export const trackUserAction = (action: string, data?: Record<string, any>) => {
  analytics?.trackUserAction(action, data)
}

export const trackError = (error: string, context?: Record<string, any>) => {
  analytics?.trackError(error, context)
}

export const trackPerformance = (metric: string, value: number, context?: Record<string, any>) => {
  analytics?.trackPerformance(metric, value, context)
}

export const setUserId = (userId: string) => {
  analytics?.setUserId(userId)
}

export const disableAnalytics = () => {
  analytics?.disable()
}

export const enableAnalytics = () => {
  analytics?.enable()
}

export default analytics
