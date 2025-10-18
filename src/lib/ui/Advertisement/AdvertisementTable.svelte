<script lang="ts">
  import DataTable from '$lib/components/Table/DataTable.svelte'
  import type { TableColumn, SortDirection } from '$lib/components/Table/types'

  // Types
  type Advertisement = {
    id: number
    title: string
    description: string
    category: string
    industry: string
    dealType: string
    price: number
    tags: string[]
    validUntil: string
    status: string
    createdAt: string
    views: number
    clicks: number
  }

  // Props
  let {
    advertisements = [],
    loading = false,
    onEdit = (id: number) => {},
    onView = (id: number) => {},
    onDelete = (id: number) => {},
    showFilters = true,
  }: {
    advertisements: Advertisement[]
    loading?: boolean
    onEdit: (id: number) => void
    onView?: (id: number) => void
    onDelete?: (id: number) => void
    showFilters?: boolean
  } = $props()

  // State
  let currentPage = $state(1)
  let pageSize = $state(5)
  let sortBy = $state('')
  let sortDirection = $state<SortDirection>(null)

  // Filter state
  let searchTerm = $state('')
  let statusFilter = $state('')
  let categoryFilter = $state('')
  let industryFilter = $state('')

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value: string) =>
        `<span class="font-medium text-text dark:text-text-dark">${value}</span>`,
    },
    {
      key: 'description',
      label: 'Description',
      sortable: true,
      class: 'max-w-xs',
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm truncate block">${value}</span>`,
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'industry',
      label: 'Industry',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'dealType',
      label: 'Deal Type',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (value: number) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm font-medium">$${value.toFixed(2)}</span>`,
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const statusClass =
          value === 'Published'
            ? 'bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark'
            : 'bg-background-toned-3 text-text-light dark:bg-background-toned-3-dark dark:text-text-light-dark'
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${value}</span>`
      },
    },
    {
      key: 'views',
      label: 'Views',
      sortable: true,
      render: (value: number) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value.toLocaleString()}</span>`,
    },
    {
      key: 'clicks',
      label: 'Clicks',
      sortable: true,
      render: (value: number) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value.toLocaleString()}</span>`,
    },
    {
      key: 'createdAt',
      label: 'Created',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
  ]

  // Table actions
  const actions = [
    {
      label: 'View',
      onClick: (row: Advertisement) => onView?.(row.id),
      class:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
      condition: () => !!onView,
    },
    {
      label: 'Edit',
      onClick: (row: Advertisement) => onEdit(row.id),
      class:
        'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark',
    },
    {
      label: 'Delete',
      onClick: (row: Advertisement) => onDelete?.(row.id),
      class:
        'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
      condition: () => !!onDelete,
    },
  ]

  // Sorted, filtered and paginated data
  let processedData: Advertisement[] = $state([])
  let totalFilteredItems = $state(0)

  // Get unique filter options
  const statusOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.status)),
  ])
  const categoryOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.category)),
  ])
  const industryOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.industry)),
  ])

  // Reactively update processed data when dependencies change
  $effect(() => {
    let result = [...advertisements]

    // Apply filters
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter(
        (ad) =>
          ad.title.toLowerCase().includes(search) ||
          ad.description.toLowerCase().includes(search) ||
          ad.tags.some((tag) => tag.toLowerCase().includes(search)),
      )
    }

    if (statusFilter) {
      result = result.filter((ad) => ad.status === statusFilter)
    }

    if (categoryFilter) {
      result = result.filter((ad) => ad.category === categoryFilter)
    }

    if (industryFilter) {
      result = result.filter((ad) => ad.industry === industryFilter)
    }

    totalFilteredItems = result.length

    // Apply sorting
    if (sortBy && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof Advertisement]
        const bVal = b[sortBy as keyof Advertisement]

        let comparison = 0
        if (aVal < bVal) comparison = -1
        if (aVal > bVal) comparison = 1

        return sortDirection === 'desc' ? -comparison : comparison
      })
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    processedData = result.slice(startIndex, endIndex)
  })

  // Event handlers
  const handleSort = (key: string, direction: SortDirection) => {
    sortBy = key
    sortDirection = direction
  }

  const handlePageChange = (page: number) => {
    currentPage = page
  }

  const handlePageSizeChange = (size: number) => {
    pageSize = size
    currentPage = 1 // Reset to first page when changing page size
  }

  const clearFilters = () => {
    searchTerm = ''
    statusFilter = ''
    categoryFilter = ''
    industryFilter = ''
    currentPage = 1
  }

  // Reset to first page when filters change
  $effect(() => {
    if (searchTerm || statusFilter || categoryFilter || industryFilter) {
      currentPage = 1
    }
  })
</script>

<!-- Filter Section -->
{#if showFilters}
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6"
  >
    <div class="flex items-center justify-between mb-4">
      <h3
        class="text-lg font-semibold text-text-primary dark:text-text-primary-dark"
      >
        Filters
      </h3>
      <button
        type="button"
        onclick={clearFilters}
        class="text-sm text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
      >
        Clear All
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Search -->
      <div>
        <label
          for="search"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Search
        </label>
        <input
          id="search"
          type="text"
          bind:value={searchTerm}
          placeholder="Search title, description, tags..."
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        />
      </div>

      <!-- Status Filter -->
      <div>
        <label
          for="status"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Status
        </label>
        <select
          id="status"
          bind:value={statusFilter}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        >
          <option value="">All Statuses</option>
          {#each statusOptions as status}
            <option value={status}>{status}</option>
          {/each}
        </select>
      </div>

      <!-- Category Filter -->
      <div>
        <label
          for="category"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Category
        </label>
        <select
          id="category"
          bind:value={categoryFilter}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        >
          <option value="">All Categories</option>
          {#each categoryOptions as category}
            <option value={category}>{category}</option>
          {/each}
        </select>
      </div>

      <!-- Industry Filter -->
      <div>
        <label
          for="industry"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Industry
        </label>
        <select
          id="industry"
          bind:value={industryFilter}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        >
          <option value="">All Industries</option>
          {#each industryOptions as industry}
            <option value={industry}>{industry}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>
{/if}

<DataTable
  data={processedData}
  {columns}
  {actions}
  {currentPage}
  {pageSize}
  totalItems={totalFilteredItems}
  {loading}
  {sortBy}
  {sortDirection}
  onSort={handleSort}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  emptyMessage="No advertisements found"
/>
