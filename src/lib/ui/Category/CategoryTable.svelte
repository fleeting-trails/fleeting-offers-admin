<script lang="ts">
  import DataTable from '$lib/components/Table/DataTable.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import type { TableColumn, SortDirection } from '$lib/components/Table/types'
  import type { CategoryDisplay } from '$lib/types/category'
  import type { ModuleType } from '$lib/types/roles'
  import { appStore } from '../../../store/app.store/appStore.svelte'

  // Props
  let {
    categories = [],
    loading = false,
    module,
    onEdit = (id: string) => {},
    onView = (id: string) => {},
    onDelete = (id: string) => {},
    showFilters = true,
  }: {
    categories: CategoryDisplay[]
    loading?: boolean
    module: ModuleType
    onEdit: (id: string) => void
    onView?: (id: string) => void
    onDelete?: (id: string) => void
    showFilters?: boolean
  } = $props()

  // Filter state
  let searchTerm = $state('')
  let currentPage = $state(1)
  let pageSize = $state(10)
  let sortBy = $state<string>('')
  let sortDirection = $state<SortDirection>('asc')

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value: string) =>
        `<span class="font-mono text-xs text-text-light dark:text-text-light-dark bg-background-toned dark:bg-background-toned-dark px-2 py-1 rounded">${value.substring(0, 8)}...</span>`,
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (value: string, row: CategoryDisplay) =>
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
      module: module,
      type: 'DETAILS',
      onClick: (row: CategoryDisplay) => onView?.(row.id),
      class:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
      condition: () => !!onView,
    },
    {
      label: 'Edit',
      module: module,
      type: 'UPDATE',
      onClick: (row: CategoryDisplay) => onEdit(row.id),
      class:
        'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark',
    },
    {
      label: 'Delete',
      module: module,
      type: 'DELETE',
      onClick: (row: CategoryDisplay) => onDelete?.(row.id),
      class:
        'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
      condition: () => !!onDelete,
    },
  ]

  // Permission-based action filtering
  const allowedActions = $derived(() => {
    const permissions = appStore.auth.permissions

    if (!permissions) return []

    return actions.filter((action) => {
      // Check if the action has its own condition first
      if (action.condition && !action.condition()) {
        return false
      }

      // Check if module exists in permissions
      if (!permissions[action.module]) {
        return false
      }

      // Check if the specific type exists under the module
      return permissions[action.module][action.type] === true
    })
  })

  // Filtered data
  const filteredCategories = $derived(() => {
    let filtered = categories

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(search) ||
          category.slug.toLowerCase().includes(search),
      )
    }

    // Sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortBy as keyof CategoryDisplay]
        const bVal = b[sortBy as keyof CategoryDisplay]

        if (
          aVal === undefined ||
          aVal === null ||
          bVal === undefined ||
          bVal === null
        )
          return 0

        const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
        return sortDirection === 'desc' ? -comparison : comparison
      })
    }

    return filtered
  })

  // Pagination
  const paginatedCategories = $derived(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredCategories().slice(startIndex, startIndex + pageSize)
  })

  const totalPages = $derived(() =>
    Math.ceil(filteredCategories().length / pageSize),
  )

  // Handlers
  const handleSort = (column: string, direction: SortDirection) => {
    sortBy = column
    sortDirection = direction
  }

  const handlePageChange = (page: number) => {
    currentPage = page
  }

  const clearFilters = () => {
    searchTerm = ''
    currentPage = 1
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
            Search Categories
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
    data={paginatedCategories()}
    {columns}
    actions={allowedActions()}
    {loading}
    {currentPage}
    {pageSize}
    totalItems={filteredCategories().length}
    onSort={handleSort}
    onPageChange={handlePageChange}
  />

  {#if !loading && categories.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-500 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      </div>
      <h3
        class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-1"
      >
        No categories found
      </h3>
      <p class="text-text-secondary dark:text-text-secondary-dark">
        Get started by creating your first category.
      </p>
    </div>
  {/if}
</div>
