<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'
  import type { AdvertisementFormData } from '$lib/types/advertisement'

  let {
    isOpen = $bindable(false),
    onNext = (data: Partial<AdvertisementFormData>) => {},
  } = $props()

  let title = $state('')
  let subtitle = $state('')
  let description = $state('')
  let startDate = $state('')
  let expirationDate = $state('')

  const handleNext = () => {
    if (title.trim() && subtitle.trim() && description.trim()) {
      onNext({
        title,
        subtitle,
        description,
        startDate: startDate || undefined,
        expirationDate: expirationDate || undefined,
      })
      // Reset form
      title = ''
      subtitle = ''
      description = ''
      startDate = ''
      expirationDate = ''
      isOpen = false
    }
  }

  const handleCancel = () => {
    title = ''
    subtitle = ''
    description = ''
    startDate = ''
    expirationDate = ''
    isOpen = false
  }
</script>

<Modal bind:isOpen title="Create Advertisement" maxWidth="lg">
  {#snippet children()}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleNext()
      }}
      class="space-y-6"
    >
      <!-- Title, Subtitle and Description Fields -->
      <div class="relative">
        <div class="relative group">
          <input
            id="title"
            type="text"
            bind:value={title}
            required
            class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-t-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="Enter advertisement title"
          />
        </div>

        <div class="relative group">
          <input
            id="subtitle"
            type="text"
            bind:value={subtitle}
            required
            class="w-full px-4 py-4 border-x border-background-toned-2 dark:border-background-toned-2-dark outline-none bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="Enter advertisement subtitle"
          />
        </div>

        <div class="relative group">
          <textarea
            id="description"
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
            for="startDate"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Start Date (Optional)
          </label>
          <input
            id="startDate"
            type="datetime-local"
            bind:value={startDate}
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          />
        </div>

        <div class="relative group">
          <label
            for="expirationDate"
            class="block text-sm font-medium text-text dark:text-text-dark mb-2"
          >
            Expiration Date (Optional)
          </label>
          <input
            id="expirationDate"
            type="datetime-local"
            bind:value={expirationDate}
            class="w-full px-4 py-3 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onclick={handleCancel}
          class="px-4 py-2 cursor-pointer text-text-light dark:text-text-light-dark hover:text-text dark:hover:text-text-dark transition-colors"
        >
          Cancel
        </button>
        <ButtonGradient type="submit" size="md">Next</ButtonGradient>
      </div>
    </form>
  {/snippet}
</Modal>
