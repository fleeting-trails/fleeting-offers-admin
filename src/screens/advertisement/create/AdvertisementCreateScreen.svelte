<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import ImageUploader from '$lib/components/Input/ImageUploader.svelte'
  import {
    createAdvertisement,
    fetchAdvertisementById,
    updateAdvertisement,
    type CreateAdvertisementData,
    type CreateAdvertisementByAdminData,
  } from '$lib/api/advertisement'
  import { fetchCategories } from '$lib/api/category'
  import { fetchIndustries } from '$lib/api/industry'
  import { appStore } from '../../../store/app.store/appStore.svelte'

  // State
  let isEditing = $state(false)
  let editId = $state<string | null>(null)
  let loading = $state(false)
  let loadingData = $state(false)
  let userRole = $state<string>('')
  let activeTab = $state<'basic' | 'dates' | 'categories' | 'images'>('basic')

  // Tab configuration
  const tabs = [
    { id: 'basic' as const, label: 'Basic Information', order: 1 },
    { id: 'dates' as const, label: 'Date Information', order: 2 },
    { id: 'categories' as const, label: 'Categories', order: 3 },
    { id: 'images' as const, label: 'Images', order: 4 },
  ]

  // Form data
  let formData = $state({
    title: '',
    subtitle: '',
    description: '',
    startDate: '',
    expirationDate: '',
    categoryId: '',
    subCategoryId: '',
    coverImage: null as File | null,
    thumbnailImage: null as File | null,
    ownerUserId: '',
  })

  // Form errors
  let errors = $state({
    title: '',
    subtitle: '',
    ownerUserId: '',
  })

  // Image upload state
  let coverImagePreview = $state<string | null>(null)
  let thumbnailImagePreview = $state<string | null>(null)
  let uploadedCoverImageId = $state<string | null>(null)
  let uploadedThumbnailImageId = $state<string | null>(null)

  // Dropdown data
  let categories = $state<any[]>([])
  let industries = $state<any[]>([])

  // Initialize
  onMount(() => {
    userRole = appStore.auth.user?.role || ''
    loadDropdownData()

    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadAdvertisementData(editParam)
    }
  })

  // Load dropdown data
  const loadDropdownData = async () => {
    try {
      const [categoriesResponse, industriesResponse] = await Promise.all([
        fetchCategories(1, 100),
        fetchIndustries(1, 100),
      ])

      categories = categoriesResponse.data.items
      industries = industriesResponse.data.items
    } catch (error) {
      console.error('Error loading dropdown data:', error)
      toast.error('Failed to load form data')
    }
  }

  // Load existing advertisement data for editing
  const loadAdvertisementData = async (id: string) => {
    loadingData = true
    try {
      const advertisement = await fetchAdvertisementById(id)
      formData.title = advertisement.title
      formData.subtitle = advertisement.subtitle
      formData.description = advertisement.description || ''
      formData.startDate = advertisement.startDate || ''
      formData.expirationDate = advertisement.expirationDate || ''
      formData.categoryId = advertisement.categoryId || ''
      formData.subCategoryId = advertisement.subCategoryId || ''

      if (advertisement.coverImageId) {
        uploadedCoverImageId = advertisement.coverImageId
      }
      if (advertisement.thumbnailImageId) {
        uploadedThumbnailImageId = advertisement.thumbnailImageId
      }
    } catch (error) {
      console.error('Error loading advertisement:', error)
      toast.error('Failed to load advertisement data')
      goto('/admin/advertisements/list')
    } finally {
      loadingData = false
    }
  }

  // Validation
  const validateForm = (): boolean => {
    errors.title = ''
    errors.subtitle = ''
    errors.ownerUserId = ''

    let isValid = true

    if (!formData.title.trim()) {
      errors.title = 'Title is required'
      isValid = false
    }

    if (!formData.subtitle.trim()) {
      errors.subtitle = 'Subtitle is required'
      isValid = false
    }

    if (
      (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') &&
      !formData.ownerUserId.trim()
    ) {
      errors.ownerUserId = 'Owner User ID is required'
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
      let payload: CreateAdvertisementData | CreateAdvertisementByAdminData

      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        // Admin payload structure
        payload = {
          advertise: {
            title: formData.title.trim(),
            subtitle: formData.subtitle.trim() || undefined,
            description: formData.description.trim() || undefined,
            startDate: formData.startDate || undefined,
            expirationDate: formData.expirationDate || undefined,
            coverImageId: uploadedCoverImageId || undefined,
            thumbnailImageId: uploadedThumbnailImageId || undefined,
            categoryId: formData.categoryId || undefined,
            subCategoryId: formData.subCategoryId || undefined,
          },
          owners: [
            {
              userId: formData.ownerUserId.trim(),
              ownershipType: 'OWNER' as const,
            },
          ],
        }
      } else {
        // Organization payload structure
        payload = {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim() || undefined,
          description: formData.description.trim() || undefined,
          startDate: formData.startDate || undefined,
          expirationDate: formData.expirationDate || undefined,
          coverImageId: uploadedCoverImageId || undefined,
          thumbnailImageId: uploadedThumbnailImageId || undefined,
          categoryId: formData.categoryId || undefined,
          subCategoryId: formData.subCategoryId || undefined,
        }
      }

      if (isEditing && editId) {
        await updateAdvertisement(editId, payload)
        toast.success('Advertisement updated successfully')
      } else {
        await createAdvertisement(payload)
        toast.success('Advertisement created successfully')
      }

      goto('/admin/advertisements/list')
    } catch (error) {
      console.error('Error saving advertisement:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(
        isEditing
          ? `Failed to update advertisement: ${errorMessage}`
          : `Failed to create advertisement: ${errorMessage}`,
      )
    } finally {
      loading = false
    }
  }

  // Handle cancel
  const handleCancel = () => {
    goto('/admin/advertisements/list')
  }

  // Tab navigation
  const handleTabClick = (tabId: typeof activeTab) => {
    activeTab = tabId
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <!-- Page header -->
  <div class="mb-8">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        {isEditing
          ? 'Update advertisement information'
          : 'Add a new advertisement to your system'}
      </p>
    </div>
  </div>

  <!-- Loading state for data fetch -->
  {#if loadingData}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading advertisement data...</span
      >
    </div>
  {:else}
    <!-- Tab navigation -->
    <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        {#each tabs as tab}
          <button
            type="button"
            onclick={() => handleTabClick(tab.id)}
            class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors {activeTab ===
            tab.id
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300 dark:hover:border-gray-600'}"
          >
            {tab.label}
          </button>
        {/each}
      </nav>
    </div>

    <!-- Form -->
    <form onsubmit={handleSubmit} class="space-y-8">
      <!-- Tab content -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        {#if activeTab === 'basic'}
          <!-- Basic Information -->
          <h2
            class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
          >
            Basic Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Title -->
            <div>
              <label
                for="title"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Title *
              </label>
              <input
                id="title"
                type="text"
                bind:value={formData.title}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50 {errors.title
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'}"
                placeholder="Enter advertisement title"
              />
              {#if errors.title}
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.title}
                </p>
              {/if}
            </div>

            <!-- Subtitle -->
            <div>
              <label
                for="subtitle"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Subtitle *
              </label>
              <input
                id="subtitle"
                type="text"
                bind:value={formData.subtitle}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50 {errors.subtitle
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'}"
                placeholder="Enter advertisement subtitle"
              />
              {#if errors.subtitle}
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.subtitle}
                </p>
              {/if}
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <label
              for="description"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              bind:value={formData.description}
              disabled={loading || loadingData}
              rows="4"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
              placeholder="Enter advertisement description"
            ></textarea>
          </div>

          <!-- Admin-specific fields -->
          {#if userRole === 'ADMIN' || userRole === 'SUPER_ADMIN'}
            <div class="mt-6">
              <label
                for="ownerUserId"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Owner User ID *
              </label>
              <input
                id="ownerUserId"
                type="text"
                bind:value={formData.ownerUserId}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50 {errors.ownerUserId
                  ? 'border-red-500 dark:border-red-400'
                  : 'border-gray-300 dark:border-gray-600'}"
                placeholder="Enter owner user ID"
              />
              {#if errors.ownerUserId}
                <p class="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.ownerUserId}
                </p>
              {/if}
            </div>
          {/if}
        {:else if activeTab === 'dates'}
          <!-- Date Information -->
          <h2
            class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
          >
            Date Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Start Date -->
            <div>
              <label
                for="startDate"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Start Date
              </label>
              <input
                id="startDate"
                type="datetime-local"
                bind:value={formData.startDate}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
              />
            </div>

            <!-- Expiration Date -->
            <div>
              <label
                for="expirationDate"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Expiration Date
              </label>
              <input
                id="expirationDate"
                type="datetime-local"
                bind:value={formData.expirationDate}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
              />
            </div>
          </div>
        {:else if activeTab === 'categories'}
          <!-- Category Information -->
          <h2
            class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
          >
            Category Information
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Category -->
            <div>
              <label
                for="categoryId"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Category
              </label>
              <select
                id="categoryId"
                bind:value={formData.categoryId}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
              >
                <option value="">Select a category</option>
                {#each categories as category}
                  <option value={category.id}>{category.name}</option>
                {/each}
              </select>
            </div>

            <!-- Subcategory (Industry) -->
            <div>
              <label
                for="subCategoryId"
                class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
              >
                Subcategory
              </label>
              <select
                id="subCategoryId"
                bind:value={formData.subCategoryId}
                disabled={loading || loadingData}
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
              >
                <option value="">Select a subcategory</option>
                {#each industries as industry}
                  <option value={industry.id}>{industry.name}</option>
                {/each}
              </select>
            </div>
          </div>
        {:else if activeTab === 'images'}
          <!-- Images -->
          <h2
            class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
          >
            Images
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cover Image -->
            <div>
              <h3
                class="text-md font-medium text-text-primary dark:text-text-primary-dark mb-4"
              >
                Cover Image
              </h3>
              <ImageUploader
                bind:value={formData.coverImage}
                bind:preview={coverImagePreview}
                bind:uploadedFileId={uploadedCoverImageId}
                disabled={loading || loadingData}
                label="Upload Cover Image"
              />
            </div>

            <!-- Thumbnail Image -->
            <div>
              <h3
                class="text-md font-medium text-text-primary dark:text-text-primary-dark mb-4"
              >
                Thumbnail Image
              </h3>
              <ImageUploader
                bind:value={formData.thumbnailImage}
                bind:preview={thumbnailImagePreview}
                bind:uploadedFileId={uploadedThumbnailImageId}
                disabled={loading || loadingData}
                label="Upload Thumbnail Image"
              />
            </div>
          </div>
        {/if}

        <!-- Form Actions -->
        <div
          class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600"
        >
          <div class="flex gap-4">
            <button
              type="button"
              onclick={handleCancel}
              disabled={loading || loadingData}
              class="px-6 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <ButtonGradient type="submit" disabled={loading || loadingData}>
              {#if loading}
                <div class="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
                </div>
              {:else}
                {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
              {/if}
            </ButtonGradient>
          </div>
        </div>
      </div>
    </form>
  {/if}
</div>
