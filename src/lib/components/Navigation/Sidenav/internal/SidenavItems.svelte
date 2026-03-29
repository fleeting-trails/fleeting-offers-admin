<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import type { SvelteComponent } from 'svelte'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'
  import type { SidenavModule } from '../Sidenav.service'
  import { appStore } from '../../../../../store/app.store/appStore.svelte'
  import SidenavSubmenuPopup from './SidenavSubmenuPopup.svelte'

  let submenuPopupOpen = $state(false)
  const dispatch = createEventDispatcher()
  // export let module: SidenavModule
  // export let badgeCount: number

  let { module, badgeCount }: { module: SidenavModule; badgeCount: number } =
    $props()

  const handleMenuClick = (module: SidenavModule) => {
    dispatch('menuclick', module)
  }
  const handleMenuHover = (module: SidenavModule) => {
    dispatch('menuhover', module)
  }
  const handleSubmoduleSelect = (submodule: SidenavModule['submodule'][0]) => {
    dispatch('submoduleselect', submodule)
  }

  let sidenavOpenState = $derived(appStore.sidenavOpenState)
</script>

<div>
  <div
    id="sidenav-item-{module.id}"
    class="flex flex-row my-1 items-center gap-2 p-2 rounded cursor-pointer hover:bg-background-pure/50 transition ease-in-out duration-300"
    style={module.selected
      ? 'background-color: var(--color-background-pure)'
      : ''}
    onclick={() => handleMenuClick(module)}
    onmouseover={() => handleMenuHover(module)}
  >
    {#if module.icon}
      <svelte:component this={module.icon} scale={0.8} />
    {/if}
    {#if sidenavOpenState !== 'collapsed'}
      <Text class="text-sm">{module.label}</Text>
    {/if}
    {#if badgeCount > 0 && sidenavOpenState !== 'collapsed'}
      <div
        class="h-6 w-6 text-base/0 rounded flex justify-center items-center ml-auto bg-background-pure text-text-primary"
      >
        <p class="m-0! p-0! text-sm">{badgeCount}</p>
      </div>
    {/if}
    {#if module.submodule.length !== 0 && sidenavOpenState !== 'collapsed'}
      <div
        class="ml-auto transition ease-in-out duration-300"
        style={`${module.selected ? 'transform: rotate(90deg)' : ''}`}
      >
        <ArrowRightIcon scale={0.65} />
      </div>
    {/if}
  </div>
  {#if module.submodule.length !== 0}
    <ul
      class="relative transition-all ease-in-out duration-300 overflow-hidden"
      style="max-height: {(module.selected ? 34 : 0) *
        module.submodule.length}px;"
    >
      {#each module.submodule as item (item.id)}
        <button
          type="button"
          class="cursor-pointer pl-6 w-full text-left group hover:bg-transparent border-none bg-transparent p-0"
          onclick={() => handleSubmoduleSelect(item)}
        >
          <li
            class="relative before:absolute before:left-[-12px] before:-top-4 before:w-3 before:h-9 before:border-l before:border-b before:border-gray-300 before:rounded-bl-md text-xs text-text-light"
          >
            <Text
              variant="span"
              class="group-hover:text-text-primary group-hover:bg-background-pure/50 {item.selected
                ? 'text-text-primary bg-background-pure'
                : ''} rounded-lg transition ease-in-out duration-300 py-[9px] px-2 block"
            >
              {item.label}
            </Text>
          </li>
        </button>
      {/each}
    </ul>
  {/if}
</div>
