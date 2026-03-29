<!-- Auth Background Component -->
<script lang="ts">
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
    grainSize: string
    grainOpacity: number
    floatingOrbs: GradientLayer[]
    glowBeams: GradientLayer[]
    accentRings: GradientLayer[]
    sparkParticles: GradientLayer[]
  }

  const getGradientSettings = (): GradientSettings => {
    const baseSettings = {
      direction: 'bg-gradient-to-br',
      primaryStop: 'from-primary/95 dark:from-primary-dark/95',
      midStop: 'via-primary-light-1/75 dark:via-primary-light-1-dark/70',
      accentStop: 'to-accent/85 dark:to-accent-dark/85',
      radialOverlay:
        'bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.2),_transparent_65%)]',
      grainSize: '36px 36px',
      grainOpacity: 0.06,
    }
    return {
      ...baseSettings,
      midStop: 'via-primary-light-2/70 dark:via-primary-light-2-dark/65',
      accentStop: 'to-accent/80 dark:to-accent-dark/80',
      radialOverlay:
        'bg-[radial-gradient(circle_at_35%_25%,_rgba(255,255,255,0.22),_transparent_60%)]',
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
  }

  $: gradientSettings = getGradientSettings()
</script>

<div
  class={`relative ${gradientSettings.direction} ${gradientSettings.primaryStop} ${gradientSettings.midStop} ${gradientSettings.accentStop} w-full min-h-screen flex items-center justify-center overflow-hidden`}
  style="padding: 12px"
>
  <!-- Background Effects -->
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Radial and Conic Overlays -->
    <div
      class={`absolute inset-0 ${gradientSettings.radialOverlay} opacity-60 blur-3xl`}
    ></div>

    <!-- Glow Beams -->
    {#each gradientSettings.glowBeams as beam, index (index)}
      <div class={beam.class} style={beam.style ?? undefined}></div>
    {/each}

    <!-- Floating Orbs -->
    {#each gradientSettings.floatingOrbs as orb, index (index)}
      <div class={orb.class} style={orb.style ?? undefined}></div>
    {/each}

    <!-- Accent Rings -->
    {#each gradientSettings.accentRings as ring, index (index)}
      <div class={ring.class} style={ring.style ?? undefined}></div>
    {/each}

    <!-- Spark Particles -->
    {#each gradientSettings.sparkParticles as spark, index (index)}
      <div class={spark.class} style={spark.style ?? undefined}></div>
    {/each}

    <!-- Grain Texture -->
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

  <!-- Content Slot -->
  <slot />
</div>
