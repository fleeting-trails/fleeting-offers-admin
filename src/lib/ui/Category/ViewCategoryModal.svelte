<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import type { CategoryDisplay } from '$lib/types/category'

  let {
    isOpen = $bindable(false),
    category = null,
    loading = false,
  }: {
    isOpen: boolean
    category: CategoryDisplay | null
    loading?: boolean
  } = $props()
</script>

<Modal bind:isOpen title="Category Details">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading category details...</span
      >
    </div>
  {:else if category}
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Name
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {category.name}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Slug
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {category.slug}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            ID
          </label>
          <p
            class="text-text-secondary dark:text-text-secondary-dark text-sm font-mono"
          >
            {category.id}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Created At
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {category.formattedDate}
          </p>
        </div>
      </div>

      <!-- Image Status -->
      <div>
        <label
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
        >
          Image Status
        </label>
        <div class="flex items-center gap-2">
          <div
            class="w-3 h-3 rounded-full {category.hasImage
              ? 'bg-green-500'
              : 'bg-gray-400'}"
          ></div>
          <span
            class="text-text-secondary dark:text-text-secondary-dark text-sm"
          >
            {category.hasImage ? 'Image attached' : 'No image'}
          </span>
        </div>
      </div>
    </div>
  {:else}
    <div class="py-8 text-center">
      <p class="text-text-light dark:text-text-light-dark">
        No category selected
      </p>
    </div>
  {/if}
</Modal>
