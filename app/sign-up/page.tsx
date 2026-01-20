'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSignUp } from '@clerk/nextjs'
import Link from 'next/link'

export default function CustomSignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isLoaded) return null

  const handleSignUp = async () => {
    if (!email || !password) {
      setError('Email and password are required')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create the user account
      await signUp.create({ emailAddress: email, password })
      // Send verification code
      await signUp.prepareEmailAddressVerification({
        strategy: 'email_code'
      })
      setVerifying(true)
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Sign up failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async () => {
    if (code.length < 6) {
      setError('Enter a valid 6-digit code')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Verify the code
      const result = await signUp.attemptEmailAddressVerification({ code }) 
      if (result.status === 'complete') {
        // Activate session
        await setActive({ session: result.createdSessionId }) 
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message ?? 'Invalid code')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-100">
      <div className="w-full max-w-md rounded-xl bg-amber-800 p-6 shadow">
        <h1 className="mb-4 text-2xl font-bold text-center text-white">
          Create your account
        </h1>

        {error && (
          <p className="mb-3 rounded bg-red-100 p-2 text-sm text-red-600">
            {error}
          </p>
        )}

        {!verifying ? (
          <>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 w-full rounded border p-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="mb-4 w-full rounded border p-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <div id="clerk-captcha" className="mb-4" />

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-full rounded bg-black p-2 text-amber-600 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
            <p
              className="text-right text-sm text-gray-600"
              style={{ display: 'flex', justifyContent: 'space-between' }}>
              Already have an account?{' '}
              <Link href="/sign-in" className="text-blue-400 underline">
                Sign In
              </Link>
            </p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter verification code"
              className="mb-4 w-full rounded border p-2"
              value={code}
              onChange={e => setCode(e.target.value)}
            />

            <div id="clerk-captcha" className="mb-4" />

            <button
              onClick={handleVerify}
              disabled={loading}
              className="w-full rounded bg-green-600 p-2 text-amber-200 disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
