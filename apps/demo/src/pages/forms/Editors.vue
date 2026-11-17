<script setup lang="ts">
import { computed, ref } from 'vue'
import { NuCard, NuEditor, NuPageHeader, NuTextarea } from 'nusa-admin'

const html = ref('<h2>Release notes</h2><p>This version adds <b>layout options</b>, a <i>rich text editor</i> and form validation.</p><ul><li>Top navigation</li><li>Boxed layout</li></ul>')
const code = ref(`import { createApp } from 'vue'
import { createNusaAdmin } from 'nusa-admin'
import 'nusa-admin/style.css'

createApp(App).use(createNusaAdmin()).mount('#app')`)
const lines = computed(() => code.value.split('\n').length)
</script>

<template>
  <NuPageHeader title="Editors" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Forms' }, { label: 'Editors' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-7">
      <NuCard title="Rich text (NuEditor)" subtitle="contenteditable with a toolbar; v-model is HTML">
        <NuEditor v-model="html" placeholder="Start writing…" min-height="220px" hint="Sanitize the HTML on the server before showing it to other users." />
      </NuCard>
    </div>
    <div class="nu-col-lg-5 nu-stack">
      <NuCard title="HTML output" flush>
        <pre class="code" style="border-radius: 0; max-height: 220px; white-space: pre-wrap">{{ html }}</pre>
      </NuCard>
      <NuCard title="Code (plain textarea)">
        <NuTextarea v-model="code" class="code-area" :rows="7" spellcheck="false" :hint="`${lines} lines`" />
      </NuCard>
    </div>
  </div>
</template>

<style>
.code-area textarea { font-family: var(--nu-font-mono); font-size: 12.5px; white-space: pre; }
</style>
