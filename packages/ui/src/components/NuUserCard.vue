<script setup lang="ts">
import type { NuColor } from '../types'
import NuAvatar from './NuAvatar.vue'

/** Profile widget: colored cover, avatar, name, role and a row of stats. */
withDefaults(
  defineProps<{
    name: string
    role?: string
    avatar?: string
    color?: NuColor
    stats?: { label: string; value: string | number }[]
    /** `left` puts the avatar beside the name in the cover. */
    align?: 'center' | 'left'
  }>(),
  { color: 'primary', align: 'center', stats: () => [] },
)
</script>

<template>
  <div class="nu-user-card" :class="[`nu-c-${color}`, `nu-user-card--${align}`]">
    <div class="nu-user-card__cover">
      <div class="nu-user-card__name">{{ name }}</div>
      <div v-if="role" class="nu-user-card__role">{{ role }}</div>
    </div>
    <NuAvatar class="nu-user-card__avatar" :src="avatar" :name="name" :size="72" :color="color" />
    <dl v-if="stats.length" class="nu-user-card__stats">
      <div v-for="s in stats" :key="s.label">
        <dd>{{ s.value }}</dd>
        <dt>{{ s.label }}</dt>
      </div>
    </dl>
    <div v-if="$slots.default" class="nu-user-card__body"><slot /></div>
  </div>
</template>

<style>
.nu-user-card {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius);
  background: var(--nu-surface);
  box-shadow: var(--nu-shadow-sm);
  text-align: center;
}
.nu-user-card__cover {
  height: 104px;
  padding: 14px;
  background:
    radial-gradient(300px 120px at 100% 0%, rgba(255, 255, 255, 0.2), transparent),
    var(--nu-c);
  color: var(--nu-on-color);
}
.nu-user-card__name { font-size: 17px; font-weight: 700; }
.nu-user-card__role { font-size: 13px; opacity: 0.85; }
.nu-user-card__avatar { margin-top: -36px; box-shadow: 0 0 0 3px var(--nu-surface); background: color-mix(in srgb, var(--nu-c) 18%, var(--nu-surface)); }
.nu-user-card__stats { display: flex; margin: 10px 0 0; border-top: 1px solid var(--nu-border); }
.nu-user-card__stats > div { flex: 1; padding: 8px 4px; }
.nu-user-card__stats > div + div { border-inline-start: 1px solid var(--nu-border); }
.nu-user-card__stats dd { margin: 0; font-size: 16px; font-weight: 700; font-variant-numeric: tabular-nums; }
.nu-user-card__stats dt { font-size: 11.5px; color: var(--nu-text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
.nu-user-card__body { padding: 10px 14px 14px; border-top: 1px solid var(--nu-border); }
.nu-user-card--left { text-align: start; }
.nu-user-card--left .nu-user-card__cover { height: auto; min-height: 92px; padding-inline-start: 100px; }
.nu-user-card--left .nu-user-card__avatar { position: absolute; top: 10px; inset-inline-start: 14px; margin: 0; }
.nu-user-card--left .nu-user-card__stats { margin-top: 0; }
</style>
