<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import ImageUploader from '$lib/components/Input/ImageUploader.svelte'
  import type { CategoryDisplay } from '$lib/types/category'

  let {
    isOpen = $bindable(false),
    category = null,
    loading = false,
    onSubmit = (data: { name: string; imageId?: string }) => {},
  }: {
    isOpen: boolean
    category: CategoryDisplay | null
    loading?: boolean
    onSubmit: (data: { name: string; imageId?: string }) => void
  } = $props()

  // Form state
  let formData = $state({
    name: '',
    image: null as File | null,
  })

  // Image preview and upload state
  let imagePreview = $state<string | null>(null)
  let uploadedFileId = $state<string | null>(null)

  // Form errors
  let errors = $state({
    name: '',
  })

  // Update form when category changes
  $effect(() => {
    if (category) {
      formData.name = category.name
      formData.image = null
      imagePreview = null
      uploadedFileId = null
      errors.name = ''
    }
  })

  const handleClose = () => {
    if (!loading) {
      isOpen = false
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

  const handleSubmit = (e: Event) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      name: formData.name.trim(),
      ...(uploadedFileId && { imageId: uploadedFileId }),
    })
  }
</script>

<Modal bind:isOpen title="Edit Category">
  {#if category}
    <form onsubmit={handleSubmit} class="space-y-6">
      <!-- Category Name -->
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
          disabled={loading}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
          placeholder="Enter category name"
        />
        {#if errors.name}
          <p class="text-red-500 text-sm mt-1">{errors.name}</p>
        {/if}
      </div>

      <!-- Image Upload -->
      <ImageUploader
        bind:value={formData.image}
        bind:preview={imagePreview}
        bind:uploadedFileId
        disabled={loading}
        label="Category Image"
        description="Upload an image for the category"
      />

      <!-- Form Actions -->
      <div
        class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600"
      >
        <ButtonPrimary type="button" onclick={handleClose} disabled={loading}>
          Cancel
        </ButtonPrimary>
        <ButtonGradient type="submit" disabled={loading}>
          {#if loading}
            <div class="flex items-center gap-2">
              <LoadingSpinner size="sm" />
              <span>Updating...</span>
            </div>
          {:else}
            Update Category
          {/if}
        </ButtonGradient>
      </div>
    </form>
  {:else}
    <div class="py-8 text-center">
      <p class="text-text-light dark:text-text-light-dark">
        No category selected
      </p>
    </div>
  {/if}
</Modal>
