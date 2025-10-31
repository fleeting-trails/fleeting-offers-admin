<script>
  import { onMount } from 'svelte'
  import { initializeAuthState } from '$lib/api/auth'
  let { children } = $props()
  import '../global.css'
  import '../tailwind.css'
  import ToastProvider from '$lib/components/Toast/ToastProvider.svelte'

  // Initialize auth state when app loads
  onMount(() => {
    initializeAuthState()
  })
</script>

{@render children()}
<ToastProvider />
