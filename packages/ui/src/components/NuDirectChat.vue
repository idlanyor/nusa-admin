<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import NuAvatar from './NuAvatar.vue'
import NuIcon from './NuIcon.vue'

export interface NuChatMessage {
  /** Sender name (used for the avatar). */
  from: string
  text: string
  time?: string
  /** Sent by the current user → right-aligned. */
  me?: boolean
}

const props = withDefaults(defineProps<{ messages: NuChatMessage[]; height?: string; placeholder?: string; avatars?: boolean }>(), {
  height: '320px',
  placeholder: 'Type a message',
  avatars: true,
})
const emit = defineEmits<{ send: [text: string] }>()

const draft = ref('')
const scroller = ref<HTMLElement | null>(null)

function scrollToEnd() {
  nextTick(() => scroller.value?.scrollTo({ top: scroller.value.scrollHeight }))
}
function send() {
  const text = draft.value.trim()
  if (!text) return
  emit('send', text)
  draft.value = ''
}
onMounted(scrollToEnd)
watch(() => props.messages.length, scrollToEnd)
</script>

<template>
  <div class="nu-dchat">
    <div ref="scroller" class="nu-dchat__messages" :style="{ height }" role="log" aria-live="polite">
      <div v-for="(m, i) in messages" :key="i" class="nu-dchat__msg" :class="{ 'is-me': m.me }">
        <NuAvatar v-if="avatars" :name="m.from" :size="28" :color="m.me ? 'primary' : 'secondary'" />
        <div class="nu-dchat__bubble">
          <div class="nu-dchat__meta"><strong>{{ m.from }}</strong><time v-if="m.time">{{ m.time }}</time></div>
          <p>{{ m.text }}</p>
        </div>
      </div>
    </div>
    <form class="nu-dchat__form" @submit.prevent="send">
      <input v-model="draft" class="nu-dchat__input" :placeholder="placeholder" :aria-label="placeholder" />
      <button class="nu-btn nu-btn--solid nu-btn--md nu-c-primary" type="submit" :disabled="!draft.trim()">
        <NuIcon name="arrow-up" :size="15" /><span class="nu-sr-only">Send</span>
      </button>
    </form>
  </div>
</template>

<style>
.nu-dchat__messages { display: flex; flex-direction: column; gap: 10px; padding: 12px 14px; overflow-y: auto; }
.nu-dchat__msg { display: flex; align-items: flex-end; gap: 8px; max-width: 85%; }
.nu-dchat__msg.is-me { flex-direction: row-reverse; align-self: flex-end; }
.nu-dchat__bubble { min-width: 0; }
.nu-dchat__meta { display: flex; gap: 8px; margin-bottom: 2px; font-size: 11.5px; color: var(--nu-text-muted); }
.nu-dchat__msg.is-me .nu-dchat__meta { flex-direction: row-reverse; }
.nu-dchat__bubble p {
  padding: 6px 10px;
  border-radius: var(--nu-radius);
  background: color-mix(in srgb, var(--nu-text) 7%, transparent);
  overflow-wrap: anywhere;
}
.nu-dchat__msg.is-me .nu-dchat__bubble p { background: var(--nu-primary); color: var(--nu-on-color); }
.nu-dchat__form { display: flex; gap: 6px; padding: 8px 10px; border-top: 1px solid var(--nu-border); }
.nu-dchat__input {
  flex: 1;
  min-width: 0;
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--nu-border);
  border-radius: var(--nu-radius-sm);
  background: var(--nu-surface);
  color: var(--nu-text);
  outline: 0;
}
.nu-dchat__input:focus { border-color: var(--nu-primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--nu-primary) 18%, transparent); }
</style>
