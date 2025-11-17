// Module constants for permissions
export const AppModule = {
  AUTH: 'AUTH',
  USER: 'USER',
  ADVERTISE: 'ADVERTISE',
  ADVERTISE_CATEGORY: 'ADVERTISE_CATEGORY',
  ADVERTISE_INDUSTRY: 'ADVERTISE_INDUSTRY',
  CAMPAIGN: 'CAMPAIGN',
  SUBSCRIBER: 'SUBSCRIBER',
  UPLOAD: 'UPLOAD',
  LOCATION: 'LOCATION',
} as const

export type ModuleType = (typeof AppModule)[keyof typeof AppModule]
