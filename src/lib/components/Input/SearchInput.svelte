<script>
  import SearchIcon from '$lib/icons/SearchIcon.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'

  export let containerStyleClass = ''
</script>

<div
  class="flex flex-row gap-3 items-center rounded-lg px-3 py-2 bg-background-pure {containerStyleClass}"
>
  <SearchIcon />
  <input class="flex-1 border-none outline-none" />
  <ButtonPrimary size="sm">Search</ButtonPrimary>
</div>
