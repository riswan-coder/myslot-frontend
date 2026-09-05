import api from './client'

export async function getShops() {
  const res = await api.get('/shops/gaming-centers/')
  return res.data
}

export async function getShop(id) {
  const res = await api.get(`/shops/gaming-centers/${id}/`)
  return res.data
}

export async function getGamesForShop(shopId) {
  const res = await api.get('/games/games/')
  return res.data.filter((g) => g.shop === Number(shopId))
}

export async function getSlotsForMachine(machineId, date) {
  const res = await api.get('/bookings/slots/')
  return res.data.filter((s) => s.machine === machineId && s.date === date)
}