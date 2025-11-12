import { apiRequest, getApiErrorMessage, type ApiError } from './api'
import { getAuthToken } from './auth'
import type {
  User,
  UserListResponse,
  UserUpdateData,
  UserCreateData,
} from '$lib/types/user'

// User API endpoints
const USER_ENDPOINTS = {
  LIST: '/admin/user/list',
  CREATE: '/admin/user/create',
  UPDATE: '/admin/user/update',
  DELETE: (id: string) => `/admin/user/delete/${id}`,
  GET: (id: string) => `/admin/user/${id}`,
}

// Get authenticated headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// List users with pagination
export async function fetchUsers(
  page: number = 1,
  pageSize: number = 10,
): Promise<UserListResponse> {
  try {
    const response = await apiRequest(
      `${USER_ENDPOINTS.LIST}?page=${page}&pageSize=${pageSize}`,
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

// Get single user by ID
export async function fetchUserById(id: string): Promise<User> {
  try {
    const response = await apiRequest(USER_ENDPOINTS.GET(id), {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || 'Failed to fetch user')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Create new user
export async function createUser(
  data: UserCreateData,
): Promise<{ success: boolean; message: string; data: string }> {
  try {
    const response = await apiRequest(USER_ENDPOINTS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
      body: JSON.stringify(data),
    })

    if (response.success) {
      return response
    } else {
      throw new Error(response.message || 'Failed to create user')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Update existing user
export async function updateUser(
  id: string,
  data: Omit<UserUpdateData, 'id'>,
): Promise<{ success: boolean; message: string; data: string }> {
  try {
    const payload = {
      id,
      ...data,
    }

    const response = await apiRequest(USER_ENDPOINTS.UPDATE, {
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
      throw new Error(response.message || 'Failed to update user')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Delete user
export async function deleteUser(id: string): Promise<void> {
  try {
    const response = await apiRequest(USER_ENDPOINTS.DELETE(id), {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete user')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}
