import { Link } from 'react-router-dom'

export default function ShopCard({ shop, distance }) {
  return (
    <Link
      to={`/shop/${shop.id}`}
      className="block group"
    >
      <div className="bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800 hover:border-red-500/50 transition-all duration-200 cursor-pointer">

        {/* Shop Image */}
        <div className="relative h-40 overflow-hidden bg-zinc-900 flex items-center justify-center">

          {shop.cover_image ? (
            <img
              src={shop.cover_image}
              alt={shop.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <span className="text-zinc-700 text-sm">
              No image yet
            </span>
          )}

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          {/* Open / Closed */}
          <span
            className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full font-medium ${
              shop.is_enabled
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}
          >
            {shop.is_enabled ? 'Open' : 'Closed'}
          </span>

          {/* Distance */}
          {distance !== null && distance !== undefined && (
            <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full bg-black/70 text-white backdrop-blur-sm">
              📍{' '}
              {distance < 1
                ? `${Math.round(distance * 1000)}m`
                : `${distance.toFixed(1)}km`}
            </span>
          )}

          {/* Shop Name */}
          <h3 className="absolute bottom-3 left-4 font-semibold text-white text-lg drop-shadow-lg group-hover:text-red-400 transition-colors">
            {shop.name}
          </h3>
        </div>

        {/* Shop Information */}
        <div className="p-4">

          <p className="text-zinc-400 text-sm">
            {shop.city}
            {shop.area ? `, ${shop.area}` : ''}
          </p>

          {/* Click hint */}
         

        </div>
      </div>
    </Link>
  )
}
