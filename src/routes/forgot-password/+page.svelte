<script lang="ts">
  import { page } from '$app/stores'
  import { goto } from '$app/navigation'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import MailIcon from '$lib/icons/MailIcon.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import ArrowRightIcon from '$lib/icons/ArrowRightIcon.svelte'

  type GradientLayer = {
    class: string
    style?: string
  }

  type GradientSettings = {
    direction: string
    primaryStop: string
    midStop: string
    accentStop: string
    radialOverlay: string
    conicOverlay: string
    grainSize: string
    grainOpacity: number
    floatingOrbs: GradientLayer[]
    glowBeams: GradientLayer[]
    accentRings: GradientLayer[]
    sparkParticles: GradientLayer[]
  }

  let email = $state('')
  let otp = $state('')
  let password = $state('')
  let confirmPassword = $state('')

  let currentStep = $derived($page.url.searchParams.get('step') || 'email')

  const gradientSettings: GradientSettings = {
    direction: 'bg-gradient-to-br',
    primaryStop: 'from-primary/95 dark:from-primary-dark/95',
    midStop: 'via-primary-light-2/70 dark:via-primary-light-2-dark/65',
    accentStop: 'to-accent/80 dark:to-accent-dark/80',
    radialOverlay:
      'bg-[radial-gradient(circle_at_35%_25%,_rgba(255,255,255,0.22),_transparent_60%)]',
    conicOverlay:
      'bg-[conic-gradient(at_75%_30%,_rgba(255,255,255,0.16),_transparent_55%)]',
    grainSize: '34px 34px',
    grainOpacity: 0.07,
    floatingOrbs: [
      {
        class:
          'absolute -top-36 right-[-20px] w-64 h-64 bg-gradient-to-br from-primary-light-0/22 to-transparent rounded-full blur-3xl animate-[pulse_11s_ease-in-out_infinite]',
      },
      {
        class:
          'absolute -bottom-44 left-[-30px] w-80 h-80 bg-gradient-to-tl from-accent/26 to-transparent rounded-full blur-3xl animate-[pulse_13s_ease-in-out_infinite]',
        style: 'animation-delay: 0.9s;',
      },
      {
        class:
          'absolute top-[26%] left-[48%] w-40 h-40 bg-gradient-to-br from-primary-light-3/20 to-transparent rounded-full blur-2xl animate-[pulse_17s_ease-in-out_infinite]',
        style: 'animation-delay: 1.8s;',
      },
    ],
    glowBeams: [
      {
        class:
          'absolute -top-16 left-1/4 w-32 h-[60vh] bg-[linear-gradient(180deg,_rgba(255,255,255,0.22),_transparent)] rounded-full blur-2xl opacity-55 rotate-[16deg]',
      },
      {
        class:
          'absolute top-4 right-1/5 w-28 h-[58vh] bg-[linear-gradient(180deg,_rgba(255,255,255,0.16),_transparent)] rounded-full blur-2xl opacity-50 -rotate-[12deg]',
      },
      {
        class:
          'absolute top-[45%] left-1/2 w-24 h-[40vh] bg-[linear-gradient(180deg,_rgba(255,255,255,0.12),_transparent)] rounded-full blur-3xl opacity-45 rotate-[28deg]',
      },
    ],
    accentRings: [
      {
        class:
          'absolute top-[18%] right-[18%] w-40 h-40 rounded-full border border-white/15 dark:border-white/10 blur-[2px] mix-blend-overlay animate-[spin_26s_linear_infinite]',
      },
      {
        class:
          'absolute bottom-[20%] left-[20%] w-32 h-32 rounded-full border border-white/10 dark:border-white/6 blur-sm mix-blend-overlay animate-[spin_34s_linear_infinite]',
        style: 'animation-direction: reverse;',
      },
      {
        class:
          'absolute top-[55%] right-[35%] w-20 h-20 border border-accent/35 dark:border-accent-dark/30 rounded-full blur-[1px] mix-blend-overlay animate-[spin_30s_linear_infinite]',
        style: 'animation-delay: 1.4s;',
      },
    ],
    sparkParticles: [
      {
        class:
          'absolute top-[30%] right-[30%] w-3 h-3 rounded-full bg-white/55 blur-[1px] animate-[ping_5s_ease-in-out_infinite]',
      },
      {
        class:
          'absolute bottom-[28%] right-[32%] w-2.5 h-2.5 rounded-full bg-accent/60 blur-[0.5px] animate-[ping_6s_ease-in-out_infinite]',
        style: 'animation-delay: 1.1s;',
      },
      {
        class:
          'absolute top-[42%] left-[24%] w-2 h-2 rounded-full bg-primary-light-2/70 blur-[0.5px] animate-[ping_7s_ease-in-out_infinite]',
        style: 'animation-delay: 1.6s;',
      },
      {
        class:
          'absolute bottom-[36%] left-[40%] w-2 h-2 rounded-full bg-white/45 blur-[0.5px] animate-[ping_8s_ease-in-out_infinite]',
        style: 'animation-delay: 2.2s;',
      },
    ],
  }

  let passwordsMatch = $derived(password === confirmPassword)

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  let emailValid = $derived(email.trim() !== '' && isValidEmail(email))
  let formValid = $derived(
    otp.trim() !== '' &&
      otp.length === 6 &&
      password.trim() !== '' &&
      confirmPassword.trim() !== '' &&
      passwordsMatch,
  )

  const handleEmailNext = async () => {
    if (!emailValid) return
    await goto(`/forgot-password?step=reset`)
  }

  const handleUpdatePassword = () => {
    if (!formValid) return
    console.log('Update Password:', {
      email,
      otp,
      password,
    })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      if (currentStep === 'email' && emailValid) {
        handleEmailNext()
      } else if (currentStep === 'reset' && formValid) {
        handleUpdatePassword()
      }
    }
  }

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

