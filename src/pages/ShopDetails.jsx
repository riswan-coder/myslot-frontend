import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getShop, getGamesForShop } from '../api/shops'
import { getReviewsForShop } from '../api/reviews'
import Spinner from '../components/Spinner'

export default function ShopDetails() {
  const { id } = useParams()

  const [shop, setShop] = useState(null)
  const [games, setGames] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const shopData = await getShop(id)
        const gamesData = await getGamesForShop(id)
        const reviewsData = await getReviewsForShop(id)

        console.log('SHOP DATA:', shopData)

        setShop(shopData)
        setGames(gamesData)
        setReviews(reviewsData)
      } catch (err) {
        console.error('Shop details error:', err)
        setError('Could not load shop details.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const avgRating = reviews.length
    ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        reviews.length
      ).toFixed(1)
    : null

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>
          {error || 'Shop not found.'}{' '}
          <Link to="/" className="text-red-400 underline">
            Go home
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* ================= COVER ================= */}
      <div className="relative h-64 md:h-80 bg-zinc-950">

        {shop.cover_image ? (
          <img
            src={shop.cover_image}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-700">
            No cover image
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        {/* Back */}
        <Link
          to="/"
          className="absolute top-6 left-6 text-white/80 hover:text-white text-sm"
        >
          ← Back
        </Link>

        {/* Shop information */}
        <div className="absolute bottom-6 left-6 right-6">

          <h1 className="text-3xl font-bold">
            {shop.name}
          </h1>

          <p className="text-zinc-300 mt-1">
            {shop.city}
            {shop.area ? `, ${shop.area}` : ''}

            {avgRating && (
              <span className="ml-3 text-yellow-400">
                ★ {avgRating} ({reviews.length})
              </span>
            )}
          </p>

          {/* ================= GOOGLE MAPS ================= */}

          {shop.google_maps_url && (
            <a
              href={shop.google_maps_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              📍 View Shop on Google Maps
            </a>
          )}

          {/* GPS fallback */}
          {!shop.google_maps_url &&
            shop.latitude &&
            shop.longitude && (
              <a
                href={`https://www.google.com/maps?q=${shop.latitude},${shop.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                📍 View Shop Location
              </a>
            )}

        </div>
      </div>

      {/* ================= CONTENT ================= */}

      <div className="max-w-5xl mx-auto px-6 py-8 grid md:grid-cols-3 gap-8">

        <div className="md:col-span-2 space-y-8">


          {/* ================= GAMES ================= */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-semibold">
                Available Games
              </h2>

              {games.length > 0 && (
                <span className="text-zinc-500 text-sm">
                  {games.length}{' '}
                  {games.length === 1 ? 'game' : 'games'}
                </span>
              )}

            </div>

            {games.length === 0 ? (

              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl">

                <div className="text-3xl mb-3">
                  🎮
                </div>

                <p className="text-zinc-500 text-sm">
                  No games listed yet.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {games.map((game) => (

                  <div
                    key={game.id}
                    className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-200"
                  >

                    {/* Game Image */}
                    <div className="h-40 bg-zinc-900 overflow-hidden">

                      {game.image ? (

                        <img
                          src={game.image}
                          alt={game.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center text-zinc-700 text-5xl">
                          🎮
                        </div>

                      )}

                    </div>

                    {/* Game Details */}
                    <div className="p-4">

                      <div className="flex justify-between items-start gap-3 mb-2">

                        <h3 className="font-semibold text-white truncate">
                          {game.name}
                        </h3>

                        <span className="text-red-400 font-semibold text-sm whitespace-nowrap">
                          ₹{game.price_per_hour}/hr
                        </span>

                      </div>

                      <p className="text-zinc-500 text-sm mb-4">
                        {game.machines?.length || 0}{' '}
                        {(game.machines?.length || 0) === 1
                          ? 'machine'
                          : 'machines'}{' '}
                        available
                      </p>

                      <Link
                        to={`/booking/${shop.id}?game=${game.id}`}
                        className="block w-full text-center bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Book This Game
                      </Link>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

        {/* ================= RIGHT SIDE ================= */}

        
        <div className="space-y-5">

          {/* Contact */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              CANCEL ORDER
            </h3>
            <p>
              Before Two Houre</p>

            {shop.phone && (
              <p className="text-zinc-400 text-sm mb-3">
                📞 {shop.phone}
              </p>
            )}

          </div>

        </div>
        
        
        <div className="space-y-5">

          {/* Contact */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">

            <h3 className="font-semibold mb-4">
              Shop Information
            </h3>

            {shop.phone && (
              <p className="text-zinc-400 text-sm mb-3">
                📞 {shop.phone}
              </p>
            )}

            {shop.email && (
              <p className="text-zinc-400 text-sm mb-3 break-all">
                ✉️ {shop.email}
              </p>
            )}

            {shop.opening_time && shop.closing_time && (
              <p className="text-zinc-400 text-sm">
                🕐 {shop.opening_time} - {shop.closing_time}
              </p>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
