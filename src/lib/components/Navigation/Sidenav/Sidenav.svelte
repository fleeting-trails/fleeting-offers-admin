<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import CollapseIcon from '$lib/icons/collapseIcon.svelte'
  import ShortcutIcon from '$lib/icons/ShortcutIcon.svelte'
  import { theme } from '../../../../config/theme/theme'
  import SidenavItems from './internal/SidenavItems.svelte'
  import navTree from '../../../../core/nav-tree/nav-tree'
  import HistoryIcon from '$lib/icons/HistoryIcon.svelte'
  import {
    initializeNavTreeState,
    onNavItemSelect,
    onNavSubmoduleSelect,
  } from './Sidenav.service'
  import type { SidenavModule } from './Sidenav.service'
  import { appStore } from '../../../../store/app.store/appStore.svelte'
  import {
    expandSidenav,
    collapseSidenav,
  } from '../../../../core/app/app.service'
  import SidenavSubmenuPopup from './internal/SidenavSubmenuPopup.svelte'
  
  // Filter nav tree based on permissions
  const getFilteredNavTree = (navTree: Core.NavTree, permissions: Record<string, any> | null | undefined) => {
    return navTree.map(section => ({
      ...section,
      module: section.module.filter(module => {
        // Show module if it doesn't have permissionLabel
        if (!module.permissionLabel) {
          return true
        }
        
        // Show module if user has the required permission
        return permissions && permissions.hasOwnProperty(module.permissionLabel)
      })
    })).filter(section => section.module.length > 0) // Remove empty sections
  }
  
  let filteredNavTree = $derived(getFilteredNavTree(navTree, appStore.auth.permissions))
  let navItems = $state(initializeNavTreeState(filteredNavTree))
  let sidenavOpenState = $derived(appStore.sidenavOpenState)
  let openedSubmenuPopup: SidenavModule | null = $state(null)

  // Update navItems when permissions change
  $effect(() => {
    const newFilteredTree = getFilteredNavTree(navTree, appStore.auth.permissions)
    navItems = initializeNavTreeState(newFilteredTree)
  })

  const handleNavItemSelect = (e: CustomEvent<SidenavModule>) => {
    navItems = onNavItemSelect(navItems, e.detail)
  }

  const handleSubmoduleSelect = (
    e: CustomEvent<SidenavModule['submodule'][0]>,
  ) => {
    console.log('Submodule selected in parent:', e.detail)
    navItems = onNavSubmoduleSelect(navItems, e.detail)

    // Navigate to submodule page
    const submoduleId = e.detail.id
    let targetUrl = ''

    // Convert nav tree IDs to path-based routes
    const parts = submoduleId.split('.')
    const moduleId = parts[parts.length - 2] // Second to last part (module)
    const submodulePage = parts[parts.length - 1] // Last part (submodule)

    // Map submodule pages to appropriate route names
    let routePage = submodulePage
    if (submodulePage === 'all') {
      routePage = 'list'
    }

    targetUrl = `/admin/${moduleId}/${routePage}`

    // Only navigate if we're not already on this URL
    if ($page.url.pathname !== targetUrl.split('?')[0]) {
      goto(targetUrl)
    }
  }

  const handleCollapseSelect = () => {
    collapseSidenav()
  }

  let logoDimensionClass = $derived(
    appStore.sidenavOpenState !== 'collapsed'
      ? 'h-[30px] w-[30px]'
      : 'h-[20px] w-[20px]',
  )

  const closeSubmenuPopup = () => {
    openedSubmenuPopup = null
  }

  const handleNavItemHover = (e: CustomEvent<SidenavModule>) => {
    openedSubmenuPopup = e.detail
  }
</script>

