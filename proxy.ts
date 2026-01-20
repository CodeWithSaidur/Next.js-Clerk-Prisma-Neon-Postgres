import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in',
  '/sign-up',
  '/api/webhook/register'
])

// Admin routes
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware((auth, request) => {
  const { userId, sessionClaims }: any = auth
  const role = sessionClaims?.publicMetadata?.role as string | undefined
  const url = new URL(request.url)

  // Handle unauthenticated users accessing protected routes
  if (!userId && !isPublicRoute(request)) {
    auth.protect()
  }

  // Redirect authenticated users away from public routes
  if (userId && isPublicRoute(request)) {
    return NextResponse.redirect(
      new URL(role === 'admin' ? '/admin/dashboard' : '/dashboard', url)
    )
  }

  // Redirect admin from /dashboard to /admin/dashboard
  if (role === 'admin' && url.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/admin/dashboard', url))
  }

  // Prevent non-admin users from accessing admin routes
  if (isAdminRoute(request) && role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', url))
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
}
