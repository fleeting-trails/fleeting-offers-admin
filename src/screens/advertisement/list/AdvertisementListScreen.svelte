<script lang="ts">
  import { goto } from '$app/navigation'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import DeleteConfirmationModal from '$lib/components/Modal/DeleteConfirmationModal.svelte'
  import AdvertisementTable from '$lib/ui/Advertisement/AdvertisementTable.svelte'
  import EditAdvertisementModal from '$lib/ui/Advertisement/EditAdvertisementModal.svelte'
  import ViewAdvertisementModal from '$lib/ui/Advertisement/ViewAdvertisementModal.svelte'
  import type { AdvertisementDisplay } from '$lib/types/advertisement'

  // State
  let isEditModalOpen = $state(false)
  let isViewModalOpen = $state(false)
  let isDeleteModalOpen = $state(false)
  let editingAdvertisement = $state<AdvertisementDisplay | null>(null)
  let viewingAdvertisement = $state<AdvertisementDisplay | null>(null)
  let deletingAdvertisementId = $state<string | null>(null)
  let loading = $state(false)

  // Advertisement data
  let advertisements = $state<AdvertisementDisplay[]>([
    {
      id: '1',
      title: 'Summer Sale Campaign',
      subtitle: 'Biggest Sale of the Year',
      description:
        'Get 50% off on all summer items including fashion, accessories, and more',
      startDate: '2024-06-01T00:00:00Z',
      expirationDate: '2024-08-31T23:59:59Z',
      categoryName: 'Fashion',
      subCategoryName: 'Retail Clothing',
      dealTypeName: 'Percentage Discount',
      coverImageUrl: '/images/summer-sale-cover.jpg',
      thumbnailImageUrl: '/images/summer-sale-thumb.jpg',
      tagCount: 3,
      locationCount: 5,
      ownerCount: 1,
      status: 'published',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Tech Gadgets Promotion',
      subtitle: 'Latest Technology at Best Prices',
      description:
        'Latest smartphones, laptops, and accessories at discounted prices',
      startDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      categoryName: 'Electronics',
      subCategoryName: 'Consumer Electronics',
      dealTypeName: 'Flash Sale',
      coverImageUrl: '/images/tech-promo-cover.jpg',
      thumbnailImageUrl: '/images/tech-promo-thumb.jpg',
      tagCount: 4,
      locationCount: 10,
      ownerCount: 2,
      status: 'published',
      createdAt: '2024-01-10T14:20:00Z',
      updatedAt: '2024-01-10T14:20:00Z',
    },
    {
      id: '3',
      title: 'Home Decor Collection',
      subtitle: 'Transform Your Living Space',
      description:
        'Transform your space with our premium home decor collection',
      startDate: undefined,
      expirationDate: '2024-06-30T23:59:59Z',
      categoryName: 'Home & Garden',
      subCategoryName: 'Interior Design',
      dealTypeName: 'Clearance Sale',
      coverImageUrl: '/images/home-decor-cover.jpg',
      thumbnailImageUrl: '/images/home-decor-thumb.jpg',
      tagCount: 5,
      locationCount: 3,
      ownerCount: 1,
      status: 'draft',
      createdAt: '2024-01-08T09:15:00Z',
      updatedAt: '2024-01-08T09:15:00Z',
    },
    {
      id: '4',
      title: 'Fitness Equipment Sale',
      subtitle: 'Professional Grade Equipment',
      description:
        'Professional grade fitness equipment for home workouts and gyms',
      startDate: '2024-03-01T00:00:00Z',
      expirationDate: '2024-09-15T23:59:59Z',
      categoryName: 'Sports & Recreation',
      subCategoryName: 'Fitness Equipment',
      dealTypeName: 'Seasonal Offer',
      coverImageUrl: '/images/fitness-cover.jpg',
      thumbnailImageUrl: '/images/fitness-thumb.jpg',
      tagCount: 3,
      locationCount: 8,
      ownerCount: 1,
      status: 'published',
      createdAt: '2024-01-20T16:45:00Z',
      updatedAt: '2024-01-20T16:45:00Z',
    },
    {
      id: '5',
      title: 'Gourmet Food Festival',
      subtitle: 'World Cuisine Experience',
      description: 'Exclusive gourmet food items from around the world',
      startDate: '2024-07-01T00:00:00Z',
      expirationDate: '2024-07-20T23:59:59Z',
      categoryName: 'Food & Beverage',
      subCategoryName: 'Gourmet Foods',
      dealTypeName: 'Limited Time Offer',
      coverImageUrl: '/images/food-festival-cover.jpg',
      thumbnailImageUrl: '/images/food-festival-thumb.jpg',
      tagCount: 6,
      locationCount: 2,
      ownerCount: 3,
      status: 'published',
      createdAt: '2024-01-12T11:30:00Z',
      updatedAt: '2024-01-12T11:30:00Z',
    },
    {
      id: '6',
      title: 'Beauty & Skincare Bundle',
      subtitle: 'Complete Beauty Routine',
      description: 'Complete skincare routine with premium beauty products',
      startDate: undefined,
      expirationDate: '2024-10-30T23:59:59Z',
      categoryName: 'Health & Beauty',
      subCategoryName: 'Skincare',
      dealTypeName: 'Bundle Deal',
      coverImageUrl: '/images/beauty-cover.jpg',
      thumbnailImageUrl: '/images/beauty-thumb.jpg',
      tagCount: 4,
      locationCount: 6,
      ownerCount: 1,
      status: 'draft',
      createdAt: '2024-01-18T08:45:00Z',
      updatedAt: '2024-01-18T08:45:00Z',
    },
  ])

  // Actions
  const handleCreateClick = () => {
    goto('/admin/advertisements/create')
  }

  const handleView = (id: string) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return
    viewingAdvertisement = ad
    isViewModalOpen = true
  }

  // Action handlers
  const handleEdit = (id: string) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return

    if (ad.status === 'draft') {
      goto(`/admin/advertisements/create?edit=${id}`)
    } else {
      editingAdvertisement = ad
      isEditModalOpen = true
    }
  }

  const handleDelete = (id: string) => {
    deletingAdvertisementId = id
    isDeleteModalOpen = true
  }

  const confirmDelete = () => {
    if (deletingAdvertisementId) {
      advertisements = advertisements.filter(
        (ad) => ad.id !== deletingAdvertisementId,
      )
      deletingAdvertisementId = null
      isDeleteModalOpen = false
    }
  }

  const cancelDelete = () => {
    deletingAdvertisementId = null
    isDeleteModalOpen = false
  }

  const handleEditSubmit = (data: any) => {
    if (!editingAdvertisement) return

    advertisements = advertisements.map((ad) =>
      ad.id === editingAdvertisement!.id
        ? {
            ...ad,
            title: data.title,
            subtitle: data.subtitle,
            description: data.description,
            startDate: data.startDate,
            expirationDate: data.expirationDate,
            updatedAt: new Date().toISOString(),
          }
        : ad,
    )
    editingAdvertisement = null
  }
</script>

<!-- Page header -->
<div class="p-6">
  <div class="flex items-center justify-between mb-6">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        Advertisements
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        Manage your advertisement campaigns
      </p>
    </div>
    <ButtonGradient onclick={handleCreateClick} size="md">
      Create Advertisement
    </ButtonGradient>
  </div>

  <!-- Advertisement table -->
  <AdvertisementTable
    {advertisements}
    {loading}
    onEdit={handleEdit}
    onView={handleView}
    onDelete={handleDelete}
  />
</div>

<!-- Modals -->
<ViewAdvertisementModal
  bind:isOpen={isViewModalOpen}
  advertisement={viewingAdvertisement}
/>

<EditAdvertisementModal
  bind:isOpen={isEditModalOpen}
  onSubmit={handleEditSubmit}
  advertisement={editingAdvertisement}
/>

<DeleteConfirmationModal
  bind:isOpen={isDeleteModalOpen}
  title="Confirm Delete"
  message="Are you sure you want to delete this advertisement? This action cannot be undone."
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  {loading}
/>
