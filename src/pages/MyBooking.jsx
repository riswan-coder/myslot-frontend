import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lookupGuestBooking, cancelGuestBooking } from '../api/guestBooking'
import { submitReview } from '../api/reviews'

const statusStyles = {
  upcoming: 'bg-yellow-500/20 text-yellow-400',
  completed: 'bg-green-500/20 text-green-400',
  cancelled: 'bg-red-500/20 text-red-400',
}

export default function MyBooking() {
  const [bookingId, setBookingId] = useState('')
  const [phone, setPhone] = useState('')
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  async function handleLookup(e) {
    e.preventDefault()
    setError('')
    setBooking(null)
    setReviewSubmitted(false)
    setLoading(true)
    try {
      const data = await lookupGuestBooking(bookingId.trim(), phone.trim())
      setBooking(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not find booking.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    setCancelling(true)
    setError('')
    try {
      await cancelGuestBooking(bookingId.trim(), phone.trim())
      setBooking((prev) => ({ ...prev, status: 'cancelled' }))
    } catch (err) {
      setError(err.response?.data?.error || 'Could not cancel booking.')
    } finally {
      setCancelling(false)
    }
  }

  async function handleSubmitReview(e) {
    e.preventDefault()
    setSubmittingReview(true)
    setError('')
    try {
      await submitReview(bookingId.trim(), phone.trim(), rating, comment)
      setReviewSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not submit review.')
    } finally {
      setSubmittingReview(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-zinc-900 px-6 py-4">
        <Link to="/" className="text-zinc-400 hover:text-white text-sm">← Back to MySlot</Link>
      </header>

      <div className="max-w-md mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">Find Your Booking</h1>
        <p className="text-zinc-500 text-sm mb-6">
          Enter your Booking ID and the phone number you used to book.
        </p>

        <form onSubmit={handleLookup} className="space-y-3">
          <input
            type="text"
            placeholder="Booking ID (e.g. MS-20260822-12345)"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-red-500"
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-3 rounded-lg font-medium"
          >
            {loading ? 'Searching...' : 'Find Booking'}
          </button>
        </form>

        {booking && (
          <div className="mt-8 bg-zinc-950 border border-zinc-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">{booking.booking_id}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusStyles[booking.status]}`}>
                {booking.status}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-1">Amount</p>
            <p className="mb-4">₹{booking.amount}</p>

            {booking.status === 'upcoming' && (
              <>
                <p className="text-zinc-500 text-xs mb-3 leading-relaxed">
                  Cancellations must be made at least 2 hours before your slot time. If it's closer than that, please call the shop directly instead.
                </p>
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="w-full border border-red-900 text-red-400 hover:bg-red-950 disabled:opacity-50 py-2.5 rounded-lg text-sm"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel This Booking'}
                </button>
              </>
            )}

            {booking.status === 'completed' && !reviewSubmitted && (
              <form onSubmit={handleSubmitReview} className="border-t border-zinc-800 pt-4 mt-4 space-y-3">
                <p className="text-sm font-medium">Leave a Review</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`text-2xl ${n <= rating ? 'text-yellow-400' : 'text-zinc-700'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="How was your experience? (optional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-red-500"
                />
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 py-2.5 rounded-lg text-sm font-medium"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}

            {reviewSubmitted && (
              <p className="border-t border-zinc-800 pt-4 mt-4 text-green-400 text-sm text-center">
                Thanks for your review!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
