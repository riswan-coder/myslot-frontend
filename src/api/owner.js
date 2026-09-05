import api from './client'

// ===============================
// BOOKINGS
// ===============================

export async function getMyBookings() {
  const response = await api.get('/bookings/bookings/')
  return response.data
}

export async function completeBooking(bookingId) {
  const response = await api.post(
    `/bookings/bookings/${bookingId}/complete/`
  )
  return response.data
}

export async function cancelBooking(bookingId) {
  const response = await api.post(
    `/bookings/bookings/${bookingId}/cancel/`
  )
  return response.data
}


// ===============================
// SHOPS
// ===============================

export async function createShop(shopData) {
  const formData = new FormData()

  Object.entries(shopData).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      formData.append(key, value)
    }
  })

  const response = await api.post(
    '/shops/gaming-centers/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return response.data
}


// ===============================
// GAMES
// ===============================

export async function getMyGames(shopId) {
  const response = await api.get('/games/games/')

  return response.data.filter(
    (game) => Number(game.shop) === Number(shopId)
  )
}

export async function createGame(shopId, gameData) {
  const response = await api.post('/games/games/', {
    ...gameData,
    shop: Number(shopId),
  })

  return response.data
}


// ===============================
// MACHINES
// ===============================

export async function createMachine(gameId, machineData) {
  const response = await api.post('/games/machines/', {
    ...machineData,
    game: Number(gameId),
  })

  return response.data
}

export async function deleteMachine(machineId) {
  await api.delete(`/games/machines/${machineId}/`)
}


// ===============================
// SLOTS
// ===============================

export async function getMySlots(shopId) {
  const response = await api.get('/bookings/slots/')
  return response.data
}

export async function createSlot(machineId, slotData) {
  const response = await api.post('/bookings/slots/', {
    ...slotData,
    machine: Number(machineId),
  })

  return response.data
}

export async function bulkCreateSlots(data) {
  const response = await api.post(
    '/bookings/slots/',
    data
  )

  return response.data
}

export async function deleteSlot(slotId) {
  await api.delete(`/bookings/slots/${slotId}/`)
}
