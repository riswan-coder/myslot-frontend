import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {
  getAllShops,
  approveShop,
  rejectShop,
  deleteShop,
} from '../../api/admin'
import { logout } from '../../api/auth'

const statusStyles = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  active: 'bg-green-500/20 text-green-400',
  suspended: 'bg-red-500/20 text-red-400',
  approved: 'bg-blue-500/20 text-blue-400',
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('pending')

  async function loadShops() {
    setLoading(true)
    try {
      const data = await getAllShops()
      setShops(data)
    } catch {
      setError('Could not load shops.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadShops()
  }, [])

  async function handleApprove(id) {
    try {
      await approveShop(id)
      loadShops()
    } catch {
      setError('Could not approve shop.')
    }
  }

  async function handleReject(id) {
    try {
      await rejectShop(id)
      loadShops()
    } catch {
      setError('Could not reject shop.')
    }
  }

  async function handleDelete(id, name) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?\n\nThis action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setError('')
      await deleteShop(id)

      setShops((currentShops) =>
        currentShops.filter((shop) => shop.id !== id)
      )
    } catch (err) {
      setError('Could not delete shop.')
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const filtered = filter === 'all' ? shops : shops.filter((s) => s.status === filter)
  const pendingCount = shops.filter((s) => s.status === 'pending').length

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          MySlot <span className="text-orange-500">Admin</span>
        </h1>
        <button onClick={handleLogout} className="text-zinc-400 hover:text-white text-sm">
          Log Out
        </button>
        <Link to="/admin/users" className="text-zinc-400 hover:text-white text-sm mr-4">
          Users
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">Total Shops</p>
            <p className="text-2xl font-bold">{shops.length}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <p className="text-zinc-500 text-sm">Active</p>
            <p className="text-2xl font-bold text-green-400">
              {shops.filter((s) => s.status === 'active').length}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {['pending', 'active', 'suspended', 'all'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize ${
                filter === f ? 'bg-orange-500 text-white' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        {loading && <p className="text-zinc-500">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="text-zinc-500 text-sm">No shops found.</p>}

        <div className="space-y-3">
          {filtered.map((shop) => (
            <div key={shop.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex justify-between items-center">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-medium">{shop.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[shop.status]}`}>
                    {shop.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm">{shop.city} · {shop.phone}</p>
              </div>

              <div className="flex gap-2">
                {shop.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(shop.id)}
                      className="text-xs bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(shop.id)}
                      className="text-xs border border-red-900 text-red-400 hover:bg-red-950 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}

  <button
    onClick={() => handleDelete(shop.id, shop.name)}
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