<div
  class={`relative ${gradientSettings.direction} ${gradientSettings.primaryStop} ${gradientSettings.midStop} ${gradientSettings.accentStop} w-full min-h-screen flex items-center justify-center overflow-hidden`}
  style="padding: 12px"
>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      class={`absolute inset-0 ${gradientSettings.radialOverlay} opacity-60 blur-3xl`}
    ></div>
    <div
      class={`absolute inset-0 ${gradientSettings.conicOverlay} opacity-50`}
    ></div>

    {#each gradientSettings.glowBeams as beam, index (index)}
      <div class={beam.class} style={beam.style ?? undefined}></div>
    {/each}

    {#each gradientSettings.floatingOrbs as orb, index (index)}
      <div class={orb.class} style={orb.style ?? undefined}></div>
    {/each}

    {#each gradientSettings.accentRings as ring, index (index)}
      <div class={ring.class} style={ring.style ?? undefined}></div>
    {/each}

    {#each gradientSettings.sparkParticles as spark, index (index)}
      <div class={spark.class} style={spark.style ?? undefined}></div>
    {/each}

    <div
      class="absolute inset-0"
      style={`opacity: ${gradientSettings.grainOpacity};`}
    >
      <div
        class="w-full h-full"
        style={`background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.32) 1px, transparent 0); background-size: ${gradientSettings.grainSize};`}
      ></div>
    </div>
  </div>

  <div
    class="relative bg-gradient-to-b from-background-toned-1/95 dark:from-background-toned-1-dark/95 to-background-toned-0/95 dark:to-background-toned-0-dark/95 backdrop-blur-sm rounded-xl shadow-2xl border border-background-pure/20 dark:border-background-pure-dark/20 overflow-hidden max-w-lg w-full"
  >
    <div class="px-8 py-12">
      <div class="text-center mb-8">
        <img
          src="/logo.jpg"
          alt="Logo"
          class="w-16 h-16 mx-auto mb-4 rounded-lg"
        />
        <h1
          class="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2"
        >
          {getStepTitle(currentStep)}
        </h1>
        <Text>{getStepDescription(currentStep)}</Text>
      </div>

      {#if currentStep === 'email'}
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
              required
              class="w-full px-4 py-4 border border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30"
              placeholder="Enter your email address"
            />
            <div
              class="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-light/50 dark:text-text-light-dark/50 group-focus-within:text-primary dark:group-focus-within:text-primary-dark transition-colors duration-300"
            >
              <MailIcon scale={1} strokeWidth={2} />
            </div>
          </div>

          <div class="pt-6">
            <button
              type="submit"
              disabled={!emailValid}
              class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 disabled:active:scale-100"
            >
              <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
              ></div>

              <span class="relative flex items-center justify-center gap-2">
                Send Reset Code
                <div
                  class="group-hover:translate-x-1 transition-transform duration-300"
                >
                  <ArrowRightIcon scale={0.67} strokeWidth={2} />
                </div>
              </span>
            </button>
          </div>
        </form>
      {:else if currentStep === 'reset'}
        <form
          onsubmit={(e) => {
            e.preventDefault()
            handleUpdatePassword()
          }}
          class="space-y-6"
        >
          <div class="text-center mb-6">
            <Text class="text-text-light dark:text-text-light-dark">
              We've sent a reset code to <strong
                class="text-text dark:text-text-dark">{email}</strong
              >
            </Text>
          </div>

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

          <div class="text-center">
            <button
              type="button"
              class="text-sm text-primary dark:text-primary-dark hover:text-primary-light-0 dark:hover:text-primary-light-0-dark transition-colors duration-200"
            >
              Resend reset code
            </button>
          </div>

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
                  class="w-full px-4 py-4 border-x border-b border-background-toned-2 dark:border-background-toned-2-dark outline-none rounded-b-lg bg-background-pure/90 dark:bg-background-pure-dark/90 backdrop-blur-sm text-text dark:text-text-dark placeholder-text-light/70 dark:placeholder-text-light-dark/70 focus:ring-2 focus:ring-primary/50 dark:focus:ring-primary-dark/50 focus:border-primary dark:focus:border-primary-dark focus:bg-background-pure dark:focus:bg-background-pure-dark transition-all duration-300 hover:border-primary/30 dark:hover:border-primary-dark/30 ${confirmPassword &&
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
                  <ArrowRightIcon scale={0.67} strokeWidth={2} />
                </div>
              </span>
            </button>
          </div>
        </form>
      {/if}

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
    </div>
  </div>
</div>
