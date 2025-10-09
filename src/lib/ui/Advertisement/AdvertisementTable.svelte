<script lang="ts">
  import Text from '$lib/ui/typography/Text/Text.svelte'

  type Advertisement = {
    id: number
    title: string
    description: string
    category: string
    status: string
    createdAt: string
    views: number
    clicks: number
  }

  let {
    advertisements = [],
    onEdit = (id: number) => {},
  }: {
    advertisements: Advertisement[]
    onEdit: (id: number) => void
  } = $props()

  const getStatusBadgeClass = (status: string) => {
    return status === 'Published'
      ? 'bg-primary/10 text-primary dark:bg-primary-dark/10 dark:text-primary-dark'
      : 'bg-background-toned-3 text-text-light dark:bg-background-toned-3-dark dark:text-text-light-dark'
  }
</script>

<div
  class="bg-background-pure dark:bg-background-pure-dark rounded-xl shadow-lg border border-background-toned-2/50 dark:border-background-toned-2-dark/50 overflow-hidden"
>
  <div class="overflow-x-auto">
    <table class="w-full">
      <thead>
        <tr
          class="bg-background-toned-1 dark:bg-background-toned-1-dark border-b border-background-toned-2 dark:border-background-toned-2-dark"
        >
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Title
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Description
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Category
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Views
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Clicks
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Created
          </th>
          <th
            class="text-left py-4 px-6 text-sm font-medium text-text-light dark:text-text-light-dark uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody
        class="divide-y divide-background-toned-2/30 dark:divide-background-toned-2-dark/30"
      >
        {#each advertisements as ad (ad.id)}
          <tr
            class="hover:bg-background-toned-0/50 dark:hover:bg-background-toned-0-dark/50 transition-colors"
          >
            <td class="py-4 px-6">
              <Text class="font-medium text-text dark:text-text-dark">
                {ad.title}
              </Text>
            </td>
            <td class="py-4 px-6">
              <Text
                class="text-text-light dark:text-text-light-dark text-sm max-w-xs truncate"
              >
                {ad.description}
              </Text>
            </td>
            <td class="py-4 px-6">
              <Text class="text-text-light dark:text-text-light-dark text-sm">
                {ad.category}
              </Text>
            </td>
            <td class="py-4 px-6">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium {getStatusBadgeClass(
                  ad.status,
                )}"
              >
                {ad.status}
              </span>
            </td>
            <td class="py-4 px-6">
              <Text class="text-text-light dark:text-text-light-dark text-sm">
                {ad.views.toLocaleString()}
              </Text>
            </td>
            <td class="py-4 px-6">
              <Text class="text-text-light dark:text-text-light-dark text-sm">
                {ad.clicks.toLocaleString()}
              </Text>
            </td>
            <td class="py-4 px-6">
              <Text class="text-text-light dark:text-text-light-dark text-sm">
                {ad.createdAt}
              </Text>
            </td>
            <td class="py-4 px-6">
              <button
                type="button"
                onclick={() => onEdit(ad.id)}
                class="bg-primary/10 hover:bg-primary/20 dark:bg-primary-dark/10 dark:hover:bg-primary-dark/20 text-primary dark:text-primary-dark px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
              >
                Edit
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
