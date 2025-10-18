<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'
  import BasicInfoForm from './BasicInfoForm.svelte'
  import DealDetailsForm from './DealDetailsForm.svelte'
  import AdditionalInfoForm from './AdditionalInfoForm.svelte'

  type TabId = 'basic' | 'details' | 'additional'

  // State
  let activeTab = $state<TabId>('basic')
  let isEditing = $state(false)
  let editId = $state<string | null>(null)
  let showConfirmModal = $state(false)

  // Tab configuration
  const tabs = [
    { id: 'basic' as TabId, label: 'Basic Information', order: 1 },
    { id: 'details' as TabId, label: 'Deal Details', order: 2 },
    { id: 'additional' as TabId, label: 'Additional Information', order: 3 },
  ]

  // Form data
  let formData = $state({
    title: '',
    description: '',
    category: '',
    industry: '',
    dealType: '',
    price: '',
    tags: '',
    validUntil: '',
    targetAudience: '',
    location: '',
    contactInfo: '',
    termsConditions: '',
  })

  // Form errors
  let errors = $state({
    title: '',
    description: '',
    category: '',
    industry: '',
    dealType: '',
    price: '',
    validUntil: '',
  })

  // Dropdown options
  const categories = [
    'Fashion',
    'Electronics',
    'Home & Garden',
    'Food & Beverage',
    'Health & Beauty',
    'Sports & Recreation',
    'Travel',
    'Automotive',
    'Education',
    'Services',
  ]

  const industries = [
    'Retail',
    'Technology',
    'Healthcare',
    'Financial Services',
    'Manufacturing',
    'Real Estate',
    'Education',
    'Entertainment',
    'Transportation',
    'Hospitality',
  ]

  const dealTypes = [
    'Discount',
    'Flash Sale',
    'Buy One Get One',
    'Clearance',
    'Seasonal Offer',
    'New Customer Deal',
    'Limited Time',
    'Bundle Deal',
  ]

  // Initialize editing mode
  onMount(() => {
    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadAdvertisementData(editParam)
    }
  })

  // Load existing advertisement data
  const loadAdvertisementData = (id: string) => {
    const mockData = {
      title: 'Summer Sale Campaign',
      description: 'Get 50% off on all summer items',
      category: 'Fashion',
      industry: 'Retail',
      dealType: 'Discount',
      price: '99.99',
      tags: 'summer, sale, fashion',
      validUntil: '2025-12-31',
      targetAudience: 'Fashion enthusiasts aged 18-35',
      location: 'All stores nationwide',
      contactInfo: 'support@example.com',
      termsConditions:
        'Valid while supplies last. Cannot be combined with other offers.',
    }

    formData = { ...mockData }
  }

  // Validation
  const validateTab = (tab: TabId): boolean => {
    let isValid = true

    if (tab === 'basic') {
      errors.title = ''
      errors.description = ''
      errors.category = ''
      errors.industry = ''

      if (!formData.title.trim()) {
        errors.title = 'Title is required'
        isValid = false
      }
      if (!formData.description.trim()) {
        errors.description = 'Description is required'
        isValid = false
      }
      if (!formData.category) {
        errors.category = 'Category is required'
        isValid = false
      }
      if (!formData.industry) {
        errors.industry = 'Industry is required'
        isValid = false
      }
    }

    if (tab === 'details') {
      errors.dealType = ''
      errors.price = ''
      errors.validUntil = ''

      if (!formData.dealType) {
        errors.dealType = 'Deal type is required'
        isValid = false
      }
      if (!formData.price || formData.price === '') {
        errors.price = 'Price is required'
        isValid = false
      } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
        errors.price = 'Price must be a valid positive number'
        isValid = false
      }
      if (!formData.validUntil) {
        errors.validUntil = 'Valid until date is required'
        isValid = false
      } else {
        const selectedDate = new Date(formData.validUntil)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (selectedDate < today) {
          errors.validUntil = 'Valid until date cannot be in the past'
          isValid = false
        }
      }
    }

    return isValid
  }

  // Event handlers
  const handleTabChange = (tabId: TabId) => {
    activeTab = tabId
  }

  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      showConfirmModal = true
    } else {
      goto('/admin/advertisements/list')
    }
  }

  const confirmCancel = () => {
    goto('/admin/advertisements/list')
  }

  const hasUnsavedChanges = (): boolean => {
    return Object.values(formData).some((value) => value.trim() !== '')
  }

  const handleSubmit = () => {
    const isBasicValid = validateTab('basic')
    const isDetailsValid = validateTab('details')

    if (isBasicValid && isDetailsValid) {
      console.log('Submitting advertisement:', formData)
      goto('/admin/advertisements/list')
    } else {
      if (!isBasicValid) {
        activeTab = 'basic'
      } else if (!isDetailsValid) {
        activeTab = 'details'
      }
    }
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <!-- Page header -->
  <div class="mb-6">
    <div class="flex items-center gap-4 mb-4">
      <button
        onclick={handleCancel}
        class="text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
      >
        ← Back to Advertisements
      </button>
    </div>
    <h1
      class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
    >
      {isEditing ? 'Edit Advertisement' : 'Create New Advertisement'}
    </h1>
    <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
      Fill in the information to create your advertisement
    </p>
  </div>

  <!-- Tab navigation -->
  <div class="mb-6 border-b border-gray-200 dark:border-gray-700">
    <nav class="-mb-px flex space-x-8" aria-label="Tabs">
      {#each tabs as tab}
        <button
          onclick={() => handleTabChange(tab.id)}
          class="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
            {activeTab === tab.id
            ? 'border-primary-500 text-primary-600 dark:text-primary-400'
            : 'border-transparent text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark hover:border-gray-300 dark:hover:border-gray-600'}"
        >
          {tab.label}
        </button>
      {/each}
    </nav>
  </div>

  <!-- Form content -->
  <div
    class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6"
  >
    {#if activeTab === 'basic'}
      <BasicInfoForm {formData} {errors} {categories} {industries} />
    {:else if activeTab === 'details'}
      <DealDetailsForm {formData} {errors} {dealTypes} />
    {:else if activeTab === 'additional'}
      <AdditionalInfoForm {formData} />
    {/if}
  </div>

  <!-- Form actions -->
  <div class="flex justify-between items-center mt-8">
    <button
      onclick={handleCancel}
      class="px-6 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
    >
      Cancel
    </button>

    <ButtonGradient onclick={handleSubmit} size="md">
      {isEditing ? 'Update Advertisement' : 'Create Advertisement'}
    </ButtonGradient>
  </div>
</div>

<!-- Confirmation modal -->
<Modal bind:isOpen={showConfirmModal} title="Unsaved Changes">
  <div class="p-6">
    <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
      You have unsaved changes. Are you sure you want to leave without saving?
    </p>
    <div class="flex justify-end gap-4">
      <button
        onclick={() => (showConfirmModal = false)}
        class="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
      >
        Stay
      </button>
      <ButtonGradient onclick={confirmCancel} size="sm">
        Leave Without Saving
      </ButtonGradient>
    </div>
  </div>
</Modal>
