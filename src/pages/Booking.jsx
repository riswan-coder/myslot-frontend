import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import api from '../api/client'
import { getShop, getGamesForShop } from '../api/shops'
import { getMyBookings } from '../api/owner'

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
  const location = useLocation()

  const [shop, setShop] = useState(null)
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)

  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedMachine, setSelectedMachine] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState(null)

  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const days = getNextDays(5)

  // Load shop and games
  useEffect(() => {
    async function load() {
      try {
        const shopData = await getShop(id)
        const gamesData = await getGamesForShop(id)

        setShop(shopData)
        setGames(gamesData)

        // Get game ID from URL
        const params = new URLSearchParams(location.search)
        const gameId = params.get('game')

        if (gameId) {
          const game = gamesData.find(
            (g) => String(g.id) === String(gameId)
          )

          if (game) {
            setSelectedGame(game)
          }
        }
      } catch (err) {
        console.error(err)
        setError('Could not load booking details.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, location.search])

  // When game changes, reset machine/date/slot
  useEffect(() => {
    setSelectedMachine(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setAvailableSlots([])
  }, [selectedGame])

  // Load slots for selected machine + selected date
  useEffect(() => {
    async function loadSlots() {
      if (!selectedMachine || !selectedDate) {
        setAvailableSlots([])
        return
      }

      try {
        const res = await api.get('/bookings/slots/')

        const dateStr = formatDateForApi(selectedDate)

        const filtered = res.data.filter(
          (slot) =>
            String(slot.machine) === String(selectedMachine.id) &&
            slot.date === dateStr
        )

        setAvailableSlots(filtered)
      } catch (err) {
        console.error(err)
        setAvailableSlots([])
      }
    }

    loadSlots()
  }, [selectedMachine, selectedDate])

  const canConfirm =
    selectedGame &&
    selectedMachine &&
    selectedDate &&
    selectedSlot &&
    guestName.trim() &&
    guestPhone.trim()

  async function handleConfirm() {
    setError('')
    setSubmitting(true)

    try {
      const res = await api.post('/bookings/bookings/', {
        slot: selectedSlot.id,
        guest_name: guestName.trim(),
        guest_phone: guestPhone.trim(),
      })

      navigate('/booking-confirmed', {
        state: {
          bookingId: res.data.booking_id,
          shopName: shop.name,
          gameName: selectedGame.name,
          machineName:
            selectedMachine.name ||
            selectedMachine.machine_name ||
            `Machine ${selectedMachine.id}`,
          date: selectedDate.toDateString(),
          time: `${selectedSlot.start_time} – ${selectedSlot.end_time}`,
          price: selectedSlot.price,
        },
      })
    } catch (err) {
      console.error(err)

      setError(
        err.response?.data?.error ||
        'Something went wrong. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-400">
          Loading booking...
        </div>
      </div>
    )
  }

  if (error && !shop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-3">{error}</p>

          <Link
            to="/"
            className="text-red-400 underline"
          >
            Go home
          </Link>
        </div>
      </div>
    )
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Shop not found.</p>
      </div>
    )
  }

  if (!selectedGame) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-zinc-900 px-6 py-4">
          <Link
            to={`/shop/${shop.id}`}
            className="text-zinc-400 hover:text-white text-sm"
          >
            ← Back to {shop.name}
          </Link>
        </header>

        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <div className="text-4xl mb-4">🎮</div>

          <h1 className="text-xl font-semibold mb-2">
            Please select a game
          </h1>

          <p className="text-zinc-500 text-sm mb-6">
            Choose a game before booking.
          </p>

          <Link
            to={`/shop/${shop.id}`}
            className="inline-block bg-red-600 hover:bg-red-500 px-5 py-2.5 rounded-lg text-sm font-medium"
          >
            Choose Game
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-zinc-900 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">

          <Link
            to={`/shop/${shop.id}`}
            className="text-zinc-400 hover:text-white text-sm"
          >
            ← Back to {shop.name}
          </Link>

          <span className="text-sm font-semibold">
            MySlot <span className="text-red-500">🎮</span>
          </span>

        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        {/* TITLE */}
        <div>
          <p className="text-red-500 text-xs uppercase tracking-widest mb-2">
            Booking
          </p>

          <h1 className="text-2xl md:text-3xl font-bold">
            Book Your Gaming Slot
          </h1>

          <p className="text-zinc-500 text-sm mt-1">
            Select a machine, date and available time slot.
          </p>
        </div>

        {/* SELECTED GAME */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Selected Game
          </h2>

          <div className="bg-zinc-950 border border-red-500/40 rounded-xl overflow-hidden">

            <div className="flex items-center">

              <div className="w-28 h-24 bg-zinc-900 flex-shrink-0">

                {selectedGame.image ? (
                  <img
                    src={selectedGame.image}
                    alt={selectedGame.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    🎮
                  </div>
                )}

              </div>

              <div className="p-4 flex-1">

                <div className="flex items-center justify-between gap-3">

                  <div>
                    <h3 className="font-semibold">
                      {selectedGame.name}
                    </h3>

                    <p className="text-zinc-500 text-sm mt-1">
                      {selectedGame.machines?.length || 0}{' '}
                      {(selectedGame.machines?.length || 0) === 1
                        ? 'machine'
                        : 'machines'}
                    </p>
                  </div>

                  <span className="text-red-400 font-semibold whitespace-nowrap">
                    ₹{selectedGame.price_per_hour}/hr
                  </span>

                </div>

              </div>

            </div>

          </div>
        </div>

        {/* MACHINE SELECTION */}
        <div>

          <div className="flex items-center justify-between mb-3">

            <h2 className="text-lg font-semibold">
              1. Select Machine
            </h2>

            {selectedMachine && (
              <span className="text-red-400 text-sm">
                Selected
              </span>
            )}

          </div>

          {!selectedGame.machines ||
          selectedGame.machines.length === 0 ? (

            <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-8 text-center">

              <div className="text-3xl mb-3">
                🖥️
              </div>

              <p className="text-zinc-500 text-sm">
                No machines available for this game.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {selectedGame.machines.map((machine, index) => {

                const isSelected =
                  selectedMachine?.id === machine.id

                const machineName =
                  machine.name ||
                  machine.machine_name ||
                  machine.title ||
                  `Machine ${index + 1}`

                return (
                  <button
                    key={machine.id}
                    onClick={() => {
                      setSelectedMachine(machine)
                      setSelectedDate(null)
                      setSelectedSlot(null)
                      setAvailableSlots([])
                    }}
                    className={`text-left border rounded-xl p-4 transition ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-zinc-800 bg-zinc-950 hover:border-red-500/50'
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div>
                        <div className="text-lg mb-1">
                          🖥️
                        </div>

                        <p className="font-medium">
                          {machineName}
                        </p>

                        <p className="text-zinc-600 text-xs mt-1">
                          Machine ID: {machine.id}
                        </p>
                      </div>

                      {isSelected && (
                        <span className="text-red-500 text-lg">
                          ✓
                        </span>
                      )}

                    </div>

                  </button>
                )
              })}

            </div>

          )}

        </div>

        {/* DATE */}
        {selectedMachine && (
          <div>

            <div className="flex items-center justify-between mb-3">

              <h2 className="text-lg font-semibold">
                2. Select Date
              </h2>

              {selectedDate && (
                <span className="text-red-400 text-sm">
                  {selectedDate.toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              )}

            </div>

            <div className="flex gap-3 overflow-x-auto pb-2">

              {days.map((d) => {

                const isSelected =
                  selectedDate?.toDateString() ===
                  d.toDateString()

                return (
                  <button
                    key={d.toDateString()}
                    onClick={() => {
                      setSelectedDate(d)
                      setSelectedSlot(null)
                    }}
                    className={`flex-shrink-0 w-20 py-3 rounded-xl border text-center transition ${
                      isSelected
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-600'
                    }`}
                  >

                    <p className="text-xs text-zinc-500">
                      {d.toLocaleDateString('en-US', {
                        weekday: 'short',
                      })}
                    </p>

                    <p className="font-semibold text-lg mt-1">
                      {d.getDate()}
                    </p>

                    <p className="text-xs text-zinc-600">
                      {d.toLocaleDateString('en-US', {
                        month: 'short',
                      })}
                    </p>

                  </button>
                )
              })}

            </div>

          </div>
        )}

        {/* TIME SLOTS */}
        {selectedMachine && selectedDate && (
          <div>

            <h2 className="text-lg font-semibold mb-3">
              3. Select Time Slot
            </h2>

            {availableSlots.length === 0 ? (

              <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-8 text-center">

                <div className="text-3xl mb-3">
                  🕐
                </div>

                <p className="text-zinc-500 text-sm">
                  No slots found for this machine on this date.
                </p>

                <p className="text-zinc-600 text-xs mt-1">
                  Try another date or machine.
                </p>

              </div>

            ) : (

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">

                {availableSlots.map((slot) => {

                  const isSelected =
                    selectedSlot?.id === slot.id

                  return (
                    <button
                      key={slot.id}
                      disabled={slot.is_booked}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 rounded-xl text-sm border transition ${
                        slot.is_booked
                          ? 'border-zinc-900 bg-zinc-950 text-zinc-700 cursor-not-allowed line-through'
                          : isSelected
                          ? 'border-red-500 bg-red-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-red-500/50'
                      }`}
                    >

                      {slot.start_time.slice(0, 5)}

                      {slot.is_booked && (
                        <div className="text-[10px] mt-1">
                          Booked
                        </div>
                      )}

                    </button>
                  )
                })}

              </div>

            )}

          </div>
        )}

        {/* CUSTOMER DETAILS */}
        {selectedSlot && (
          <div>

            <h2 className="text-lg font-semibold mb-3">
              4. Your Details
            </h2>

            <div className="grid sm:grid-cols-2 gap-3">

              <input
                type="text"
                placeholder="Full Name"
                value={guestName}
                onChange={(e) =>
                  setGuestName(e.target.value)
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                value={guestPhone}
                onChange={(e) =>
                  setGuestPhone(e.target.value)
                }
                className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-red-500"
              />

            </div>

          </div>
        )}

        {/* BOOKING SUMMARY */}
        {canConfirm && (
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5">

            <h3 className="font-semibold text-lg mb-4">
              Booking Summary
            </h3>

            <div className="space-y-2 text-sm">

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Gaming Center
                </span>

                <span className="text-white">
                  {shop.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Game
                </span>

                <span className="text-white">
                  {selectedGame.name}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Machine
                </span>

                <span className="text-white">
                  {selectedMachine.name ||
                    selectedMachine.machine_name ||
                    `Machine ${selectedMachine.id}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Date
                </span>

                <span className="text-white">
                  {selectedDate.toDateString()}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-zinc-500">
                  Time
                </span>

                <span className="text-white">
                  {selectedSlot.start_time.slice(0, 5)}
                  {' – '}
                  {selectedSlot.end_time.slice(0, 5)}
                </span>
              </div>

              <div className="border-t border-zinc-800 pt-3 mt-3 flex justify-between">

                <span className="text-zinc-400">
                  Total
                </span>

                <span className="text-red-400 font-bold text-lg">
                  ₹{selectedSlot.price}
                </span>

              </div>

            </div>

            {error && (
              <p className="text-red-400 text-sm mt-4">
                {error}
              </p>
            )}

            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="w-full mt-5 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-medium transition"
            >
              {submitting
                ? 'Booking...'
                : 'Confirm Booking'}
            </button>

          </div>
        )}

      </div>
    </div>
  )
}
