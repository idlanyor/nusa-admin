<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="nu-divider" role="separator"><span v-if="label || $slots.default"><slot>{{ label }}</slot></span></div>
</template>

<style>
.nu-divider { display: flex; align-items: center; gap: 10px; color: var(--nu-text-muted); font-size: 12px; }
.nu-divider::before, .nu-divider::after { content: ''; flex: 1; height: 1px; background: var(--nu-border); }
</style>
