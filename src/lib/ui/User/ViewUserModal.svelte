<script lang="ts">
  import Modal from '$lib/components/Modal/Modal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import type { UserDisplay } from '$lib/types/user'

  let {
    isOpen = $bindable(false),
    user = null,
    loading = false,
  }: {
    isOpen: boolean
    user: UserDisplay | null
    loading?: boolean
  } = $props()

  // Get role badge color
  const getRoleBadgeClass = (role: string) => {
    const roleColors = {
      SUPER_ADMIN:
        'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      ORGANIZATION:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      USER: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    }
    return roleColors[role as keyof typeof roleColors] || roleColors['USER']
  }

  // Get status badge class
  const getStatusBadgeClass = (isPasswordSet: boolean) => {
    return isPasswordSet
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
  }
</script>

<Modal bind:isOpen title="User Details" maxWidth="lg">
  {#if loading}
    <div class="flex justify-center items-center py-12">
      <LoadingSpinner />
      <span class="ml-2 text-text-secondary dark:text-text-secondary-dark"
        >Loading user details...</span
      >
    </div>
  {:else if user}
    <div class="space-y-6">
      <!-- Basic Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Full Name
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {user.fullName}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Username
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            @{user.username}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Email
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {user.email}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Role
          </label>
          <span
            class="inline-flex px-2 py-1 rounded-full text-xs font-medium {getRoleBadgeClass(
              user.role,
            )}"
          >
            {user.role}
          </span>
        </div>
      </div>

      <!-- Status Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Account Status
          </label>
          <span
            class="inline-flex px-2 py-1 rounded-full text-xs font-medium {getStatusBadgeClass(
              user.isPasswordSet,
            )}"
          >
            {user.statusText}
          </span>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Last Login
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {user.formattedLastLogin}
          </p>
        </div>
      </div>

      <!-- System Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            User ID
          </label>
          <p
            class="text-text-secondary dark:text-text-secondary-dark font-mono text-sm"
          >
            {user.id}
          </p>
        </div>
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Created At
          </label>
          <p class="text-text-secondary dark:text-text-secondary-dark">
            {user.formattedDate}
          </p>
        </div>
      </div>

      {#if user.restrictedUserSubRoleId}
        <div>
          <label
            class="block text-sm font-medium text-text-primary dark:text-text-primary-dark mb-1"
          >
            Restricted Sub-Role ID
          </label>
          <p
            class="text-text-secondary dark:text-text-secondary-dark font-mono text-sm"
          >
            {user.restrictedUserSubRoleId}
          </p>
        </div>
      {/if}
    </div>
  {:else}
    <div class="text-center py-8">
      <p class="text-text-secondary dark:text-text-secondary-dark">
        No user data available
      </p>
    </div>
  {/if}
</Modal>
