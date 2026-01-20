'use client'

import { useState } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const handleSignIn = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await signIn.create({
        identifier: email,
        password
      })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.push('/dashboard')
      } else {
        setError('Additional verification required')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <div className="w-full max-w-md rounded-xl bg-amber-800 p-6 shadow-lg">
        <h1 className="mb-4 text-2xl font-bold text-center text-white">
          Sign in to your account
        </h1>

        {error && (
          <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="mb-3 w-full rounded border p-2"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          className="mb-4 w-full rounded border p-2"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
        />

        {/* Smart CAPTCHA */}
        <div id="clerk-captcha" className="mb-4" />

        <button
          onClick={handleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-black p-2 text-amber-600 disabled:opacity-50">
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p className="mt-3 flex justify-between text-sm text-gray-300">
          <span>Don't have an account?</span>
          <Link href="/sign-up" className="text-blue-400 underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
