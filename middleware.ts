import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Temporarily disabled - will be enabled after database is fully set up
export function middleware(request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
