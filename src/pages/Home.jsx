import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getShops, getGamesForShop } from '../api/shops'
import ShopCard from '../components/ShopCard'
import Spinner from '../components/Spinner'

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

export default function Home() {
  const [shops, setShops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')

  // Load shops + games
  useEffect(() => {
    async function load() {
      try {
        const shopsData = await getShops()

        // Get games for every shop
        const shopsWithGames = await Promise.all(
          shopsData.map(async (shop) => {
            try {
              const games = await getGamesForShop(shop.id)

              return {
                ...shop,
                games: games || [],
              }
            } catch {
              return {
                ...shop,
                games: [],
              }
            }
          })
        )

        setShops(shopsWithGames)
      } catch (err) {
        console.error(err)
        setError('Could not load gaming centers.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

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

  // Calculate distance
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

          return {
            ...shop,
            distance,
          }
        }

        return {
          ...shop,
          distance: null,
        }
      })
      .sort((a, b) => {
        if (a.distance === null) return 1
        if (b.distance === null) return -1

        return a.distance - b.distance
      })
  }, [shops, userLocation])

  // Search shops AND games
  const filteredShops = useMemo(() => {
    const q = query.trim().toLowerCase()

    if (!q) {
      return shopsWithDistance
    }

    return shopsWithDistance.filter((shop) => {
      // Shop information
      const shopInformation = `
        ${shop.name || ''}
        ${shop.city || ''}
        ${shop.area || ''}
        ${shop.address || ''}
      `.toLowerCase()

      // Game names
      const gameInformation = (shop.games || [])
        .map((game) => game.name || '')
        .join(' ')
        .toLowerCase()

      // Search both shop + game
      return (
        shopInformation.includes(q) ||
        gameInformation.includes(q)
      )
    })
  }, [shopsWithDistance, query])

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <h1 className="text-xl font-bold tracking-tight">
            <span className="text-white">My</span>
            <span className="text-red-500">Slot</span>
            <span className="text-red-500"> 🎮</span>
          </h1>

          <nav className="flex items-center gap-6 text-sm text-zinc-400">
            <Link
              to="/login"
              className="hover:text-white transition-colors"
            >
              Owner Login
            </Link>
          </nav>

        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-28 text-center relative">

          <span className="inline-block text-xs uppercase tracking-widest text-red-400 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            Find & Book in Seconds
          </span>

          {/* Location */}
          {locationStatus === 'idle' && (
            <button
              onClick={requestLocation}
              className="inline-flex items-center gap-2 border border-zinc-800 hover:border-red-500/50 text-zinc-300 hover:text-white px-4 py-2 rounded-full text-sm mb-6 transition-colors"
            >
              📍 Show shops near me
            </button>
          )}

          {locationStatus === 'asking' && (
            <p className="text-zinc-500 text-sm mb-6">
              Getting your location...
            </p>
          )}

          {locationStatus === 'granted' && (
            <p className="text-green-400 text-sm mb-6">
              📍 Showing shops sorted by distance from you
            </p>
          )}

          {locationStatus === 'denied' && (
            <p className="text-zinc-500 text-sm mb-6">
              Location unavailable — showing all shops.{' '}
              <button
                onClick={requestLocation}
                className="underline hover:text-white"
              >
                Try again
              </button>
            </p>
          )}

          {/* Search */}
          <div className="max-w-xl mx-auto flex gap-2">

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search shop, location, area, or game..."
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

          {/* Search examples */}
          <p className="text-zinc-600 text-xs mt-3">
            Try: FIFA, GTA, PlayStation, PC Gaming, Kozhikode...
          </p>

        </div>
      </section>

      {/* Shops */}
      <section className="max-w-6xl mx-auto px-6 pb-16">

        <div className="flex items-center justify-between mb-5">

          <h3 className="text-xl font-semibold">
            {query
              ? `Results for "${query}"`
              : locationStatus === 'granted'
              ? 'Nearest Gaming Centers'
              : 'Gaming Centers'}
          </h3>

          {!query && shops.length > 0 && (
            <span className="text-zinc-500 text-sm">
              {shops.length} available
            </span>
          )}

        </div>

        {loading && (
          <Spinner label="Loading gaming centers..." />
        )}

        {error && (
          <p className="text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && filteredShops.length === 0 && (
          <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">

            <div className="text-4xl mb-3">
              🎮
            </div>

            <p className="text-zinc-500">
              {query
                ? `No gaming centers or games found for "${query}".`
                : 'No gaming centers available yet.'}
            </p>

          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
              distance={shop.distance}
            />
          ))}

        </div>

      </section>

      {/* Features */}
      <section className="border-t border-zinc-900 bg-zinc-950/50">

        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8 text-center">

          <div>
            <div className="text-3xl mb-3">⚡</div>
            <h4 className="font-semibold mb-1">
              Instant Booking
            </h4>
            <p className="text-zinc-500 text-sm">
              No sign-up required. Pick a slot and you're in.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-3">📍</div>
            <h4 className="font-semibold mb-1">
              Find Nearby
            </h4>
            <p className="text-zinc-500 text-sm">
              Search by area, city, or gaming center name.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-3">🔒</div>
            <h4 className="font-semibold mb-1">
              No Double Booking
            </h4>
            <p className="text-zinc-500 text-sm">
              Every slot is reserved safely, guaranteed once.
            </p>
          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10">

        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-zinc-500">

          <p>
            © 2026 MySlot — Find Your Game. Book Your Slot.
          </p>

          <div className="flex gap-4">

            <Link
              to="/my-booking"
              className="hover:text-zinc-300"
            >
              My Booking
            </Link>

            <Link
              to="/login"
              className="hover:text-zinc-300"
            >
              Owner Login
            </Link>

          </div>

        </div>

      </footer>

    </div>
  )
}
