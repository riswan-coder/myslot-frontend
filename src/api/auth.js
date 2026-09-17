import axios from 'axios'

const AUTH_BASE = import.meta.env.VITE_API_URL

export async function login(username, password) {
  const res = await axios.post(`${AUTH_BASE}/token/`, { username, password })
  localStorage.setItem('access_token', res.data.access)
  localStorage.setItem('refresh_token', res.data.refresh)
  return res.data
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}

export function getAccessToken() {
  return localStorage.getItem('access_token')
}

export function getRefreshToken() {
  return localStorage.getItem('refresh_token')
}

export function isLoggedIn() {
  return !!getAccessToken()
}

export async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token available')

  const res = await axios.post(`${AUTH_BASE}/token/refresh/`, { refresh })
  localStorage.setItem('access_token', res.data.access)
  return res.data.access
}
