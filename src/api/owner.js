import api from './client'

function buildFormData(data) {
  const formData = new FormData()
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })
  return formData
}

export async function createShop(shopData) {
  const formData = buildFormData(shopData)
  const res = await api.post('/shops/gaming-centers/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function getMyGames(shopId) {
  const res = await api.get('/games/games/')
  return res.data.filter((g) => g.shop === Number(shopId))
}

export async function createGame(shopId, gameData) {
  const formData = buildFormData({ ...gameData, shop: shopId })
  const res = await api.post('/games/games/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function createMachine(gameId, machineData) {
  const res = await api.post('/games/machines/', { ...machineData, game: gameId })
  return res.data
}

export async function deleteMachine(machineId) {
  await api.delete(`/games/machines/${machineId}/`)
}

export async function getMySlots() {
  const res = await api.get('/bookings/slots/')
  return res.data
}

export async function createSlot(machineId, slotData) {
  const res = await api.post('/bookings/slots/', { ...slotData, machine: machineId })
  return res.data
}

export async function bulkCreateSlots(payload) {
  const res = await api.post('/bookings/slots/bulk_create/', payload)
  return res.data
}

export async function deleteSlot(slotId) {
  await api.delete(`/bookings/slots/${slotId}/`)
}

export async function ownerBookSlot(slotId, customerName) {
  const res = await api.post('/bookings/bookings/owner_book/', {
    slot: slotId,
    customer_name: customerName,
  })
  return res.data
}

export async function getMyBookings() {
  const res = await api.get('/bookings/bookings/')
  return res.data
}

export async function completeBooking(bookingId) {
  const res = await api.post(`/bookings/bookings/${bookingId}/complete/`)
  return res.data
}

export async function cancelBooking(bookingId) {
  const res = await api.post(`/bookings/bookings/${bookingId}/cancel/`)
  return res.data
}

export async function getBookingStats(startDate, endDate) {
  const params = new URLSearchParams()
  if (startDate) params.append('start_date', startDate)
  if (endDate) params.append('end_date', endDate)
  const res = await api.get(`/bookings/bookings/stats/?${params.toString()}`)
  return res.data
}
