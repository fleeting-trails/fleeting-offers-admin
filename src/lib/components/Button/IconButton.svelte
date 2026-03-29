<script lang="ts">
  import { theme } from '../../../config/theme/theme'

  let { size, colorVariant = 'pure', ...props }: PropTypes.IconButton = $props()
  let iconColor = $derived(getButtonIconColor(colorVariant))
  let buttonColor = $derived(getButtonVariantColor(colorVariant))

  /** Helper **/
  function getButtonVariantColor(colorVariant: PropTypes.ButtonColorVariants) {
    if (colorVariant === 'pure') {
      return 'bg-background-pure'
    } else if (colorVariant === 'primary') {
      return 'bg-primary'
    } else if (colorVariant === 'accent') {
      return 'bg-accent'
    }
  }
  function getButtonIconColor(colorVariant: PropTypes.ButtonColorVariants) {
    debugger
    if (colorVariant === 'pure') {
      return theme.light.color.text
    } else if (colorVariant === 'primary') {
      return theme.light.color.text_inverse
    } else if (colorVariant === 'accent') {
      return theme.light.color.text_inverse
    }
  }
</script>

{#if size === 'sm'}
  <button class="btn btn-circle btn-sm btn-ghost {buttonColor}  border-none!">
    <slot scale={0.8} color={iconColor} {...props} />
  </button>
{:else if size === 'md'}
  <button class="btn btn-circle btn-md btn-ghost {buttonColor} border-none!">
    <slot scale={1} color={iconColor} {...props} />
  </button>
{:else if size === 'lg'}
  <button class="btn btn-circle btn-lg btn-ghost {buttonColor} border-none!">
    <slot scale={1.2} color={iconColor} {...props} />
  </button>
{/if}
