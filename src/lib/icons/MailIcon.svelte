<script lang="ts">
  export let color = 'currentColor'
  export let scale = 1
  export let strokeWidth = 1.5
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  width={scale * 24}
  height={scale * 24}
  fill="none"
  stroke={color}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
  <path d="M3 7l9 6 9-6" />
</svg>
