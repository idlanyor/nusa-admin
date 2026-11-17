<script setup lang="ts">
withDefaults(defineProps<{ width?: string; height?: string; lines?: number; circle?: boolean }>(), {
  width: '100%',
  height: '12px',
  lines: 1,
})
</script>

<template>
  <span class="nu-skeleton" aria-hidden="true">
    <span
      v-for="n in lines"
      :key="n"
      class="nu-skeleton__bar"
      :class="{ 'is-circle': circle }"
      :style="{ width: circle ? height : lines > 1 && n === lines ? '60%' : width, height }"
    />
  </span>
</template>

<style>
.nu-skeleton { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.nu-skeleton__bar {
  display: block;
  border-radius: var(--nu-radius-sm);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--nu-text) 8%, transparent) 25%,
    color-mix(in srgb, var(--nu-text) 15%, transparent) 37%,
    color-mix(in srgb, var(--nu-text) 8%, transparent) 63%
  );
  background-size: 400% 100%;
  animation: nu-shimmer 1.4s ease infinite;
}
.nu-skeleton__bar.is-circle { border-radius: 50%; }
@keyframes nu-shimmer { from { background-position: 100% 50%; } to { background-position: 0 50%; } }
</style>
