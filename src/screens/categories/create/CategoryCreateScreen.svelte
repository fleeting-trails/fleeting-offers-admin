<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import ImageUploader from '$lib/components/Input/ImageUploader.svelte'
  import {
    fetchCategoryById,
    createCategory,
    updateCategory,
  } from '$lib/api/category'

  // State
  let isEditing = $state(false)
  let editId = $state<string | null>(null)
  let loading = $state(false)
  let loadingData = $state(false)

  // Form data
  let formData = $state({
    name: '',
    image: null as File | null,
  })

  // Form errors
  let errors = $state({
    name: '',
  })

  // Image preview and upload state
  let imagePreview = $state<string | null>(null)
  let uploadedFileId = $state<string | null>(null)

  // Initialize editing mode
  onMount(() => {
    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadCategoryData(editParam)
    }
  })

  // Load existing category data for editing
  const loadCategoryData = async (id: string) => {
    loadingData = true
    try {
      const category = await fetchCategoryById(id)
      formData.name = category.name

      // Handle existing image if present
      if (category.imageId) {
        console.log('Category has existing image:', category.imageId)
      }
    } catch (error) {
      console.error('Error loading category:', error)
      toast.error('Failed to load category data')
      goto('/admin/categories/list')
    } finally {
      loadingData = false
    }
  }

  // Validation
  const validateForm = (): boolean => {
    errors.name = ''

    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'Category name is required'
      isValid = false
    }

    return isValid
  }

  // Submit form
  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    loading = true
    try {
      const apiData = {
        name: formData.name.trim(),
        ...(uploadedFileId && { imageId: uploadedFileId }),
      }

      if (isEditing && editId) {
        await updateCategory(editId, apiData)
        toast.success('Category updated successfully')
      } else {
        await createCategory(apiData)
        toast.success('Category created successfully')
      }

      goto('/admin/categories/list')
    } catch (error) {
      console.error('Error saving category:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(
        isEditing
          ? `Failed to update category: ${errorMessage}`
          : `Failed to create category: ${errorMessage}`,
      )
    } finally {
      loading = false
    }
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <!-- Page header -->
  <div class="mb-8">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        {isEditing ? 'Edit Category' : 'Create New Category'}
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        {isEditing
          ? 'Update category information'
          : 'Add a new category to your system'}
      </p>
    </div>
  </div>

  <!-- Loading state for data fetch -->
  {#if loadingData}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading category data...</span
      >
    </div>
  {:else}
    <form onsubmit={handleSubmit} class="space-y-8">
      <!-- Category Name -->
      <div>
        <h2
          class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
        >
          Category Information
        </h2>

        <div>
          <label
            for="name"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Category Name *
          </label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            required
            disabled={loading || loadingData}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
            placeholder="Enter category name"
          />
          {#if errors.name}
            <p class="text-red-500 text-sm mt-1">{errors.name}</p>
          {/if}
        </div>
      </div>

      <!-- Category Image -->
      <div>
        <h2
          class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
        >
          Category Image
        </h2>

        <ImageUploader
          bind:value={formData.image}
          bind:preview={imagePreview}
          bind:uploadedFileId
          disabled={loading || loadingData}
          label="Upload Category Image"
        />
      </div>

      <!-- Form Actions -->
      <div
        class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600"
      >
        <ButtonGradient type="submit" disabled={loading || loadingData}>
          {#if loading}
            <div class="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
            </div>
          {:else}
            {isEditing ? 'Update Category' : 'Create Category'}
          {/if}
        </ButtonGradient>
      </div>
    </form>
  {/if}
</div>
