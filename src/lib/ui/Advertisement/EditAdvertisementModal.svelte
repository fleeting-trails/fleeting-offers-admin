<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'

  let {
    isOpen = $bindable(),
    onSubmit,
    advertisement,
  }: {
    isOpen: boolean
    onSubmit: (data: any) => void
    advertisement: {
      id: number
      title: string
      description: string
      category?: string
      industry?: string
      dealType?: string
      price?: number
      validUntil?: string
      tags?: string[]
    } | null
  } = $props()

  let title = $state('')
  let description = $state('')
  let category = $state('')
  let industry = $state('')
  let dealType = $state('')
  let price = $state('')
  let validUntil = $state('')
  let tags = $state('')

  $effect(() => {
    if (advertisement) {
      title = advertisement.title
      description = advertisement.description
      category = advertisement.category || ''
      industry = advertisement.industry || ''
      dealType = advertisement.dealType || ''
      price = advertisement.price ? advertisement.price.toString() : ''
      validUntil = advertisement.validUntil || ''
      tags = advertisement.tags?.join(', ') || ''
    }
  })

  const handleSubmit = () => {
    if (
      title.trim() &&
      description.trim() &&
      category.trim() &&
      industry.trim()
    ) {
      onSubmit({
        id: advertisement?.id,
        title,
        description,
        category,
        industry,
        dealType,
        price: price ? parseFloat(price) : null,
        validUntil: validUntil || null,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
      })
      isOpen = false
    }
  }

  const handleClose = () => {
    if (advertisement) {
      title = advertisement.title
      description = advertisement.description
      category = advertisement.category || ''
      industry = advertisement.industry || ''
      dealType = advertisement.dealType || ''
      price = advertisement.price ? advertisement.price.toString() : ''
      validUntil = advertisement.validUntil || ''
      tags = advertisement.tags?.join(', ') || ''
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
      <!-- Title and Description -->
      <div class="grid grid-cols-1 gap-4">
        <div>
          <label
            for="edit-title"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Title *
          </label>
          <input
            id="edit-title"
            type="text"
            bind:value={title}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
            placeholder="Enter advertisement title"
          />
        </div>

        <div>
          <label
            for="edit-description"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Description *
          </label>
          <textarea
            id="edit-description"
            bind:value={description}
            required
            rows="3"
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all resize-none"
            placeholder="Enter advertisement description"
          ></textarea>
        </div>
      </div>

      <!-- Category and Industry -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="edit-category"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Category *
          </label>
          <select
            id="edit-category"
            bind:value={category}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Category</option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Home & Garden">Home & Garden</option>
            <option value="Food & Beverage">Food & Beverage</option>
            <option value="Health & Beauty">Health & Beauty</option>
          </select>
        </div>

        <div>
          <label
            for="edit-industry"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Industry *
          </label>
          <select
            id="edit-industry"
            bind:value={industry}
            required
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Industry</option>
            <option value="Retail">Retail</option>
            <option value="Technology">Technology</option>
            <option value="Services">Services</option>
            <option value="Manufacturing">Manufacturing</option>
          </select>
        </div>
      </div>

      <!-- Deal Type and Price -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            for="edit-deal-type"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Deal Type
          </label>
          <select
            id="edit-deal-type"
            bind:value={dealType}
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          >
            <option value="">Select Deal Type</option>
            <option value="Discount">Discount</option>
            <option value="BOGO">Buy One Get One</option>
            <option value="Flash Sale">Flash Sale</option>
            <option value="Clearance">Clearance</option>
          </select>
        </div>

        <div>
          <label
            for="edit-price"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Price
          </label>
          <input
            id="edit-price"
            type="number"
            step="0.01"
            bind:value={price}
            placeholder="0.00"
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          />
        </div>
      </div>

      <!-- Tags -->
      <div>
        <label
          for="edit-tags"
          class="block text-sm font-medium text-text dark:text-text-dark mb-2"
        >
          Tags
        </label>
        <input
          id="edit-tags"
          type="text"
          bind:value={tags}
          placeholder="Enter tags separated by commas"
          class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
        />
      </div>

      <!-- Valid Until -->
      <div>
        <label
          for="edit-valid-until"
          class="block text-sm font-medium text-text dark:text-text-dark mb-2"
        >
          Valid Until
        </label>
        <input
          id="edit-valid-until"
          type="date"
          bind:value={validUntil}
          class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
        />
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
