<script lang="ts">
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import Modal from '$lib/components/Modal/Modal.svelte'

  let { isOpen = $bindable(false), onSubmit = () => {} } = $props()

  let title = $state('')
  let description = $state('')

  const handleSubmit = () => {
    if (title.trim() && description.trim()) {
      onSubmit({ title, description })
      // Reset form
      title = ''
      description = ''
      isOpen = false
    }
  }

  const handleCancel = () => {
    title = ''
    description = ''
    isOpen = false
  }
</script>

<Modal bind:isOpen title="Create Advertisement" maxWidth="lg">
  {#snippet children()}
    <form
      onsubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      class="space-y-6"
    >
      <!-- Title and Description Fields in single box style -->
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
          <textarea
            id="description"
            bind:value={description}
            required
            rows="4"
            class="w-full px-4 py-4 border-x border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-b-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 resize-none"
            placeholder="Enter advertisement description"
          ></textarea>
        </div>

        <div
          class="absolute top-1/2 left-4 right-4 h-px bg-background-toned-3/40 dark:bg-background-toned-3-dark/40 transform -translate-y-1/2"
        ></div>
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
