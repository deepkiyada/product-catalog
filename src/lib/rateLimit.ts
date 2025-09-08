import { NextRequest } from "next/server";
import { RateLimitError } from "./errorHandler";

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  keyGenerator?: (request: NextRequest) => string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for multiple instances)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute

export function createRateLimit(config: RateLimitConfig) {
  const {
    maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100"),
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"), // 15 minutes
    keyGenerator = (request: NextRequest) => getClientIP(request),
  } = config;

  return function rateLimit(request: NextRequest): void {
    const key = keyGenerator(request);
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired entry
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, entry);
      return;
    }

    // Increment count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      const resetTimeSeconds = Math.ceil((entry.resetTime - now) / 1000);
      throw new RateLimitError(
        `Rate limit exceeded. Try again in ${resetTimeSeconds} seconds.`
      );
    }

    // Update entry
    rateLimitStore.set(key, entry);
  };
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfConnectingIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to unknown if no IP found
  return "unknown";
}

// Pre-configured rate limiters
export const apiRateLimit = createRateLimit({
  maxRequests: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
});

export const strictApiRateLimit = createRateLimit({
  maxRequests: 10,
  windowMs: 60 * 1000, // 1 minute
});

// Rate limit by user agent (for bot protection)
export const botProtectionRateLimit = createRateLimit({
  maxRequests: 50,
  windowMs: 60 * 1000, // 1 minute
  keyGenerator: (request: NextRequest) => {
    const userAgent = request.headers.get("user-agent") || "unknown";
    const ip = getClientIP(request);
    return `${ip}:${userAgent}`;
  },
});
