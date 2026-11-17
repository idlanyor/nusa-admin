<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Mail, MapPin, MessageSquare, PackageCheck, UserPlus } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuDescriptions, NuInput, NuProgress, NuSwitch, NuTabs, NuTextarea, NuTimeline,
  useToast,
} from 'nusa-admin'

const toast = useToast()
const tab = ref('overview')
const form = reactive({ name: 'Ayu Lestari', email: 'ayu@example.com', city: 'Bandung', bio: 'Product designer who likes tidy tables and short meetings.' })
const prefs = reactive({ mentions: true, orders: true, newsletter: false })
</script>

<template>
  <div class="profile-cover">
    <div class="profile-cover__band" />
    <div class="profile-cover__row">
      <NuAvatar name="Ayu Lestari" :size="76" status="online" class="profile-cover__avatar" />
      <div class="nu-grow">
        <h1>Ayu Lestari</h1>
        <p class="nu-text-muted nu-cluster" style="--nu-gap: 12px">
          <span>Product designer</span>
          <span class="nu-cluster" style="--nu-gap: 4px"><MapPin style="width: 14px; height: 14px" />Bandung</span>
        </p>
      </div>
      <div class="nu-cluster">
        <NuButton variant="outline" color="secondary" :icon="MessageSquare" to="/apps/chat">Message</NuButton>
        <NuButton :icon="UserPlus" @click="toast.success('You now follow Ayu.')">Follow</NuButton>
      </div>
    </div>
  </div>

  <div class="nu-row" style="margin-top: 16px">
    <div class="nu-col-lg-4 nu-stack">
      <NuCard title="About">
        <p style="margin-bottom: 10px">{{ form.bio }}</p>
        <NuDescriptions
          :items="[
            { label: 'Email', value: form.email },
            { label: 'Location', value: form.city },
            { label: 'Joined', value: '12 March 2024' },
            { label: 'Role', key: 'role' },
          ]"
        >
          <template #role><NuBadge>Administrator</NuBadge></template>
        </NuDescriptions>
      </NuCard>
      <NuCard title="Skills">
        <div class="nu-stack" style="--nu-gap: 10px">
          <NuProgress label="Interface design" :value="92" show-value />
          <NuProgress label="Prototyping" :value="78" color="info" show-value />
          <NuProgress label="Research" :value="64" color="success" show-value />
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-8">
      <NuCard>
        <NuTabs v-model="tab" :tabs="[{ key: 'overview', label: 'Activity' }, { key: 'edit', label: 'Edit profile' }, { key: 'notifications', label: 'Notifications' }]">
          <template #overview>
            <NuTimeline
              :items="[
                { title: 'Shipped the invoice redesign', time: '2h', description: 'Merged into main after review', color: 'success', icon: PackageCheck },
                { title: 'Commented on “Role-based sidebar menu”', time: '5h', description: 'Suggested grouping by section', color: 'primary', icon: MessageSquare },
                { title: 'Invited Dimas Pratama', time: 'Yesterday', description: 'Added to the Design team', color: 'info', icon: UserPlus },
                { title: 'Sent the weekly summary', time: 'Mon', description: 'To 12 stakeholders', color: 'secondary', icon: Mail },
              ]"
            />
          </template>
          <template #edit>
            <form class="nu-stack" style="--nu-gap: 12px" @submit.prevent="toast.success('Profile saved.')">
              <div class="nu-row" style="--nu-gap: 12px">
                <div class="nu-col-md-6"><NuInput v-model="form.name" label="Full name" required autocomplete="name" /></div>
                <div class="nu-col-md-6"><NuInput v-model="form.email" label="Email" type="email" required autocomplete="email" /></div>
                <div class="nu-col-md-6"><NuInput v-model="form.city" label="City" autocomplete="address-level2" /></div>
              </div>
              <NuTextarea v-model="form.bio" label="Bio" :rows="3" />
              <div><NuButton type="submit">Save changes</NuButton></div>
            </form>
          </template>
          <template #notifications>
            <div class="nu-stack" style="--nu-gap: 10px">
              <NuSwitch v-model="prefs.mentions" label="Email me when someone mentions me" />
              <NuSwitch v-model="prefs.orders" label="Email me about new orders" />
              <NuSwitch v-model="prefs.newsletter" label="Monthly product newsletter" />
            </div>
          </template>
        </NuTabs>
      </NuCard>
    </div>
  </div>
</template>

<style>
.profile-cover { border: 1px solid var(--nu-border); border-radius: var(--nu-radius); background: var(--nu-surface); box-shadow: var(--nu-shadow-sm); overflow: hidden; }
.profile-cover__band {
  height: 110px;
  background:
    radial-gradient(600px 200px at 80% 0%, color-mix(in srgb, var(--nu-info) 55%, transparent), transparent),
    linear-gradient(120deg, var(--nu-primary), color-mix(in srgb, var(--nu-primary) 55%, #000));
}
.profile-cover__row { display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px 14px; padding: 0 14px 12px; margin-top: -30px; }
.profile-cover__avatar { box-shadow: 0 0 0 3px var(--nu-surface); background: color-mix(in srgb, var(--nu-primary) 18%, var(--nu-surface)); }
.profile-cover h1 { font-size: 19px; font-weight: 700; }
</style>
