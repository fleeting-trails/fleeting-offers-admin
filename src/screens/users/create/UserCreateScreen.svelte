<script lang="ts">
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import { createUser, fetchUserById, updateUser } from '$lib/api/user'
  import {
    USER_ROLES,
    type UserCreateData,
    type UserUpdateData,
    type RoleOption,
  } from '$lib/types/user'

  // State
  let isEditing = $state(false)
  let editId = $state<string | null>(null)
  let loading = $state(false)
  let loadingData = $state(false)

  // Form data
  let formData = $state({
    fullName: '',
    email: '',
    role: USER_ROLES.ADMIN as (typeof USER_ROLES)[keyof typeof USER_ROLES],
  })

  // Form errors
  let errors = $state({
    fullName: '',
    email: '',
    role: '',
  })

  // Role options
  const roleOptions: RoleOption[] = [
    { label: 'Super Admin', value: USER_ROLES.SUPER_ADMIN },
    { label: 'Admin', value: USER_ROLES.ADMIN },
    { label: 'Organization', value: USER_ROLES.ORGANIZATION },
  ]

  // Initialize editing mode
  onMount(() => {
    const editParam = $page.url.searchParams.get('edit')
    if (editParam) {
      isEditing = true
      editId = editParam
      loadUserData(editParam)
    }
  })

  // Load existing user data for editing
  const loadUserData = async (id: string) => {
    loadingData = true
    try {
      const user = await fetchUserById(id)
      formData.fullName = user.fullName
      formData.email = user.email
      formData.role = user.role as (typeof USER_ROLES)[keyof typeof USER_ROLES]
    } catch (error) {
      console.error('Error loading user:', error)
      toast.error('Failed to load user data')
      goto('/admin/users/list')
    } finally {
      loadingData = false
    }
  }

  // Validation
  const validateForm = (): boolean => {
    errors.fullName = ''
    errors.email = ''
    errors.role = ''

    let isValid = true

    if (!formData.fullName.trim()) {
      errors.fullName = 'Full name is required'
      isValid = false
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address'
      isValid = false
    }

    if (!formData.role) {
      errors.role = 'Role is required'
      isValid = false
    }

    return isValid
  }

  // Submit form
  const handleSubmit = async (event: Event) => {
    event.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting')
      return
    }

    loading = true
    try {
      if (isEditing && editId) {
        const updateData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          role: formData.role,
        }
        await updateUser(editId, updateData)
        toast.success('User updated successfully')
      } else {
        const createData: UserCreateData = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          role: formData.role,
        }
        await createUser(createData)
        toast.success('User created successfully')
      }

      goto('/admin/users/list')
    } catch (error) {
      console.error('Error saving user:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred'
      toast.error(
        isEditing
          ? `Failed to update user: ${errorMessage}`
          : `Failed to create user: ${errorMessage}`,
      )
    } finally {
      loading = false
    }
  }

  // Cancel and go back
  const handleCancel = () => {
    goto('/admin/users/list')
  }
</script>

<div class="p-6 max-w-4xl mx-auto">
  <!-- Page header -->
  <div class="mb-8">
    <div>
      <h1
        class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
      >
        {isEditing ? 'Edit User' : 'Create New User'}
      </h1>
      <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
        {isEditing
          ? 'Update user information and permissions'
          : 'Add a new user to your system'}
      </p>
    </div>
  </div>

  <!-- Loading state for data fetch -->
  {#if loadingData}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading user data...</span
      >
    </div>
  {:else}
    <!-- Form -->
    <form onsubmit={handleSubmit} class="space-y-8">
      <!-- Basic Information -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <h2
          class="text-lg font-semibold text-text-primary dark:text-text-primary-dark mb-6"
        >
          User Information
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              placeholder="Enter full name"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-colors duration-200"
              class:border-red-500={errors.fullName}
              disabled={loading}
            />
            {#if errors.fullName}
              <p class="text-red-500 text-sm mt-1">{errors.fullName}</p>
            {/if}
          </div>

          <!-- Email -->
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Email Address *
            </label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              placeholder="Enter email address"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-colors duration-200"
              class:border-red-500={errors.email}
              disabled={loading}
            />
            {#if errors.email}
              <p class="text-red-500 text-sm mt-1">{errors.email}</p>
            {/if}
          </div>

          <!-- Role -->
          <div class="md:col-span-1">
            <label
              for="role"
              class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-2"
            >
              Role *
            </label>
            <select
              id="role"
              bind:value={formData.role}
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-text-primary dark:text-text-primary-dark
                     focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     transition-colors duration-200"
              class:border-red-500={errors.role}
              disabled={loading}
            >
              {#each roleOptions as option}
                <option value={option.value}>{option.label}</option>
              {/each}
            </select>
            {#if errors.role}
              <p class="text-red-500 text-sm mt-1">{errors.role}</p>
            {/if}
          </div>
        </div>
      </div>

      <!-- Action buttons -->
      <div
        class="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-600"
      >
        <div class="flex gap-4">
          <button
            type="button"
            onclick={handleCancel}
            class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                   text-text-secondary dark:text-text-secondary-dark
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
                   focus:outline-none focus:ring-2 focus:ring-gray-400"
            disabled={loading}
          >
            Cancel
          </button>

          <ButtonGradient type="submit" disabled={loading}>
            {#if loading}
              <div class="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                <span>{isEditing ? 'Updating...' : 'Creating...'}</span>
              </div>
            {:else}
              {isEditing ? 'Update User' : 'Create User'}
            {/if}
          </ButtonGradient>
        </div>
      </div>
    </form>
  {/if}
</div>
