<script lang="ts">
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import { uploadFile, type UploadedFile } from '$lib/api/upload'

  let {
    value = $bindable(null),
    preview = $bindable(null),
    uploadedFileId = $bindable(null),
    disabled = false,
    label = 'Upload Image',
    description = 'PNG, JPG, GIF up to 5MB',
    maxSize = 5 * 1024 * 1024, // 5MB
    acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'],
  }: {
    value: File | null
    preview: string | null
    uploadedFileId: string | null
    disabled?: boolean
    label?: string
    description?: string
    maxSize?: number
    acceptedTypes?: string[]
  } = $props()

  let fileInput: HTMLInputElement
  let uploading = $state(false)

  // Handle file selection and upload
  const handleFileSelect = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (!file) return

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error('Please select a valid image file (PNG, JPG, GIF)')
      return
    }

    // Validate file size
    if (file.size > maxSize) {
      toast.error(
        `Image size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
      )
      return
    }

    value = file

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      preview = e.target?.result as string
    }
    reader.readAsDataURL(file)

    // Upload file automatically
    await uploadFileToServer(file)
  }

  // Upload file to server
  const uploadFileToServer = async (file: File) => {
    uploading = true
    try {
      const uploadedFile = await uploadFile(file)
      uploadedFileId = uploadedFile.id
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Upload failed')
      // Reset on upload failure
      removeFile()
    } finally {
      uploading = false
    }
  }

  // Remove selected file
  const removeFile = () => {
    value = null
    preview = null
    uploadedFileId = null
    if (fileInput) fileInput.value = ''
  }

  // Trigger file input
  const triggerFileInput = () => {
    if (!disabled && !uploading) {
      fileInput?.click()
    }
  }
</script>

<div class="space-y-4">
  {#if preview}
    <!-- Image Preview -->
    <div class="relative inline-block">
      <img
        src={preview}
        alt="Upload preview"
        class="w-32 h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 {uploading
          ? 'opacity-50'
          : ''}"
      />

      {#if uploading}
        <!-- Upload Loading Overlay -->
        <div
          class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg"
        >
          <LoadingSpinner size="sm" />
        </div>
      {:else}
        <!-- Remove Button -->
        <button
          type="button"
          onclick={removeFile}
          {disabled}
          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Remove image"
        >
          ×
        </button>
      {/if}

      {#if uploadedFileId}
        <!-- Upload Success Indicator -->
        <div
          class="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs"
        >
          ✓
        </div>
      {/if}
    </div>
  {:else}
    <!-- Upload Area -->
    <div
      class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-500 dark:hover:border-primary-400 transition-colors cursor-pointer {disabled ||
      uploading
        ? 'opacity-50 cursor-not-allowed'
        : ''}"
      onclick={triggerFileInput}
      role="button"
      tabindex={disabled || uploading ? -1 : 0}
      onkeydown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled && !uploading) {
          e.preventDefault()
          triggerFileInput()
        }
      }}
    >
      <div class="flex flex-col items-center">
        {#if uploading}
          <LoadingSpinner size="lg" />
          <h3
            class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2 mt-4"
          >
            Uploading...
          </h3>
          <p class="text-text-secondary dark:text-text-secondary-dark mb-4">
            Please wait while we upload your image
          </p>
        {:else}
          <svg
            class="w-12 h-12 text-gray-400 dark:text-gray-500 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <h3
            class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            {label}
          </h3>
          <p class="text-text-secondary dark:text-text-secondary-dark mb-4">
            {description}
          </p>
          <ButtonGradient type="button" disabled={disabled || uploading}
            >Choose File</ButtonGradient
          >
        {/if}
      </div>
    </div>
  {/if}

  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    accept={acceptedTypes.join(',')}
    onchange={handleFileSelect}
    disabled={disabled || uploading}
    class="hidden"
    aria-label="File input"
  />

  <p class="text-xs text-text-light dark:text-text-light-dark">
    {#if uploading}
      Uploading image to server...
    {:else if uploadedFileId}
      ✓ Image uploaded successfully and ready to use
    {:else}
      Optional: Add an image to represent this industry. Recommended size:
      300x300px.
    {/if}
  </p>
</div>
