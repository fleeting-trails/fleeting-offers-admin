<!-- Register Screen -->
<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import { browser } from '$app/environment'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import AuthBackground from '$lib/ui/layouts/AuthBackground.svelte'
  import AuthCard from '$lib/ui/layouts/AuthCard.svelte'
  import AuthHeader from '$lib/ui/layouts/AuthHeader.svelte'
  import RegisterEmailForm from './RegisterEmailForm.svelte'
  import RegisterVerifyForm from './RegisterVerifyForm.svelte'
  import { toast } from 'svelte-sonner'

  let email = $state('')
  let otp = $state('')
  let firstName = $state('')
  let lastName = $state('')
  let password = $state('')
  let confirmPassword = $state('')
  let agreeToTerms = $state(false)

  let rawStep = $derived($page.url.searchParams.get('step'))
  let currentStep = $state('email')
  let isInitialized = $state(false)

  // Handle URL and state synchronization
  $effect(() => {
    if (!browser) return

    const urlStep = rawStep || null

    // If no step parameter, redirect to ?step=email
    if (!urlStep) {
      goto('/register?step=email', { replaceState: true })
      currentStep = 'email'
      isInitialized = true
      return
    }

    // If on verify step but no email, redirect to email step
    if (urlStep === 'verify' && (!email || email.trim() === '')) {
      if (isInitialized) {
        toast.error('Email is required. Please start from the beginning.')
      }
      goto('/register?step=email', { replaceState: true })
      currentStep = 'email'
      isInitialized = true
      return
    }

    // Update current step if valid
    if (urlStep === 'email' || urlStep === 'verify') {
      currentStep = urlStep
      isInitialized = true
    } else {
      // Invalid step, redirect to email
      goto('/register?step=email', { replaceState: true })
      currentStep = 'email'
      isInitialized = true
    }
  })

  const getStepTitle = (step: string): string => {
    switch (step) {
      case 'email':
        return 'Create Account'
      case 'verify':
        return 'Complete Setup'
      default:
        return 'Create Account'
    }
  }

  const getStepDescription = (step: string): string => {
    switch (step) {
      case 'email':
        return 'Enter your email to get started'
      case 'verify':
        return 'Verify your email and create your account'
      default:
        return 'Register for admin access'
    }
  }
</script>

<AuthBackground>
  <AuthCard maxWidth="xl">
    <AuthHeader
      title={getStepTitle(currentStep)}
      description={getStepDescription(currentStep)}
    />

    {#if isInitialized}
      {#if currentStep === 'email'}
        <RegisterEmailForm bind:email />
      {:else if currentStep === 'verify'}
        <RegisterVerifyForm
          bind:email
          bind:otp
          bind:firstName
          bind:lastName
          bind:password
          bind:confirmPassword
          bind:agreeToTerms
        />
      {/if}
    {/if}

    <!-- Login Link -->
    <div class="mt-8 text-center">
      <Text variant="span" class="text-text-light dark:text-text-light-dark">
        Already have an account?
      </Text>
      <a
        href="/login"
        class="ml-1 text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark font-medium transition-colors duration-200"
      >
        Sign in
      </a>
    </div>
  </AuthCard>
</AuthBackground>
