<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'

  // Props
  let {
    isOpen = $bindable(false),
    advertisement = null,
  }: {
    isOpen: boolean
    advertisement: AdvertisementDisplay | null
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

<Modal bind:isOpen title="Advertisement Details" maxWidth="2xl">
  {#snippet children()}
    {#if advertisement}
      <div class="space-y-6">
        <!-- Header with images -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#if advertisement.coverImageUrl}
            <div>
              <h3
                class="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Cover Image
              </h3>
              <img
                src={advertisement.coverImageUrl}
                alt="Cover"
                class="w-full h-48 object-cover rounded-lg border border-background-toned-2 dark:border-background-toned-2-dark"
              />
            </div>
          {/if}
          {#if advertisement.thumbnailImageUrl}
            <div>
              <h3
                class="text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Thumbnail Image
              </h3>
              <img
                src={advertisement.thumbnailImageUrl}
                alt="Thumbnail"
                class="w-full h-48 object-cover rounded-lg border border-background-toned-2 dark:border-background-toned-2-dark"
              />
            </div>
          {/if}
        </div>

        <!-- Basic Information -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                {advertisement.id}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Title
              </span>
              <p class="text-text dark:text-text-dark font-semibold">
                {advertisement.title}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Subtitle
              </span>
              <p class="text-text-light dark:text-text-light-dark">
                {advertisement.subtitle || 'No subtitle'}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Status
              </span>
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                {advertisement.status === 'published'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : advertisement.status === 'draft'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                    : advertisement.status === 'expired'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'}"
              >
                {advertisement.status.charAt(0).toUpperCase() +
                  advertisement.status.slice(1)}
              </span>
            </div>
          </div>

          <div class="space-y-4">
            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Category
              </span>
              <p class="text-text dark:text-text-dark">
                {advertisement.categoryName}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Sub Category
              </span>
              <p class="text-text dark:text-text-dark">
                {advertisement.subCategoryName}
              </p>
            </div>

            <div>
              <span
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
              >
                Deal Type
              </span>
              <p class="text-text dark:text-text-dark">
                {advertisement.dealTypeName}
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <span
                  class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
                >
                  Tags
                </span>
                <p class="text-text-light dark:text-text-light-dark text-sm">
                  {advertisement.tagCount} tags
                </p>
              </div>

              <div>
                <span
                  class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
                >
                  Locations
                </span>
                <p class="text-text-light dark:text-text-light-dark text-sm">
                  {advertisement.locationCount} locations
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div>
          <span
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Description
          </span>
          <div
            class="bg-background-toned dark:bg-background-toned-dark p-4 rounded-lg"
          >
            <p class="text-text dark:text-text-dark leading-relaxed">
              {advertisement.description}
            </p>
          </div>
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
            >
              Start Date
            </span>
            <p class="text-text-light dark:text-text-light-dark">
              {formatDate(advertisement.startDate)}
            </p>
          </div>

          <div>
            <span
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
            >
              Expiration Date
            </span>
            <p class="text-text-light dark:text-text-light-dark">
              {formatDate(advertisement.expirationDate)}
            </p>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-8">
        <p class="text-text-light dark:text-text-light-dark">
          No advertisement selected
        </p>
      </div>
    {/if}
  {/snippet}
</Modal>
