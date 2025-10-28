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
  import type {
    CategoryDisplay,
    CategoryFormData,
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

  // Load categories
  const loadCategories = async () => {
    loading = true
    try {
      const mockResponse: CategoryListResponse = {
        success: true,
        message: 'Ok',
        data: {
          items: [
            {
              id: '35f27c0d-86d5-4e09-b87d-bea6667b01b4',
              name: 'Smart Watch',
              slug: 'smart-watch',
              imageId: null,
              createdAt: '2025-10-25T15:09:42.082279Z',
            },
            {
              id: 'a1b2c3d4-e5f6-4789-abc1-23456789def0',
              name: 'Fashion & Apparel',
              slug: 'fashion-apparel',
              imageId: 'img_123456',
              createdAt: '2025-10-20T10:30:00.000Z',
            },
            {
              id: 'b2c3d4e5-f6a7-5890-bcd2-3456789ef012',
              name: 'Electronics',
              slug: 'electronics',
              imageId: null,
              createdAt: '2025-10-18T14:45:30.000Z',
            },
            {
              id: 'c3d4e5f6-a7b8-6901-cde3-456789f01234',
              name: 'Home & Garden',
              slug: 'home-garden',
              imageId: 'img_789012',
              createdAt: '2025-10-15T09:15:20.000Z',
            },
          ],
          totalItems: 4,
          page: 1,
          pageSize: 10,
          totalPages: 1,
        },
      }

      if (mockResponse.success) {
        categories = mockResponse.data.items.map(transformCategory)
        totalItems = mockResponse.data.totalItems
        currentPage = mockResponse.data.page
        pageSize = mockResponse.data.pageSize
        totalPages = mockResponse.data.totalPages
      } else {
        toast.error('Failed to load categories')
      }
    } catch (error) {
      console.error('Error loading categories:', error)
      toast.error('Failed to load categories')
    } finally {
      loading = false
    }
  }

  // Transform category data for display
  const transformCategory = (category: Category): CategoryDisplay => ({
    ...category,
    hasImage: !!category.imageId,
    formattedDate: new Date(category.createdAt).toLocaleDateString(),
  })

  // Initialize data
  onMount(() => {
    loadCategories()
  })

  // Action handlers
  const handleView = (id: string) => {
    const category = categories.find((c) => c.id === id)
    if (!category) return
    viewingCategory = category
    isViewModalOpen = true
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

  const handleEditSubmit = async (data: CategoryFormData) => {
    if (!editingCategory) return

    submitLoading = true
    try {
      // Update local data
      categories = categories.map((category) =>
        category.id === editingCategory!.id
          ? {
              ...category,
              name: data.name,
              slug: data.slug,
            }
          : category,
      )

      isEditModalOpen = false
      editingCategory = null
      toast.success('Category updated successfully')
    } catch (error) {
      console.error('Error updating category:', error)
      toast.error('Failed to update category')
    } finally {
      submitLoading = false
    }
  }

  const confirmDelete = async () => {
    if (!deletingCategoryId) return

    submitLoading = true
    try {
      categories = categories.filter(
        (category) => category.id !== deletingCategoryId,
      )
      totalItems = Math.max(0, totalItems - 1)

      isDeleteModalOpen = false
      deletingCategoryId = null
      toast.success('Category deleted successfully')
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
    } finally {
      submitLoading = false
    }
  }

  const cancelDelete = () => {
    if (!submitLoading) {
      deletingCategoryId = null
      isDeleteModalOpen = false
    }
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
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  loading={submitLoading}
/>
