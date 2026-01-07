/**
 * Utility functions for client-side authentication management
 */

export const STORAGE_KEY = 'user'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
}

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem(STORAGE_KEY)
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch (e) {
    return null
  }
}

export function getCurrentUserId(): string | null {
  const user = getCurrentUser()
  return user ? user.id : null
}

export function saveUserSession(user: AuthUser) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  window.dispatchEvent(new Event('authStateChanged'))
}

export function clearUserSession() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('authStateChanged'))
}

export function isAuthenticated(): boolean {
  return getCurrentUserId() !== null
}
