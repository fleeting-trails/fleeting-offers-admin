<script lang="ts">
  import { goto } from '$app/navigation'
  import { onMount } from 'svelte'
  import { toast } from 'svelte-sonner'
  import ButtonGradient from '$lib/components/Button/ButtonGradient.svelte'
  import DeleteConfirmationModal from '$lib/components/Modal/DeleteConfirmationModal.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import UserTable from '$lib/ui/User/UserTable.svelte'
  import EditUserModal from '$lib/ui/User/EditUserModal.svelte'
  import ViewUserModal from '$lib/ui/User/ViewUserModal.svelte'
  import {
    fetchUsers,
    deleteUser,
    updateUser,
    fetchUserById,
  } from '$lib/api/user'
  import type {
    UserDisplay,
    UserListResponse,
    User,
    UserUpdateData,
  } from '$lib/types/user'

  // State
  let isEditModalOpen = $state(false)
  let isViewModalOpen = $state(false)
  let isDeleteModalOpen = $state(false)
  let editingUser = $state<UserDisplay | null>(null)
  let viewingUser = $state<UserDisplay | null>(null)
  let deletingUserId = $state<string | null>(null)
  let loading = $state(false)
  let submitLoading = $state(false)

  // User data
  let users = $state<UserDisplay[]>([])
  let totalItems = $state(0)
  let currentPage = $state(1)
  let pageSize = $state(10)
  let totalPages = $state(0)

  // Transform user data for display
  const transformUser = (user: User): UserDisplay => ({
    ...user,
    formattedDate: new Date(user.createdAt).toLocaleDateString(),
    formattedLastLogin: user.lastLoggedIn
      ? new Date(user.lastLoggedIn).toLocaleDateString()
      : 'Never',
    statusText: user.isPasswordSet ? 'Active' : 'Pending Setup',
  })

  // Load users
  const loadUsers = async () => {
    loading = true
    try {
      const response = await fetchUsers(currentPage, pageSize)

      if (response.success) {
        users = response.data.items.map(transformUser)
        totalItems = response.data.totalItems
        totalPages = response.data.totalPages
      } else {
        throw new Error(response.message || 'Failed to load users')
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      loading = false
    }
  }

  // Initialize data
  onMount(() => {
    loadUsers()
  })

  // Action handlers
  const handleView = async (id: string) => {
    try {
      const user = await fetchUserById(id)
      viewingUser = transformUser(user)
      isViewModalOpen = true
    } catch (error) {
      console.error('Error loading user:', error)
      toast.error('Failed to load user details')
    }
  }

  const handleEdit = (id: string) => {
    const user = users.find((u) => u.id === id)
    if (!user) return
    editingUser = user
    isEditModalOpen = true
  }

  const handleDelete = (id: string) => {
    deletingUserId = id
    isDeleteModalOpen = true
  }

  const handleEditSubmit = async (data: UserUpdateData) => {
    if (!editingUser) return

    submitLoading = true
    try {
      // Remove id from data since updateUser handles it separately
      const { id, ...updateData } = data
      await updateUser(editingUser.id, updateData)

      // Update local data
      users = users.map((user) =>
        user.id === editingUser!.id
          ? {
              ...user,
              fullName: updateData.fullName || user.fullName,
              username: updateData.username || user.username,
              email: updateData.email || user.email,
              role: updateData.role || user.role,
            }
          : user,
      )

      isEditModalOpen = false
      editingUser = null
      toast.success('User updated successfully')
    } catch (error) {
      console.error('Error updating user:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to update user'
      toast.error(errorMessage)
    } finally {
      submitLoading = false
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deletingUserId) return

    try {
      await deleteUser(deletingUserId)

      // Remove from local data
      users = users.filter((u) => u.id !== deletingUserId)
      totalItems--

      toast.success('User deleted successfully')
    } catch (error) {
      console.error('Error deleting user:', error)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to delete user'
      toast.error(errorMessage)
    } finally {
      deletingUserId = null
      isDeleteModalOpen = false
    }
  }

  const cancelDelete = () => {
    deletingUserId = null
    isDeleteModalOpen = false
  }

  const handleCreateNew = () => {
    goto('/admin/users/create')
  }
</script>

<div class="p-6 w-full">
  <!-- Page header -->
  <div class="mb-6">
    <div
      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
      <div>
        <h1
          class="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
        >
          Users
        </h1>
        <p class="text-text-secondary dark:text-text-secondary-dark mt-1">
          Manage system users and their permissions
        </p>
      </div>
      <div class="flex gap-3">
        <ButtonGradient onclick={handleCreateNew}>
          <div class="flex items-center gap-2 whitespace-nowrap">
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Create User</span>
          </div>
        </ButtonGradient>
      </div>
    </div>
  </div>

  <!-- Table -->
  <UserTable
    {users}
    {loading}
    onView={handleView}
    onEdit={handleEdit}
    onDelete={handleDelete}
  />
</div>

<!-- Modals -->
<ViewUserModal bind:isOpen={isViewModalOpen} user={viewingUser} />

<EditUserModal
  bind:isOpen={isEditModalOpen}
  user={editingUser}
  onSubmit={handleEditSubmit}
  loading={submitLoading}
/>

<DeleteConfirmationModal
  bind:isOpen={isDeleteModalOpen}
  title="Delete User"
  message="Are you sure you want to delete this user? This action cannot be undone."
  onConfirm={handleDeleteConfirm}
  onCancel={cancelDelete}
  loading={submitLoading}
/>
