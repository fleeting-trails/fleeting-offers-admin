<script>
  import PageAuthWrapper from '$lib/components/RoleAuthWrapper/PageAuthWrapper.svelte'
  import UserListScreen from '../../../../screens/users/list/UserListScreen.svelte'
</script>

<PageAuthWrapper module="USER" type="LIST">
  <UserListScreen module="USER" />
</PageAuthWrapper>
