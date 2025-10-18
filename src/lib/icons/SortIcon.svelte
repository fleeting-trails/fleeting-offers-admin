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
    d="M8 3a.5.5 0 0 1 .354.146l2 2a.5.5 0 0 1-.708.708L8 4.207 6.354 5.854a.5.5 0 1 1-.708-.708l2-2A.5.5 0 0 1 8 3z"
  />
  <path
    d="M8 13a.5.5 0 0 1-.354-.146l-2-2a.5.5 0 0 1 .708-.708L8 11.793l1.646-1.647a.5.5 0 0 1 .708.708l-2 2A.5.5 0 0 1 8 13z"
  />
</svg>
