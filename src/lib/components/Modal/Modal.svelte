<script lang="ts">
  let {
    isOpen = $bindable(false),
    title = '',
    maxWidth = 'md',
    children,
  } = $props()

  const widthClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }

  const handleBackdropClick = () => {
    isOpen = false
  }

  const handleModalClick = (e: MouseEvent) => {
    e.stopPropagation()
  }
</script>

{#if isOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-background-inverse/40 dark:bg-background-inverse-dark/60 backdrop-blur-sm"
    onclick={handleBackdropClick}
    role="presentation"
  >
    <div
      class="relative bg-gradient-to-b from-background-toned-1/98 dark:from-background-toned-1-dark/98 to-background-toned-0/98 dark:to-background-toned-0-dark/98 backdrop-blur-sm rounded-xl shadow-2xl border border-background-pure/20 dark:border-background-pure-dark/20 overflow-hidden {widthClasses[
        maxWidth
      ]} w-full m-4 transform transition-all"
      onclick={handleModalClick}
      role="dialog"
      aria-modal="true"
      tabindex="-1"
    >
      <!-- Header -->
      <div
        class="px-6 py-4 border-b border-background-toned-2 dark:border-background-toned-2-dark"
      >
        <div class="flex items-center justify-between">
          <h2
            class="text-xl font-semibold text-text-primary dark:text-text-primary-dark"
          >
            {title}
          </h2>
          <button
            type="button"
            onclick={handleBackdropClick}
            class="text-text-light cursor-pointer dark:text-text-light-dark hover:text-text dark:hover:text-text-dark transition-colors"
            aria-label="Close modal"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 py-6">
        {@render children()}
      </div>
    </div>
  </div>
{/if}
