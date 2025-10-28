<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import type { CategoryDisplay } from '$lib/types/category'

  // Props
  let {
    isOpen = $bindable(false),
    category = null,
  }: {
    isOpen: boolean
    category: CategoryDisplay | null
  } = $props()

  // Format dates
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
</script>

<Modal bind:isOpen title="Category Details" maxWidth="xl">
  {#snippet children()}
    {#if category}
      <div class="space-y-6">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <div
            class="w-16 h-16 {category.hasImage
              ? 'bg-primary/10 dark:bg-primary-dark/10'
              : 'bg-gray-100 dark:bg-gray-700'} rounded-lg flex items-center justify-center"
          >
            <span
              class="text-2xl font-bold {category.hasImage
                ? 'text-primary dark:text-primary-dark'
                : 'text-gray-500 dark:text-gray-400'}"
            >
              {category.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div class="flex-1">
            <h2
              class="text-xl font-semibold text-text-primary dark:text-text-primary-dark"
            >
              {category.name}
            </h2>
            <p class="text-text-light dark:text-text-light-dark text-sm">
              Slug: {category.slug}
            </p>
          </div>
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                ID
              </span>
              <p
                class="text-text dark:text-text-dark font-mono text-sm bg-background-toned dark:bg-background-toned-dark px-3 py-2 rounded-lg"
              >
                {category.id}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Name
              </span>
              <p class="text-text dark:text-text-dark font-semibold">
                {category.name}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Slug
              </span>
              <p
                class="text-text-light dark:text-text-light-dark font-mono text-sm"
              >
                {category.slug}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Image
              </span>
              <p class="text-text dark:text-text-dark">
                {category.imageId
                  ? `Image ID: ${category.imageId}`
                  : 'No image set'}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Created Date
              </span>
              <p class="text-text-light dark:text-text-light-dark">
                {formatDate(category.createdAt)}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Status
              </span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              >
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h3
            class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-4"
          >
            Additional Information
          </h3>
          <div
            class="bg-background-toned dark:bg-background-toned-dark p-4 rounded-lg"
          >
            <p class="text-text-light dark:text-text-light-dark text-sm">
              This category was created on {formatDate(category.createdAt)}.
              {category.imageId
                ? 'It has an associated image.'
                : 'No image has been set for this category.'}
            </p>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-8">
        <p class="text-text-light dark:text-text-light-dark">
          No category selected
        </p>
      </div>
    {/if}
  {/snippet}
</Modal>
