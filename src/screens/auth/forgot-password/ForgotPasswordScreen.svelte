<!-- Forgot Password Screen -->
<script lang="ts">
  import { page } from '$app/stores'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import AuthBackground from '$lib/ui/layouts/AuthBackground.svelte'
  import AuthCard from '$lib/ui/layouts/AuthCard.svelte'
  import AuthHeader from '$lib/ui/layouts/AuthHeader.svelte'
  import ForgotPasswordEmailForm from './ForgotPasswordEmailForm.svelte'
  import ResetPasswordForm from './ResetPasswordForm.svelte'

  let email = $state('')
  let otp = $state('')
  let password = $state('')
  let confirmPassword = $state('')

  let currentStep = $derived($page.url.searchParams.get('step') || 'email')

  const getStepTitle = (step: string): string => {
    switch (step) {
      case 'email':
        return 'Reset Password'
      case 'reset':
        return 'Create New Password'
      default:
        return 'Reset Password'
    }
  }

  const getStepDescription = (step: string): string => {
    switch (step) {
      case 'email':
        return 'Enter your email to receive reset code'
      case 'reset':
        return 'Enter verification code and new password'
      default:
        return 'Reset your password'
    }
  }
</script>

<AuthBackground>
  <AuthCard maxWidth="lg">
    <AuthHeader
      title={getStepTitle(currentStep)}
      description={getStepDescription(currentStep)}
    />

    {#if currentStep === 'email'}
      <ForgotPasswordEmailForm bind:email />
    {:else if currentStep === 'reset'}
      <ResetPasswordForm
        bind:email
        bind:otp
        bind:password
        bind:confirmPassword
      />
    {/if}

    <!-- Login Link -->
    <div class="mt-8 text-center">
      <Text variant="span" class="text-text-light dark:text-text-light-dark">
        Remember your password?
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
