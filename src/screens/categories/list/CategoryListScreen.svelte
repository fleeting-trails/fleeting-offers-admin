<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import DeleteConfirmationModal from '$lib/components/Modal/DeleteConfirmationModal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import CategoryTable from '$lib/ui/Category/CategoryTable.svelte'
  import EditCategoryModal from '$lib/ui/Category/EditCategoryModal.svelte'
  import ViewCategoryModal from '$lib/ui/Category/ViewCategoryModal.svelte'
  import {
    fetchCategories,
    deleteCategory,
    updateCategory,
    fetchCategoryById,
  } from '$lib/api/category'
  import type {
    CategoryDisplay,
    CategoryListResponse,
    Category,
  } from '$lib/types/category'

  // State
  let isEditModalOpen = $state(false)
  let isViewModalOpen = $state(false)
  let isDeleteModalOpen = $state(false)
  let editingCategory = $state<CategoryDisplay | null>(null)
  let viewingCategory = $state<CategoryDisplay | null>(null)
  let deletingCategoryId = $state<string | null>(null)
  let loading = $state(false)
  let submitLoading = $state(false)

  // Category data
  let categories = $state<CategoryDisplay[]>([])
  let totalItems = $state(0)
  let currentPage = $state(1)
  let pageSize = $state(10)
  let totalPages = $state(0)

  // Transform category data for display
  const transformCategory = (category: Category): CategoryDisplay => ({
    ...category,
    hasImage: !!category.imageId,
    formattedDate: new Date(category.createdAt).toLocaleDateString(),
  })

  // Load categories
  const loadCategories = async () => {
    loading = true
    try {
      const response = await fetchCategories(currentPage, pageSize)

      if (response.success) {
        categories = response.data.items.map(transformCategory)
        totalItems = response.data.totalItems
        totalPages = response.data.totalPages
      } else {
        throw new Error(response.message || 'Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      loading = false
    }
  }

  // Initialize data
  onMount(() => {
    loadCategories()
  })

  // Action handlers
  const handleView = async (id: string) => {
    try {
      const category = await fetchCategoryById(id)
      viewingCategory = transformCategory(category)
      isViewModalOpen = true
    } catch (error) {
      console.error('Error loading category:', error)
      toast.error('Failed to load category details')
    }
  }

  const handleEdit = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return
    editingCategory = category
    isEditModalOpen = true
  }

  const handleDelete = (id: string) => {
    deletingCategoryId = id
    isDeleteModalOpen = true
  }

  const handleEditSubmit = async (data: { name: string; imageId?: string }) => {
    if (!editingCategory) return

    submitLoading = true
    try {
      await updateCategory(editingCategory.id, {
        name: data.name,
        ...(data.imageId && { imageId: data.imageId }),
      })

      // Update local data with the new name
      categories = categories.map((category) =>
        category.id === editingCategory!.id
          ? { ...category, name: data.name }
          : category,
      )

      isEditModalOpen = false
      editingCategory = null
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update category'
      toast.error(errorMessage)
    } finally {
      submitLoading = false
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingCategoryId) return

    try {
      await deleteCategory(deletingCategoryId)

      // Remove from local data
      categories = categories.filter((c) => c.id !== deletingCategoryId)
      totalItems--

      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete category'
      toast.error(errorMessage)
    } finally {
      deletingCategoryId = null
      isDeleteModalOpen = false
    }
  }

  const cancelDelete = () => {
    deletingCategoryId = null
    isDeleteModalOpen = false
  }

  const handleCreateNew = () => {
    goto('/admin/categories/create')
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
          Categories
        </h1>
        <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
          Manage your advertisement categories
        </p>
      </div>
      <div class="flex gap-3">
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
            <span>Create Category</span>
          </div>
        </ButtonGradient>
      </div>
    </div>
  </div>

  <!-- Table -->
  <CategoryTable
    {categories}
    {loading}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
</div>

<!-- Modals -->
<ViewCategoryModal bind:isOpen={isViewModalOpen} category={viewingCategory} />

<EditCategoryModal
  bind:isOpen={isEditModalOpen}
  category={editingCategory}
  onSubmit={handleEditSubmit}
  loading={submitLoading}
/>

<DeleteConfirmationModal
  bind:isOpen={isDeleteModalOpen}
  title="Delete Category"
  message="Are you sure you want to delete this category? This action cannot be undone."
  onConfirm={handleDeleteConfirm}
  onCancel={cancelDelete}
  loading={submitLoading}
/>
