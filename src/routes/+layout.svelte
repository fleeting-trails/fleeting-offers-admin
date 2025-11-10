<script lang="ts">
  import { onMount } from 'svelte'
  import { initializeAuthState } from '$lib/api/auth'
  import { appStore } from '../store/app.store/appStore.svelte'
  import { toast } from 'svelte-sonner'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  let { children } = $props()
  import '../global.css'
  import '../tailwind.css'
  import ToastProvider from '$lib/components/Toast/ToastProvider.svelte'

  let isInitializing = $state(true)

  // Initialize auth state when app loads
  onMount(async () => {
    try {
      // Quick check - if user is already logged in, don't show loading
      if (appStore.auth.isLoggedIn) {
        isInitializing = false
        return
      }

      await initializeAuthState()
    } catch (error: any) {
      console.error('Auth initialization failed:', error)
      // Don't show toast for normal "no token" cases, only for actual errors
      if (error?.message !== 'No token found') {
        toast.error('Session validation failed. Please log in again.')
      }
    } finally {
      isInitializing = false
    }
  })
</script>

{#if isInitializing}
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <LoadingSpinner />
      <p class="mt-4 text-gray-600">Initializing...</p>
    </div>
  </div>
{:else}
  {@render children()}
{/if}

<ToastProvider />
