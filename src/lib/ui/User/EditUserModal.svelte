<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import ButtonPrimary from '$lib/components/Button/ButtonPrimary.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import {
    USER_ROLES,
    type UserDisplay,
    type UserUpdateData,
    type RoleOption,
  } from '$lib/types/user'

  let {
    isOpen = $bindable(false),
    user = null,
    loading = false,
    onSubmit = (data: UserUpdateData) => {},
  }: {
    isOpen: boolean
    user: UserDisplay | null
    loading?: boolean
    onSubmit: (data: UserUpdateData) => void
  } = $props()

  // Form state
  let formData = $state({
    fullName: '',
    username: '',
    email: '',
    role: '',
  })

  // Form errors
  let errors = $state({
    fullName: '',
    username: '',
    email: '',
    role: '',
  })

  // Role options
  const roleOptions: RoleOption[] = [
    { label: 'Super Admin', value: USER_ROLES.SUPER_ADMIN },
    { label: 'Admin', value: USER_ROLES.ADMIN },
    { label: 'Organization', value: USER_ROLES.ORGANIZATION },
  ]

  // Update form when user changes
  $effect(() => {
    if (user) {
      formData.fullName = user.fullName
      formData.username = user.username
      formData.email = user.email
      formData.role = user.role
      clearErrors()
    }
  })

  const handleClose = () => {
    if (!loading) {
      isOpen = false
    }
  }

  const clearErrors = () => {
    errors.fullName = ''
    errors.username = ''
    errors.email = ''
    errors.role = ''
  }

  const validateForm = () => {
    clearErrors()
    let isValid = true

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
      isValid = false
    }

    if (!formData.username.trim()) {
      errors.username = 'Username is required'
      isValid = false
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username =
        'Username can only contain letters, numbers, and underscores'
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!formData.role) {
      errors.role = 'Role is required'
      isValid = false
    }

    return isValid
  }

  const handleSubmit = (event: Event) => {
    event.preventDefault()
    if (!validateForm() || !user) return

    const updateData: UserUpdateData = {
      id: user.id,
      fullName: formData.fullName.trim(),
      username: formData.username.trim(),
      email: formData.email.trim(),
      role: formData.role,
    }

    onSubmit(updateData)
  }
</script>

<Modal bind:isOpen title="Edit User" maxWidth="lg">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Updating user...</span
      >
    </div>
  {:else if user}
    <form onsubmit={handleSubmit} class="space-y-6">
      <!-- Full Name -->
      <div>
        <label
          for="fullName"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Full Name *
        </label>
        <input
          id="fullName"
          type="text"
          bind:value={formData.fullName}
          class="w-full px-3 py-2 border border-border-light dark:border-border-light-dark rounded-md bg-background-pure dark:bg-background-pure-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          placeholder="Enter full name"
          disabled={loading}
        />
        {#if errors.fullName}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.fullName}
          </p>
        {/if}
      </div>

      <!-- Username -->
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Username *
        </label>
        <input
          id="username"
          type="text"
          bind:value={formData.username}
          class="w-full px-3 py-2 border border-border-light dark:border-border-light-dark rounded-md bg-background-pure dark:bg-background-pure-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          placeholder="Enter username"
          disabled={loading}
        />
        {#if errors.username}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.username}
          </p>
        {/if}
      </div>

      <!-- Email -->
      <div>
        <label
          for="email"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Email *
        </label>
        <input
          id="email"
          type="email"
          bind:value={formData.email}
          class="w-full px-3 py-2 border border-border-light dark:border-border-light-dark rounded-md bg-background-pure dark:bg-background-pure-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          placeholder="Enter email address"
          disabled={loading}
        />
        {#if errors.email}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.email}
          </p>
        {/if}
      </div>

      <!-- Role -->
      <div>
        <label
          for="role"
          class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
        >
          Role *
        </label>
        <select
          id="role"
          bind:value={formData.role}
          class="w-full px-3 py-2 border border-border-light dark:border-border-light-dark rounded-md bg-background-pure dark:bg-background-pure-dark text-text dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark"
          disabled={loading}
        >
          <option value="">Select a role</option>
          {#each roleOptions as option}
            <option value={option.value}>{option.label}</option>
          {/each}
        </select>
        {#if errors.role}
          <p class="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.role}
          </p>
        {/if}
      </div>

      <!-- Form Actions -->
      <div
        class="flex justify-end gap-3 pt-4 border-t border-border-light dark:border-border-light-dark"
      >
        <ButtonPrimary type="button" onclick={handleClose} disabled={loading}>
          Cancel
        </ButtonPrimary>
        <ButtonGradient type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update User'}
        </ButtonGradient>
      </div>
    </form>
  {:else}
    <div class="text-center py-8">
      <p class="text-text-secondary dark:text-text-secondary-dark">
        No user data available
      </p>
    </div>
  {/if}
</Modal>
