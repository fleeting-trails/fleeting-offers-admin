<script lang="ts">
  import { page } from '$app/stores'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import { goto } from '$app/navigation'
  import { isLoggedIn } from '$lib/api/auth'

  // Get error details safely
  $: status = $page.status || 404
  $: message = $page.error?.message || 'An unexpected error occurred'

  // Navigation handlers
  const handleGoHome = () => {
    if (isLoggedIn()) {
      goto('/admin')
    } else {
      goto('/login')
    }
  }
  const handleGoBack = () => window.history.back()

  // Error type handling
  const getErrorTitle = (status: number) => {
    switch (status) {
      case 404:
        return 'Page Not Found'
      case 403:
        return 'Access Forbidden'
      case 500:
        return 'Server Error'
      default:
        return 'Error'
    }
  }

  $: getErrorDescription = (status: number) => {
    switch (status) {
      case 404:
        return "The page you're looking for doesn't exist or has been moved."
      case 403:
        return "You don't have permission to access this resource."
      case 500:
        return 'Something went wrong on our end. Please try again later.'
      default:
        return message
    }
  }
</script>

<div
  class="min-h-screen bg-background dark:bg-background-dark flex items-center justify-center px-4"
>
  <div class="max-w-md w-full text-center">
    <!-- Error illustration -->
    <div class="mb-8">
      <div
        class="w-32 h-32 mx-auto bg-gradient-to-br from-primary/20 to-primary/5 dark:from-primary-dark/20 dark:to-primary-dark/5 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-16 h-16 text-text-light dark:text-text-light-dark"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {#if status === 404}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-3-9a9 9 0 110 18 9 9 0 010-18z"
            />
          {:else if status === 403}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          {:else}
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          {/if}
        </svg>
      </div>
    </div>

    <!-- Error code -->
    <div class="mb-4">
      <h1 class="text-6xl font-bold text-primary dark:text-primary-dark mb-2">
        {status}
      </h1>
    </div>

    <!-- Error title -->
    <div class="mb-4">
      <h2 class="text-2xl font-semibold text-text dark:text-text-dark mb-2">
        {getErrorTitle(status)}
      </h2>
    </div>

    <!-- Error description -->
    <div class="mb-8">
      <Text
        variant="p"
        class="text-text-secondary dark:text-text-secondary-dark leading-relaxed"
      >
        {getErrorDescription(status)}
      </Text>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <ButtonPrimary onclick={handleGoHome} class="min-w-[120px]">
        Go Home
      </ButtonPrimary>

      <button
        onclick={handleGoBack}
        class="px-6 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors min-w-[120px]"
      >
        Go Back
      </button>
    </div>

    <!-- Additional help for 404 -->
    {#if status === 404}
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Text
          variant="p"
          class="text-sm text-text-light dark:text-text-light-dark mb-3"
        >
          Looking for something specific?
        </Text>

        <div class="flex flex-col gap-2 text-sm">
          <a
            href="/admin"
            class="text-primary dark:text-primary-dark hover:underline"
          >
            Dashboard
          </a>
          <a
            href="/admin/categories/list"
            class="text-primary dark:text-primary-dark hover:underline"
          >
            Categories
          </a>
          <a
            href="/admin/industries/list"
            class="text-primary dark:text-primary-dark hover:underline"
          >
            Industries
          </a>
        </div>
      </div>
    {/if}
  </div>
</div>
