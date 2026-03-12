import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { authApi } from '../services/api'
import { setApiToken } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { ShieldCheck } from 'lucide-react'
import { Spinner } from '../components/Spinner'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      const tokenResp = await authApi.login(data.email, data.password)
      setApiToken(tokenResp.access_token)
      const user = await authApi.me()
      login(tokenResp.access_token, user)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
      setApiToken(null)
    }
  }

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShieldCheck className="text-blue-400" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white">GDPR Privacy Manager</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to manage your personal data</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Welcome back</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input {...register('email')} type="email" placeholder="you@example.com" className="input" />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input {...register('password')} type="password" placeholder="••••••••" className="input" />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {isSubmitting ? <><Spinner /> Signing in...</> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
