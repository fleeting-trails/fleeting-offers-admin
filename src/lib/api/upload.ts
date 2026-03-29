import { apiRequest, getApiErrorMessage, type ApiError } from './api'
import { getAuthToken } from './auth'

// Upload API endpoints
const UPLOAD_ENDPOINTS = {
  FILES: '/admin/upload/files',
}

// Upload response types
export interface UploadedFile {
  id: string
  name: string
  originalName: string
  url: string
  storage: string
  mimeType: string
  createdAt: string
  updatedAt: string | null
}

export interface UploadResponse {
  success: boolean
  message: string
  data: UploadedFile[]
}

// Get authenticated headers
function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Upload files
export async function uploadFiles(files: File[]): Promise<UploadedFile[]> {
  try {
    const formData = new FormData()

    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await apiRequest(UPLOAD_ENDPOINTS.FILES, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: formData,
    })

    if (response.success) {
      return response.data
    } else {
      throw new Error(response.message || 'Upload failed')
    }
  } catch (error) {
    const apiError = error as ApiError
    throw new Error(getApiErrorMessage(apiError))
  }
}

// Upload single file
export async function uploadFile(file: File): Promise<UploadedFile> {
  const uploadedFiles = await uploadFiles([file])
  return uploadedFiles[0]
}
