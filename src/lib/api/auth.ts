import { browser } from '$app/environment'

// API Response Types
interface ApiSuccessResponse {
  success: boolean
  message: string
  data: any
}

interface ApiErrorResponse {
  type?: string
  title: string
  status: number
  errors: Record<string, string[]>
  traceId?: string
  message?: string
}

export interface ApiError {
  status: number
  data: ApiErrorResponse
  isApiError: boolean
}

// Get base URL from environment or default
function getBaseUrl(): string {
  if (browser) {
    return 'http://localhost:5001/api'
  }
  // Server-side can use environment variable
  return process.env.BASE_URL || 'http://localhost:5001/api'
}

// Base API function with error handling
async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}${endpoint}`

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    })

    const data = await response.json()

    if (!response.ok) {
      throw {
        status: response.status,
        data,
        isApiError: true,
      } as ApiError
    }

    return data
  } catch (error: any) {
    if (error && typeof error === 'object' && error.isApiError) {
      throw error
    }

    // Network or other errors
    throw {
      status: 0,
      data: {
        title: 'Network Error',
        message: 'Unable to connect to server. Please check your connection.',
        status: 0,
        errors: {},
      },
      isApiError: true,
    } as ApiError
  }
}

// Authentication API Functions

/**
 * Send OTP to email for registration
 */
export async function sendRegistrationOtp(
  email: string,
): Promise<ApiSuccessResponse> {
  return await apiRequest('/admin/auth/get-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

/**
 * Complete user registration with OTP verification
 */
export async function completeRegistration(registrationData: {
  email: string
  otp: string
  firstName: string
  lastName: string
  password: string
}): Promise<ApiSuccessResponse> {
  return await apiRequest('/admin/auth/register', {
    method: 'POST',
    body: JSON.stringify(registrationData),
  })
}

/**
 * Login user
 */
export async function loginUser(
  email: string,
  password: string,
): Promise<ApiSuccessResponse> {
  return await apiRequest('/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

/**
 * Get error message from API error response
 */
export function getApiErrorMessage(error: ApiError): string {
  if (!error || !error.data) return 'An unexpected error occurred'

  const { errors, message, title } = error.data

  if (errors && typeof errors === 'object') {
    // Get first error message from validation errors
    const errorValues = Object.values(errors)
    if (errorValues.length > 0 && Array.isArray(errorValues[0])) {
      return errorValues[0][0]
    }
  }

  return message || title || 'An unexpected error occurred'
}
