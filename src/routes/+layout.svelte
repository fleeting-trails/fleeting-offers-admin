<script>
  let { children } = $props()
  import '../global.css'
  import '../tailwind.css'
  import ToastProvider from '$lib/components/Toast/ToastProvider.svelte'
</script>

{@render children()}
<ToastProvider />
