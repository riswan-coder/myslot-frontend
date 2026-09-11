import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getShops, getAllGames } from '../api/shops'
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
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [selectedGameName, setSelectedGameName] = useState(null)
  const [userLocation, setUserLocation] = useState(null)
  const [locationStatus, setLocationStatus] = useState('idle')

  // Load shops + games
  useEffect(() => {
    async function load() {
      try {
        const [shopsData, gamesData] = await Promise.all([
          getShops(),
          getAllGames(),
        ])

        setShops(shopsData || [])
        setGames(gamesData || [])
      } catch (err) {
        console.error(err)
        setError('Could not load gaming centers.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // Request user's location
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
      (error) => {
        console.error('Location error:', error)
        setLocationStatus('denied')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  // Build one card per unique game name,
  // picking the first image/price found across shops
  const uniqueGames = useMemo(() => {
    const map = new Map()

    for (const game of games) {
      if (!game?.name) continue

      const key = game.name.trim().toLowerCase()

      if (!map.has(key)) {
        map.set(key, {
          name: game.name,
          image: game.image,
          price: game.price_per_hour,
        })
      }
    }

    return Array.from(map.values())
  }, [games])

  // Shop IDs that offer the currently selected game
  const shopIdsForSelectedGame = useMemo(() => {
    if (!selectedGameName) return null

    const key = selectedGameName.trim().toLowerCase()

    return new Set(
      games
        .filter(
          (g) =>
            g?.name &&
            g.name.trim().toLowerCase() === key
        )
        .map((g) => g.shop)
    )
  }, [games, selectedGameName])

  // Add distance and sort nearest first
  const shopsWithDistance = useMemo(() => {
    if (!userLocation) return shops

    return shops
      .map((shop) => {
        const lat = Number(shop.latitude)
        const lon = Number(shop.longitude)

        if (
          Number.isFinite(lat) &&
          Number.isFinite(lon)
        ) {
          const distance = haversineDistance(
            userLocation.latitude,
            userLocation.longitude,
            lat,
            lon
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
        if (a.distance === null && b.distance === null) return 0
        if (a.distance === null) return 1
        if (b.distance === null) return -1

        return a.distance - b.distance
      })
  }, [shops, userLocation])

  // Search shops
  const filteredShops = useMemo(() => {
    let list = shopsWithDistance

    // Filter by selected game
    if (shopIdsForSelectedGame) {
      list = list.filter((shop) =>
        shopIdsForSelectedGame.has(shop.id)
      )
    }

    // Search by shop/location
    const q = query.trim().toLowerCase()

    if (q) {
      list = list.filter((shop) => {
        const haystack = `
          ${shop.name || ''}
          ${shop.city || ''}
          ${shop.area || ''}
          ${shop.address || ''}
        `.toLowerCase()

        return haystack.includes(q)
      })
    }

    return list
  }, [
    shopsWithDistance,
    query,
    shopIdsForSelectedGame,
  ])

  function handleSelectGame(name) {
    setSelectedGameName((prev) =>
      prev === name ? null : name
    )

    setQuery('')
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Header */}
      <header className="border-b border-zinc-900 sticky top-0 bg-black/80 backdrop-blur-md z-20">
        <div className="max-w-6xl mx-auto px-6 py-1 flex items-center justify-between">

          <Link
            to="/"
            className="text-xl font-bold tracking-tight"
            aria-label="MySlot home"
          >
            MySlot <span className="text-red-500">🎮</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm text-zinc-400">

            <Link
              to="/my-booking"
              className="hover:text-white transition-colors"
            >
              My Booking
            </Link>

            <Link
              to="/login"
              className="hidden sm:inline-block border border-zinc-800 hover:border-zinc-600 px-4 py-1.5 rounded-full text-xs text-zinc-300 hover:text-white transition-colors"
            >
              Owner Login
            </Link>

          </nav>

        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden"
        aria-labelledby="hero-title"
      >

        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-2 md:py-8 text-center relative">

          <span className="inline-block text-xs uppercase tracking-widest text-red-400 bg-red-500/20 border border-red-500/20 rounded-full px-4 py-1.5 mb-6">
            Find & Book your Slot
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
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedGameName(null)
              }}
              placeholder="Search by location, area, or gaming center name..."
              aria-label="Search gaming centers"
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

      {/* Games row */}
      {uniqueGames.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-10">

          <div className="flex items-center justify-between mb-3">

            <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide">
              Browse by Game
            </h2>

            {selectedGameName && (
              <button
                onClick={() => setSelectedGameName(null)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Clear filter
              </button>
            )}

          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">

            {uniqueGames.map((game) => (
              <button
                key={game.name}
                onClick={() => handleSelectGame(game.name)}
                aria-label={`Show gaming centers offering ${game.name}`}
                className={`flex-shrink-0 w-28 rounded-xl border overflow-hidden transition-colors ${
                  selectedGameName === game.name
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                }`}
              >

                <div className="w-full h-20 bg-zinc-900 flex items-center justify-center">

                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl text-zinc-700">
                      🎮
                    </span>
                  )}

                </div>

                <div className="p-2 text-left">

                  <p className="text-xs font-medium truncate">
                    {game.name}
                  </p>

                  <p className="text-zinc-500 text-[10px]">
                    ₹{game.price}/hr
                  </p>

                </div>

              </button>
            ))}

          </div>

        </section>
      )}

      {/* Gaming Centers */}
      <section
        className="max-w-6xl mx-auto px-6 pb-16"
        aria-labelledby="gaming-centers-title"
      >

        <div className="flex items-center justify-between mb-5">

          <h2
            id="gaming-centers-title"
            className="text-xl font-semibold"
          >
            {selectedGameName
              ? `Gaming Centers with ${selectedGameName}`
              : query
              ? `Results for "${query}"`
              : 'Gaming Centers Near You'}
          </h2>

          {!query &&
            !selectedGameName &&
            shops.length > 0 && (
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

        {!loading &&
          !error &&
          filteredShops.length === 0 && (
            <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">

              <div className="text-4xl mb-3">
                🎮
              </div>

              <p className="text-zinc-500">
                {selectedGameName
                  ? `No gaming centers currently offer ${selectedGameName}.`
                  : query
                  ? `No gaming centers match "${query}".`
                  : 'No gaming centers available yet.'}
              </p>

            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredShops.map((shop) => (
            <ShopCard
              key={shop.id}
              shop={shop}
            />
          ))}

        </div>

      </section>

      {/* Features */}
      <section className="border-t border-zinc-900 bg-zinc-950/50">

        <div className="max-w-6xl mx-auto px-6 py-16 grid sm:grid-cols-3 gap-8 text-center">

          <div>
            <div className="text-3xl mb-3">⚡</div>

            <h3 className="font-semibold mb-1">
              Instant Booking
            </h3>

            <p className="text-zinc-500 text-sm">
              No sign-up required. Pick a slot and you're in.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-3">📍</div>

            <h3 className="font-semibold mb-1">
              Find Nearby
            </h3>

            <p className="text-zinc-500 text-sm">
              Search by area, city, or gaming center name.
            </p>
          </div>

          <div>
            <div className="text-3xl mb-3">🔒</div>

            <h3 className="font-semibold mb-1">
              No Double Booking
            </h3>

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

            <Link
              to="/privacy-policy"
              className="hover:text-zinc-300"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms-of-service"
              className="hover:text-zinc-300"
            >
              Terms
            </Link>

          </div>

        </div>

      </footer>

    </div>
  )
}