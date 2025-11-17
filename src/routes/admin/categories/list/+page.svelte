<script>
  import PageAuthWrapper from '$lib/components/RoleAuthWrapper/PageAuthWrapper.svelte'
  import CategoryListScreen from '../../../../screens/categories/list/CategoryListScreen.svelte'
</script>

<PageAuthWrapper module="ADVERTISE_CATEGORY" type="LIST">
  <CategoryListScreen module="ADVERTISE_CATEGORY" />
</PageAuthWrapper>
