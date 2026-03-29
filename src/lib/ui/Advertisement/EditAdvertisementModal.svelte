<script lang="ts">
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import ImageUploader from '$lib/components/Input/ImageUploader.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'
  import {
    updateAdvertisement,
    type CreateAdvertisementData,
    type CreateAdvertisementByAdminData,
  } from '$lib/api/advertisement'
  import { fetchCategories } from '$lib/api/category'
  import { fetchIndustries } from '$lib/api/industry'
  import { appStore } from '../../../store/app.store/appStore.svelte'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'

  let {
    isOpen = $bindable(),
    onSuccess,
    advertisement,
  }: {
    isOpen: boolean
    onSuccess: () => void
    advertisement: AdvertisementDisplay | null
  } = $props()

  // State
  let loading = $state(false)
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

  // Initialize user role and load data when modal opens
  $effect(() => {
    if (isOpen) {
      userRole = appStore.auth.user?.role || ''
      loadDropdownData()
      resetForm()
    }
  })

  // Update form when advertisement changes
  $effect(() => {
    if (advertisement && isOpen) {
      formData.title = advertisement.title
      formData.subtitle = advertisement.subtitle
      formData.description = advertisement.description
      formData.startDate = formatDateFromAPI(advertisement.startDate || '')
      formData.expirationDate = formatDateFromAPI(
        advertisement.expirationDate || '',
      )
      formData.categoryId = advertisement.categoryId || ''
      formData.subCategoryId = advertisement.subCategoryId || ''

      // Set image IDs if they exist
      uploadedCoverImageId = advertisement.coverImageId || null
      uploadedThumbnailImageId = advertisement.thumbnailImageId || null

      // Reset form values
      formData.coverImage = null
      formData.thumbnailImage = null
      coverImagePreview = null
      thumbnailImagePreview = null

      // Reset owner field for admin users
      formData.ownerUserId = ''
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

  // Format date from API to datetime-local input format
  const formatDateFromAPI = (dateString: string): string => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''

      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}`
    } catch (error) {
      console.error('Error formatting date from API:', error)
      return ''
    }
  }

  // Format date to required format: 0001-01-01T00:00:00
  const formatDateForAPI = (dateString: string): string | undefined => {
    if (!dateString) return undefined

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return undefined

      const year = date.getFullYear().toString().padStart(4, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = date.getSeconds().toString().padStart(2, '0')

      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    } catch (error) {
      console.error('Error formatting date:', error)
      return undefined
    }
  }

  // Reset form
  const resetForm = () => {
    formData = {
      title: '',
      subtitle: '',
      description: '',
      startDate: '',
      expirationDate: '',
      categoryId: '',
      subCategoryId: '',
      coverImage: null,
      thumbnailImage: null,
      ownerUserId: '',
    }
    errors = {
      title: '',
      subtitle: '',
      ownerUserId: '',
    }
    coverImagePreview = null
    thumbnailImagePreview = null
    uploadedCoverImageId = null
    uploadedThumbnailImageId = null
    activeTab = 'basic'
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

  // Handle form submission
  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    if (!validateForm() || !advertisement) {
      toast.error('Please fix the errors before submitting')
      return
    }

    loading = true
    try {
      let payload: CreateAdvertisementData | CreateAdvertisementByAdminData

      const formattedStartDate = formatDateForAPI(formData.startDate)
      const formattedExpirationDate = formatDateForAPI(formData.expirationDate)

      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        payload = {
          advertise: {
            title: formData.title.trim(),
            subtitle: formData.subtitle.trim() || undefined,
            description: formData.description.trim() || undefined,
            startDate: formattedStartDate,
            expirationDate: formattedExpirationDate,
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
        payload = {
          title: formData.title.trim(),
          subtitle: formData.subtitle.trim() || undefined,
          description: formData.description.trim() || undefined,
          startDate: formattedStartDate,
          expirationDate: formattedExpirationDate,
          coverImageId: uploadedCoverImageId || undefined,
          thumbnailImageId: uploadedThumbnailImageId || undefined,
          categoryId: formData.categoryId || undefined,
          subCategoryId: formData.subCategoryId || undefined,
        }
      }

      await updateAdvertisement(advertisement.id, payload)
      toast.success('Advertisement updated successfully')
      isOpen = false
      onSuccess()
    } catch (error) {
      console.error('Error updating advertisement:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(`Failed to update advertisement: ${errorMessage}`)
    } finally {
      loading = false
    }
  }

  // Handle cancel
  const handleClose = () => {
    isOpen = false
  }

  // Tab navigation
  const handleTabClick = (tabId: typeof activeTab) => {
    activeTab = tabId
  }
</script>

<Modal bind:isOpen title="Edit Advertisement" maxWidth="2xl">
  {#snippet children()}
    {#if advertisement}
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
      <form onsubmit={handleSubmit} class="space-y-6">
        <!-- Tab content -->
        <div class="min-h-[400px]">
          {#if activeTab === 'basic'}
            <!-- Basic Information -->
            <h3
              class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
            >
              Basic Information
            </h3>

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
                  disabled={loading}
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
                  disabled={loading}
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
                disabled={loading}
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
                  disabled={loading}
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
            <h3
              class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
            >
              Date Information
            </h3>

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
                  disabled={loading}
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
                  disabled={loading}
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
                />
              </div>
            </div>
          {:else if activeTab === 'categories'}
            <!-- Category Information -->
            <h3
              class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
            >
              Category Information
            </h3>

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
                  disabled={loading}
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
                  disabled={loading}
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
            <h3
              class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
            >
              Images
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Cover Image -->
              <div>
                <h4
                  class="text-md font-medium text-text-primary dark:text-text-primary-dark mb-4"
                >
                  Cover Image
                </h4>
                <ImageUploader
                  bind:value={formData.coverImage}
                  bind:preview={coverImagePreview}
                  bind:uploadedFileId={uploadedCoverImageId}
                  disabled={loading}
                  label="Upload Cover Image"
                />
              </div>

              <!-- Thumbnail Image -->
              <div>
                <h4
                  class="text-md font-medium text-text-primary dark:text-text-primary-dark mb-4"
                >
                  Thumbnail Image
                </h4>
                <ImageUploader
                  bind:value={formData.thumbnailImage}
                  bind:preview={thumbnailImagePreview}
                  bind:uploadedFileId={uploadedThumbnailImageId}
                  disabled={loading}
                  label="Upload Thumbnail Image"
                />
              </div>
            </div>
          {/if}
        </div>

        <!-- Actions -->
        <div
          class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-600"
        >
          <button
            type="button"
            onclick={handleClose}
            disabled={loading}
            class="px-6 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors disabled:opacity-50"
          >
            Cancel
          </button>

          <ButtonGradient type="submit" disabled={loading}>
            {#if loading}
              <div class="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>Updating...</span>
              </div>
            {:else}
              Update Advertisement
            {/if}
          </ButtonGradient>
        </div>
      </form>
    {/if}
  {/snippet}
</Modal>
