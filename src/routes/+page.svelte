<script>
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { isLoggedIn } from '$lib/api/auth'

  onMount(() => {
    // Redirect based on auth status
    if (isLoggedIn()) {
      goto('/admin', { replaceState: true })
    } else {
      goto('/login', { replaceState: true })
    }
  })
</script>

<div class="p-6 h-full flex items-center justify-center">
  <div class="text-center">
    <p class="text-text-secondary dark:text-text-secondary-dark">
      Redirecting...
    </p>
  </div>
</div>
