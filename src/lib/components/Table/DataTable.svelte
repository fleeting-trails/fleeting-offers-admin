<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import SortIcon from '$lib/icons/SortIcon.svelte'
  import SortUpIcon from '$lib/icons/SortUpIcon.svelte'
  import SortDownIcon from '$lib/icons/SortDownIcon.svelte'

  // Types
  type SortDirection = 'asc' | 'desc' | null
  type Column = {
    key: string
    label: string
    sortable?: boolean
    class?: string
    render?: (value: any, row: any) => string
  }

  // Props
  let {
    data = [],
    columns = [],
    pageSize = 5,
    currentPage = 1,
    totalItems = 0,
    loading = false,
    emptyMessage = 'No data available',
    sortBy = '',
    sortDirection = null as SortDirection,
    onSort = (key: string, direction: SortDirection) => {},
    onPageChange = (page: number) => {},
    onPageSizeChange = (size: number) => {},
    onRowClick = null as ((row: any) => void) | null,
    actions = [] as Array<{
      label: string
      onClick: (row: any) => void
      class?: string
      condition?: (row: any) => boolean
    }>,
    pageSizeOptions = [5, 10, 25, 50, 100],
  }: {
    data: any[]
    columns: Column[]
    pageSize?: number
    currentPage?: number
    totalItems?: number
    loading?: boolean
    emptyMessage?: string
    sortBy?: string
    sortDirection?: SortDirection
    onSort?: (key: string, direction: SortDirection) => void
    onPageChange?: (page: number) => void
    onPageSizeChange?: (size: number) => void
    onRowClick?: ((row: any) => void) | null
    actions?: Array<{
      label: string
      onClick: (row: any) => void
      class?: string
      condition?: (row: any) => boolean
    }>
    pageSizeOptions?: number[]
  } = $props()

  const dispatch = createEventDispatcher()

  // Computed values
  const totalPages = $derived(Math.ceil((totalItems || data.length) / pageSize))
  const startItem = $derived((currentPage - 1) * pageSize + 1)
  const endItem = $derived(
    Math.min(currentPage * pageSize, totalItems || data.length),
  )

  // Handle column sorting
  const handleSort = (column: Column) => {
    if (!column.sortable) return

    let newDirection: SortDirection = 'asc'
    if (sortBy === column.key) {
      if (sortDirection === 'asc') {
        newDirection = 'desc'
      } else if (sortDirection === 'desc') {
        newDirection = null
      } else {
        newDirection = 'asc'
      }
    }

    onSort(column.key, newDirection)
    dispatch('sort', { key: column.key, direction: newDirection })
  }

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
    dispatch('pageChange', { page })
  }

  // Get cell value
  const getCellValue = (row: any, column: Column) => {
    const value = row[column.key]
    return column.render ? column.render(value, row) : value
  }

  // Generate page numbers for pagination
  const getPageNumbers = (current: number, total: number) => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(total - 1, current + delta);
      i++
    ) {
      range.push(i)
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (current + delta < total - 1) {
      rangeWithDots.push('...', total)
    } else if (total > 1) {
      rangeWithDots.push(total)
    }

    return rangeWithDots
  }
</script>

<!-- Table container -->
<div
  class="bg-background-pure dark:bg-background-pure-dark rounded-xl shadow-lg border border-background-toned-2/50 dark:border-background-toned-2-dark/50 overflow-hidden"
