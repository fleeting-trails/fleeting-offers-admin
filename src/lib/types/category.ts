// Category types
export interface Category {
  id: string
  name: string
  slug: string
  imageId: string | null
  createdAt: string
}

export interface CategoryDisplay extends Category {
  // Additional computed fields for display
  hasImage: boolean
  formattedDate: string
}

export interface CategoryFormData {
  name: string
  slug: string
  description: string
  parentCategory: string
  sortOrder: string
  isActive: boolean
  icon: string
  color: string
}

export interface CategoryListResponse {
  success: boolean
  message: string
  data: {
    items: Category[]
    totalItems: number
    page: number
    pageSize: number
    totalPages: number
  }
}
