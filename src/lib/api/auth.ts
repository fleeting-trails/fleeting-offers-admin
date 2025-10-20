import { apiRequest, type ApiSuccessResponse } from './api'
import { browser } from '$app/environment'

// Device detection utility
function getDeviceInfo(): string {
  if (!browser) return 'ServerSide'

  const userAgent = navigator.userAgent
  const platform = navigator.platform

  return `${platform}_${userAgent}`.replace(/\s+/g, '_').trim()
}

// Token management utilities
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
    localStorage.removeItem('user_data')
    localStorage.removeItem('is_loggedin')
  }
}

// User data management utilities
export function storeUserData(user: any): void {
  if (browser) {
    localStorage.setItem('user_data', JSON.stringify(user))
    localStorage.setItem('is_loggedin', 'true')
  }
}

export function getUserData(): any | null {
  if (browser) {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  }
  return null
}

// Authentication state utilities
export function isLoggedIn(): boolean {
  if (!browser) return false

  const token = getAuthToken()
  const loginStatus = localStorage.getItem('is_loggedin')

  return !!(token && loginStatus === 'true')
}

export function setLoggedOut(): void {
  if (browser) {
    localStorage.removeItem('is_loggedin')
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
    // Always clear local storage regardless of API success
    removeAuthToken()
  }
}
