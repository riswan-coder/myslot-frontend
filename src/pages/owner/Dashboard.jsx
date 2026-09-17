import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/client'
import { logout } from '../../api/auth'
import { getBookingStats } from '../../api/owner'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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

  async function loadStats(sDate, eDate) {
    setStatsLoading(true)
    try {
      const data = await getBookingStats(sDate, eDate)
      setStats(data)
    } catch {
      setStats(null)
    } finally {
      setStatsLoading(false)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  function handleDateRangeSubmit(e) {
    e.preventDefault()
    if (startDate && endDate) {
      loadStats(startDate, endDate)
    }
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          MySlot <span className="text-red-500">Owner</span>
        </h1>
        <button onClick={handleLogout} className="text-zinc-400 hover:text-white text-sm">
          Log Out
        </button>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Stats cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Overview</h2>
          {statsLoading && <p className="text-zinc-500 text-sm">Loading stats...</p>}
          {stats && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">📅 Today's Bookings</p>
                <p className="text-2xl font-bold">{stats.today_bookings}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">💰 Today's Revenue</p>
                <p className="text-2xl font-bold text-red-400">₹{stats.today_revenue}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">📊 Total Bookings</p>
                <p className="text-2xl font-bold">{stats.total_bookings}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
                <p className="text-zinc-500 text-xs mb-1">💵 Total Revenue</p>
                <p className="text-2xl font-bold text-red-400">₹{stats.total_revenue}</p>
              </div>
            </div>
          )}

          {/* Custom date range */}
          <form onSubmit={handleDateRangeSubmit} className="mt-4 bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-wrap items-end gap-3">
            <div>
              <label className="text-zinc-500 text-xs block mb-1">From</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs block mb-1">To</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm font-medium"
            >
              📅 Check Range
            </button>
            {stats?.range_bookings !== undefined && (
              <div className="text-sm text-zinc-400 ml-auto">
                <span className="text-white font-medium">{stats.range_bookings}</span> bookings ·{' '}
                <span className="text-red-400 font-medium">₹{stats.range_revenue}</span> revenue
                <span className="text-zinc-600"> ({stats.range_start} to {stats.range_end})</span>
              </div>
            )}
          </form>
        </div>

        {/* Shops */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">My Shops</h2>
            <Link to="/owner/shop/new" className="text-red-400 hover:text-red-300 text-sm">
              + New Shop
            </Link>
          </div>

          {loading && <p className="text-zinc-500">Loading...</p>}

          {!loading && shops.length === 0 && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 text-center">
              <p className="text-zinc-400 mb-4">You don't have any shops yet.</p>
              <Link
                to="/owner/shop/new"
                className="inline-block bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-lg text-sm font-medium"
              >
                + Add Your First Shop
              </Link>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {shops.map((shop) => (
              <div key={shop.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
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
                    className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-900"
                  >
                    Games
                  </Link>
                  <Link
                    to={`/owner/shop/${shop.id}/slots`}
                    className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-900"
                  >
                    Slots
                  </Link>
                  <Link
                    to="/owner/bookings"
                    className="flex-1 text-center border border-zinc-700 py-2 rounded-lg hover:bg-zinc-900"
                  >
                    Bookings
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
