<script lang="ts">
  import { goto } from '$app/navigation'
  import Text from '$lib/ui/typography/Text/Text.svelte'
  import LockClosedIcon from '$lib/icons/LockClosedIcon.svelte'
  import MailIcon from '$lib/icons/MailIcon.svelte'

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
  let password = $state('')
  let rememberMe = $state(false)

  const gradientSettings: GradientSettings = {
    direction: 'bg-gradient-to-br',
    primaryStop: 'from-primary/95 dark:from-primary-dark/95',
    midStop: 'via-primary-light-1/75 dark:via-primary-light-1-dark/70',
    accentStop: 'to-accent/85 dark:to-accent-dark/85',
    radialOverlay:
      'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_65%)]',
    conicOverlay:
      'bg-[conic-gradient(at_80%_20%,_rgba(255,255,255,0.14),_transparent_60%)]',
    grainSize: '36px 36px',
    grainOpacity: 0.06,
    floatingOrbs: [
      {
        class:
          'absolute -top-36 -left-28 w-64 h-64 bg-gradient-to-br from-primary-light-0/24 to-transparent rounded-full blur-3xl animate-[pulse_10s_ease-in-out_infinite]',
      },
      {
        class:
          'absolute -bottom-40 -right-28 w-80 h-80 bg-gradient-to-tl from-accent/28 to-transparent rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite]',
        style: 'animation-delay: 1.2s;',
      },
      {
        class:
          'absolute top-[22%] left-[45%] w-36 h-36 bg-gradient-to-br from-primary-light-3/20 to-transparent rounded-full blur-2xl animate-[pulse_16s_ease-in-out_infinite]',
        style: 'animation-delay: 2s;',
      },
    ],
    glowBeams: [
      {
        class:
          'absolute -top-20 left-1/5 w-32 h-[65vh] bg-[linear-gradient(180deg,_rgba(255,255,255,0.24),_transparent)] rounded-full blur-2xl opacity-60 rotate-[18deg]',
      },
      {
        class:
          'absolute top-0 right-1/6 w-28 h-[55vh] bg-[linear-gradient(180deg,_rgba(255,255,255,0.18),_transparent)] rounded-full blur-2xl opacity-50 -rotate-[14deg]',
      },
    ],
    accentRings: [
      {
        class:
          'absolute top-[18%] right-[20%] w-40 h-40 rounded-full border border-white/15 dark:border-white/10 blur-[2px] mix-blend-overlay animate-[spin_25s_linear_infinite]',
      },
      {
        class:
          'absolute bottom-[18%] left-[18%] w-28 h-28 rounded-full border border-white/10 dark:border-white/5 blur-sm mix-blend-overlay animate-[spin_32s_linear_infinite]',
        style: 'animation-direction: reverse;',
      },
    ],
    sparkParticles: [
      {
        class:
          'absolute top-[32%] right-[32%] w-3 h-3 rounded-full bg-white/55 blur-[1px] animate-[ping_5s_ease-in-out_infinite]',
      },
      {
        class:
          'absolute bottom-[26%] right-[28%] w-2.5 h-2.5 rounded-full bg-accent/60 blur-[0.5px] animate-[ping_6s_ease-in-out_infinite]',
        style: 'animation-delay: 1s;',
      },
      {
        class:
          'absolute top-[42%] left-[22%] w-2 h-2 rounded-full bg-primary-light-2/70 blur-[0.5px] animate-[ping_7s_ease-in-out_infinite]',
        style: 'animation-delay: 1.8s;',
      },
    ],
  }

  const handleLogin = () => {
    console.log('Login:', { email, password, rememberMe })
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleLogin()
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
    class="relative bg-gradient-to-b from-background-toned-1/95 dark:from-background-toned-1-dark/95 to-background-toned-0/95 dark:to-background-toned-0-dark/95 backdrop-blur-sm rounded-xl shadow-2xl border border-background-pure/20 dark:border-background-pure-dark/20 overflow-hidden max-w-md w-full"
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
          Welcome Back
        </h1>
        <Text>Sign in to your admin account</Text>
      </div>

      <form
        onsubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}
        class="space-y-6"
      >
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

        <div class="pt-6">
          <button
            type="submit"
            class="relative w-full cursor-pointer bg-gradient-to-r from-primary dark:from-primary-dark via-primary-light-0 dark:via-primary-light-0-dark to-accent dark:to-accent-dark text-white font-semibold py-4 px-4 rounded-xl hover:from-primary-light-0 dark:hover:from-primary-light-0-dark hover:via-primary-light-1 dark:hover:via-primary-light-1-dark hover:to-accent-deep-0 dark:hover:to-accent-deep-0-dark transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-2xl group overflow-hidden"
          >
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
            ></div>

            <span class="relative flex items-center justify-center gap-2">
              Sign In
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
            </span>
          </button>
        </div>
      </form>

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
    </div>
  </div>
</div>
