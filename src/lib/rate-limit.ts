/**
 * Simple rate limiting utility for API routes
 * Tracks requests by IP address
 */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Rate limit configuration
 */
interface RateLimitConfig {
  /** Maximum requests allowed in the time window */
  maxRequests: number;
  /** Time window in seconds */
  windowSeconds: number;
}

/**
 * Default rate limit: 100 requests per minute
 */
const DEFAULT_CONFIG: RateLimitConfig = {
  maxRequests: 100,
  windowSeconds: 60,
};

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (typically IP address)
 * @param config - Rate limit configuration
 * @returns true if rate limited, false if allowed
 */
export function isRateLimited(
  identifier: string,
  config: RateLimitConfig = DEFAULT_CONFIG
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // If no record or time window expired, create/reset the record
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + config.windowSeconds * 1000,
    });
    return false;
  }

  // Increment counter
  record.count++;

  // Check if limit exceeded
  if (record.count > config.maxRequests) {
    return true;
  }

  return false;
}

/**
 * Get the client IP address from Next.js request headers
 * @param headers - Request headers
 * @returns IP address or 'unknown'
 */
export function getClientIp(headers: Headers): string {
  // Try various headers in order of preference
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  const cfConnectingIp = headers.get("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp;
  }

  return "unknown";
}

/**
 * Clean up old entries from rate limit map (call periodically)
 */
export function cleanupRateLimitMap(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];
  
  rateLimitMap.forEach((record, key) => {
    if (now > record.resetTime) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach((key) => rateLimitMap.delete(key));
}

// Clean up every 5 minutes
if (typeof window === "undefined") {
  setInterval(cleanupRateLimitMap, 5 * 60 * 1000);
}
