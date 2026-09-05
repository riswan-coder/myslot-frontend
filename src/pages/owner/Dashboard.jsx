import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/client'
import { logout } from '../../api/auth'
import Spinner from '../../components/Spinner'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/shops/gaming-centers/')
        setShops(res.data)
      } catch {
        setShops([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          MySlot <span className="text-orange-500">Owner</span>
        </h1>
        <button onClick={handleLogout} className="text-zinc-400 hover:text-white text-sm">
          Log Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">My Shops</h2>
          <Link to="/owner/shop/new" className="text-orange-400 hover:text-orange-300 text-sm">
            + New Shop
          </Link>
        </div>

        {loading && <Spinner />}

        {!loading && shops.length === 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
            <p className="text-zinc-400 mb-4">You don't have any shops yet.</p>
            <Link
              to="/owner/shop/new"
              className="inline-block bg-orange-500 hover:bg-orange-600 px-5 py-2.5 rounded-lg text-sm font-medium"
            >
              + Add Your First Shop
            </Link>
          </div>
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          {shops.map((shop) => (
            <div key={shop.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{shop.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    shop.status === 'active'
                      ? 'bg-green-500/20 text-green-400'
                      : shop.status === 'pending'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {shop.status}
                </span>
              </div>
              <p className="text-zinc-500 text-sm mb-4">{shop.city}</p>
              <div className="flex gap-2 text-sm">
                <Link
                  to={`/owner/shop/${shop.id}/games`}
                  className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-800"
                >
                  Games
                </Link>
                <Link
                  to={`/owner/shop/${shop.id}/slots`}
                  className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-800"
                >
                  Slots
                </Link>
                <Link
                  to="/owner/bookings"
                  className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-800"
                >
                  Bookings
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
