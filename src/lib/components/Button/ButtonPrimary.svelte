<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' = 'md'
  let btnClass = `btn btn-soft border-none outline-none btn-${size} bg-background-pure`
</script>

{#if size === 'sm'}
  <button class={btnClass}>
    <slot scale={0.8} {...$$restProps} />
  </button>
{:else if size === 'md'}
  <button class={btnClass}>
    <slot scale={1} {...$$restProps} />
  </button>
{:else if size === 'lg'}
  <button class={btnClass}>
    <slot scale={1.2} {...$$restProps} />
  </button>
{/if}
