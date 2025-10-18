<script lang="ts">
  import { goto } from '$app/navigation'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import EditAdvertisementModal from '$lib/ui/Advertisement/EditAdvertisementModal.svelte'
  import AdvertisementTable from '$lib/ui/Advertisement/AdvertisementTable.svelte'

  // State
  let isEditModalOpen = $state(false)
  let editingAdvertisement = $state<any | null>(null)
  let loading = $state(false)
  let showDeleteModal = $state(false)
  let deletingAdvertisementId = $state<number | null>(null)

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
    {
      id: 4,
      title: 'Fitness Equipment Sale',
      description: 'Professional grade fitness equipment for home workouts',
      category: 'Sports & Recreation',
      industry: 'Retail',
      dealType: 'Seasonal Offer',
      price: 299.99,
      tags: ['fitness', 'equipment', 'health'],
      validUntil: '2024-09-15',
      status: 'Published',
      createdAt: '2024-01-20',
      views: 890,
      clicks: 67,
    },
    {
      id: 5,
      title: 'Gourmet Food Festival',
      description: 'Exclusive gourmet food items from around the world',
      category: 'Food & Beverage',
      industry: 'Retail',
      dealType: 'Limited Time',
      price: 75.5,
      tags: ['gourmet', 'food', 'international'],
      validUntil: '2024-07-20',
      status: 'Published',
      createdAt: '2024-01-12',
      views: 1567,
      clicks: 123,
    },
    {
      id: 6,
      title: 'Beauty & Skincare Bundle',
      description: 'Complete skincare routine with premium beauty products',
      category: 'Health & Beauty',
      industry: 'Retail',
      dealType: 'Bundle Deal',
      price: 185.0,
      tags: ['beauty', 'skincare', 'bundle'],
      validUntil: '2024-10-30',
      status: 'Draft',
      createdAt: '2024-01-18',
      views: 0,
      clicks: 0,
    },
    {
      id: 7,
      title: 'Travel Adventure Package',
      description:
        'All-inclusive adventure travel packages to exotic destinations',
      category: 'Travel',
      industry: 'Hospitality',
      dealType: 'Discount',
      price: 1299.99,
      tags: ['travel', 'adventure', 'vacation'],
      validUntil: '2024-11-15',
      status: 'Published',
      createdAt: '2024-01-25',
      views: 3421,
      clicks: 298,
    },
    {
      id: 8,
      title: 'Educational Course Bundle',
      description: 'Comprehensive online courses for professional development',
      category: 'Education',
      industry: 'Education',
      dealType: 'New Customer Deal',
      price: 199.99,
      tags: ['education', 'courses', 'professional'],
      validUntil: '2024-12-01',
      status: 'Published',
      createdAt: '2024-01-30',
      views: 987,
      clicks: 89,
    },
    {
      id: 9,
      title: 'Winter Sports Gear',
      description: 'Premium winter sports equipment and apparel',
      category: 'Sports & Recreation',
      industry: 'Retail',
      dealType: 'Seasonal Offer',
      price: 450.0,
      tags: ['winter', 'sports', 'gear'],
      validUntil: '2024-12-15',
      status: 'Published',
      createdAt: '2024-02-01',
      views: 1200,
      clicks: 95,
    },
    {
      id: 10,
      title: 'Smart Home Automation',
      description: 'Complete smart home setup with voice control',
      category: 'Electronics',
      industry: 'Technology',
      dealType: 'Bundle Deal',
      price: 899.99,
      tags: ['smart', 'home', 'automation'],
      validUntil: '2024-11-30',
      status: 'Published',
      createdAt: '2024-02-05',
      views: 2100,
      clicks: 180,
    },
    {
      id: 11,
      title: 'Organic Garden Starter Kit',
      description: 'Everything you need to start your organic garden',
      category: 'Home & Garden',
      industry: 'Retail',
      dealType: 'New Customer Deal',
      price: 89.99,
      tags: ['organic', 'garden', 'plants'],
      validUntil: '2024-08-15',
      status: 'Draft',
      createdAt: '2024-02-10',
      views: 0,
      clicks: 0,
    },
    {
      id: 12,
      title: 'Luxury Spa Package',
      description: 'Rejuvenating spa treatments and wellness packages',
      category: 'Health & Beauty',
      industry: 'Hospitality',
      dealType: 'Limited Time',
      price: 350.0,
      tags: ['spa', 'wellness', 'luxury'],
      validUntil: '2024-09-30',
      status: 'Published',
      createdAt: '2024-02-15',
      views: 1800,
      clicks: 145,
    },
    {
      id: 13,
      title: 'Professional Photography Services',
      description: 'High-quality photography for events and portraits',
      category: 'Services',
      industry: 'Entertainment',
      dealType: 'Discount',
      price: 299.99,
      tags: ['photography', 'professional', 'events'],
      validUntil: '2024-10-15',
      status: 'Published',
      createdAt: '2024-02-20',
      views: 950,
      clicks: 78,
    },
    {
      id: 14,
      title: 'Vintage Car Rental',
      description: 'Classic vintage cars for special occasions',
      category: 'Automotive',
      industry: 'Transportation',
      dealType: 'Flash Sale',
      price: 250.0,
      tags: ['vintage', 'car', 'rental'],
      validUntil: '2024-07-30',
      status: 'Published',
      createdAt: '2024-02-25',
      views: 1350,
      clicks: 110,
    },
    {
      id: 15,
      title: 'Language Learning Bootcamp',
      description: 'Intensive language learning program with native speakers',
      category: 'Education',
      industry: 'Education',
      dealType: 'Early Bird',
      price: 450.0,
      tags: ['language', 'learning', 'bootcamp'],
      validUntil: '2024-09-01',
      status: 'Published',
      createdAt: '2024-03-01',
      views: 800,
      clicks: 65,
    },
  ])

  // Event handlers
  const handleCreateClick = () => {
    goto('/admin/advertisements/create')
  }

  const handleView = (id: number) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return

    // For now, just show an alert. In a real app, you'd navigate to a view page
    alert(`Viewing advertisement: ${ad.title}`)
    // goto(`/admin/advertisements/view/${id}`)
  }

  const handleEdit = (id: number) => {
    const ad = advertisements.find((a) => a.id === id)
    if (!ad) return

    if (ad.status === 'Draft' || ad.status === 'Unpublished') {
      goto(`/admin/advertisements/create?edit=${id}`)
    } else {
      editingAdvertisement = ad
      isEditModalOpen = true
    }
  }

  const handleDelete = (id: number) => {
    deletingAdvertisementId = id
    showDeleteModal = true
  }

  const confirmDelete = () => {
    if (deletingAdvertisementId) {
      advertisements = advertisements.filter(
        (ad) => ad.id !== deletingAdvertisementId,
      )
      deletingAdvertisementId = null
      showDeleteModal = false
    }
  }

  const cancelDelete = () => {
    deletingAdvertisementId = null
    showDeleteModal = false
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

<!-- Edit modal -->
<EditAdvertisementModal
  bind:isOpen={isEditModalOpen}
  onSubmit={handleEditSubmit}
  advertisement={editingAdvertisement}
/>

<!-- Delete confirmation modal -->
{#if showDeleteModal}
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
      <h3
        class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-4"
      >
        Confirm Delete
      </h3>
      <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
        Are you sure you want to delete this advertisement? This action cannot
        be undone.
      </p>
      <div class="flex justify-end gap-3">
        <button
          type="button"
          onclick={cancelDelete}
          class="px-4 py-2 text-text-secondary hover:text-text-primary dark:text-text-secondary-dark dark:hover:text-text-primary-dark transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onclick={confirmDelete}
          class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
{/if}
