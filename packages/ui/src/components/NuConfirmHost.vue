<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useConfirm } from '../composables/useConfirm'
import { t } from '../composables/useLocale'
import NuButton from './NuButton.vue'
import NuInput from './NuInput.vue'
import NuModal from './NuModal.vue'

const { pending, settle } = useConfirm()
const cur = computed(() => pending.current)
const typed = ref('')
watch(() => cur.value?.id, () => (typed.value = ''))
const blocked = computed(() => !!cur.value?.typeToConfirm && typed.value !== cur.value.typeToConfirm)
const open = computed({
  get: () => !!cur.value,
  set: (v) => !v && settle(false),
})
function ok() {
  if (!blocked.value) settle(true)
}
</script>

<template>
  <NuModal v-model="open" :title="cur?.title" size="sm">
    <form id="nu-confirm-form" class="nu-stack" style="--nu-gap: 10px" @submit.prevent="ok">
      <p v-if="cur?.message" class="nu-text-muted">{{ cur.message }}</p>
      <NuInput
        v-if="cur?.typeToConfirm"
        v-model="typed"
        :label="t('typeToConfirm', { text: cur.typeToConfirm })"
        autocomplete="off"
        spellcheck="false"
      />
    </form>
    <template #footer>
      <NuButton variant="ghost" color="secondary" @click="settle(false)">{{ cur?.cancelLabel ?? t('cancel') }}</NuButton>
      <NuButton type="submit" form="nu-confirm-form" :color="cur?.danger ? 'danger' : (cur?.color ?? 'primary')" :disabled="blocked">
        {{ cur?.confirmLabel ?? t('confirm') }}
      </NuButton>
    </template>
  </NuModal>
</template>
