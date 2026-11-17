<script setup lang="ts">
import NuIcon from './NuIcon.vue'

export interface NuStep {
  title: string
  description?: string
}

defineProps<{ steps: NuStep[]; clickable?: boolean; vertical?: boolean }>()
/** Zero-based index of the current step. */
const current = defineModel<number>({ default: 0 })
</script>

<template>
  <ol class="nu-steps" :class="{ 'nu-steps--vertical': vertical }">
    <li
      v-for="(step, i) in steps"
      :key="i"
      class="nu-steps__step"
      :class="{ 'is-done': i < current, 'is-current': i === current }"
      :aria-current="i === current ? 'step' : undefined"
    >
      <component
        :is="clickable ? 'button' : 'div'"
        class="nu-steps__btn"
        :type="clickable ? 'button' : undefined"
        @click="clickable && (current = i)"
      >
        <span class="nu-steps__marker">
          <NuIcon v-if="i < current" name="check" :size="13" />
          <template v-else>{{ i + 1 }}</template>
        </span>
        <span class="nu-steps__text">
          <span class="nu-steps__title">{{ step.title }}</span>
          <span v-if="step.description" class="nu-steps__desc">{{ step.description }}</span>
        </span>
      </component>
    </li>
  </ol>
</template>

<style>
.nu-steps { display: flex; gap: 8px; margin: 0; padding: 0; list-style: none; }
.nu-steps__step { flex: 1 1 0; display: flex; align-items: center; gap: 8px; min-width: 0; }
.nu-steps__step:not(:last-child)::after { content: ''; flex: 1; min-width: 12px; height: 2px; background: var(--nu-border); }
.nu-steps__step:last-child { flex: 0 1 auto; }
.nu-steps__step.is-done::after { background: var(--nu-primary); }
.nu-steps__btn { display: flex; align-items: center; gap: 8px; padding: 0; border: 0; background: transparent; color: inherit; text-align: start; min-width: 0; }
button.nu-steps__btn { cursor: pointer; }
.nu-steps__marker {
  flex: none;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 2px solid var(--nu-border);
  border-radius: 50%;
  color: var(--nu-text-muted);
  font-size: 12px;
  font-weight: 700;
}
.nu-steps__step.is-current .nu-steps__marker { border-color: var(--nu-primary); color: var(--nu-primary); }
.nu-steps__step.is-done .nu-steps__marker { border-color: var(--nu-primary); background: var(--nu-primary); color: var(--nu-on-color); }
.nu-steps__text { display: flex; flex-direction: column; min-width: 0; }
.nu-steps__title { font-size: 13px; font-weight: 600; white-space: nowrap; color: var(--nu-text-muted); }
.nu-steps__step:is(.is-current, .is-done) .nu-steps__title { color: var(--nu-text); }
.nu-steps__desc { font-size: 12px; color: var(--nu-text-muted); white-space: nowrap; }

.nu-steps--vertical { flex-direction: column; gap: 0; }
.nu-steps--vertical .nu-steps__step { flex: none; flex-direction: column; align-items: flex-start; gap: 0; }
.nu-steps--vertical .nu-steps__step:not(:last-child)::after { flex: none; width: 2px; height: 18px; min-width: 0; margin: 3px 0 3px 11px; }
@media (max-width: 640px) {
  .nu-steps:not(.nu-steps--vertical) .nu-steps__step:not(.is-current) .nu-steps__text { display: none; }
}
</style>
