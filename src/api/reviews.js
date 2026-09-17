import api from './client'

export async function submitReview(bookingId, phone, rating, comment) {
  const res = await api.post('/reviews/submit/', {
    booking_id: bookingId,
    phone,
    rating,
    comment,
  })
  return res.data
}

export async function getReviewsForShop(shopId) {
  const res = await api.get(`/reviews/reviews/?shop=${shopId}`)
  return res.data
}
