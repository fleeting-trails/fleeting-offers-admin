import { apiRequest, type ApiSuccessResponse } from './api'
import { browser } from '$app/environment'
import { appStore } from '../../store/app.store/appStore.svelte'

// Device detection utility
function getDeviceInfo(): string {
  if (!browser) return 'ServerSide'

  const userAgent = navigator.userAgent
  const platform = navigator.platform

  return `${platform}_${userAgent}`.replace(/\s+/g, '_').trim()
}

// Token management utilities (only token in localStorage)
export function storeAuthToken(token: string): void {
  if (browser) {
    localStorage.setItem('auth_token', token)
  }
}

export function getAuthToken(): string | null {
  if (browser) {
    return localStorage.getItem('auth_token')
  }
  return null
}

export function removeAuthToken(): void {
  if (browser) {
    localStorage.removeItem('auth_token')
  }
}

// Store management utilities (user data and auth state in store)
export function setAuthState(user: any): void {
  appStore.auth = {
    isLoggedIn: true,
    user: user,
  }
}

export function clearAuthState(): void {
  appStore.auth = {
    isLoggedIn: false,
    user: null,
  }
}

export function getUserData(): any | null {
  return appStore.auth.user
}

export function isLoggedIn(): boolean {
  if (!browser) return false

  const token = getAuthToken()
  const storeLoggedIn = appStore.auth.isLoggedIn

  return !!(token && storeLoggedIn)
}

// Initialize auth state on app load
// This should be called when the app starts to restore session if token exists
export function initializeAuthState(): void {
  if (!browser) return

  const token = getAuthToken()

  // If there's a token but no user in store, the session is incomplete
  // We will fetch user data from an API endpoint later
  // For now, if there's a token but no user data, we consider the session invalid
  if (token && !appStore.auth.isLoggedIn) {
    // Option 1: Clear the orphaned token
    removeAuthToken()

    // Option 2: We will fetch user data from an API endpoint
    // fetchCurrentUser(token).then(user => setAuthState(user))
  }
}

// Authentication API Functions

// Send OTP to email for registration
export async function sendRegistrationOtp(
  email: string,
): Promise<ApiSuccessResponse> {
  return await apiRequest('/admin/auth/get-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

// Set password with OTP verification
export async function setPassword(data: {
  email: string
  otp: string
  password: string
  fullName: string
}): Promise<ApiSuccessResponse> {
  return await apiRequest('/dev/auth/set-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJBYnRhaGlUYWp3YXIiLCJpYXQiOjE3NDMwMzU5NzYsImV4cCI6MTc3NDU3MTk3NiwiYXVkIjoiRmxlZXRpbmdPZmZlcnNEZXZlbG9wZXJzIiwic3ViIjoi',
    },
    body: JSON.stringify({
      Email: data.email,
      Otp: data.otp,
      Password: data.password,
      // FullName: data.fullName,
    }),
  })
}

// Login user
export async function loginUser(
  email: string,
  password: string,
): Promise<ApiSuccessResponse> {
  const device = getDeviceInfo()

  return await apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      device,
    }),
  })
}

// Logout user
export async function logoutUser(token: string): Promise<ApiSuccessResponse> {
  return await apiRequest('/admin/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Complete logout - clears local state and calls API
export async function performLogout(): Promise<void> {
  try {
    const token = getAuthToken()
    if (token) {
      await logoutUser(token)
    }
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    // Always clear auth state regardless of API success
    removeAuthToken()
    clearAuthState()
  }
}
