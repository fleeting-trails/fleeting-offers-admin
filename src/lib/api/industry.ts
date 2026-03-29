import { apiRequest, getApiErrorMessage, type ApiError } from './api'
import { getAuthToken } from './auth'
import type { Industry, IndustryListResponse } from '$lib/types/industry'

// Industry API endpoints
const INDUSTRY_ENDPOINTS = {
  LIST: '/admin/advertise/industry/list',
  CREATE: '/admin/advertise/industry',
  UPDATE: (id: string) => `/admin/advertise/industry/${id}`,
  DELETE: (id: string) => `/admin/advertise/industry/delete/${id}`,
  GET: (id: string) => `/admin/advertise/industry/${id}`,
}

// Get authenticated headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// List industries with pagination
export async function fetchIndustries(
  page: number = 1,
  pageSize: number = 10,
): Promise<IndustryListResponse> {
  try {
    const response = await apiRequest(
      `${INDUSTRY_ENDPOINTS.LIST}?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )
    return response
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Get single industry by ID
export async function fetchIndustryById(id: string): Promise<Industry> {
  try {
    const response = await apiRequest(INDUSTRY_ENDPOINTS.GET(id), {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || 'Failed to fetch industry')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Create new industry
export async function createIndustry(data: {
  name: string
  imageId?: string
}): Promise<Industry> {
  try {
    const response = await apiRequest(INDUSTRY_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })
    return response.data
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Update existing industry
export async function updateIndustry(
  id: string,
  data: { name: string; imageId?: string },
): Promise<Industry> {
  try {
    const response = await apiRequest(INDUSTRY_ENDPOINTS.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })
    return response.data
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Delete industry
export async function deleteIndustry(id: string): Promise<void> {
  try {
    const response = await apiRequest(INDUSTRY_ENDPOINTS.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete industry')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}
