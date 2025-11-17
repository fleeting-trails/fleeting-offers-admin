<script lang="ts">
  import { goto } from '$app/navigation'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import { isLoggedIn } from '$lib/api/auth'

  const handleGoHome = () => {
    if (isLoggedIn()) {
      goto('/admin')
    } else {
      goto('/login')
    }
  }
</script>

<div
  class="h-full pt-16 bg-background dark:bg-background-dark flex items-center justify-center px-4"
>
  <div class="max-w-md w-full text-center">
    <!-- Access denied illustration -->
    <div class="mb-8">
      <div
        class="w-32 h-32 mx-auto bg-gradient-to-br from-red-500/20 to-red-500/5 dark:from-red-400/20 dark:to-red-400/5 rounded-full flex items-center justify-center"
      >
        <svg
          class="w-16 h-16 text-red-500 dark:text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
    </div>

    <!-- Error title -->
    <div class="mb-4">
      <h1 class="text-3xl font-bold text-text dark:text-text-dark mb-2">
        Access Denied
      </h1>
    </div>

    <!-- Error description -->
    <div class="mb-8">
      <p
        class="text-text-secondary dark:text-text-secondary-dark leading-relaxed"
      >
        You don't have permission to access this page. Please contact your
        administrator if you believe this is an error.
      </p>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col sm:flex-row gap-3 justify-center">
      <ButtonPrimary on:click={handleGoHome} class="min-w-[120px]">
        Go Home
      </ButtonPrimary>
    </div>
  </div>
</div>
