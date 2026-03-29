<script lang="ts">
  let {
    scale = 1,
    class: className = '',
  }: {
    scale?: number
    class?: string
  } = $props()
</script>

<svg
  width={16 * scale}
  height={16 * scale}
  viewBox="0 0 16 16"
  fill="currentColor"
  class={className}
>
  <path
    d="M8 4a.5.5 0 0 1 .354.146l4 4a.5.5 0 0 1-.708.708L8 5.207 4.354 8.854a.5.5 0 1 1-.708-.708l4-4A.5.5 0 0 1 8 4z"
  />
</svg>
