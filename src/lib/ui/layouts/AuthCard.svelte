<!-- Auth Card Wrapper -->
<script lang="ts">
  export let maxWidth: 'sm' | 'md' | 'lg' | 'xl' = 'md'

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  }
</script>

<div
  class="relative bg-gradient-to-b from-background-toned-1/95 dark:from-background-toned-1-dark/95 to-background-toned-0/95 dark:to-background-toned-0-dark/95 backdrop-blur-sm rounded-xl shadow-2xl border border-background-pure/20 dark:border-background-pure-dark/20 overflow-hidden {widthClasses[
    maxWidth
  ]} w-full"
>
  <div class="px-8 py-12">
    <slot />
  </div>
</div>
