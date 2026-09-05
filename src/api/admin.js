import api from './client'

export async function getAllShops() {
  const res = await api.get('/shops/gaming-centers/')
  return res.data
}

export async function approveShop(shopId) {
  const res = await api.post(`/shops/gaming-centers/${shopId}/approve/`)
  return res.data
}

export async function rejectShop(shopId) {
  const res = await api.post(`/shops/gaming-centers/${shopId}/reject/`)
  return res.data
}

export async function getUsers(role, search) {
  const params = new URLSearchParams()
  if (role) params.append('role', role)
  if (search) params.append('search', search)
  const res = await api.get(`/accounts/users/?${params.toString()}`)
  return res.data
}

export async function suspendUser(userId) {
  const res = await api.post(`/accounts/users/${userId}/suspend/`)
  return res.data
}

export async function activateUser(userId) {
  const res = await api.post(`/accounts/users/${userId}/activate/`)
  return res.data
}

export async function deleteShop(id) {
  await api.delete(`/shops/gaming-centers/${id}/`)
}

export async function deleteUser(userId) {
  await api.delete(`/accounts/users/${userId}/`)
}