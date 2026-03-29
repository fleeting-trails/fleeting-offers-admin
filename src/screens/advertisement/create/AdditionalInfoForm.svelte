<script lang="ts">
  // Props
  let {
    formData = {},
  }: {
    formData: any
  } = $props()
</script>

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
