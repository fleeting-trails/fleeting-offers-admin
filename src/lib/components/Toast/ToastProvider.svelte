<script lang="ts">
  import { Toaster } from 'svelte-sonner'
</script>

<Toaster
  position="top-right"
  theme="light"
  closeButton
  toastOptions={{
    style:
      'background: #ffffff; color: #374151; border: 1px solid #e5e7eb; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);',
  }}
/>

<style>
  :global([data-sonner-toaster]) {
    --normal-bg: #ffffff;
    --normal-border: #e5e7eb;
    --normal-text: #374151;
    --success-bg: #f0fdf4;
    --success-border: #bbf7d0;
    --success-text: #15803d;
    --error-bg: #fef2f2;
    --error-border: #fecaca;
    --error-text: #dc2626;
    --warning-bg: #fffbeb;
    --warning-border: #fed7aa;
    --warning-text: #d97706;
  }

  :global(.dark [data-sonner-toaster]) {
    --normal-bg: #1f2937;
    --normal-border: #374151;
    --normal-text: #f3f4f6;
    --success-bg: #064e3b;
    --success-border: #065f46;
    --success-text: #86efac;
    --error-bg: #7f1d1d;
    --error-border: #991b1b;
    --error-text: #fca5a5;
    --warning-bg: #78350f;
    --warning-border: #92400e;
    --warning-text: #fbbf24;
  }
</style>
