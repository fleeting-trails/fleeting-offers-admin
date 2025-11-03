<script lang="ts">
  import { toast } from 'svelte-sonner'
  import {
    fetchAdvertisementDetails,
    type AdvertisementDetailData,
  } from '$lib/api/advertisement'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'
  import Modal from '$lib/components/Modal/Modal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'

  interface Props {
    advertisement?: AdvertisementDisplay | null
    isOpen: boolean
    onClose?: () => void
  }

  let { advertisement, isOpen = $bindable(), onClose }: Props = $props()

  let isLoading = $state(false)
  let advertisementDetails = $state<AdvertisementDetailData | null>(null)

  // Load advertisement details when modal opens
  $effect(() => {
    if (isOpen && advertisement?.id) {
      loadAdvertisementDetails()
    }
  })

  async function loadAdvertisementDetails() {
    if (!advertisement?.id) return

    isLoading = true
    try {
      advertisementDetails = await fetchAdvertisementDetails(advertisement.id)
    } catch (error: any) {
      console.error('Failed to load advertisement details:', error)
      toast.error(error.message || 'Failed to load advertisement details')
    } finally {
      isLoading = false
    }
  }

  function handleClose() {
    advertisementDetails = null
    isOpen = false
    onClose?.()
  }

  // Watch for modal close from backdrop click
  $effect(() => {
    if (!isOpen) {
      advertisementDetails = null
    }
  })
</script>

<Modal bind:isOpen title="Advertisement Details" maxWidth="2xl">
  <div class="max-w-4xl mx-auto p-6">
    {#if isLoading}
      <div class="flex justify-center items-center py-8">
        <LoadingSpinner />
      </div>
    {:else if advertisementDetails}
      <div class="space-y-6">
        <!-- Basic Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              Basic Information
            </h3>
            <div class="space-y-2">
              <div>
                <span class="font-medium text-gray-600">Title:</span>
                <span class="ml-2 text-gray-900"
                  >{advertisementDetails.title}</span
                >
              </div>
              <div>
                <span class="font-medium text-gray-600">Subtitle:</span>
                <span class="ml-2 text-gray-900"
                  >{advertisementDetails.subtitle}</span
                >
              </div>
              {#if advertisementDetails.description}
                <div>
                  <span class="font-medium text-gray-600">Description:</span>
                  <p class="mt-1 text-gray-900">
                    {advertisementDetails.description}
                  </p>
                </div>
              {/if}
            </div>
          </div>

          <!-- Dates -->
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">Dates</h3>
            <div class="space-y-2">
              {#if advertisementDetails.startDate}
                <div>
                  <span class="font-medium text-gray-600">Start Date:</span>
                  <span class="ml-2 text-gray-900">
                    {new Date(
                      advertisementDetails.startDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
              {/if}
              {#if advertisementDetails.expirationDate}
                <div>
                  <span class="font-medium text-gray-600">Expiration Date:</span
                  >
                  <span class="ml-2 text-gray-900">
                    {new Date(
                      advertisementDetails.expirationDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
              {/if}
              <div>
                <span class="font-medium text-gray-600">Created:</span>
                <span class="ml-2 text-gray-900">
                  {new Date(
                    advertisementDetails.createdAt,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Owners Section -->
        {#if advertisementDetails.owners && advertisementDetails.owners.length > 0}
          <div>
            <h3 class="text-lg font-semibold text-gray-900 mb-3">
              Owners ({advertisementDetails.owners.length})
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {#each advertisementDetails.owners as owner}
                <div class="p-4 bg-gray-50 rounded-lg">
                  <div class="space-y-2">
                    <div>
                      <span class="font-medium text-gray-600">Owner ID:</span>
                      <span class="ml-2 text-gray-900">{owner.userId}</span>
                    </div>
                    <div>
                      <span class="font-medium text-gray-600"
                        >Ownership Type:</span
                      >
                      <span class="ml-2 text-gray-900"
                        >{owner.ownershipType}</span
                      >
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/if}

        <!-- Additional Information -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#if advertisementDetails.tags && advertisementDetails.tags.length > 0}
            <div class="text-center p-4 bg-purple-50 rounded-lg">
              <div class="text-2xl font-bold text-purple-600">
                {advertisementDetails.tags.length}
              </div>
              <div class="text-sm text-purple-800">Tags</div>
            </div>
          {/if}

          {#if advertisementDetails.locations && advertisementDetails.locations.length > 0}
            <div class="text-center p-4 bg-orange-50 rounded-lg">
              <div class="text-2xl font-bold text-orange-600">
                {advertisementDetails.locations.length}
              </div>
              <div class="text-sm text-orange-800">Locations</div>
            </div>
          {/if}

          {#if advertisementDetails.additionalImages && advertisementDetails.additionalImages.length > 0}
            <div class="text-center p-4 bg-green-50 rounded-lg">
              <div class="text-2xl font-bold text-green-600">
                {advertisementDetails.additionalImages.length}
              </div>
              <div class="text-sm text-green-800">Additional Images</div>
            </div>
          {/if}
        </div>

        <!-- IDs Section for debugging/admin -->
        <div class="p-4 bg-gray-50 rounded-lg">
          <h3 class="text-lg font-semibold text-gray-900 mb-3">
            System Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-medium text-gray-600">Advertisement ID:</span>
              <span class="ml-2 text-gray-900 font-mono"
                >{advertisementDetails.id}</span
              >
            </div>
            {#if advertisementDetails.categoryId}
              <div>
                <span class="font-medium text-gray-600">Category ID:</span>
                <span class="ml-2 text-gray-900 font-mono"
                  >{advertisementDetails.categoryId}</span
                >
              </div>
            {/if}
            {#if advertisementDetails.subCategoryId}
              <div>
                <span class="font-medium text-gray-600">Sub-Category ID:</span>
                <span class="ml-2 text-gray-900 font-mono"
                  >{advertisementDetails.subCategoryId}</span
                >
              </div>
            {/if}
            <div>
              <span class="font-medium text-gray-600">Created By:</span>
              <span class="ml-2 text-gray-900 font-mono"
                >{advertisementDetails.createdById}</span
              >
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div class="text-center py-8">
        <p class="text-gray-500">No advertisement details available</p>
      </div>
    {/if}
  </div>
</Modal>
