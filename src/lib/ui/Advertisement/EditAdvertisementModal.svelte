<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'
  import type {
    AdvertisementDisplay,
    AdvertisementFormData,
  } from '$lib/types/advertisement'

  let {
    isOpen = $bindable(),
    onSubmit,
    advertisement,
  }: {
    isOpen: boolean
    onSubmit: (data: AdvertisementFormData) => void
    advertisement: AdvertisementDisplay | null
  } = $props()

  let title = $state('')
  let subtitle = $state('')
  let description = $state('')
  let startDate = $state('')
  let expirationDate = $state('')
  let categoryId = $state('')
  let subCategoryId = $state('')
  let dealTypeId = $state('')

  // Update form when advertisement changes
  $effect(() => {
    if (advertisement) {
      title = advertisement.title
      subtitle = advertisement.subtitle
      description = advertisement.description
      startDate = advertisement.startDate
        ? advertisement.startDate.substring(0, 16)
        : ''
      expirationDate = advertisement.expirationDate
        ? advertisement.expirationDate.substring(0, 16)
        : ''
      categoryId = ''
      subCategoryId = ''
      dealTypeId = ''
    }
  })

  // Handle form submission
  const handleSubmit = () => {
    if (
      title.trim() &&
      subtitle.trim() &&
      description.trim() &&
      categoryId.trim() &&
      subCategoryId.trim() &&
      dealTypeId.trim()
    ) {
      onSubmit({
        title,
        subtitle,
        description,
        startDate: startDate || undefined,
        expirationDate: expirationDate || undefined,
        categoryId,
        subCategoryId,
        dealTypeId,
        locations: [],
        tags: [],
        owners: [],
      })
      isOpen = false
    }
  }

  const handleClose = () => {
    if (advertisement) {
      title = advertisement.title
      subtitle = advertisement.subtitle
      description = advertisement.description
      startDate = advertisement.startDate
        ? advertisement.startDate.substring(0, 16)
        : ''
      expirationDate = advertisement.expirationDate
        ? advertisement.expirationDate.substring(0, 16)
        : ''
    }
    isOpen = false
  }
</script>

<Modal bind:isOpen title="Edit Advertisement" maxWidth="lg">
  {#snippet children()}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      class="space-y-6"
    >
      <!-- Basic Information -->
      <div class="relative">
        <div class="relative group">
          <input
            id="edit-title"
            type="text"
            bind:value={title}
            required
            class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-t-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="Enter advertisement title"
          />
        </div>

        <div class="relative group">
          <input
            id="edit-subtitle"
            type="text"
            bind:value={subtitle}
            required
            class="w-full px-4 py-4 border-x border-background-toned-2 dark:border-background-toned-2-dark outline-none bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="Enter advertisement subtitle"
          />
        </div>

        <div class="relative group">
          <textarea
            id="edit-description"
            bind:value={description}
            required
            rows="4"
            class="w-full px-4 py-4 border-x border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-b-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 resize-none"
            placeholder="Enter advertisement description"
          ></textarea>
        </div>
      </div>

      <!-- Date Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative group">
          <label
            for="edit-startDate"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Start Date (Optional)
          </label>
          <input
            id="edit-startDate"
            type="datetime-local"
            bind:value={startDate}
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          />
        </div>

        <div class="relative group">
          <label
            for="edit-expirationDate"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Expiration Date (Optional)
          </label>
          <input
            id="edit-expirationDate"
            type="datetime-local"
            bind:value={expirationDate}
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          />
        </div>
      </div>

      <!-- Category, Sub Category, and Deal Type -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            for="edit-category"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Category *
          </label>
          <select
            id="edit-category"
            bind:value={categoryId}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Category</option>
            <option value="cat1">Fashion</option>
            <option value="cat2">Electronics</option>
            <option value="cat3">Home & Garden</option>
            <option value="cat4">Food & Beverage</option>
            <option value="cat5">Health & Beauty</option>
            <option value="cat6">Sports & Recreation</option>
          </select>
        </div>

        <div>
          <label
            for="edit-subCategory"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Sub Category *
          </label>
          <select
            id="edit-subCategory"
            bind:value={subCategoryId}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Sub Category</option>
            <option value="sub1">Retail Clothing</option>
            <option value="sub2">Consumer Electronics</option>
            <option value="sub3">Interior Design</option>
            <option value="sub4">Fitness Equipment</option>
            <option value="sub5">Gourmet Foods</option>
            <option value="sub6">Skincare</option>
          </select>
        </div>

        <div>
          <label
            for="edit-dealType"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Deal Type *
          </label>
          <select
            id="edit-dealType"
            bind:value={dealTypeId}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Deal Type</option>
            <option value="deal1">Percentage Discount</option>
            <option value="deal2">Flash Sale</option>
            <option value="deal3">Clearance Sale</option>
            <option value="deal4">Seasonal Offer</option>
            <option value="deal5">Limited Time Offer</option>
            <option value="deal6">Bundle Deal</option>
          </select>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onclick={handleClose}
          class="px-4 py-2 cursor-pointer text-text-light dark:text-text-light-dark hover:text-text dark:hover:text-text-dark transition-colors"
        >
          Cancel
        </button>

        <ButtonGradient type="submit" size="md">
          Update Advertisement
        </ButtonGradient>
      </div>
    </form>
  {/snippet}
</Modal>
