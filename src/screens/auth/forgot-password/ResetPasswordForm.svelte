<!-- Reset Password Form - Client Side -->
<script lang="ts">
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'

  let {
    email = $bindable(''),
    otp = $bindable(''),
    password = $bindable(''),
    confirmPassword = $bindable(''),
  } = $props()

  let passwordsMatch = $derived(password === confirmPassword)

  let formValid = $derived(
    otp.trim() !== '' &&
      otp.length === 6 &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordsMatch,
  )

  const handleUpdatePassword = () => {
    if (!formValid) return
    console.log('Update Password:', {
      email,
      otp,
      password,
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && formValid) {
      handleUpdatePassword()
    }
  }
</script>

<form
  onsubmit={(e) => {
    e.preventDefault()
    handleUpdatePassword()
  }}
  class="space-y-6"
>
  <!-- Email confirmation -->
  <div class="text-center mb-6">
    <Text class="text-text-light dark:text-text-light-dark">
      We've sent a reset code to <strong class="text-text dark:text-text-dark"
        >{email}</strong
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
      maxlength="6"
      required
      class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 text-center text-xl tracking-widest"
      placeholder="000000"
    />
  </div>

  <!-- Resend Code -->
  <div class="text-center">
    <button
      type="button"
      class="text-sm text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200"
    >
      Resend reset code
    </button>
  </div>

  <!-- Password Fields -->
  <div class="space-y-4">
    <div class="relative">
      <div class="relative group">
        <input
          id="password"
          type="password"
          bind:value={password}
          onkeydown={handleKeyDown}
          required
          class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-t-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
          placeholder="Enter new password"
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
          placeholder="Confirm new password"
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

  <!-- Submit Button -->
  <div class="pt-6">
    <button
      type="submit"
      disabled={!formValid}
      class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
      ></div>

      <span class="relative flex items-center justify-center gap-2">
        Update Password
        <div
          class="group-hover:translate-x-1 transition-transform duration-300"
        >
          <ArrowRightIcon scale={0.67} />
        </div>
      </span>
    </button>
  </div>
</form>
