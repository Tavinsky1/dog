import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

// Simple in-memory rate limiter for development
// In production, use Redis or Upstash
class MemoryRateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()

  async isAllowed(
    identifier: string,
    limit: number,
    windowMs: number
  ): Promise<{ success: boolean; limit: number; remaining: number; reset: Date }> {
    const now = Date.now()
    const key = identifier

    // Clean up expired entries
    const entries = Array.from(this.requests.entries())
    for (const [k, v] of entries) {
      if (v.resetTime <= now) {
        this.requests.delete(k)
      }
    }

    const current = this.requests.get(key)

    if (!current || current.resetTime <= now) {
      // First request or window has reset
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs
      })
      return {
        success: true,
        limit,
        remaining: limit - 1,
        reset: new Date(now + windowMs)
      }
    }

    if (current.count >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        reset: new Date(current.resetTime)
      }
    }

    current.count++
    return {
      success: true,
      limit,
      remaining: limit - current.count,
      reset: new Date(current.resetTime)
    }
  }
}

const limiter = new MemoryRateLimiter()

interface RateLimitConfig {
  requests: number
  window: number // in milliseconds
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

export async function rateLimit(
  request: NextRequest,
  config: RateLimitConfig
): Promise<{ success: boolean; response?: NextResponse }> {
  // Get identifier (IP address or user ID if authenticated)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

  const result = await limiter.isAllowed(ip, config.requests, config.window)

  if (!result.success) {
    return {
      success: false,
      response: new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.getTime().toString(),
            'Retry-After': Math.round((result.reset.getTime() - Date.now()) / 1000).toString()
          }
        }
      )
    }
  }

  return { success: true }
}

// Input validation helpers
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function sanitizeInput(input: string): string {
  // Remove potential XSS vectors
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
}

export function validateFileUpload(file: File, allowedTypes: string[], maxSize: number): { valid: boolean; error?: string } {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size ${Math.round(file.size / 1024 / 1024)}MB exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`
    }
  }

  return { valid: true }
}

// CSRF protection
export function validateCSRFToken(request: NextRequest): boolean {
  const token = request.headers.get('x-csrf-token')
  const cookie = request.cookies.get('csrf-token')?.value

  if (!token || !cookie) {
    return false
  }

  return token === cookie
}

// Security headers
export function addSecurityHeaders(response: NextResponse): NextResponse {
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // Remove server header
  response.headers.delete('Server')

  return response
}