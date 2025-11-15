<script lang="ts">
  import { appStore } from '../../../store/app.store/appStore.svelte'

  let {
    module,
    type,
    children,
  }: {
    module: string
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
{/if}
