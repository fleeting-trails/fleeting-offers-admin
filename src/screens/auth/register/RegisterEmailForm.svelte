<!-- Register Email Step Form - Client Side -->
<script lang="ts">
  import { goto } from '$app/navigation'
  import { toast } from 'svelte-sonner'
  import MailIcon from '$lib/icons/MailIcon.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'
  import LoadingSpinner from '$lib/components/Loading/LoadingSpinner.svelte'
  import {
    sendRegistrationOtp,
    getApiErrorMessage,
    type ApiError,
  } from '$lib/api/auth'

  let { email = $bindable('') } = $props()

  let isLoading = $state(false)
  let errorMessage = $state('')

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  let emailValid = $derived(email.trim() !== '' && isValidEmail(email))

  const handleEmailNext = async () => {
    if (!emailValid || isLoading) return

    isLoading = true
    errorMessage = ''

    try {
      const response = await sendRegistrationOtp(email.trim())

      if (response.success) {
        toast.success('OTP sent successfully!', {
          description: 'Please check your email for the verification code.',
        })
        await goto(`/register?step=verify`)
      }
    } catch (error) {
      const message = getApiErrorMessage(error as ApiError)
      errorMessage = message
      toast.error('Failed to send OTP', {
        description: message,
      })
    } finally {
      isLoading = false
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && emailValid && !isLoading) {
      handleEmailNext()
    }
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    handleEmailNext()
  }}
  class="space-y-6"
>
  <div class="relative group">
    <input
      id="email"
      type="email"
      bind:value={email}
      onkeydown={handleKeyDown}
      disabled={isLoading}
      required
      class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 disabled:opacity-60 disabled:cursor-not-allowed
        {errorMessage ? 'border-red-500 dark:border-red-500' : ''}"
      placeholder="Enter your email address"
    />
    <div
      class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
    >
      <MailIcon scale={1} strokeWidth={2} />
    </div>
  </div>

  <!-- Error message -->
  {#if errorMessage}
    <div class="text-red-500 text-sm mt-2 px-1">
      {errorMessage}
    </div>
  {/if}

  <div class="pt-6">
    <button
      type="submit"
      disabled={!emailValid || isLoading}
      class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
      ></div>

      <span class="relative flex items-center justify-center gap-2">
        {#if isLoading}
          <LoadingSpinner size="sm" variant="white" />
          Sending OTP...
        {:else}
          Next
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
