'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import { LogOut, User } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push('/sign-in')
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-100">
        <p className="text-lg text-amber-800">Loading...</p>
      </div>
    )
  }

  if (!user) {
    router.push('/sign-in')
    return null
  }

  const email = user.primaryEmailAddress?.emailAddress || 'User'

  return (
    <div className="min-h-screen bg-amber-950 p-8">
      <h1>{email}</h1>

      <div className="mt-12 text-center">
        <button
          onClick={handleLogout}
          style={{ background: 'red', padding: '5px' }}
          className="inline-flex items-center gap-2 rounded-4xl bg-red-600 px-4 py-2 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
          Logout
        </button>
      </div>
    </div>
  )
}
