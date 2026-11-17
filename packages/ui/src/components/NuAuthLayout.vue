<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    brand?: string
    logo?: string
    /** `split` adds a branded panel beside the form on wide screens. */
    variant?: 'card' | 'split'
    /** Headline and text for the split panel (or use the `aside` slot). */
    asideTitle?: string
    asideText?: string
  }>(),
  { brand: 'Nusa Admin', variant: 'card' },
)
</script>

<template>
  <div class="nu-auth" :class="`nu-auth--${variant}`">
    <aside v-if="variant === 'split'" class="nu-auth__aside">
      <slot name="aside">
        <div class="nu-brand"><span class="nu-brand__logo">{{ brand.charAt(0) }}</span><span class="nu-brand__name">{{ brand }}</span></div>
        <div>
          <h2>{{ asideTitle }}</h2>
          <p>{{ asideText }}</p>
        </div>
      </slot>
    </aside>
    <div class="nu-auth__card">
      <slot name="brand">
        <div class="nu-brand nu-auth__brand">
          <span class="nu-brand__logo"><img v-if="logo" :src="logo" alt="" /><template v-else>{{ brand.charAt(0) }}</template></span>
          <span class="nu-brand__name">{{ brand }}</span>
        </div>
      </slot>
      <h1 class="nu-auth__title">{{ title }}</h1>
      <p v-if="subtitle" class="nu-auth__subtitle">{{ subtitle }}</p>
      <div class="nu-auth__body"><slot /></div>
      <div v-if="$slots.footer" class="nu-auth__footer"><slot name="footer" /></div>
    </div>
  </div>
</template>

<style>
.nu-auth {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 16px;
  background:
    radial-gradient(900px 500px at 15% -10%, color-mix(in srgb, var(--nu-primary) 14%, transparent), transparent),
    var(--nu-bg);
}
.nu-auth__card {
  width: 100%;
  max-width: 380px;
  padding: 22px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow);
}
.nu-auth__brand { margin-bottom: 14px; }
.nu-auth__title { font-size: 19px; font-weight: 700; }
.nu-auth__subtitle { margin-top: 2px; color: var(--nu-text-muted); }
.nu-auth__body { margin-top: 14px; }
.nu-auth--split { grid-template-columns: minmax(0, 1fr); place-items: stretch; padding: 0; }
.nu-auth--split .nu-auth__card { align-self: center; }
.nu-auth--split .nu-auth__card { justify-self: center; margin: 16px; }
.nu-auth__aside {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px;
  background:
    radial-gradient(500px 300px at 90% 10%, color-mix(in srgb, var(--nu-info) 45%, transparent), transparent),
    linear-gradient(150deg, var(--nu-primary), color-mix(in srgb, var(--nu-primary) 45%, #000));
  color: #fff;
}
.nu-auth__aside .nu-brand__logo { background: rgba(255, 255, 255, 0.18); color: #fff; }
.nu-auth__aside h2 { font-size: 26px; font-weight: 700; line-height: 1.25; letter-spacing: -0.01em; }
.nu-auth__aside p { max-width: 420px; margin-top: 8px; opacity: 0.85; }
@media (min-width: 900px) {
  .nu-auth--split { grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr); align-items: stretch; }
  .nu-auth--split .nu-auth__aside { display: flex; }
  .nu-auth--split .nu-auth__card { align-self: center; border: 0; box-shadow: none; background: transparent; }
}
.nu-auth__footer { margin-top: 12px; font-size: 13px; color: var(--nu-text-muted); text-align: center; }
</style>
