<script lang="ts">
  // Props
  let {
    formData = {},
    errors = {},
    dealTypes = [],
  }: {
    formData: any
    errors: any
    dealTypes: string[]
  } = $props()
</script>

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
    <p class="mt-1 text-sm text-text-secondary dark:text-text-secondary-dark">
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
