<script setup lang="ts">
defineProps<{ bordered?: boolean }>()
</script>

<template>
  <ul class="nu-list" :class="{ 'nu-list--bordered': bordered }"><slot /></ul>
</template>

<style>
.nu-list { margin: 0; padding: 0; list-style: none; }
.nu-list--bordered { border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); overflow: hidden; }
.nu-list > li + li { border-top: 1px solid var(--nu-border); }
.nu-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px 14px;
  border: 0;
  background: transparent;
  color: var(--nu-text);
  text-align: left;
  text-decoration: none !important;
}
:is(a, button).nu-list-item { cursor: pointer; }
:is(a, button).nu-list-item:hover { background: color-mix(in srgb, var(--nu-text) 5%, transparent); }
.nu-list-item.is-active { background: color-mix(in srgb, var(--nu-primary) 10%, transparent); }
.nu-list-item__icon { flex: none; display: grid; place-items: center; color: var(--nu-text-muted); }
.nu-list-item__icon svg { width: 17px; height: 17px; }
.nu-list-item.is-active .nu-list-item__icon { color: var(--nu-primary); }
.nu-list-item__text { flex: 1; min-width: 0; }
.nu-list-item__title { font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nu-list-item.is-active .nu-list-item__title { color: var(--nu-primary); font-weight: 600; }
.nu-list-item__subtitle { font-size: 12.5px; color: var(--nu-text-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nu-list-item__end { flex: none; display: flex; align-items: center; gap: 6px; color: var(--nu-text-muted); font-size: 12.5px; }
</style>
