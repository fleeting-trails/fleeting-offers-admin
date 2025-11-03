import { apiRequest, getApiErrorMessage, type ApiError } from './api'
import { getAuthToken } from './auth'
import { appStore } from '../../store/app.store/appStore.svelte'

// API Response Types
export interface AdvertisementApiItem {
  id: string
  title: string
  subtitle: string
  description: string | null
  startDate: string | null
  expirationDate: string | null
  coverImageId: string | null
  thumbnailImageId: string | null
  categoryId: string | null
  subCategoryId: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface AdvertisementListResponse {
  success: boolean
  message: string
  data: {
    items: AdvertisementApiItem[]
    totalItems: number
    page: number
    pageSize: number
    totalPages: number
  }
}

// Create Advertisement Types
export interface CreateAdvertisementData {
  title: string
  subtitle?: string
  description?: string
  startDate?: string
  expirationDate?: string
  coverImageId?: string
  thumbnailImageId?: string
  categoryId?: string
  subCategoryId?: string
}

export interface CreateAdvertisementByAdminData {
  advertise: CreateAdvertisementData
  owners: {
    userId: string
    ownershipType: 'OWNER'
  }[]
}

// Detailed Advertisement Types
export interface AdvertisementOwner {
  id: string
  advertiseId: string
  advertise: any | null
  userId: string
  user: any | null
  ownershipType: 'OWNER'
}

export interface AdvertisementDetailData {
  locations: any[]
  relatedAdvertises: any[]
  additionalImages: any[]
  tags: any[]
  owners: AdvertisementOwner[]
  analytics: any | null
  id: string
  title: string
  subtitle: string
  description: string | null
  startDate: string | null
  expirationDate: string | null
  coverImageId: string | null
  thumbnailImageId: string | null
  categoryId: string | null
  subCategoryId: string | null
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface AdvertisementDetailResponse {
  success: boolean
  message: string
  data: AdvertisementDetailData
}

// Advertisement API endpoints
const ADVERTISEMENT_ENDPOINTS = {
  LIST_ALL: '/admin/advertise/list',
  LIST_OWN: '/admin/advertise/list/own',
  CREATE: '/admin/advertise/create',
  CREATE_BY_ADMIN: '/admin/advertise/create-by-admin',
  UPDATE: '/admin/advertise/update',
  DELETE: (id: string) => `/admin/advertise/delete/${id}`,
  DELETE_BY_ADMIN: (id: string) => `/admin/advertise/delete-by-admin/${id}`,
  GET: (id: string) => `/admin/advertise/get/${id}`,
  GET_OWN: (id: string) => `/admin/advertise/get/own/${id}`,
}

// Get authenticated headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Get user role from store
function getUserRole(): string | null {
  const user = appStore.auth.user
  return user?.role || null
}

// Get appropriate endpoint based on user role
function getListEndpoint(): string {
  const role = getUserRole()

  if (role === 'ORGANIZATION') {
    return ADVERTISEMENT_ENDPOINTS.LIST_OWN
  }

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return ADVERTISEMENT_ENDPOINTS.LIST_ALL
  }

  // Default to own for other roles
  return ADVERTISEMENT_ENDPOINTS.LIST_OWN
}

// Get appropriate create endpoint based on user role
function getCreateEndpoint(): string {
  const role = getUserRole()

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return ADVERTISEMENT_ENDPOINTS.CREATE_BY_ADMIN
  }

  return ADVERTISEMENT_ENDPOINTS.CREATE
}

// Get appropriate delete endpoint based on user role
function getDeleteEndpoint(id: string): string {
  const role = getUserRole()

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return ADVERTISEMENT_ENDPOINTS.DELETE_BY_ADMIN(id)
  }

  return ADVERTISEMENT_ENDPOINTS.DELETE(id)
}

// Get appropriate detail endpoint based on user role
function getDetailEndpoint(id: string): string {
  const role = getUserRole()

  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    return ADVERTISEMENT_ENDPOINTS.GET(id)
  }

  return ADVERTISEMENT_ENDPOINTS.GET_OWN(id)
}

// List advertisements with role-based endpoint
export async function fetchAdvertisements(
  page: number = 1,
  pageSize: number = 10,
): Promise<AdvertisementListResponse> {
  try {
    const endpoint = getListEndpoint()
    const response = await apiRequest(
      `${endpoint}?page=${page}&pageSize=${pageSize}`,
      {
        method: 'GET',
        headers: getAuthHeaders(),
      },
    )

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch advertisements')
    }

    return response
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}

// Get single advertisement by ID
export async function fetchAdvertisementById(
  id: string,
): Promise<AdvertisementApiItem> {
  try {
    const response = await apiRequest(ADVERTISEMENT_ENDPOINTS.GET(id), {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch advertisement')
    }

    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}

// Get detailed advertisement by ID with role-based endpoint
export async function fetchAdvertisementDetails(
  id: string,
): Promise<AdvertisementDetailData> {
  try {
    const endpoint = getDetailEndpoint(id)
    const response = await apiRequest(endpoint, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(
        response.message || 'Failed to fetch advertisement details',
      )
    }

    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}

// Create new advertisement
export async function createAdvertisement(
  data: CreateAdvertisementData | CreateAdvertisementByAdminData,
): Promise<AdvertisementApiItem> {
  try {
    const endpoint = getCreateEndpoint()
    const response = await apiRequest(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to create advertisement')
    }

    return response.data
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}

// Update advertisement
export async function updateAdvertisement(
  id: string,
  data: CreateAdvertisementData | CreateAdvertisementByAdminData,
): Promise<{ success: boolean; message: string; data: string }> {
  try {
    const response = await apiRequest(ADVERTISEMENT_ENDPOINTS.UPDATE, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        id,
        ...data,
      }),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to update advertisement')
    }

    return response
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}

// Delete advertisement
export async function deleteAdvertisement(id: string): Promise<void> {
  try {
    const endpoint = getDeleteEndpoint(id)
    const response = await apiRequest(endpoint, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete advertisement')
    }
  } catch (error) {
    const message = getApiErrorMessage(error as ApiError)
    throw new Error(message)
  }
}
