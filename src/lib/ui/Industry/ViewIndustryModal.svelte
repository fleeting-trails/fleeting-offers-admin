<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import type { IndustryDisplay } from '$lib/types/industry'

  let {
    isOpen = $bindable(false),
    industry = null,
    loading = false,
  }: {
    isOpen: boolean
    industry: IndustryDisplay | null
    loading?: boolean
  } = $props()
</script>

<Modal bind:isOpen title="Industry Details">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading industry details...</span
      >
    </div>
  {:else if industry}
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
            {industry.name}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Slug
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {industry.slug}
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
            {industry.id}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Created At
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {industry.formattedDate}
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
            class="w-3 h-3 rounded-full {industry.hasImage
              ? 'bg-green-500'
              : 'bg-gray-400'}"
          ></div>
          <span
            class="text-text-secondary dark:text-text-secondary-dark text-sm"
          >
            {industry.hasImage ? 'Image attached' : 'No image'}
          </span>
        </div>
      </div>
    </div>
  {:else}
    <div class="py-8 text-center">
      <p class="text-text-light dark:text-text-light-dark">
        No industry selected
      </p>
    </div>
  {/if}
</Modal>
