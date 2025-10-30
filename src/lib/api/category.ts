import { apiRequest, getApiErrorMessage, type ApiError } from './api'
import { getAuthToken } from './auth'
import type { Category, CategoryListResponse } from '$lib/types/category'

// Category API endpoints
const CATEGORY_ENDPOINTS = {
  LIST: '/admin/advertise/category/list',
  CREATE: '/admin/advertise/category/create',
  UPDATE: (id: string) => `/admin/advertise/category/update/${id}`,
  DELETE: (id: string) => `/admin/advertise/category/delete/${id}`,
  GET: (id: string) => `/admin/advertise/category/${id}`,
}

// Get authenticated headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// List categories with pagination
export async function fetchCategories(
  page: number = 1,
  pageSize: number = 10,
): Promise<CategoryListResponse> {
  try {
    const response = await apiRequest(
      `${CATEGORY_ENDPOINTS.LIST}?page=${page}&pageSize=${pageSize}`,
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

// Get single category by ID
export async function fetchCategoryById(id: string): Promise<Category> {
  try {
    const response = await apiRequest(CATEGORY_ENDPOINTS.GET(id), {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || 'Failed to fetch category')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Create new category
export async function createCategory(data: {
  name: string
  imageId?: string
}): Promise<{ success: boolean; message: string; data: string }> {
  try {
    const payload = {
      Name: data.name,
      ...(data.imageId && { ImageId: data.imageId }),
    }

    const response = await apiRequest(CATEGORY_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    if (response.success) {
      return response
    } else {
      throw new Error(response.message || 'Failed to create category')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Update existing category
export async function updateCategory(
  id: string,
  data: { name: string; imageId?: string },
): Promise<{ success: boolean; message: string; data: string }> {
  try {
    const payload = {
      Name: data.name,
      ...(data.imageId && { ImageId: data.imageId }),
    }

    const response = await apiRequest(CATEGORY_ENDPOINTS.UPDATE(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(payload),
    })

    if (response.success) {
      return response
    } else {
      throw new Error(response.message || 'Failed to update category')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Delete category
export async function deleteCategory(id: string): Promise<void> {
  try {
    const response = await apiRequest(CATEGORY_ENDPOINTS.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete category')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}
