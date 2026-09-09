import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/client'
import { getShop, getGamesForShop } from '../api/shops'
import { createPaymentOrder, verifyPayment } from '../api/payment'

function getNextDays(count = 5) {
  const days = []
  for (let i = 0; i < count; i++) {
    const d = new Date()
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

function formatDateForApi(date) {
  return date.toISOString().split('T')[0]
}

export default function Booking() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [shop, setShop] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const days = getNextDays(5)

  useEffect(() => {
    async function load() {
      try {
        const shopData = await getShop(id)
        const gamesData = await getGamesForShop(id)
        setShop(shopData)
        setGames(gamesData)
      } catch (err) {
        setError('Could not load shop details.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  useEffect(() => {
    async function loadSlots() {
      if (!selectedGame || !selectedDate) return
      try {
        const res = await api.get('/bookings/slots/')
        const dateStr = formatDateForApi(selectedDate)
        const machineIds = selectedGame.machines.map((m) => m.id)
        const filtered = res.data.filter(
          (s) => machineIds.includes(s.machine) && s.date === dateStr
        )
        setAvailableSlots(filtered)
      } catch {
        setAvailableSlots([])
      }
    }
    loadSlots()
  }, [selectedGame, selectedDate])

  const canConfirm = selectedGame && selectedDate && selectedSlot && guestName.trim() && guestPhone.trim()

  async function handleConfirm() {
    setError('')
    setSubmitting(true)
    try {
      const order = await createPaymentOrder(selectedSlot.id)

      const options = {
        key: order.razorpay_key,
        amount: order.amount,
        currency: order.currency,
        name: 'MySlot',
        description: `${selectedGame.name} at ${shop.name}`,
        order_id: order.order_id,
        prefill: {
          name: guestName,
          contact: guestPhone,
        },
        theme: {
          color: '#dc2626',
        },
        handler: async function (response) {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              slot: selectedSlot.id,
              guest_name: guestName,
              guest_phone: guestPhone,
            })

            navigate('/booking-confirmed', {
              state: {
                bookingId: result.booking_id,
                shopName: shop.name,
                gameName: selectedGame.name,
                date: selectedDate.toDateString(),
                time: `${selectedSlot.start_time} – ${selectedSlot.end_time}`,
                price: selectedSlot.price,
              },
            })
          } catch (err) {
            setError('Payment succeeded but booking failed. Contact support with your payment ID: ' + response.razorpay_payment_id)
          } finally {
            setSubmitting(false)
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false)
          },
        },
      }

      const razorpayCheckout = new window.Razorpay(options)
      razorpayCheckout.open()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not start payment. Please try again.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Shop not found. <Link to="/" className="text-red-400 underline">Go home</Link></p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to={`/shop/${shop.id}`} className="text-zinc-400 hover:text-white text-sm">← Back to {shop.name}</Link>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold">Book a Slot at {shop.name}</h1>

        <div>
          <h2 className="text-lg font-semibold mb-3">1. Select a Game</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {games.map((game) => (
              <button
                key={game.id}
                onClick={() => {
                  setSelectedGame(game)
                  setSelectedSlot(null)
                }}
                className={`text-left border rounded-lg p-4 transition ${
                  selectedGame?.id === game.id
                    ? 'border-red-500 bg-red-500/10'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                }`}
              >
                <p className="font-medium">{game.name}</p>
                <p className="text-zinc-500 text-sm">₹{game.price_per_hour}/hr · {game.machines.length} machines</p>
              </button>
            ))}
          </div>
        </div>

        {selectedGame && (
          <div>
            <h2 className="text-lg font-semibold mb-3">2. Select a Date</h2>
            <div className="flex gap-3 overflow-x-auto">
              {days.map((d) => (
                <button
                  key={d.toDateString()}
                  onClick={() => {
                    setSelectedDate(d)
                    setSelectedSlot(null)
                  }}
                  className={`flex-shrink-0 w-20 py-3 rounded-lg border text-center transition ${
                    selectedDate?.toDateString() === d.toDateString()
                      ? 'border-red-500 bg-red-500/10'
                      : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'
                  }`}
                >
                  <p className="text-xs text-zinc-500">{d.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                  <p className="font-semibold">{d.getDate()}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedGame && selectedDate && (
          <div>
            <h2 className="text-lg font-semibold mb-3">3. Select a Time Slot</h2>
            {availableSlots.length === 0 ? (
              <p className="text-zinc-500 text-sm">No slots found for this date. Try another date.</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    disabled={slot.is_booked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-lg text-sm border transition ${
                      slot.is_booked
                        ? 'border-zinc-800 bg-zinc-950 text-zinc-600 cursor-not-allowed line-through'
                        : selectedSlot?.id === slot.id
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-zinc-700 bg-zinc-950 hover:border-zinc-500'
                    }`}
                  >
                    {slot.start_time.slice(0, 5)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedSlot && (
          <div>
            <h2 className="text-lg font-semibold mb-3">4. Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Full Name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                className="bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>
        )}

        {canConfirm && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <h3 className="font-semibold mb-3">Booking Summary</h3>
            <div className="text-sm text-zinc-400 space-y-1 mb-4">
              <p>Name: <span className="text-white">{guestName}</span></p>
              <p>Phone: <span className="text-white">{guestPhone}</span></p>
              <p>Game: <span className="text-white">{selectedGame.name}</span></p>
              <p>Date: <span className="text-white">{selectedDate.toDateString()}</span></p>
              <p>Time: <span className="text-white">{selectedSlot.start_time.slice(0,5)} – {selectedSlot.end_time.slice(0,5)}</span></p>
              <p>Amount: <span className="text-red-400 font-semibold">₹{selectedSlot.price}</span></p>
            </div>
            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-3 rounded-lg font-medium"
            >
              {submitting ? 'Opening Payment...' : `Pay ₹${selectedSlot.price} & Confirm`}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
