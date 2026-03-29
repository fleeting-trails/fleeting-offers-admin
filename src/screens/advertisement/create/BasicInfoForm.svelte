<script lang="ts">
  // Props
  let {
    formData = {},
    errors = {},
    categories = [],
    industries = [],
  }: {
    formData: any
    errors: any
    categories: string[]
    industries: string[]
  } = $props()
</script>

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
