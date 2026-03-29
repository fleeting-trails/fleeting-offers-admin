<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import DeleteConfirmationModal from '$lib/components/Modal/DeleteConfirmationModal.svelte'
  import IndustryTable from '$lib/ui/Industry/IndustryTable.svelte'
  import EditIndustryModal from '$lib/ui/Industry/EditIndustryModal.svelte'
  import ViewIndustryModal from '$lib/ui/Industry/ViewIndustryModal.svelte'
  import {
    fetchIndustries,
    deleteIndustry,
    updateIndustry,
    fetchIndustryById,
  } from '$lib/api/industry'
  import type { IndustryDisplay, Industry } from '$lib/types/industry'
  import RoleAuthWrapper from '$lib/components/RoleAuthWrapper/RoleAuthWrapper.svelte'
  import type { ModuleType } from '$lib/types/roles'

  // Props
  let { module }: { module: ModuleType } = $props()

  // State
  let isEditModalOpen = $state(false)
  let isViewModalOpen = $state(false)
  let isDeleteModalOpen = $state(false)
  let editingIndustry = $state<IndustryDisplay | null>(null)
  let viewingIndustry = $state<IndustryDisplay | null>(null)
  let deletingIndustryId = $state<string | null>(null)
  let loading = $state(false)
  let submitLoading = $state(false)
  let viewLoading = $state(false)

  // Industry data
  let industries = $state<IndustryDisplay[]>([])
  let totalItems = $state(0)
  let currentPage = $state(1)
  let pageSize = $state(10)
  let totalPages = $state(0)

  // Load industries
  const loadIndustries = async () => {
    loading = true
    try {
      const response = await fetchIndustries(currentPage, pageSize)

      if (response.success) {
        industries = response.data.items.map(transformIndustry)
        totalItems = response.data.totalItems
        currentPage = response.data.page
        pageSize = response.data.pageSize
        totalPages = response.data.totalPages
      } else {
        toast.error('Failed to load industries')
      }
    } catch (error) {
      console.error('Error loading industries:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to load industries'
      toast.error(errorMessage)
    } finally {
      loading = false
    }
  }

  // Transform industry data for display
  const transformIndustry = (industry: Industry): IndustryDisplay => ({
    ...industry,
    hasImage: !!industry.imageId,
    formattedDate: new Date(industry.createdAt).toLocaleDateString(),
  })

  // Initialize data
  onMount(() => {
    loadIndustries()
  })

  // Action handlers
  const handleView = async (id: string) => {
    try {
      viewLoading = true
      viewingIndustry = null
      isViewModalOpen = true
      const industry = await fetchIndustryById(id)
      viewingIndustry = transformIndustry(industry)
    } catch (error) {
      console.error('Error loading industry details:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to load industry details'
      toast.error(errorMessage)
      isViewModalOpen = false
    } finally {
      viewLoading = false
    }
  }

  const handleEdit = (id: string) => {
    const industry = industries.find((i) => i.id === id)
    if (!industry) return
    editingIndustry = industry
    isEditModalOpen = true
  }

  const handleDelete = (id: string) => {
    deletingIndustryId = id
    isDeleteModalOpen = true
  }

  const handleEditSubmit = async (data: { name: string; imageId?: string }) => {
    if (!editingIndustry) return

    submitLoading = true
    try {
      const updatedIndustry = await updateIndustry(editingIndustry.id, {
        name: data.name,
        ...(data.imageId && { imageId: data.imageId }),
      })

      // Update local data
      industries = industries.map((industry) =>
        industry.id === editingIndustry!.id
          ? transformIndustry(updatedIndustry)
          : industry,
      )

      isEditModalOpen = false
      editingIndustry = null
      toast.success('Industry updated successfully')
    } catch (error) {
      console.error('Error updating industry:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update industry'
      toast.error(errorMessage)
    } finally {
      submitLoading = false
    }
  }

  const confirmDelete = async () => {
    if (!deletingIndustryId) return

    submitLoading = true
    try {
      await deleteIndustry(deletingIndustryId)

      // Update local data
      industries = industries.filter(
        (industry) => industry.id !== deletingIndustryId,
      )
      totalItems = Math.max(0, totalItems - 1)

      isDeleteModalOpen = false
      deletingIndustryId = null
      toast.success('Industry deleted successfully')
    } catch (error) {
      console.error('Error deleting industry:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete industry'
      toast.error(errorMessage)
    } finally {
      submitLoading = false
    }
  }

  const cancelDelete = () => {
    if (!submitLoading) {
      deletingIndustryId = null
      isDeleteModalOpen = false
    }
  }

  const handleCreateNew = () => {
    goto('/admin/industries/create')
  }

  // Pagination handler
  const handlePageChange = async (page: number) => {
    currentPage = page
    await loadIndustries()
  }
</script>

<div class="p-6 w-full">
  <!-- Page header -->
  <div class="mb-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
        >
          Industries
        </h1>
        <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
          Manage your advertisement industries
        </p>
      </div>
      <div class="flex gap-3">
        <RoleAuthWrapper {module} type="CREATE">
          <ButtonGradient onclick={handleCreateNew}>
            <div class="flex items-center gap-2 whitespace-nowrap">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create Industry</span>
            </div>
          </ButtonGradient>
        </RoleAuthWrapper>
      </div>
    </div>
  </div>

  <!-- Table -->
  <RoleAuthWrapper {module} type="LIST">
    <IndustryTable
      {industries}
      {loading}
      {module}
      {totalItems}
      {currentPage}
      {pageSize}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onPageChange={handlePageChange}
    />
  </RoleAuthWrapper>
</div>

<!-- Modals -->
<RoleAuthWrapper {module} type="DETAILS">
  <ViewIndustryModal
    bind:isOpen={isViewModalOpen}
    industry={viewingIndustry}
    loading={viewLoading}
  />
</RoleAuthWrapper>

<RoleAuthWrapper {module} type="UPDATE">
  <EditIndustryModal
    bind:isOpen={isEditModalOpen}
    industry={editingIndustry}
    onSubmit={handleEditSubmit}
    loading={submitLoading}
  />
</RoleAuthWrapper>

<RoleAuthWrapper {module} type="DELETE">
  <DeleteConfirmationModal
    bind:isOpen={isDeleteModalOpen}
    title="Delete Industry"
    message="Are you sure you want to delete this industry? This action cannot be undone."
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    loading={submitLoading}
  />
</RoleAuthWrapper>
