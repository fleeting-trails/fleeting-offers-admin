<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'

  let {
    isOpen = $bindable(),
    onSubmit,
    advertisementData,
  }: {
    isOpen: boolean
    onSubmit: (data: any) => void
    advertisementData: { title: string; description: string; id?: number }
  } = $props()

  let category = $state('')
  let tags = $state('')
  let industry = $state('')
  let dealType = $state('')
  let price = $state('')
  let validUntil = $state('')

  const handleSubmit = () => {
    if (category.trim() && industry.trim()) {
      onSubmit({
        ...advertisementData,
        category,
        tags: tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean),
        industry,
        dealType,
        price: price ? parseFloat(price) : null,
        validUntil: validUntil || null,
      })

      // Reset form
      category = ''
      tags = ''
      industry = ''
      dealType = ''
      price = ''
      validUntil = ''
      isOpen = false
    }
  }

  const handleBack = () => {
    isOpen = false
  }
</script>

<Modal bind:isOpen title="Additional Details" maxWidth="lg">
  {#snippet children()}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      class="space-y-6"
    >
      <!-- Advertisement Info Display -->
      <div
        class="bg-background-toned-0/30 dark:bg-background-toned-0-dark/30 rounded-lg p-4 mb-6"
      >
        <h3
          class="text-lg font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          {advertisementData.title}
        </h3>
        <p class="text-text-light dark:text-text-light-dark text-sm">
          {advertisementData.description}
        </p>
      </div>

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Category *
          </label>
          <select
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
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Industry *
          </label>
          <select
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Deal Type
          </label>
          <select
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
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Price
          </label>
          <input
            type="number"
            step="0.01"
            bind:value={price}
            placeholder="0.00"
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
          />
        </div>
      </div>

      <div>
        <label
          class="block text-sm font-medium text-text dark:text-text-dark mb-2"
        >
          Tags
        </label>
        <input
          type="text"
          bind:value={tags}
          placeholder="Enter tags separated by commas"
          class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
        />
      </div>

      <div>
        <label
          class="block text-sm font-medium text-text dark:text-text-dark mb-2"
        >
          Valid Until
        </label>
        <input
          type="date"
          bind:value={validUntil}
          class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark transition-all"
        />
      </div>

      <!-- Actions -->
      <div class="flex justify-between gap-3 pt-4">
        <button
          type="button"
          onclick={handleBack}
          class="px-4 py-2 cursor-pointer text-text-light dark:text-text-light-dark hover:text-text dark:hover:text-text-dark transition-colors"
        >
          Back
        </button>

        <ButtonGradient type="submit" size="md">Save</ButtonGradient>
      </div>
    </form>
  {/snippet}
</Modal>
