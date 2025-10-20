<script lang="ts">
  let { children } = $props()
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { isLoggedIn } from '$lib/api/auth'

  // Auth guard - redirect logged in users away from auth pages
  let authChecked = $state(false)
  let isAuthenticated = $state(false)

  onMount(() => {
    if (browser) {
      isAuthenticated = isLoggedIn()

      if (isAuthenticated) {
        goto('/admin')
        return
      }

      authChecked = true
    }
  })
</script>

{#if authChecked && !isAuthenticated}
  {@render children()}
{:else if authChecked}
  <!-- This will only show briefly before redirect -->
  <div class="flex items-center justify-center h-screen">
    <p>Redirecting to admin...</p>
  </div>
{/if}
