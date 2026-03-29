import { browser } from '$app/environment'
import { env } from '$env/dynamic/public'

// API Response Types
export interface ApiSuccessResponse {
  success: boolean
  message: string
  data: any
}

export interface ApiErrorResponse {
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
export function getBaseUrl(): string {
  const envUrl = env.PUBLIC_BASE_URL || 'http://localhost:5001/api'
  return envUrl
}
// Base API function with error handling
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
): Promise<any> {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}${endpoint}`

    // Don't set Content-Type for FormData (browser will set it automatically)
    const headers: Record<string, string> = {}
    if (!(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json'
    }

    const response = await fetch(url, {
      headers: {
        ...headers,
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

// Get error message from API error response
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
