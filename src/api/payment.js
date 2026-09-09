import api from './client'

export async function createPaymentOrder(slotId) {
  const res = await api.post('/bookings/payment/create-order/', { slot: slotId })
  return res.data
}

export async function verifyPayment(paymentData) {
  const res = await api.post('/bookings/payment/verify/', paymentData)
  return res.data
}
