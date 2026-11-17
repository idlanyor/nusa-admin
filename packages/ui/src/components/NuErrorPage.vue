<script setup lang="ts">
defineProps<{ code?: string | number; title: string; description?: string }>()
</script>

<template>
  <div class="nu-error-page">
    <div v-if="code || $slots.icon" class="nu-error-page__code"><slot name="icon">{{ code }}</slot></div>
    <h1 class="nu-error-page__title">{{ title }}</h1>
    <p v-if="description" class="nu-error-page__desc">{{ description }}</p>
    <div v-if="$slots.default" class="nu-error-page__actions"><slot /></div>
  </div>
</template>

<style>
.nu-error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 100vh;
  padding: 16px;
  text-align: center;
}
.nu-error-page__code { font-size: 84px; font-weight: 800; line-height: 1; letter-spacing: -0.04em; color: var(--nu-primary); }
.nu-error-page__code svg { width: 64px; height: 64px; }
.nu-error-page__title { font-size: 20px; font-weight: 700; }
.nu-error-page__desc { max-width: 420px; color: var(--nu-text-muted); }
.nu-error-page__actions { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; margin-top: 10px; }
</style>
