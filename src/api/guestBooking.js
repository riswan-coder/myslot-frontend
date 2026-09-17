import api from './client'

export async function lookupGuestBooking(bookingId, phone) {
  const res = await api.post('/bookings/guest/lookup/', { booking_id: bookingId, phone })
  return res.data
}

export async function cancelGuestBooking(bookingId, phone) {
  const res = await api.post('/bookings/guest/cancel/', { booking_id: bookingId, phone })
  return res.data
}
