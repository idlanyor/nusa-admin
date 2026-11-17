<script setup lang="ts">
import { computed, ref } from 'vue'
import { Mail, MapPin, Phone, User } from 'lucide-vue-next'
import { NuAvatar, NuBadge, NuButton, NuCard, NuEmpty, NuInput, NuPageHeader, NuPagination } from 'nusa-admin'
import { contacts } from '../data'

const query = ref('')
const page = ref(1)
const PAGE = 6
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return contacts.filter((c) => !q || `${c.name} ${c.role} ${c.company} ${c.city} ${c.tags.join(' ')}`.toLowerCase().includes(q))
})
const shown = computed(() => filtered.value.slice((page.value - 1) * PAGE, page.value * PAGE))
</script>

<template>
  <NuPageHeader title="Contacts" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Contacts' }]">
    <NuInput v-model="query" size="sm" type="search" placeholder="Search contacts" aria-label="Search contacts" @update:model-value="page = 1" />
  </NuPageHeader>

  <div class="nu-row">
    <div v-for="c in shown" :key="c.email" class="nu-col-md-6 nu-col-lg-4">
      <NuCard class="contact">
        <template #header><span class="nu-text-sm nu-text-muted">{{ c.company }}</span></template>
        <div class="contact__body">
          <div class="nu-grow">
            <h3>{{ c.name }}</h3>
            <p class="nu-text-muted">{{ c.role }}</p>
            <ul>
              <li><MapPin />{{ c.city }}</li>
              <li><Phone />{{ c.phone }}</li>
              <li><Mail />{{ c.email }}</li>
            </ul>
            <div class="nu-cluster" style="--nu-gap: 4px; margin-top: 8px"><NuBadge v-for="t in c.tags" :key="t" color="secondary">{{ t }}</NuBadge></div>
          </div>
          <NuAvatar :name="c.name" :size="64" />
        </div>
        <template #footer>
          <div class="nu-cluster" style="justify-content: flex-end">
            <NuButton size="sm" variant="soft" color="info" :icon="Mail" :href="`mailto:${c.email}`">Email</NuButton>
            <NuButton size="sm" :icon="User" to="/profile">View profile</NuButton>
          </div>
        </template>
      </NuCard>
    </div>
  </div>
  <NuCard v-if="!filtered.length" flush><NuEmpty title="No contacts found" description="Try another name, company or city." /></NuCard>
  <div v-else class="nu-cluster" style="justify-content: center; margin-top: 16px"><NuPagination v-model="page" :total="filtered.length" :page-size="PAGE" /></div>
</template>

<style>
.contact__body { display: flex; gap: 12px; }
.contact h3 { font-size: 16px; }
.contact ul { display: grid; gap: 3px; margin: 8px 0 0; padding: 0; list-style: none; font-size: 13px; }
.contact li { display: flex; align-items: center; gap: 6px; min-width: 0; overflow-wrap: anywhere; }
.contact li svg { flex: none; width: 14px; height: 14px; color: var(--nu-text-muted); }
</style>
