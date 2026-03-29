<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import ImageUploader from '$lib/components/Input/ImageUploader.svelte'
  import {
    fetchIndustryById,
    createIndustry,
    updateIndustry,
  } from '$lib/api/industry'

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
      loadIndustryData(editParam)
    }
  })

  // Load existing industry data for editing
  const loadIndustryData = async (id: string) => {
    loadingData = true
    try {
      const industry = await fetchIndustryById(id)
      formData.name = industry.name

      // Handle existing image if present
      if (industry.imageId) {
        console.log('Industry has existing image:', industry.imageId)
      }
    } catch (error) {
      console.error('Error loading industry:', error)
      toast.error('Failed to load industry data')
      goto('/admin/industries/list')
    } finally {
      loadingData = false
    }
  }

  // Validation
  const validateForm = (): boolean => {
    errors.name = ''

    let isValid = true

    if (!formData.name.trim()) {
      errors.name = 'Industry name is required'
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
        await updateIndustry(editId, apiData)
        toast.success('Industry updated successfully')
      } else {
        await createIndustry(apiData)
        toast.success('Industry created successfully')
      }

      goto('/admin/industries/list')
    } catch (error) {
      console.error('Error saving industry:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(
        isEditing
          ? `Failed to update industry: ${errorMessage}`
          : `Failed to create industry: ${errorMessage}`,
      )
    } finally {
      loading = false
    }
  }

  // Handle cancel
  const handleCancel = () => {
    goto('/admin/industries/list')
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <!-- Page header -->
  <div class="mb-8">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        {isEditing ? 'Edit Industry' : 'Create New Industry'}
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        {isEditing
          ? 'Update industry information'
          : 'Add a new industry to your system'}
      </p>
    </div>
  </div>

  <!-- Loading state for data fetch -->
  {#if loadingData}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading industry data...</span
      >
    </div>
  {:else}
    <!-- Form -->
    <form onsubmit={handleSubmit} class="space-y-8">
      <!-- Basic Information -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2
          class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
        >
          Basic Information
        </h2>

        <!-- Industry Name -->
        <div>
          <label
            for="name"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Industry Name *
          </label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            disabled={loading || loadingData}
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50 {errors.name
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600'}"
            placeholder="Enter industry name"
          />
          {#if errors.name}
            <p class="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          {/if}
        </div>
      </div>

      <!-- Image Upload -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2
          class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
        >
          Industry Image
        </h2>

        <ImageUploader
          bind:value={formData.image}
          bind:preview={imagePreview}
          bind:uploadedFileId
          disabled={loading || loadingData}
          label="Upload Industry Image"
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
            {isEditing ? 'Update Industry' : 'Create Industry'}
          {/if}
        </ButtonGradient>
      </div>
    </form>
  {/if}
</div>
