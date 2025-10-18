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
    d="M8 12a.5.5 0 0 1-.354-.146l-4-4a.5.5 0 0 1 .708-.708L8 10.793l3.646-3.647a.5.5 0 0 1 .708.708l-4 4A.5.5 0 0 1 8 12z"
  />
</svg>
