"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
<<<<<<< HEAD
  // const [example, setExample] = useState('') this is removed because we dont need it
=======
>>>>>>> parent of 657d639 (add feature)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
      const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp })
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('user', JSON.stringify(res.data.user))
        router.push('/chat')
      } else {
        setMessage('Verification failed')
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Verification error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="mb-4">We sent a 4-digit code to <strong>{email}</strong></p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={6}
            className="w-full px-4 py-2 border rounded"
            placeholder="Enter verification code"
          />
          {message && <div className="text-red-600">{message}</div>}
          <button disabled={loading} className="w-full bg-whatsapp-green text-white py-2 rounded">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