>
  <!-- Loading state -->
  {#if loading}
    <div class="flex items-center justify-center p-8">
      <div
        class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary dark:border-primary-dark"
      ></div>
      <Text class="ml-3 text-text-light dark:text-text-light-dark"
        >Loading...</Text
      >
    </div>
  {:else}
    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="w-full">
        <!-- Table header -->
        <thead>
          <tr
            class="bg-background-toned-1 dark:bg-background-toned-1-dark border-b border-background-toned-2 dark:border-background-toned-2-dark"
          >
            {#each columns as column}
              <th
                class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider {column.class ||
                  ''}"
              >
                {#if column.sortable}
                  <button
                    type="button"
                    onclick={() => handleSort(column)}
                    class="flex items-center space-x-1 hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
                  >
                    <span>{column.label}</span>
                    <span class="opacity-60">
                      {#if sortBy !== column.key}
                        <SortIcon scale={0.75} />
                      {:else if sortDirection === 'asc'}
                        <SortUpIcon scale={0.75} />
                      {:else if sortDirection === 'desc'}
                        <SortDownIcon scale={0.75} />
                      {:else}
                        <SortIcon scale={0.75} />
                      {/if}
                    </span>
                  </button>
                {:else}
                  {column.label}
                {/if}
              </th>
            {/each}
            {#if actions.length > 0}
              <th
                class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
              >
                Actions
              </th>
            {/if}
          </tr>
        </thead>

        <!-- Table body -->
        <tbody
          class="divide-y divide-background-toned-2/30 dark:divide-background-toned-2-dark/30"
        >
          {#if data.length === 0}
            <tr>
              <td
                colspan={columns.length + (actions.length > 0 ? 1 : 0)}
                class="py-8 px-6 text-center"
              >
                <Text class="text-text-light dark:text-text-light-dark"
                  >{emptyMessage}</Text
                >
              </td>
            </tr>
          {:else}
            {#each data as row, index (row.id || index)}
              <tr
                class="hover:bg-background-toned-0/50 dark:hover:bg-background-toned-0-dark/50 transition-colors {onRowClick
                  ? 'cursor-pointer'
                  : ''}"
                onclick={() => onRowClick?.(row)}
              >
                {#each columns as column}
                  <td class="py-4 px-6 {column.class || ''}">
                    {@html getCellValue(row, column)}
                  </td>
                {/each}
                {#if actions.length > 0}
                  <td class="py-4 px-6">
                    <div class="flex items-center space-x-2">
                      {#each actions as action}
                        {#if !action.condition || action.condition(row)}
                          <button
                            type="button"
                            onclick={(e) => {
                              e.stopPropagation()
                              action.onClick(row)
                            }}
                            class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors {action.class ||
                              'bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark'}"
                          >
                            {action.label}
                          </button>
                        {/if}
                      {/each}
                    </div>
                  </td>
                {/if}
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="bg-background-toned-1/50 dark:bg-background-toned-1-dark/50 px-6 py-4 border-t border-background-toned-2/30 dark:border-background-toned-2-dark/30"
    >
      <div class="flex items-center justify-between">
        <!-- Left side: Items info and page size selector -->
        <div class="flex items-center space-x-4">
          <Text class="text-sm text-text-light dark:text-text-light-dark">
            Showing {startItem} to {endItem} of {totalItems || data.length} results
          </Text>

          <!-- Page size selector -->
          <div class="flex items-center space-x-2">
            <Text class="text-sm text-text-light dark:text-text-light-dark">
              Show:
            </Text>
            <select
              value={pageSize}
              onchange={(e) => {
                const target = e.target as HTMLSelectElement
                if (target) {
                  onPageSizeChange(parseInt(target.value))
                }
              }}
              class="px-2 py-1 rounded-md text-sm border border-background-toned-2 dark:border-background-toned-2-dark bg-background-pure dark:bg-background-pure-dark text-black dark:text-white focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-transparent"
            >
              {#each pageSizeOptions as option}
                <option value={option} class="text-black dark:text-white"
                  >{option}</option
                >
              {/each}
            </select>
            <Text class="text-sm text-text-light dark:text-text-light-dark">
              per page
            </Text>
          </div>
        </div>

        <!-- Right side: Pagination controls -->
        {#if totalPages > 1}
          <div class="flex items-center space-x-2">
            <!-- Previous button -->
            <button
              type="button"
              onclick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-background-pure dark:bg-background-pure-dark hover:bg-background-toned-2 dark:hover:bg-background-toned-2-dark text-text-light dark:text-text-light-dark border border-background-toned-2 dark:border-background-toned-2-dark"
            >
              Previous
            </button>

            <!-- Page numbers -->
            {#each getPageNumbers(currentPage, totalPages) as page}
              {#if page === '...'}
                <span
                  class="px-3 py-2 text-text-light dark:text-text-light-dark"
                  >...</span
                >
              {:else}
                <button
                  type="button"
                  onclick={() => handlePageChange(Number(page))}
                  class="px-3 py-2 rounded-md text-sm font-medium transition-colors {currentPage ===
                  page
                    ? 'bg-primary dark:bg-primary-dark text-white'
                    : 'bg-background-pure dark:bg-background-pure-dark hover:bg-background-toned-2 dark:hover:bg-background-toned-2-dark text-text-light dark:text-text-light-dark border border-background-toned-2 dark:border-background-toned-2-dark'}"
                >
                  {page}
                </button>
              {/if}
            {/each}

            <!-- Next button -->
            <button
              type="button"
              onclick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-background-pure dark:bg-background-pure-dark hover:bg-background-toned-2 dark:hover:bg-background-toned-2-dark text-text-light dark:text-text-light-dark border border-background-toned-2 dark:border-background-toned-2-dark"
            >
              Next
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>
