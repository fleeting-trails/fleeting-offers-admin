// User types
export interface User {
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

export interface UserDisplay extends User {
  formattedDate: string
  formattedLastLogin: string
  statusText: string
}

export interface UserFormData {
  fullName: string
  username: string
  email: string
  role: string
  isPasswordSet: boolean
}

export interface UserListResponse {
  success: boolean
  message: string
  data: {
    items: User[]
    totalItems: number
    page: number
    pageSize: number
    totalPages: number
  }
}

export interface UserUpdateData {
  id: string
  fullName?: string
  username?: string
  email?: string
  role?: string
}

export interface UserCreateData {
  fullName: string
  email: string
  role: string
}

// Role options
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  ORGANIZATION: 'ORGANIZATION',
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

export interface RoleOption {
  label: string
  value: UserRole
}
