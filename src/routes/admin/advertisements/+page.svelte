<script lang="ts">
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import CreateAdvertisementModal from '$lib/ui/Advertisement/CreateAdvertisementModal.svelte'
  import AdditionalDetailsModal from '$lib/ui/Advertisement/AdditionalDetailsModal.svelte'
  import EditAdvertisementModal from '$lib/ui/Advertisement/EditAdvertisementModal.svelte'
  import AdvertisementTable from '$lib/ui/Advertisement/AdvertisementTable.svelte'

  // Mock advertisement data
  let advertisements = $state([
    {
      id: 1,
      title: 'Summer Sale Campaign',
      description: 'Get 50% off on all summer items',
      category: 'Fashion',
      industry: 'Retail',
      dealType: 'Discount',
      price: 99.99,
      tags: ['summer', 'sale', 'fashion'],
      validUntil: '2024-08-31',
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
      industry: 'Technology',
      dealType: 'Flash Sale',
      price: 599.99,
      tags: ['tech', 'gadgets', 'electronics'],
      validUntil: '2024-12-31',
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
      industry: 'Retail',
      dealType: 'Clearance',
      price: 149.5,
      tags: ['home', 'decor', 'interior'],
      validUntil: '2024-06-30',
      status: 'Draft',
      createdAt: '2024-01-08',
      views: 0,
      clicks: 0,
    },
  ])

  // Modal states
  let isCreateModalOpen = $state(false)
  let isAdditionalDetailsModalOpen = $state(false)
  let isEditModalOpen = $state(false)

  // Current advertisement data
  let currentAdData = $state<{
    title: string
    description: string
    id?: number
  } | null>(null)
  let editingAdvertisement = $state<any | null>(null)

  // Check URL params on mount and page changes
  onMount(() => {
    checkUrlParams()
  })

  $effect(() => {
    checkUrlParams()
  })

  const checkUrlParams = () => {
    const urlPage = $page.url.searchParams.get('page')
    if (urlPage === 'create') {
      isCreateModalOpen = true
    }
  }

  const openCreateModal = () => {
    isCreateModalOpen = true
  }

  const handleCreateNext = (data: { title: string; description: string }) => {
    currentAdData = data
    isAdditionalDetailsModalOpen = true
  }

  const handleAdditionalDetailsSubmit = (data: any) => {
    const newAd = {
      id: advertisements.length + 1,
      title: data.title,
      description: data.description,
      category: data.category,
      industry: data.industry,
      dealType: data.dealType,
      price: data.price,
      tags: data.tags,
      validUntil: data.validUntil,
      status: 'Draft',
      createdAt: new Date().toISOString().split('T')[0],
      views: 0,
      clicks: 0,
    }
    advertisements = [...advertisements, newAd]
    currentAdData = null
  }

  const handleEdit = (id: number) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return

    if (ad.status === 'Draft' || ad.status === 'Unpublished') {
      // Open additional details modal for draft/unpublished
      currentAdData = {
        id: ad.id,
        title: ad.title,
        description: ad.description,
      }
      isAdditionalDetailsModalOpen = true
    } else {
      // Open edit modal for published - pass full advertisement data
      editingAdvertisement = ad
      isEditModalOpen = true
    }
  }

  const handleEditSubmit = (data: any) => {
    if (!editingAdvertisement) return

    advertisements = advertisements.map((ad) =>
      ad.id === editingAdvertisement!.id
        ? {
            ...ad,
            title: data.title,
            description: data.description,
            category: data.category,
            industry: data.industry,
            dealType: data.dealType,
            price: data.price,
            tags: data.tags,
            validUntil: data.validUntil,
          }
        : ad,
    )
    editingAdvertisement = null
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

<!-- Modals -->
<CreateAdvertisementModal
  bind:isOpen={isCreateModalOpen}
  onNext={handleCreateNext}
/>

<AdditionalDetailsModal
  bind:isOpen={isAdditionalDetailsModalOpen}
  onSubmit={handleAdditionalDetailsSubmit}
  advertisementData={currentAdData || { title: '', description: '' }}
/>

<EditAdvertisementModal
  bind:isOpen={isEditModalOpen}
  onSubmit={handleEditSubmit}
  advertisement={editingAdvertisement}
/>
