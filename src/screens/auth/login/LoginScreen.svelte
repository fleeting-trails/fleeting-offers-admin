<!-- Login Screen -->
<script lang="ts">
  import AuthBackground from '$lib/ui/layouts/AuthBackground.svelte'
  import AuthCard from '$lib/ui/layouts/AuthCard.svelte'
  import AuthHeader from '$lib/ui/layouts/AuthHeader.svelte'
  import LoginForm from './LoginForm.svelte'
</script>

<AuthBackground>
  <AuthCard maxWidth="md">
    <AuthHeader
      title="Welcome Back"
      description="Sign in to your admin account"
    />
    <LoginForm />
  </AuthCard>
</AuthBackground>
