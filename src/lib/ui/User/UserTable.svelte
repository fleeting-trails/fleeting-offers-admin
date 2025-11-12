<script lang="ts">
  import DataTable from '$lib/components/Table/DataTable.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import type { TableColumn, SortDirection } from '$lib/components/Table/types'
  import type { UserDisplay } from '$lib/types/user'

  // Props
  let {
    users = [],
    loading = false,
    onEdit = (id: string) => {},
    onView = (id: string) => {},
    onDelete = (id: string) => {},
    showFilters = true,
  }: {
    users: UserDisplay[]
    loading?: boolean
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
      key: 'fullName',
      label: 'Name',
      sortable: true,
      render: (value: string, row: UserDisplay) =>
        `<div>
          <p class="font-medium text-text dark:text-text-dark">${value}</p>
          <p class="text-text-light dark:text-text-light-dark text-xs">@${row.username}</p>
        </div>`,
    },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (value: string) => {
        const roleColors = {
          SUPER_ADMIN:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
          ADMIN:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          ORGANIZATION:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          USER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
        }
        const colorClass =
          roleColors[value as keyof typeof roleColors] || roleColors['USER']
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${colorClass}">${value}</span>`
      },
    },
    {
      key: 'statusText',
      label: 'Status',
      sortable: true,
      render: (value: string, row: UserDisplay) => {
        const isActive = row.isPasswordSet
        const statusClass = isActive
          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
        return `<span class="px-2 py-1 rounded-full text-xs font-medium ${statusClass}">${value}</span>`
      },
    },
    {
      key: 'formattedLastLogin',
      label: 'Last Login',
      sortable: true,
      render: (value: string) =>
        `<span class="text-text-light dark:text-text-light-dark text-sm">${value}</span>`,
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
      onClick: (row: UserDisplay) => onView?.(row.id),
      class:
        'bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30',
      condition: () => !!onView,
    },
    {
      label: 'Edit',
      onClick: (row: UserDisplay) => onEdit(row.id),
      class:
        'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark',
    },
    {
      label: 'Delete',
      onClick: (row: UserDisplay) => onDelete?.(row.id),
      class:
        'bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30',
      condition: () => !!onDelete,
    },
  ]

  // Filtered data
  const filteredUsers = $derived(() => {
    let filtered = users

    // Search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(search) ||
          user.username.toLowerCase().includes(search) ||
          user.email.toLowerCase().includes(search) ||
          user.role.toLowerCase().includes(search),
      )
    }

    // Sorting
    if (sortBy) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortBy as keyof UserDisplay]
        const bValue = b[sortBy as keyof UserDisplay]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        const comparison = String(aValue).localeCompare(String(bValue))
        return sortDirection === 'desc' ? -comparison : comparison
      })
    }

    return filtered
  })

  // Pagination
  const paginatedUsers = $derived(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredUsers().slice(startIndex, endIndex)
  })

  const totalPages = $derived(() =>
    Math.ceil(filteredUsers().length / pageSize),
  )

  // Event handlers
  const handleSort = (column: string) => {
    if (sortBy === column) {
      sortDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    } else {
      sortBy = column
      sortDirection = 'asc'
    }
  }

  const handlePageChange = (page: number) => {
    currentPage = page
  }

  const handlePageSizeChange = (size: number) => {
    pageSize = size
    currentPage = 1
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
            Search Users
          </label>
          <input
            id="search"
            type="text"
            bind:value={searchTerm}
            placeholder="Search by name, email, username, or role..."
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
    data={paginatedUsers()}
    {columns}
    {actions}
    {loading}
    {currentPage}
    {pageSize}
    totalItems={filteredUsers().length}
    onSort={handleSort}
    onPageChange={handlePageChange}
  />

  {#if !loading && users.length === 0}
    <div class="text-center py-12">
      <div class="text-gray-400 dark:text-gray-500 mb-4">
        <svg
          class="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 20h5v-2a3 3 0 00-5.196-2.012A6.003 6.003 0 0117 20z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 20H4v-2a3 3 0 015.196-2.012A6.003 6.003 0 019 20z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 14a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </div>
      <h3
        class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-1"
      >
        No users found
      </h3>
      <p class="text-text-secondary dark:text-text-secondary-dark">
        There are no users to display at the moment.
      </p>
    </div>
  {/if}
</div>
