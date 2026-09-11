import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getShops } from '../api/shops'
import ShopCard from '../components/ShopCard'
import Spinner from '../components/Spinner'

const categories = [
  { name: 'PlayStation', icon: '🎮' },
  { name: 'PC Gaming', icon: '🖥️' },
  { name: 'VR', icon: '🕶️' },
  { name: 'Racing Sim', icon: '🏎️' },
  { name: 'Pool', icon: '🎱' },
  { name: 'Xbox', icon: '🎯' },
]

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')

  useEffect(() => {
    async function load() {
      try {
        const data = await getShops()
        setShops(data)
      } catch (err) {
        setError('Could not load gaming centers.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function requestLocation() {
    if (!navigator.geolocation) {
      setLocationStatus('denied')
      return
    }
    setLocationStatus('asking')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
        setLocationStatus('granted')
      },
      () => {
        setLocationStatus('denied')
      }
    )
  }

  const shopsWithDistance = useMemo(() => {
    if (!userLocation) return shops
    return shops
      .map((shop) => {
        if (shop.latitude && shop.longitude) {
          const distance = haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            shop.latitude,
            shop.longitude
          )
          return { ...shop, distance }
        }
        return { ...shop, distance: null }
      })
      .sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1
        return a.distance - b.distance
      })
  }, [shops, userLocation])

  const filteredShops = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return shopsWithDistance
    return shopsWithDistance.filter((shop) => {
      const haystack = `${shop.name} ${shop.city} ${shop.area || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [shopsWithDistance, query])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">
            MySlot <span className="text-red-500">🎮</span>
          </h1>
          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            <Link to="/my-booking" className="hover:text-white transition-colors">My Booking</Link>
            <Link
              to="/login"
              className="hidden sm:inline-block border border-zinc-800 hover:border-zinc-600 px-4 py-1.5 rounded-full text-xs text-zinc-300 hover:text-white transition-colors"
            >
              Owner Login
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-2 md:py-8 text-center relative">
          <span className="inline-block text-xs uppercase tracking-widest text-red-400 bg-red-500/20 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            Find & Book in Seconds
          </span>
          {locationStatus === 'idle' && (
            <button
              onClick={requestLocation}
              className="inline-flex items-center gap-2 border border-zinc-800 hover:border-red-500/50 text-zinc-300 hover:text-white px-4 py-2 rounded-full text-sm mb-6 transition-colors"
            >
              📍 Show shops near me
            </button>
          )}
          {locationStatus === 'asking' && (
            <p className="text-zinc-500 text-sm mb-6">Getting your location...</p>
          )}
          {locationStatus === 'granted' && (
            <p className="text-green-400 text-sm mb-6">📍 Showing shops sorted by distance from you</p>
          )}
          {locationStatus === 'denied' && (
            <p className="text-zinc-500 text-sm mb-6">
              Location unavailable — showing all shops.{' '}
              <button onClick={requestLocation} className="underline hover:text-white">Try again</button>
            </p>
          )}

          <div className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by location, area, or gaming center name..."
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full px-5 py-3.5 text-sm focus:outline-none focus:border-red-500 shadow-lg shadow-black/40"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="border border-zinc-800 hover:bg-zinc-900 px-5 py-3.5 rounded-full text-sm text-zinc-400 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-10">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setQuery(cat.name)}
              className="flex-shrink-0 flex items-center gap-2 bg-zinc-950 border border-zinc-800 hover:border-red-500/50 rounded-full px-4 py-2 text-sm text-zinc-300 hover:text-white transition-colors"
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-semibold">
            {query ? `Results for "${query}"` : locationStatus === 'granted' ? 'Nearest Gaming Centers' : 'Gaming Centers Near You'}
          </h3>
          {!query && shops.length > 0 && (
            <span className="text-zinc-500 text-sm">{shops.length} available</span>
          )}
        </div>

        {loading && <Spinner label="Loading gaming centers..." />}
        {error && <p className="text-red-400">{error}</p>}

        {!loading && !error && filteredShops.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
            <p className="text-zinc-500">
              {query ? `No gaming centers match "${query}".` : 'No gaming centers available yet.'}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredShops.map((shop) => (
            <ShopCard key={shop.id} shop={shop} distance={shop.distance} />
          ))}
        </div>
      </section>

      <section className="border-t border-zinc-900 bg-zinc-950/50">
        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold mb-1">Instant Booking</h4>
            <p className="text-zinc-500 text-sm">No sign-up required. Pick a slot and you're in.</p>
          </div>
          <div>
            <div className="text-3xl mb-3">📍</div>
            <h4 className="font-semibold mb-1">Find Nearby</h4>
            <p className="text-zinc-500 text-sm">Search by area, city, or gaming center name.</p>
          </div>
          <div>
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold mb-1">No Double Booking</h4>
            <p className="text-zinc-500 text-sm">Every slot is reserved safely, guaranteed once.</p>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-900 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-zinc-500">
          <p>© 2026 MySlot — Find Your Game. Book Your Slot.</p>
          <div className="flex gap-4">
            <Link to="/my-booking" className="hover:text-zinc-300">My Booking</Link>
            <Link to="/login" className="hover:text-zinc-300">Owner Login</Link>
            <Link to="/privacy-policy" className="hover:text-zinc-300">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
