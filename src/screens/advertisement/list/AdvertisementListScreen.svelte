<script lang="ts">
  import { onMount } from 'svelte'
  import { goto } from '$app/navigation'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import DeleteConfirmationModal from '$lib/components/Modal/DeleteConfirmationModal.svelte'
  import AdvertisementTable from '$lib/ui/Advertisement/AdvertisementTable.svelte'
  import EditAdvertisementModal from '$lib/ui/Advertisement/EditAdvertisementModal.svelte'
  import ViewAdvertisementModal from '$lib/ui/Advertisement/ViewAdvertisementModal.svelte'
  import {
    fetchAdvertisements,
    deleteAdvertisement,
    type AdvertisementApiItem,
  } from '$lib/api/advertisement'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'

  // State
  let isEditModalOpen = $state(false)
  let isViewModalOpen = $state(false)
  let isDeleteModalOpen = $state(false)
  let editingAdvertisement = $state<AdvertisementDisplay | null>(null)
  let viewingAdvertisement = $state<AdvertisementDisplay | null>(null)
  let deletingAdvertisementId = $state<string | null>(null)
  let loading = $state(false)
  let deleteLoading = $state(false)

  // Data state
  let advertisements = $state<AdvertisementDisplay[]>([])
  let totalItems = $state(0)
  let currentPage = $state(1)
  let pageSize = $state(10)
  let totalPages = $state(0)

  // Load advertisements on mount
  onMount(() => {
    loadAdvertisements()
  })

  // Transform API item to display format
  const transformToDisplay = (
    item: AdvertisementApiItem,
  ): AdvertisementDisplay => {
    return {
      id: item.id,
      title: item.title,
      subtitle: item.subtitle,
      description: item.description || '',
      startDate: item.startDate || undefined,
      expirationDate: item.expirationDate || undefined,
      categoryName: 'N/A', // Will be populated when we have category lookup
      subCategoryName: 'N/A', // Will be populated when we have subcategory lookup
      dealTypeName: 'N/A', // Will be populated when we have deal type lookup
      coverImageUrl: item.coverImageId
        ? `/api/files/${item.coverImageId}`
        : undefined,
      thumbnailImageUrl: item.thumbnailImageId
        ? `/api/files/${item.thumbnailImageId}`
        : undefined,
      tagCount: 0, // Will be populated when we have tag count from API
      locationCount: 0, // Will be populated when we have location count from API
      ownerCount: 1, // Default to 1 for now
      status: 'published', // Will be determined based on dates and API response
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  }

  // Load advertisements from API
  const loadAdvertisements = async () => {
    loading = true
    try {
      const response = await fetchAdvertisements(currentPage, pageSize)

      advertisements = response.data.items.map(transformToDisplay)
      totalItems = response.data.totalItems
      totalPages = response.data.totalPages
    } catch (error) {
      console.error('Error loading advertisements:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load advertisements'
      toast.error(errorMessage)
      advertisements = []
    } finally {
      loading = false
    }
  }

  // Refresh function
  const handleRefresh = () => {
    loadAdvertisements()
  }

  // Actions
  const handleCreateClick = () => {
    goto('/admin/advertisements/create')
  }

  const handleView = (id: string) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return
    viewingAdvertisement = ad
    isViewModalOpen = true
  }

  const handleEdit = (id: string) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return

    if (ad.status === 'draft') {
      goto(`/admin/advertisements/create?edit=${id}`)
    } else {
      editingAdvertisement = ad
      isEditModalOpen = true
    }
  }

  const handleDelete = (id: string) => {
    deletingAdvertisementId = id
    isDeleteModalOpen = true
  }

  const confirmDelete = async () => {
    if (!deletingAdvertisementId) return

    deleteLoading = true
    try {
      await deleteAdvertisement(deletingAdvertisementId)
      toast.success('Advertisement deleted successfully')

      // Reload the list
      await loadAdvertisements()
    } catch (error) {
      console.error('Error deleting advertisement:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to delete advertisement'
      toast.error(errorMessage)
    } finally {
      deleteLoading = false
      deletingAdvertisementId = null
      isDeleteModalOpen = false
    }
  }

  const cancelDelete = () => {
    deletingAdvertisementId = null
    isDeleteModalOpen = false
  }

  const handleEditSubmit = async (data: any) => {
    if (!editingAdvertisement) return

    try {
      // For now, we'll update the local state
      // Later this should call the API update endpoint
      advertisements = advertisements.map((ad) =>
        ad.id === editingAdvertisement!.id
          ? {
              ...ad,
              title: data.title,
              subtitle: data.subtitle,
              description: data.description,
              startDate: data.startDate,
              expirationDate: data.expirationDate,
              updatedAt: new Date().toISOString(),
            }
          : ad,
      )

      toast.success('Advertisement updated successfully')
      editingAdvertisement = null
    } catch (error) {
      console.error('Error updating advertisement:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to update advertisement'
      toast.error(errorMessage)
    }
  }
</script>

<!-- Page header -->
<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        Advertisements
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        Manage your advertisement campaigns
      </p>
    </div>
    <ButtonGradient onclick={handleCreateClick} size="md" disabled={loading}>
      Create Advertisement
    </ButtonGradient>
  </div>

  <!-- Loading state -->
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark">
        Loading advertisements...
      </span>
    </div>
  {:else}
    <!-- Advertisement table -->
    <AdvertisementTable
      {advertisements}
      loading={false}
      onEdit={handleEdit}
      onView={handleView}
      onDelete={handleDelete}
    />
  {/if}
</div>

<!-- Modals -->
<ViewAdvertisementModal
  bind:isOpen={isViewModalOpen}
  advertisement={viewingAdvertisement}
/>

<EditAdvertisementModal
  bind:isOpen={isEditModalOpen}
  onSubmit={handleEditSubmit}
  advertisement={editingAdvertisement}
/>

<DeleteConfirmationModal
  bind:isOpen={isDeleteModalOpen}
  title="Confirm Delete"
  message="Are you sure you want to delete this advertisement? This action cannot be undone."
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  loading={deleteLoading}
/>
