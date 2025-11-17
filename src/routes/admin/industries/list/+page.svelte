<script>
  import PageAuthWrapper from '$lib/components/RoleAuthWrapper/PageAuthWrapper.svelte'
  import IndustryListScreen from '../../../../screens/industries/list/IndustryListScreen.svelte'
</script>

<PageAuthWrapper module="ADVERTISE_INDUSTRY" type="LIST">
  <IndustryListScreen module="ADVERTISE_INDUSTRY" />
</PageAuthWrapper>
