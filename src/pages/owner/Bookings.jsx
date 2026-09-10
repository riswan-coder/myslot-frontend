import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getMyBookings, completeBooking, cancelBooking, cancelAndRefundBooking } from '../../api/owner'

const statusStyles = {
  upcoming: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [filter, setFilter] = useState('all')
  const [refundingId, setRefundingId] = useState(null)

  async function loadBookings() {
    setLoading(true)
    try {
      const data = await getMyBookings()
      setBookings(data)
    } catch {
      setError('Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBookings()
  }, [])

  async function handleComplete(id) {
    try {
      await completeBooking(id)
      loadBookings()
    } catch {
      setError('Could not update booking.')
    }
  }

  async function handleCancel(id) {
    try {
      await cancelBooking(id)
      loadBookings()
    } catch {
      setError('Could not cancel booking.')
    }
  }

  async function handleCancelAndRefund(id) {
    if (!window.confirm('Cancel this booking and refund the full amount to the customer via Razorpay?')) return
    setRefundingId(id)
    setError('')
    setSuccess('')
    try {
      const result = await cancelAndRefundBooking(id)
      if (result.refund) {
        setSuccess(`Cancelled and refunded ₹${result.refund.amount} (refund status: ${result.refund.status}).`)
      } else {
        setSuccess('Booking cancelled.')
      }
      loadBookings()
    } catch (err) {
      setError(err.response?.data?.error || 'Could not cancel and refund.')
    } finally {
      setRefundingId(null)
    }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/owner/dashboard" className="text-zinc-400 hover:text-white text-sm">← Back to Dashboard</Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <h1 className="text-2xl font-bold">Bookings</h1>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}

        <div className="flex gap-2">
          {['all', 'upcoming', 'completed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-sm capitalize ${
                filter === f ? 'bg-red-600 text-white' : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading && <p className="text-zinc-500">Loading...</p>}
        {!loading && filtered.length === 0 && <p className="text-zinc-500 text-sm">No bookings found.</p>}

        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium">{b.booking_id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                    {b.is_paid && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">
                        Paid Online
                      </span>
                    )}
                  </div>
                  <p className="text-zinc-400 text-sm">
                    {b.guest_name || 'Registered user'} · {b.guest_phone || '—'}
                  </p>
                  <p className="text-zinc-500 text-xs mt-1">₹{b.amount}</p>
                </div>

                {b.status === 'upcoming' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleComplete(b.id)}
                      className="text-xs border border-zinc-700 hover:bg-zinc-900 px-3 py-1.5 rounded-lg"
                    >
                      Mark Completed
                    </button>
                    {b.is_paid ? (
                      <button
                        onClick={() => handleCancelAndRefund(b.id)}
                        disabled={refundingId === b.id}
                        className="text-xs border border-red-900 text-red-400 hover:bg-red-950 disabled:opacity-50 px-3 py-1.5 rounded-lg"
                      >
                        {refundingId === b.id ? 'Refunding...' : 'Cancel & Refund'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancel(b.id)}
                        className="text-xs border border-red-900 text-red-400 hover:bg-red-950 px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
