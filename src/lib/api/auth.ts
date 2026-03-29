import { apiRequest, type ApiSuccessResponse } from './api'
import { browser } from '$app/environment'
import { appStore } from '../../store/app.store/appStore.svelte'

// Token validation response types
interface TokenValidationData {
  isValid: boolean
  token: string
  userId: string
  role: string
  device: string
  permissions?: Record<string, any>
  user: {
    id: string
    fullName: string
    username: string
    email: string
    role: string
    restrictedUserSubRoleId: string | null
    lastLoggedIn: string | null
    createdAt: string
    isPasswordSet: boolean
  }
}

interface TokenValidationResponse extends ApiSuccessResponse {
  data: TokenValidationData
}

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
export function setAuthState(
  user: any,
  token?: string | null,
  permissions?: Record<string, any> | null,
): void {
  appStore.auth = {
    isLoggedIn: true,
    user: user,
    token: token ?? appStore.auth.token ?? null,
    permissions: permissions ?? appStore.auth.permissions ?? null,
  }
}

export function clearAuthState(): void {
  appStore.auth = {
    isLoggedIn: false,
    user: null,
    token: null,
    permissions: null,
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

// Validate token and get user data
export async function validateToken(): Promise<TokenValidationResponse> {
  const token = getAuthToken()
  if (!token) {
    throw new Error('No token found')
  }

  return await apiRequest('/admin/auth/validate-token', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

// Initialize auth state on app load
export async function initializeAuthState(): Promise<void> {
  if (!browser) return

  const token = getAuthToken()

  // No token - clear auth state and return
  if (!token) {
    clearAuthState()
    return
  }

  // Token exists but user not in store - validate token
  if (!appStore.auth.isLoggedIn) {
    try {
      const response = await validateToken()

      if (response.success && response.data?.isValid && response.data?.user) {
        // Token is valid - token and set user + permissions
        if (response.data.token) {
          storeAuthToken(response.data.token)
        }
        setAuthState(
          response.data.user,
          response.data.token ?? null,
          response.data.permissions ?? null,
        )
      } else {
        // Token validation failed - clear auth
        removeAuthToken()
        clearAuthState()
      }
    } catch (error: any) {
      console.error('Token validation failed:', error)

      // Clear auth state for any validation error
      removeAuthToken()
      clearAuthState()

      // Re-throw error to let caller handle toast notifications
      throw error
    }
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
