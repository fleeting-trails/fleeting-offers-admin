<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import type { CategoryDisplay, CategoryFormData } from '$lib/types/category'

  // Props
  let {
    isOpen = $bindable(false),
    category = null,
    onSubmit = (data: CategoryFormData) => {},
    loading = false,
  }: {
    isOpen: boolean
    category: CategoryDisplay | null
    onSubmit: (data: CategoryFormData) => void
    loading?: boolean
  } = $props()

  // Form state
  let name = $state('')
  let slug = $state('')
  let description = $state('')
  let parentCategory = $state('')
  let sortOrder = $state('')
  let isActive = $state(true)
  let icon = $state('')
  let color = $state('#3B82F6')

  // Form errors
  let errors = $state({
    name: '',
    slug: '',
    description: '',
  })

  // Parent categories
  const parentCategories = [
    'Fashion',
    'Electronics',
    'Food & Beverage',
    'Travel',
    'Entertainment',
    'Health & Beauty',
    'Sports & Recreation',
    'Home & Garden',
  ]

  // Update form when category changes
  $effect(() => {
    if (category) {
      name = category.name
      slug = category.slug
      description = ''
      parentCategory = ''
      sortOrder = ''
      isActive = true
      icon = ''
      color = '#3B82F6'
    }
  })

  // Validation
  const validateForm = (): boolean => {
    errors.name = ''
    errors.slug = ''
    errors.description = ''

    let isValid = true

    if (!name.trim()) {
      errors.name = 'Category name is required'
      isValid = false
    }

    if (!slug.trim()) {
      errors.slug = 'Slug is required'
      isValid = false
    }

    if (!description.trim()) {
      errors.description = 'Description is required'
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm() || loading) return

    const formData: CategoryFormData = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      parentCategory,
      sortOrder,
      isActive,
      icon,
      color,
    }

    onSubmit(formData)
  }

  // Auto-generate slug from name
  const generateSlug = () => {
    slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Handle close
  const handleClose = () => {
    if (!loading) {
      isOpen = false
    }
  }
</script>

<Modal bind:isOpen title="Edit Category" maxWidth="lg">
  {#snippet children()}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      class="space-y-6"
    >
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="edit-name"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Category Name *
          </label>
          <input
            id="edit-name"
            type="text"
            bind:value={name}
            onblur={generateSlug}
            disabled={loading}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
            placeholder="Enter category name"
          />
          {#if errors.name}
            <p class="text-red-500 text-sm mt-1">{errors.name}</p>
          {/if}
        </div>

        <div>
          <label
            for="edit-slug"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Slug *
          </label>
          <input
            id="edit-slug"
            type="text"
            bind:value={slug}
            disabled={loading}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
            placeholder="category-slug"
          />
          {#if errors.slug}
            <p class="text-red-500 text-sm mt-1">{errors.slug}</p>
          {/if}
        </div>
      </div>

      <div>
        <label
          for="edit-description"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Description *
        </label>
        <textarea
          id="edit-description"
          bind:value={description}
          rows="3"
          disabled={loading}
          class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50 resize-none"
          placeholder="Enter category description"
        ></textarea>
        {#if errors.description}
          <p class="text-red-500 text-sm mt-1">{errors.description}</p>
        {/if}
      </div>

      <!-- Additional Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="edit-parentCategory"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Parent Category
          </label>
          <select
            id="edit-parentCategory"
            bind:value={parentCategory}
            disabled={loading}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
          >
            <option value="">Select parent category</option>
            {#each parentCategories as parent}
              <option value={parent}>{parent}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            for="edit-sortOrder"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Sort Order
          </label>
          <input
            id="edit-sortOrder"
            type="number"
            bind:value={sortOrder}
            disabled={loading}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
            placeholder="0"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            for="edit-icon"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Icon Class
          </label>
          <input
            id="edit-icon"
            type="text"
            bind:value={icon}
            disabled={loading}
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark disabled:opacity-50"
            placeholder="icon-class-name"
          />
        </div>

        <div>
          <label
            for="edit-color"
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
          >
            Color
          </label>
          <input
            id="edit-color"
            type="color"
            bind:value={color}
            disabled={loading}
            class="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
          />
        </div>
      </div>

      <div>
        <label class="flex items-center">
          <input
            type="checkbox"
            bind:checked={isActive}
            disabled={loading}
            class="rounded border-gray-300 text-primary-600 focus:border-primary-500 focus:ring-primary-500 disabled:opacity-50"
          />
          <span
            class="ml-2 text-sm text-text-primary dark:text-text-primary-dark"
            >Active</span
          >
        </label>
      </div>

      <!-- Action buttons -->
      <div
        class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700"
      >
        <button
          type="button"
          onclick={handleClose}
          disabled={loading}
          class="px-4 py-2 text-text-secondary dark:text-text-secondary-dark hover:text-text-primary dark:hover:text-text-primary-dark transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          {#if loading}
            <LoadingSpinner size="sm" />
          {/if}
          Update Category
        </button>
      </div>
    </form>
  {/snippet}
</Modal>
