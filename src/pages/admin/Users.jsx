import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getUsers,
  suspendUser,
  activateUser,
  deleteUser,
} from '../../api/admin'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await getUsers(roleFilter, search)
      setUsers(data)
    } catch {
      setError('Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(loadUsers, 300)
    return () => clearTimeout(timer)
  }, [roleFilter, search])

  async function handleSuspend(id) {
    try {
      await suspendUser(id)
      loadUsers()
    } catch {
      setError('Could not suspend user.')
    }
  }

  async function handleActivate(id) {
    try {
      await activateUser(id)
      loadUsers()
    } catch {
      setError('Could not activate user.')
    }
  }

  async function handleDelete(userId, username, role) {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ${role} "${username}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setError('')

      await deleteUser(userId)

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== userId)
      )
    } catch {
      setError('Could not delete user.')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/admin/dashboard" className="text-zinc-400 hover:text-white text-sm">← Back to Dashboard</Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Users & Owners</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-red-500"
          >
            <option value="">All roles</option>
            <option value="customer">Customers</option>
            <option value="owner">Owners</option>
          </select>
        </div>

        {loading && <p className="text-zinc-500">Loading...</p>}
        {!loading && users.length === 0 && <p className="text-zinc-500 text-sm">No users found.</p>}

        <div className="space-y-2">
          {users.map((u) => (
            <div key={u.id} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{u.username}</span>
                  <span className="text-xs bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-full capitalize">
                    {u.role}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      u.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {u.is_active ? 'Active' : 'Suspended'}
                  </span>
                </div>
                <p className="text-zinc-500 text-xs mt-1">{u.email || 'No email'} · {u.phone || 'No phone'}</p>
              </div>

              <div className="flex items-center gap-2">
                {u.is_active ? (
                  <button
                    onClick={() => handleSuspend(u.id)}
                    className="text-xs border border-red-900 text-red-400 hover:bg-red-950 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleActivate(u.id)}
                    className="text-xs border border-green-900 text-green-400 hover:bg-green-950 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Activate
                  </button>
                )}

                <button
                  onClick={() => handleDelete(u.id, u.username, u.role)}
                  className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
