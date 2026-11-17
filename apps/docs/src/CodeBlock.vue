<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, Copy } from 'lucide-vue-next'
import { highlight } from './markdown'

const props = withDefaults(defineProps<{ code: string; lang?: string; caption?: string }>(), { lang: 'vue' })
const html = computed(() => highlight(props.code, props.lang))
const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch {
    /* clipboard blocked */
  }
}
</script>

<template>
  <figure class="codebox">
    <figcaption class="codebox__bar">
      <span class="nu-truncate"><slot name="caption">{{ caption ?? lang }}</slot></span>
      <button type="button" class="codebox__copy" :aria-label="copied ? 'Copied' : 'Copy code'" @click="copy">
        <component :is="copied ? Check : Copy" />{{ copied ? 'Copied' : 'Copy' }}
      </button>
    </figcaption>
    <pre class="code-block"><code class="hljs" v-html="html" /></pre>
  </figure>
</template>
