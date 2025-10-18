<script lang="ts">
  // Props
  let {
    size = 'md',
    variant = 'primary',
    class: className = '',
  }: {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    variant?: 'primary' | 'secondary' | 'white'
    class?: string
  } = $props()

  // Size classes
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  }

  // Variant classes
  const variantClasses = {
    primary:
      'border-primary dark:border-primary-dark border-t-transparent dark:border-t-transparent',
    secondary:
      'border-text-light dark:border-text-light-dark border-t-transparent dark:border-t-transparent',
    white: 'border-white border-t-transparent',
  }
</script>

<div
  class="inline-block animate-spin rounded-full border-2 {sizeClasses[
    size
  ]} {variantClasses[variant]} {className}"
  role="status"
  aria-label="Loading"
>
  <span class="sr-only">Loading...</span>
</div>
