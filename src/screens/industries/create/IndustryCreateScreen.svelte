<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'

  type TabId = 'basic' | 'details'

  // State
  let activeTab = $state<TabId>('basic')
  let isEditing = $state(false)
  let editId = $state<string | null>(null)
  let showConfirmModal = $state(false)

  // Tab configuration
  const tabs = [
    { id: 'basic' as TabId, label: 'Basic Information', order: 1 },
    { id: 'details' as TabId, label: 'Industry Details', order: 2 },
  ]

  // Form data
  let formData = $state({
    name: '',
    description: '',
    code: '',
    parentIndustry: '',
    isActive: true,
    sortOrder: '',
    tags: '',
    sector: '',
    naicsCode: '',
  })

  // Form errors
  let errors = $state({
    name: '',
    description: '',
    code: '',
    sortOrder: '',
    naicsCode: '',
  })

  // Industry sectors
  const sectors = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Education',
    'Real Estate',
    'Transportation',
    'Energy',
    'Media & Entertainment',
    'Agriculture',
    'Hospitality',
  ]

  // Parent industries
  const parentIndustries = [
    'Technology & Software',
    'Healthcare & Medical',
    'Financial Services',
    'Retail & E-commerce',
    'Manufacturing & Industrial',
    'Education & Training',
    'Real Estate & Construction',
    'Transportation & Logistics',
  ]

  // Initialize editing mode
  onMount(() => {
    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadIndustryData(editParam)
    }
  })

  // Load existing industry data
  const loadIndustryData = (id: string) => {
    const mockData = {
      name: 'E-commerce Technology',
      description: 'Online retail and digital commerce platforms',
      code: 'ECOM-001',
      parentIndustry: 'Technology & Software',
      isActive: true,
      sortOrder: '1',
      tags: 'ecommerce, technology, retail, digital',
      sector: 'Technology',
      naicsCode: '454110',
    }

    formData = { ...mockData }
  }

  // Validation
  const validateTab = (tab: TabId): boolean => {
    let isValid = true

    if (tab === 'basic') {
      errors.name = ''
      errors.description = ''
      errors.code = ''

      if (!formData.name.trim()) {
        errors.name = 'Industry name is required'
        isValid = false
      }
      if (!formData.description.trim()) {
        errors.description = 'Description is required'
        isValid = false
      }
      if (!formData.code.trim()) {
        errors.code = 'Industry code is required'
        isValid = false
      }
    }

    if (tab === 'details') {
      errors.sortOrder = ''
      errors.naicsCode = ''

      if (formData.sortOrder && isNaN(Number(formData.sortOrder))) {
        errors.sortOrder = 'Sort order must be a number'
        isValid = false
      }
      if (
        formData.naicsCode &&
        (formData.naicsCode.length !== 6 || isNaN(Number(formData.naicsCode)))
      ) {
        errors.naicsCode = 'NAICS code must be 6 digits'
        isValid = false
      }
    }

    return isValid
  }

  // Tab navigation
  const handleTabChange = (tabId: TabId) => {
    if (validateTab(activeTab)) {
      activeTab = tabId
    }
  }

  // Navigation
  const handleCancel = () => {
    if (hasUnsavedChanges()) {
      showConfirmModal = true
    } else {
      goto('/admin/industries/list')
    }
  }

  const confirmCancel = () => {
    showConfirmModal = false
    goto('/admin/industries/list')
  }

  const hasUnsavedChanges = (): boolean => {
    return Object.values(formData).some((value) =>
      typeof value === 'string' ? value.trim() !== '' : value !== true,
    )
  }

  const handleSubmit = () => {
    const isBasicValid = validateTab('basic')
    const isDetailsValid = validateTab('details')

    if (isBasicValid && isDetailsValid) {
      console.log('Submitting industry:', formData)
      goto('/admin/industries/list')
    } else {
      if (!isBasicValid) {
        activeTab = 'basic'
      } else if (!isDetailsValid) {
        activeTab = 'details'
      }
    }
  }

  // Auto-generate code from name
  const generateCode = () => {
    formData.code = formData.name
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 10)
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
        ← Back to Industries
      </button>
    </div>
    <h1
      class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
    >
      {isEditing ? 'Edit Industry' : 'Create New Industry'}
    </h1>
    <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
      Fill in the information to create your industry classification
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
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'}"
        >
          {tab.label}
        </button>
      {/each}
    </nav>
  </div>

  <!-- Tab content -->
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    {#if activeTab === 'basic'}
      <!-- Basic Information -->
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="name"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Industry Name *
            </label>
            <input
              id="name"
              type="text"
              bind:value={formData.name}
              onblur={generateCode}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
              placeholder="Enter industry name"
            />
            {#if errors.name}
              <p class="text-red-500 text-sm mt-1">{errors.name}</p>
            {/if}
          </div>

          <div>
            <label
              for="code"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Industry Code *
            </label>
            <input
              id="code"
              type="text"
              bind:value={formData.code}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
              placeholder="INDUSTRY-001"
            />
            {#if errors.code}
              <p class="text-red-500 text-sm mt-1">{errors.code}</p>
            {/if}
          </div>
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
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark resize-none"
            placeholder="Enter industry description"
          ></textarea>
          {#if errors.description}
            <p class="text-red-500 text-sm mt-1">{errors.description}</p>
          {/if}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="sector"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Sector
            </label>
            <select
              id="sector"
              bind:value={formData.sector}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            >
              <option value="">Select sector</option>
              {#each sectors as sector}
                <option value={sector}>{sector}</option>
              {/each}
            </select>
          </div>

          <div>
            <label
              for="parentIndustry"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Parent Industry
            </label>
            <select
              id="parentIndustry"
              bind:value={formData.parentIndustry}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            >
              <option value="">Select parent industry</option>
              {#each parentIndustries as industry}
                <option value={industry}>{industry}</option>
              {/each}
            </select>
          </div>
        </div>
      </div>
    {:else if activeTab === 'details'}
      <!-- Industry Details -->
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              for="sortOrder"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Sort Order
            </label>
            <input
              id="sortOrder"
              type="number"
              bind:value={formData.sortOrder}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
              placeholder="0"
            />
            {#if errors.sortOrder}
              <p class="text-red-500 text-sm mt-1">{errors.sortOrder}</p>
            {/if}
          </div>

          <div>
            <label
              for="naicsCode"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              NAICS Code
            </label>
            <input
              id="naicsCode"
              type="text"
              bind:value={formData.naicsCode}
              maxlength="6"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
              placeholder="123456"
            />
            {#if errors.naicsCode}
              <p class="text-red-500 text-sm mt-1">{errors.naicsCode}</p>
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
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark"
            placeholder="tag1, tag2, tag3"
          />
          <p class="text-text-light dark:text-text-light-dark text-xs mt-1">
            Separate tags with commas
          </p>
        </div>

        <div>
          <label class="flex items-center">
            <input
              type="checkbox"
              bind:checked={formData.isActive}
              class="rounded border-gray-300 text-primary-600 focus:border-primary-500 focus:ring-primary-500"
            />
            <span
              class="ml-2 text-sm text-text-primary dark:text-text-primary-dark"
              >Active</span
            >
          </label>
        </div>
      </div>
    {/if}
  </div>

  <!-- Action buttons -->
  <div class="flex justify-between mt-6">
    <button
      onclick={handleCancel}
      class="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
    >
      Cancel
    </button>

    <div class="flex gap-3">
      {#if activeTab !== 'basic'}
        <button
          onclick={() => (activeTab = 'basic')}
          class="px-6 py-2 border border-gray-300 dark:border-gray-600 text-text-primary dark:text-text-primary-dark rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>
      {/if}

      {#if activeTab !== 'details'}
        <button
          onclick={() => handleTabChange('details')}
          class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          Next
        </button>
      {:else}
        <ButtonGradient onclick={handleSubmit}>
          {isEditing ? 'Update Industry' : 'Create Industry'}
        </ButtonGradient>
      {/if}
    </div>
  </div>
</div>

<!-- Confirmation Modal -->
<Modal bind:isOpen={showConfirmModal} title="Unsaved Changes" maxWidth="md">
  {#snippet children()}
    <p class="text-text-secondary dark:text-text-secondary-dark mb-6">
      You have unsaved changes. Are you sure you want to leave this page?
    </p>
    <div class="flex justify-end gap-3">
      <button
        onclick={() => (showConfirmModal = false)}
        class="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors"
      >
        Stay
      </button>
      <button
        onclick={confirmCancel}
        class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
      >
        Leave
      </button>
    </div>
  {/snippet}
</Modal>
