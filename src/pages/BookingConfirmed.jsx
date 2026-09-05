import { useLocation, Link } from 'react-router-dom'

export default function BookingConfirmed() {
  const { state } = useLocation()

  if (!state) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p>No booking found. <Link to="/" className="text-orange-400 underline">Go home</Link></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-xl p-8 text-center">
        <div className="text-green-400 text-5xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-1">Booking Confirmed!</h1>
        <p className="text-zinc-500 text-sm mb-6">{state.bookingId}</p>

        <div className="text-left space-y-2 text-sm mb-8">
          <p className="flex justify-between"><span className="text-zinc-400">Gaming Center</span> <span>{state.shopName}</span></p>
          <p className="flex justify-between"><span className="text-zinc-400">Game</span> <span>{state.gameName}</span></p>
          <p className="flex justify-between"><span className="text-zinc-400">Date</span> <span>{state.date}</span></p>
          <p className="flex justify-between"><span className="text-zinc-400">Time</span> <span>{state.time}</span></p>
          <p className="flex justify-between"><span className="text-zinc-400">Amount</span> <span className="text-orange-400 font-semibold">₹{state.price}</span></p>
        </div>

        <Link to="/" className="block bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-medium">
          Back to Home
        </Link>
      </div>
    </div>
  )
}