export type SortDirection = 'asc' | 'desc' | null

export interface TableColumn {
  key: string
  label: string
  sortable?: boolean
  class?: string
  render?: (value: any, row: any) => string
}

export interface TableAction {
  label: string
  onClick: (row: any) => void
  class?: string
  condition?: (row: any) => boolean
}

export interface TableProps {
  data: any[]
  columns: TableColumn[]
  pageSize?: number
  currentPage?: number
  totalItems?: number
  loading?: boolean
  emptyMessage?: string
  sortBy?: string
  sortDirection?: SortDirection
  onSort?: (key: string, direction: SortDirection) => void
  onPageChange?: (page: number) => void
  onRowClick?: ((row: any) => void) | null
  actions?: TableAction[]
}

export interface TableEvents {
  sort: { key: string; direction: SortDirection }
  pageChange: { page: number }
  rowClick: { row: any }
}
