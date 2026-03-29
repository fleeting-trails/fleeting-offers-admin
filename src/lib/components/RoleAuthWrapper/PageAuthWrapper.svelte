<script lang="ts">
  import { appStore } from '../../../store/app.store/appStore.svelte'
  import { type ModuleType } from '$lib/types/roles'
  import AccessDenied from './AccessDenied.svelte'

  let {
    module,
    type,
    children,
  }: {
    module: ModuleType
    type: string
    children: any
  } = $props()

  // Check if user has permission for the given module and type
  const hasPermission = $derived(() => {
    const permissions = appStore.auth.permissions

    if (!permissions) return false

    const modulePermissions = permissions[module]
    if (!modulePermissions) return false

    return modulePermissions[type] === true
  })
</script>

{#if hasPermission()}
  {@render children()}
{:else}
  <AccessDenied />
{/if}
