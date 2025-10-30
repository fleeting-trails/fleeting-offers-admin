<script lang="ts">
  import DataTable from '$lib/components/Table/DataTable.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import type { TableColumn, SortDirection } from '$lib/components/Table/types'
  import type { IndustryDisplay } from '$lib/types/industry'

  // Props
  let {
    industries = [],
    loading = false,
    totalItems = 0,
    currentPage = 1,
    pageSize = 10,
    onEdit = (id: string) => {},
    onView = (id: string) => {},
    onDelete = (id: string) => {},
    onPageChange = (page: number) => {},
    showFilters = true,
  }: {
    industries: IndustryDisplay[]
    loading?: boolean
    totalItems?: number
    currentPage?: number
    pageSize?: number
    onEdit: (id: string) => void
    onView?: (id: string) => void
    onDelete?: (id: string) => void
    onPageChange?: (page: number) => void
    showFilters?: boolean
  } = $props()

  // State
  let searchTerm = $state('')
  let sortBy = $state('')
  let sortDirection = $state<SortDirection>(null)

  // Use server-side pagination data
  const displayedIndustries = $derived(() => {
    if (!searchTerm) return industries

    return industries.filter(
      (industry) =>
        industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.slug.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  })

  // Table columns
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: false,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm font-mono">${value.substring(0, 8)}...</span>`,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: IndustryDisplay) =>
        `<div>
          <p class="font-medium text-text dark:text-text-dark">${value}</p>
          <p class="text-text-light dark:text-text-light-dark text-xs">${row.slug}</p>
        </div>`,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value)
        return `<span class="text-text-light dark:text-text-light-dark text-sm">${date.toLocaleDateString()}</span>`
      },
    },
  ]

  // Table actions
  const actions = [
    {
      label: 'View',
      onClick: (row: IndustryDisplay) => onView?.(row.id),
      class:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
      condition: () => !!onView,
    },
    {
      label: 'Edit',
      onClick: (row: IndustryDisplay) => onEdit(row.id),
      class:
        'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark',
    },
    {
      label: 'Delete',
      onClick: (row: IndustryDisplay) => onDelete?.(row.id),
      class:
        'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
      condition: () => !!onDelete,
    },
  ]

  // Filtered data (for search only, pagination is server-side)
  const filteredIndustries = $derived(() => {
    if (!searchTerm.trim()) return industries

    const search = searchTerm.toLowerCase()
    return industries.filter(
      (industry) =>
        industry.name.toLowerCase().includes(search) ||
        industry.slug.toLowerCase().includes(search),
    )
  })

  // Handlers
  const handleSort = (column: string, direction: SortDirection) => {
    sortBy = column
    sortDirection = direction
  }

  const handlePageChange = (page: number) => {
    onPageChange(page)
  }

  const clearFilters = () => {
    searchTerm = ''
  }
</script>

<div class="w-full space-y-6">
  {#if showFilters}
    <!-- Filters -->
    <div
      class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700"
    >
      <div
        class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between"
      >
        <div class="flex-1 max-w-md">
          <label
            for="search"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Search Industries
          </label>
          <input
            id="search"
            type="text"
            bind:value={searchTerm}
            placeholder="Search by name or slug..."
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
          />
        </div>

        <div class="flex gap-2">
          <ButtonPrimary size="sm" onclick={clearFilters}>
            Clear Filters
          </ButtonPrimary>
        </div>
      </div>
    </div>
  {/if}

  <!-- Table -->
  <DataTable
    data={filteredIndustries()}
    {columns}
    {actions}
    {loading}
    {currentPage}
    {pageSize}
    {totalItems}
    onSort={handleSort}
    onPageChange={handlePageChange}
  />
</div>
