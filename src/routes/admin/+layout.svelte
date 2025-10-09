<script lang="ts">
  let { children } = $props()
  import Sidenav from '$lib/components/Navigation/Sidenav/Sidenav.svelte'
  import Topnav from '$lib/components/Navigation/Topnav/Topnav.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'
  import IconButton from '$lib/components/Button/IconButton.svelte'
  import { expandSidenav } from '../../core/app/app.service'
  import { appStore } from '../../store/app.store/appStore.svelte'
  // States
  let containerOffset = 12
  let sidenavOpenState = $derived(appStore.sidenavOpenState)
  let widthClass = $derived(() => {
    if (sidenavOpenState === 'expanded') {
      return 'w-[280px]'
    } else if (sidenavOpenState === 'collapsed') {
      return 'w-[70px]'
    } else {
      return 'w-[0px]'
    }
  })

  let navWidth = $derived(
    appStore.sidenavOpenState === 'expanded'
      ? 280
      : appStore.sidenavOpenState === 'collapsed'
        ? 55
        : 0,
  )

  const handleExpandClick = () => expandSidenav()
</script>

<div
  class="bg-gradient-to-r from-primary dark:from-primary-dark to-accent dark:to-accent-dark w-full h-screen"
  style="padding: {containerOffset}px"
>
  <div
    class="flex rounded bg-gradient-to-b from-background-toned-1 dark:from-background-toned-1-dark to-background-toned-0 dark:to-background-toned-0-dark dark:bg-background-dark h-full rounded overflow-hidden transition-all ease-in-out duration-300"
  >
    <!-- Sidenavigation -->
    <div
      class="relative h-full transition-all ease-in-out duration-300"
      style={`width: ${navWidth}px`}
    >
      {#if sidenavOpenState === 'collapsed'}
        <button
          type="button"
          class="absolute top-[20px] -right-[-5px] h-[10px] w-[10px] cursor-pointer z-2 border-none bg-transparent p-0"
          onclick={handleExpandClick}
        >
          <IconButton size="sm" colorVariant="primary">
            <ArrowRightIcon scale={0.6} color="white" />
          </IconButton>
        </button>
      {/if}
      <Sidenav />
    </div>

    <!-- Right Content -->
    <div class="flex-1 flex flex-col h-full">
      <!-- Top Navigation -->
      <Topnav />
      <div class="flex-1">
        {@render children()}
      </div>
    </div>
  </div>
</div>
