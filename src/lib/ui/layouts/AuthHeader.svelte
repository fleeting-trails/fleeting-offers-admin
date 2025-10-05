<!-- Auth Header Component -->
<script lang="ts">
  import Text from '$lib/ui/typography/Text/Text.svelte'

  export let title: string
  export let description: string
</script>

<div class="text-center mb-8">
  <img src="/logo.jpg" alt="Logo" class="w-16 h-16 mx-auto mb-4 rounded-lg" />
  <h1
    class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2"
  >
    {title}
  </h1>
  <Text>{description}</Text>
</div>
