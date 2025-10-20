<!-- Login Form Component - Client Side -->
<script lang="ts">
  import { goto } from '$app/navigation'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import MailIcon from '$lib/icons/MailIcon.svelte'
  import { loginUser, storeAuthToken, storeUserData } from '$lib/api/auth'
  import { getApiErrorMessage } from '$lib/api/api'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import { toast } from 'svelte-sonner'

  let email = $state('')
  let password = $state('')
  let rememberMe = $state(false)
  let isLoading = $state(false)

  let formValid = $derived(
    email.trim() !== '' && password.trim() !== '' && email.includes('@'),
  )

  const handleLogin = async () => {
    if (!formValid || isLoading) return

    isLoading = true

    try {
      const response = await loginUser(email.trim(), password)

      if (response.success && response.data) {
        const { user, token } = response.data

        // Store auth data
        storeAuthToken(token)
        storeUserData(user)

        toast.success(`Welcome back, ${user.fullName}!`)

        // Clear form
        email = ''
        password = ''
        rememberMe = false

        // Navigate to admin dashboard
        setTimeout(() => {
          goto('/admin')
        }, 1000)
      } else {
        toast.error(response.message || 'Login failed')
      }
    } catch (error: any) {
      console.error('Login error:', error)

      if (error?.isApiError) {
        const errorMessage = getApiErrorMessage(error)
        toast.error('Login Failed', {
          description: errorMessage,
        })
      } else {
        toast.error('Login failed. Please try again.')
      }
    } finally {
      isLoading = false
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && formValid && !isLoading) {
      handleLogin()
    }
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    handleLogin()
  }}
  class="space-y-6"
>
  <!-- Email and Password Fields -->
  <div class="relative">
    <div class="relative group">
      <input
        id="email"
        type="email"
        bind:value={email}
        onkeydown={handleKeyDown}
        required
        class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-t-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
        placeholder="Enter your email"
      />
      <div
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
      >
        <MailIcon scale={1} strokeWidth={2} />
      </div>
    </div>

    <div class="relative group">
      <input
        id="password"
        type="password"
        bind:value={password}
        onkeydown={handleKeyDown}
        required
        class="w-full px-4 py-4 border-x border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-b-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
        placeholder="Enter your password"
      />
      <div
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
      >
        <LockClosedIcon scale={1} strokeWidth={2} />
      </div>
    </div>

    <div
      class="absolute top-1/2 left-4 right-16 h-px bg-background-toned-3/50 dark:bg-background-toned-3-dark/50 transform -translate-y-1/2"
    ></div>
  </div>

  <!-- Remember Me and Forgot Password -->
  <div class="flex items-center justify-between">
    <label class="flex items-center">
      <input
        type="checkbox"
        bind:checked={rememberMe}
        class="w-4 h-4 text-primary dark:text-primary-dark bg-background-pure dark:bg-background-pure-dark border-gray dark:border-gray-dark rounded focus:ring-primary dark:focus:ring-primary-dark focus:ring-2"
      />
      <span class="ml-2 text-sm text-text-light dark:text-text-light-dark"
        >Remember me</span
      >
    </label>
    <button
      type="button"
      onclick={() => goto('/forgot-password')}
      class="text-sm text-primary cursor-pointer dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200"
    >
      Forgot password?
    </button>
  </div>

  <!-- Submit Button -->
  <div class="pt-6">
    <button
      type="submit"
      disabled={!formValid || isLoading}
      class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
      ></div>

      <span class="relative flex items-center justify-center gap-2">
        {#if isLoading}
          <LoadingSpinner size="sm" variant="white" />
          <span>Signing In...</span>
        {:else}
          <span>Sign In</span>
          <svg
            class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            ></path>
          </svg>
        {/if}
      </span>
    </button>
  </div>
</form>

<!-- Register Link -->
<div class="mt-8 text-center">
  <Text variant="span" class="text-text-light dark:text-text-light-dark">
    Don't have an account?
  </Text>
  <a
    href="/register"
    class="ml-1 text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark font-medium transition-colors duration-200"
  >
    Register
  </a>
</div>
