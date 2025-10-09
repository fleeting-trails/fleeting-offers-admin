<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import CreateAdvertisementModal from '$lib/ui/Advertisement/CreateAdvertisementModal.svelte'
  import AdvertisementTable from '$lib/ui/Advertisement/AdvertisementTable.svelte'

  // Mock advertisement data
  let advertisements = $state([
    {
      id: 1,
      title: 'Summer Sale Campaign',
      description: 'Get 50% off on all summer items',
      category: 'Fashion',
      status: 'Published',
      createdAt: '2024-01-15',
      views: 1250,
      clicks: 89,
    },
    {
      id: 2,
      title: 'Tech Gadgets Promotion',
      description: 'Latest smartphones and laptops at discounted prices',
      category: 'Electronics',
      status: 'Published',
      createdAt: '2024-01-10',
      views: 2340,
      clicks: 156,
    },
    {
      id: 3,
      title: 'Home Decor Collection',
      description: 'Transform your space with our premium collection',
      category: 'Home & Garden',
      status: 'Draft',
      createdAt: '2024-01-08',
      views: 0,
      clicks: 0,
    },
  ])

  // Modal state
  let isCreateModalOpen = $state(false)

  const openCreateModal = () => {
    isCreateModalOpen = true
  }

  const handleCreateAd = (data: { title: string; description: string }) => {
    const newAd = {
      id: advertisements.length + 1,
      title: data.title,
      description: data.description,
      category: 'Uncategorized',
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      clicks: 0,
    }
    advertisements = [...advertisements, newAd]
  }

  const handleEdit = (id: number) => {
    console.log('Edit advertisement:', id)
  }
</script>

<div class="p-6 h-full">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1
      class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
    >
      Advertisements
    </h1>
    <ButtonGradient onclick={openCreateModal} size="md">
      Create Advertisement
    </ButtonGradient>
  </div>

  <!-- Table -->
  <AdvertisementTable {advertisements} onEdit={handleEdit} />
</div>

<!-- Create Advertisement Modal -->
<CreateAdvertisementModal
  bind:isOpen={isCreateModalOpen}
  onSubmit={handleCreateAd}
/>
