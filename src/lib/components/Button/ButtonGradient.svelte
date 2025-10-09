<script lang="ts">
  let {
    type = 'button' as 'button' | 'submit' | 'reset',
    disabled = false,
    size = 'md' as 'sm' | 'md' | 'lg',
    variant = 'primary' as 'primary' | 'secondary',
    children,
    ...props
  } = $props()

  const sizeClasses: Record<string, string> = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-3 px-6 text-base',
    lg: 'py-4 px-8 text-lg',
  }

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark'
      case 'secondary':
        return 'bg-background-toned-2 hover:bg-background-toned-3 dark:bg-background-toned-2-dark dark:hover:bg-background-toned-3-dark text-text dark:text-text-dark'
      default:
        return 'bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark'
    }
  }

  const baseClasses =
    'relative cursor-pointer font-semibold rounded-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl group overflow-hidden'
  const disabledClasses =
    'disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100'
  const textColor = variant === 'secondary' ? '' : 'text-white'
</script>

<button
  {type}
  {disabled}
  class="{baseClasses} {sizeClasses[size]} {getVariantClasses(
    variant,
  )} {textColor} {disabledClasses}"
  {...props}
>
  {#if variant === 'primary'}
    <div
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
    ></div>
  {/if}
  <span class="relative">
    {@render children()}
  </span>
</button>
