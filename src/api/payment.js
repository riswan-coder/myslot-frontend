import api from './client'

export async function createPaymentOrder(slotId, lockToken) {
  const res = await api.post(
    '/bookings/payment/create-order/',
    {
      slot: slotId,
      lock_token: lockToken,
    }
  )

  return res.data
}

export async function verifyPayment(paymentData) {
  const res = await api.post(
    '/bookings/payment/verify/',
    paymentData
  )

  return res.data
}