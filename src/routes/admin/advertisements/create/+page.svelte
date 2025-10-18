<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'

  // Types
  type TabId = 'basic' | 'details' | 'additional'

  // State
  let activeTab = $state<TabId>('basic')
  let isEditing = $state(false)
  let editId = $state<string | null>(null)

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

  // Modal state
  let showConfirmModal = $state(false)

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

  // Initialize editing mode if edit parameter exists
  onMount(() => {
    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadAdvertisementData(editParam)
    }
  })

  // Load existing advertisement data for editing
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

  // Validate form fields for a specific tab
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

<!-- Page header -->
<div class="p-6 max-w-4xl mx-auto">
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
    <!-- Basic Information Tab -->
    {#if activeTab === 'basic'}
      <div class="space-y-6">
        <div>
          <label
            for="title"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Advertisement Title *
          </label>
          <input
            id="title"
            type="text"
            bind:value={formData.title}
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              {errors.title
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            placeholder="Enter a compelling title for your advertisement"
          />
          {#if errors.title}
            <p class="mt-1 text-sm text-red-500">{errors.title}</p>
          {/if}
        </div>

        <div>
          <label
            for="description"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            bind:value={formData.description}
            rows="4"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              {errors.description
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark resize-none"
            placeholder="Provide a detailed description of your offer"
          ></textarea>
          {#if errors.description}
            <p class="mt-1 text-sm text-red-500">{errors.description}</p>
          {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="category"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Category *
            </label>
            <select
              id="category"
              bind:value={formData.category}
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                {errors.category
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            >
              <option value="">Select a category</option>
              {#each categories as category}
                <option value={category}>{category}</option>
              {/each}
            </select>
            {#if errors.category}
              <p class="mt-1 text-sm text-red-500">{errors.category}</p>
            {/if}
          </div>

          <div>
            <label
              for="industry"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Industry *
            </label>
            <select
              id="industry"
              bind:value={formData.industry}
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                {errors.industry
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            >
              <option value="">Select an industry</option>
              {#each industries as industry}
                <option value={industry}>{industry}</option>
              {/each}
            </select>
            {#if errors.industry}
              <p class="mt-1 text-sm text-red-500">{errors.industry}</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Deal Details Tab -->
    {:else if activeTab === 'details'}
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="dealType"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Deal Type *
            </label>
            <select
              id="dealType"
              bind:value={formData.dealType}
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                {errors.dealType
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            >
              <option value="">Select deal type</option>
              {#each dealTypes as dealType}
                <option value={dealType}>{dealType}</option>
              {/each}
            </select>
            {#if errors.dealType}
              <p class="mt-1 text-sm text-red-500">{errors.dealType}</p>
            {/if}
          </div>

          <div>
            <label
              for="price"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Price ($) *
            </label>
            <input
              id="price"
              type="number"
              step="0.01"
              min="0"
              bind:value={formData.price}
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
                {errors.price
                ? 'border-red-500'
                : 'border-gray-300 dark:border-gray-600'}
                bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
              placeholder="0.00"
            />
            {#if errors.price}
              <p class="mt-1 text-sm text-red-500">{errors.price}</p>
            {/if}
          </div>
        </div>

        <div>
          <label
            for="tags"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Tags
          </label>
          <input
            id="tags"
            type="text"
            bind:value={formData.tags}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            placeholder="Enter tags separated by commas (e.g., summer, sale, fashion)"
          />
          <p
            class="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark"
          >
            Add tags to help users find your advertisement
          </p>
        </div>

        <div>
          <label
            for="validUntil"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Valid Until *
          </label>
          <input
            id="validUntil"
            type="date"
            min={new Date().toISOString().split('T')[0]}
            bind:value={formData.validUntil}
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              {errors.validUntil
              ? 'border-red-500'
              : 'border-gray-300 dark:border-gray-600'}
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
          />
          {#if errors.validUntil}
            <p class="mt-1 text-sm text-red-500">{errors.validUntil}</p>
          {/if}
        </div>
      </div>

      <!-- Additional Information Tab -->
    {:else if activeTab === 'additional'}
      <div class="space-y-6">
        <div>
          <label
            for="targetAudience"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Target Audience
          </label>
          <textarea
            id="targetAudience"
            bind:value={formData.targetAudience}
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark resize-none"
            placeholder="Describe your target audience (age, interests, demographics, etc.)"
          ></textarea>
        </div>

        <div>
          <label
            for="location"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Location/Availability
          </label>
          <input
            id="location"
            type="text"
            bind:value={formData.location}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            placeholder="Where is this offer available? (e.g., Online, New York stores, Nationwide)"
          />
        </div>

        <div>
          <label
            for="contactInfo"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Contact Information
          </label>
          <input
            id="contactInfo"
            type="text"
            bind:value={formData.contactInfo}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            placeholder="Email, phone number, or website for inquiries"
          />
        </div>

        <div>
          <label
            for="termsConditions"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Terms & Conditions
          </label>
          <textarea
            id="termsConditions"
            bind:value={formData.termsConditions}
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500
              bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark resize-none"
            placeholder="Add any terms, conditions, or restrictions for this offer"
          ></textarea>
        </div>
      </div>
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