<div
  class="relative flex flex-col w-full h-full overflow-hidden border-r-[0.8px] border-r-gray font-secondary font-medium bg-gray-100 dark:bg-gray-900 transition ease-in-out duration-300"
  style={`
--stop-one: ${theme.light.color.primary}; 
--stop-two: ${theme.light.color.accent};
`}
>
  <div class="p-4 flex items-center flex-row gap-[15px]">
    <div class="{logoDimensionClass} rounded overflow-hidden">
      <img src="/logo.jpg" class="h-full w-full" alt="Main Logo" />
    </div>
    {#if sidenavOpenState !== 'collapsed'}
      <p class="text-bold">fleetingoffers</p>
      <div class="ml-auto">
        <button
          class="btn btn-circle btn-ghost border-none!"
          onclick={handleCollapseSelect}
        >
          <CollapseIcon />
        </button>
      </div>
    {/if}
  </div>
  <div class="flex flex-col p-2 border-b-gray border-b-[0.8px]">
    <SidenavItems
      badgeCount={2}
      module={{
        label: 'Shortcuts',
        icon: ShortcutIcon,
        id: 'history',
        tags: ['history'],
        description: '',
        submodule: [],
        collapsed: true,
        selected: true,
      }}
    />
    <SidenavItems
      badgeCount={0}
      module={{
        label: 'History',
        icon: HistoryIcon,
        id: 'history',
        tags: ['history'],
        description: '',
        submodule: [],
        collapsed: true,
        selected: false,
      }}
    />
  </div>

  <div class="flex flex-col p-2 overflow-y-auto flex-1">
    <!-- Section -->
    {#each navItems as section (section.id)}
      <div class="mt-3 mb-2">
        {#if sidenavOpenState !== 'collapsed'}
          <p class="text-xs text-text-light uppercase">{section.label}</p>
        {:else}
          <p class="text-xs text-text-light uppercase text-center">-</p>
        {/if}

        {#each section.module as module (module.id)}
          <SidenavItems
            on:menuhover={handleNavItemHover}
            on:menuclick={handleNavItemSelect}
            on:submoduleselect={handleSubmoduleSelect}
            {module}
            badgeCount={0}
          />
        {/each}
      </div>
    {/each}
  </div>
  <div class="absolute mesh-background -inset-10 pointer-events-none"></div>
  <!-- {:else if sidenavOpenState === 'collapsed'} -->
  <!--   <div class="flex flex-col gap-1 items-center overflow-y-auto"> -->
  <!--     <div class="w-full my-2 flex flex-col gap-1 items-center"> -->
  <!--       <img src="logo.jpg" alt="App Logo" class="h-[30px] w-[30px] rounded" /> -->
  <!--       <div class="collapsed_icon_container"> -->
  <!--         <ShortcutIcon /> -->
  <!--       </div> -->
  <!--       <div class="collapsed_icon_container"> -->
  <!--         <HistoryIcon /> -->
  <!--       </div> -->
  <!--     </div> -->
  <!---->
  <!--     {#each navItems as section (section.id)} -->
  <!--       <div class="my-2">-</div> -->
  <!--       {#each section.module as module (module.id)} -->
  <!--         <div class="collapsed_icon_container"> -->
  <!--           <svelte:component this={module.icon} /> -->
  <!--         </div> -->
  <!--       {/each} -->
  <!--     {/each} -->
  <!--   </div> -->
  <!-- {/if} -->
  {#if sidenavOpenState === 'collapsed' && openedSubmenuPopup}
    <SidenavSubmenuPopup module={openedSubmenuPopup} />
    <div
      onmouseover={closeSubmenuPopup}
      class="fixed left-[67px] bg-black/10 inset-0"
    ></div>
  {/if}
</div>

<style>
  .collapsed_icon_container {
    height: 50px;
    width: 50px;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .collapsed_icon_container:hover {
    background-color: var(--color-background-pure);
  }
  .mesh-background {
    position: absolute;
    opacity: 0.18;
    background:
      radial-gradient(
        circle 450px at 30% 60%,
        var(--stop-one) 0%,
        transparent 100%
      ),
      radial-gradient(
        circle 250px at 40% 80%,
        var(--stop-two) 0%,
        transparent 100%
      );
    background-blend-mode: screen;
    animation: moveBlobs 10s ease-in-out infinite alternate;
    filter: blur(60px);
  }

  @keyframes moveBlobs {
    0% {
      background-position:
        20% 20%,
        80% 30%,
        50% 80%;
    }
    100% {
      background-position:
        30% 10%,
        70% 40%,
        60% 90%;
    }
  }
</style>
