import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/auth'
import api from '../api/client'

export default function Login() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(username, password)
      const me = await api.get('/accounts/me/')
      if (me.data.is_staff) {
        navigate('/admin/dashboard')
      } else if (me.data.role === 'owner') {
        navigate('/owner/dashboard')
      } else {
        setError('This account does not have dashboard access.')
      }
    } catch (err) {
      setError('Invalid username or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            MySlot <span className="text-orange-500">🎮</span>
          </h1>
          <p className="text-zinc-500 text-sm mt-1">Owner & Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-orange-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 py-3 rounded-lg font-medium"
          >
            {submitting ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className="text-center text-zinc-600 text-xs mt-6">
          <Link to="/" className="hover:text-zinc-400">← Back to MySlot</Link>
        </p>
      </div>
    </div>
  )
}
