<script lang="ts">
  // Props
  let {
    isOpen = $bindable(false),
    title = 'Confirm Delete',
    message = 'Are you sure you want to delete this item? This action cannot be undone.',
    onConfirm = () => {},
    onCancel = () => {},
    confirmText = 'Delete',
    cancelText = 'Cancel',
    loading = false,
  }: {
    isOpen: boolean
    title?: string
    message?: string
    onConfirm: () => void
    onCancel?: () => void
    confirmText?: string
    cancelText?: string
    loading?: boolean
  } = $props()

  // Handle cancel
  const handleCancel = () => {
    if (loading) return
    onCancel?.()
    isOpen = false
  }

  // Handle confirm
  const handleConfirm = () => {
    if (loading) return
    onConfirm()
  }

  // Handle backdrop click
  const handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  // Handle escape key
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }
</script>

{#if isOpen}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3
        class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4"
      >
        {title}
      </h3>
      <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
        {message}
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          onclick={handleCancel}
          disabled={loading}
          class="px-4 py-2 text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onclick={handleConfirm}
          disabled={loading}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {#if loading}
            <div
              class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
            ></div>
          {/if}
          {confirmText}
        </button>
      </div>
    </div>
  </div>
{/if}
