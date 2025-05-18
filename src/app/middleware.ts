import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Проверяем наличие токена для защищенных маршрутов
  const token = request.cookies.get('authToken')?.value
  
  if (request.nextUrl.pathname.startsWith('/weather')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/weather/:path*']
}

