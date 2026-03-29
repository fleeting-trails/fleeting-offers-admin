<!-- Register Verification Form - Client Side -->
<script lang="ts">
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import UserCircleIcon from '$lib/icons/UserCircleIcon.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'
  import { sendRegistrationOtp, setPassword } from '$lib/api/auth'
  import { getApiErrorMessage } from '$lib/api/api'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import { toast } from 'svelte-sonner'
  import { goto } from '$app/navigation'

  let {
    email = $bindable(''),
    otp = $bindable(''),
    firstName = $bindable(''),
    lastName = $bindable(''),
    password = $bindable(''),
    confirmPassword = $bindable(''),
    agreeToTerms = $bindable(false),
  } = $props()

  let passwordsMatch = $derived(password === confirmPassword)

  let formValid = $derived(
    otp.trim() !== '' &&
      otp.length === 5 &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordsMatch &&
      agreeToTerms,
  )

  // Resend OTP Timer State
  let resendCountdown = $state(0)
  let isResending = $state(false)
  let resendInterval = $state<ReturnType<typeof setInterval> | null>(null)

  // Form submission state
  let isSubmitting = $state(false)

  // Start countdown timer
  const startResendCountdown = () => {
    resendCountdown = 180 // 3 minutes in seconds
    resendInterval = setInterval(() => {
      if (resendCountdown > 0) {
        resendCountdown--
      } else {
        clearInterval(resendInterval!)
        resendInterval = null
      }
    }, 1000)
  }

  // Format countdown time
  const formatCountdown = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return

    isResending = true

    try {
      const result = await sendRegistrationOtp(email)

      if (result.success) {
        toast.success('Verification code sent successfully!')
        startResendCountdown()
      } else {
        toast.error(result.message || 'Failed to send verification code')
      }
    } catch (error: any) {
      console.error('Resend OTP error:', error)

      if (error?.isApiError) {
        toast.error(getApiErrorMessage(error))
      } else {
        toast.error('Failed to send verification code')
      }
    } finally {
      isResending = false
    }
  }

  // Start countdown timer on mount
  $effect(() => {
    startResendCountdown()

    // Cleanup interval on unmount
    return () => {
      if (resendInterval) {
        clearInterval(resendInterval)
      }
    }
  })

  const handleCreateAccount = async () => {
    if (!formValid || isSubmitting) return

    isSubmitting = true

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`

      const result = await setPassword({
        email,
        otp,
        password,
        fullName,
      })

      if (result.success) {
        toast.success(
          'Account created successfully! Please login with your new password.',
        )

        // Clear form data
        otp = ''
        firstName = ''
        lastName = ''
        password = ''
        confirmPassword = ''
        agreeToTerms = false

        // Navigate to login page
        setTimeout(() => {
          goto('/login')
        }, 1000)
      } else {
        toast.error(result.message || 'Failed to create account')
      }
    } catch (error: any) {
      console.error('Account creation error:', error)

      if (error?.isApiError) {
        toast.error(getApiErrorMessage(error))
      } else {
        toast.error('Failed to create account. Please try again.')
      }
    } finally {
      isSubmitting = false
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && formValid) {
      handleCreateAccount()
    }
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    handleCreateAccount()
  }}
  class="space-y-6"
>
  <!-- Email confirmation -->
  <div class="text-center mb-6">
    <Text class="text-text-light dark:text-text-light-dark">
      We've sent a verification code to <strong
        class="text-text dark:text-text-dark">{email}</strong
      >
    </Text>
  </div>

  <!-- OTP Input -->
  <div class="relative group">
    <input
      id="otp"
      type="text"
      bind:value={otp}
      onkeydown={handleKeyDown}
      maxlength="5"
      required
      class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 text-center text-xl tracking-widest"
      placeholder="00000"
    />
  </div>

  <!-- Resend Code -->
  <div class="text-center">
    <button
      type="button"
      onclick={handleResendOtp}
      disabled={resendCountdown > 0 || isResending}
      class="text-sm text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200 disabled:text-text-light dark:disabled:text-text-light-dark disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {#if isResending}
        <LoadingSpinner size="sm" />
        <span>Sending...</span>
      {:else if resendCountdown > 0}
        <span>Resend in {formatCountdown(resendCountdown)}</span>
      {:else}
        <span>Resend verification code</span>
      {/if}
    </button>
  </div>

  <!-- Name Fields -->
  <div class="space-y-4">
    <div class="relative">
      <div class="grid grid-cols-2 gap-0">
        <div class="relative group">
          <input
            id="firstName"
            type="text"
            bind:value={firstName}
            onkeydown={handleKeyDown}
            required
            class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-tl-lg rounded-bl-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="First name"
          />
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
          >
            <UserCircleIcon scale={1} strokeWidth={2} />
          </div>
        </div>

        <div class="relative group">
          <input
            id="lastName"
            type="text"
            bind:value={lastName}
            onkeydown={handleKeyDown}
            required
            class="w-full px-4 py-4 border-t border-r border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-tr-lg rounded-br-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
            placeholder="Last name"
          />
          <div
            class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
          >
            <UserCircleIcon scale={1} strokeWidth={2} />
          </div>
        </div>
      </div>

      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-px h-4 bg-background-toned-3/40 dark:bg-background-toned-3-dark/40"
      ></div>
    </div>

    <!-- Password Fields -->
    <div class="relative">
      <div class="relative group">
        <input
          id="password"
          type="password"
          bind:value={password}
          onkeydown={handleKeyDown}
          required
          class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-t-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          placeholder="Create password"
        />
        <div
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
        >
          <LockClosedIcon scale={1} strokeWidth={2} />
        </div>
      </div>

      <div class="relative group">
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          onkeydown={handleKeyDown}
          required
          class="w-full px-4 py-4 border-x border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-b-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 {confirmPassword &&
          !passwordsMatch
            ? 'ring-2 ring-accent dark:ring-accent-dark'
            : ''}"
          placeholder="Confirm password"
        />
        <div
          class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
        >
          <LockClosedIcon scale={1} strokeWidth={2} />
        </div>
      </div>

      <div
        class="absolute top-1/2 left-4 right-16 h-px bg-background-toned-3/40 dark:bg-background-toned-3-dark/40"
      ></div>

      {#if confirmPassword && !passwordsMatch}
        <p class="mt-2 text-sm text-accent dark:text-accent-dark">
          Passwords do not match
        </p>
      {/if}
    </div>
  </div>

  <!-- Terms Agreement -->
  <div
    class="flex items-start gap-3 rounded-xl bg-background-pure/70 dark:bg-background-pure-dark/40 border border-background-toned-2/60 dark:border-background-toned-2-dark/60 px-4 py-4 transition-all duration-300 backdrop-blur-sm"
  >
    <input
      id="agreeToTerms"
      type="checkbox"
      bind:checked={agreeToTerms}
      class="w-4 h-4 mt-1 text-primary dark:text-primary-dark bg-background-pure dark:bg-background-pure-dark border-gray dark:border-gray-dark rounded focus:ring-primary dark:focus:ring-primary-dark focus:ring-2"
    />
    <label
      for="agreeToTerms"
      class="text-sm text-text-light dark:text-text-light-dark leading-relaxed"
    >
      I agree to the
      <button
        type="button"
        class="text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200"
      >
        Terms of Service
      </button>
      and
      <button
        type="button"
        class="text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200"
      >
        Privacy Policy
      </button>
    </label>
  </div>

  <!-- Submit Button -->
  <div class="pt-6">
    <button
      type="submit"
      disabled={!formValid || isSubmitting}
      class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
      ></div>

      <span class="relative flex items-center justify-center gap-2">
        {#if isSubmitting}
          <LoadingSpinner size="sm" />
          <span>Creating Account...</span>
        {:else}
          <span>Create Account</span>
          <div
            class="group-hover:translate-x-1 transition-transform duration-300"
          >
            <ArrowRightIcon scale={0.67} />
          </div>
        {/if}
      </span>
    </button>
  </div>
</form>
