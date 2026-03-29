<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'

  onMount(() => {
    // Redirect to the list page
    goto('/admin/advertisements/list', { replaceState: true })
  })
</script>

<div class="p-6 h-full flex items-center justify-center">
  <div class="text-center">
    <p class="text-text-secondary dark:text-text-secondary-dark">
      Redirecting to advertisements list...
    </p>
  </div>
</div>
