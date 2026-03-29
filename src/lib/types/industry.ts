// Industry types
export interface Industry {
  id: string
  name: string
  slug: string
  imageId: string | null
  createdAt: string
}

export interface IndustryDisplay extends Industry {
  // Additional computed fields for display
  hasImage: boolean
  formattedDate: string
}

export interface IndustryFormData {
  name: string
  slug: string
  description: string
  parentIndustry: string
  sortOrder: string
  isActive: boolean
  icon: string
  color: string
}

export interface IndustryListResponse {
  success: boolean
  message: string
  data: {
    items: Industry[]
    totalItems: number
    page: number
    pageSize: number
    totalPages: number
  }
}
