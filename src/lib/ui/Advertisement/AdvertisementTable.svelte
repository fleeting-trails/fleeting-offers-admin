<script lang="ts">
  import DataTable from '$lib/components/Table/DataTable.svelte'
  import type { TableColumn, SortDirection } from '$lib/components/Table/types'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'

  // Props
  let {
    advertisements = [],
    loading = false,
    onEdit = (id: string) => {},
    onView = (id: string) => {},
    onDelete = (id: string) => {},
    showFilters = true,
  }: {
    advertisements: AdvertisementDisplay[]
    loading?: boolean
    onEdit: (id: string) => void
    onView?: (id: string) => void
    onDelete?: (id: string) => void
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
  let subCategoryFilter = $state('')
  let dealTypeFilter = $state('')

  // Table configuration
  const columns: TableColumn[] = [
    {
      key: 'id',
      label: 'ID',
      sortable: true,
      render: (value: string) =>
        `<span class="font-mono text-xs text-text-light dark:text-text-light-dark bg-background-toned dark:bg-background-toned-dark px-2 py-1 rounded">${value}</span>`,
    },
    {
      key: 'title',
      label: 'Title',
      sortable: true,
      render: (value: string, row: AdvertisementDisplay) =>
        `<div class="max-w-xs">
          <p class="font-medium text-text dark:text-text-dark">${value}</p>
          <p class="text-text-light dark:text-text-light-dark text-xs truncate">${row.subtitle}</p>
        </div>`,
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
      key: 'categoryName',
      label: 'Category',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'subCategoryName',
      label: 'Sub Category',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'dealTypeName',
      label: 'Deal Type',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'expirationDate',
      label: 'Expires',
      sortable: true,
      render: (value: string) => {
        if (!value)
          return '<span class="text-text-light dark:text-text-light-dark text-sm">No expiry</span>'
        const date = new Date(value)
        const now = new Date()
        const isExpired = date < now
        const colorClass = isExpired
          ? 'text-red-600 dark:text-red-400'
          : 'text-text-light dark:text-text-light-dark'
        return `<span class="${colorClass} text-sm">${date.toLocaleDateString()}</span>`
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => {
        const statusClasses = {
          published:
            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          draft:
            'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
          expired: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          paused:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        }
        const statusClass =
          statusClasses[value as keyof typeof statusClasses] ||
          statusClasses.draft
        return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}">${value.charAt(0).toUpperCase() + value.slice(1)}</span>`
      },
    },
    {
      key: 'tagCount',
      label: 'Tags',
      sortable: true,
      render: (value: number) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value} tags</span>`,
    },
    {
      key: 'locationCount',
      label: 'Locations',
      sortable: true,
      render: (value: number) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value} locations</span>`,
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
      onClick: (row: AdvertisementDisplay) => onView?.(row.id),
      class:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
      condition: () => !!onView,
    },
    {
      label: 'Edit',
      onClick: (row: AdvertisementDisplay) => onEdit(row.id),
      class:
        'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark',
    },
    {
      label: 'Delete',
      onClick: (row: AdvertisementDisplay) => onDelete?.(row.id),
      class:
        'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
      condition: () => !!onDelete,
    },
  ]

  // Sorted, filtered and paginated data
  let processedData: AdvertisementDisplay[] = $state([])
  let totalFilteredItems = $state(0)

  // Get unique filter options
  const statusOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.status)),
  ])
  const categoryOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.categoryName)),
  ])
  const subCategoryOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.subCategoryName)),
  ])
  const dealTypeOptions = $derived([
    ...new Set(advertisements.map((ad) => ad.dealTypeName)),
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
          ad.subtitle.toLowerCase().includes(search) ||
          ad.description.toLowerCase().includes(search),
      )
    }

    if (statusFilter) {
      result = result.filter((ad) => ad.status === statusFilter)
    }

    if (categoryFilter) {
      result = result.filter((ad) => ad.categoryName === categoryFilter)
    }

    if (subCategoryFilter) {
      result = result.filter((ad) => ad.subCategoryName === subCategoryFilter)
    }

    if (dealTypeFilter) {
      result = result.filter((ad) => ad.dealTypeName === dealTypeFilter)
    }

    totalFilteredItems = result.length

    // Apply sorting
    if (sortBy && sortDirection) {
      result.sort((a, b) => {
        const aVal = a[sortBy as keyof AdvertisementDisplay]
        const bVal = b[sortBy as keyof AdvertisementDisplay]

        // Handle undefined values
        if (aVal === undefined && bVal === undefined) return 0
        if (aVal === undefined) return sortDirection === 'desc' ? 1 : -1
        if (bVal === undefined) return sortDirection === 'desc' ? -1 : 1

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
    subCategoryFilter = ''
    dealTypeFilter = ''
    currentPage = 1
  }

  // Reset to first page when filters change
  $effect(() => {
    if (
      searchTerm ||
      statusFilter ||
      categoryFilter ||
      subCategoryFilter ||
      dealTypeFilter
    ) {
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
          placeholder="Search title, subtitle, description..."
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

      <!-- Sub Category Filter -->
      <div>
        <label
          for="subCategory"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Sub Category
        </label>
        <select
          id="subCategory"
          bind:value={subCategoryFilter}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        >
          <option value="">All Sub Categories</option>
          {#each subCategoryOptions as subCategory}
            <option value={subCategory}>{subCategory}</option>
          {/each}
        </select>
      </div>

      <div>
        <label
          for="dealType"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Deal Type
        </label>
        <select
          id="dealType"
          bind:value={dealTypeFilter}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
        >
          <option value="">All Deal Types</option>
          {#each dealTypeOptions as dealType}
            <option value={dealType}>{dealType}</option>
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
