'pnpmimport { NextResponse, type NextRequest } from 'next/server'
import { RateLimiter } from 'fastest-rate-limiter'

const limiter = new RateLimiter({
  tokensPerInterval: 10,    // Max 10 requests
  interval: '15m',         // Per 15 minutes
})

export async function rateLimitMiddleware(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || 
            request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 
            'unknown'
  const key = `rl_${ip}`

  const { allowed } = await limiter.check(key)
  
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' }, 
      { status: 429 }
    )
  }

  return NextResponse.next()
}
