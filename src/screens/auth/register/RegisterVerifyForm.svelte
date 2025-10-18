<!-- Register Verification Form - Client Side -->
<script lang="ts">
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import UserCircleIcon from '$lib/icons/UserCircleIcon.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'

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
      otp.length === 6 &&
      firstName.trim() !== '' &&
      lastName.trim() !== '' &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordsMatch &&
      agreeToTerms,
  )

  const handleCreateAccount = () => {
    if (!formValid) return
    console.log('Create Account:', {
      email,
      otp,
      firstName,
      lastName,
      password,
      agreeToTerms,
    })
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
      Resend verification code
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
      disabled={!formValid}
      class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
    >
      <div
        class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
      ></div>

      <span class="relative flex items-center justify-center gap-2">
        Create Account
        <div
          class="group-hover:translate-x-1 transition-transform duration-300"
        >
          <ArrowRightIcon scale={0.67} />
        </div>
      </span>
    </button>
  </div>
</form>
