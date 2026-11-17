<script setup lang="ts">
import { ref } from 'vue'
import {
  NuCard, NuCheckbox, NuCombobox, NuDatePicker, NuFileUpload, NuInput, NuPageHeader, NuRadioGroup, NuRating, NuSegmented, NuSelect, NuSlider,
  NuSwitch, NuTagInput, NuTransfer,
} from 'nusa-admin'

const plan = ref('team')
const billing = ref('yearly')
const volume = ref(40)
const budget = ref(2500)
const tags = ref(['vue', 'vite', 'bun'])
const files = ref<File[]>([])
const avatar = ref<File[]>([])
const score = ref(3)
const date = ref('2026-11-16')
const time = ref('09:30')
const color = ref('#4f46e5')
const city = ref<string | number | null>('bdg')
const cities = ref<(string | number)[]>(['jkt', 'sby'])
const day = ref<string | null>('2026-11-20')
const stay = ref<[string, string] | null>(['2026-11-18', '2026-11-22'])
const card = ref('')
const phone = ref('')
const expiry = ref('')
const plate = ref('')
const permissions = ref<(string | number)[]>(['users.read', 'orders.read'])
const permissionOptions = ['users.read', 'users.write', 'orders.read', 'orders.write', 'orders.refund', 'billing.read', 'billing.write', 'reports.export', 'settings.manage'].map((p) => ({ label: p, value: p, disabled: p === 'settings.manage' }))
const cityOptions = [
  { label: 'Bandung', value: 'bdg' },
  { label: 'Jakarta', value: 'jkt' },
  { label: 'Surabaya', value: 'sby' },
  { label: 'Yogyakarta', value: 'yog' },
  { label: 'Medan', value: 'mdn' },
  { label: 'Makassar', value: 'mks' },
  { label: 'Denpasar', value: 'dps', disabled: true },
]
</script>

<template>
  <NuPageHeader
    title="Advanced forms"
    subtitle="Choice controls, sliders, tags, uploads and native pickers."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Forms' }, { label: 'Advanced' }]"
  />

  <div class="nu-row">
    <div class="nu-col-12">
      <NuCard title="Dual list box" subtitle="NuTransfer — v-model is the chosen values">
        <NuTransfer v-model="permissions" :options="permissionOptions" :titles="['Available permissions', 'Granted']" />
        <p class="nu-text-sm nu-text-muted" style="margin-top: 8px">Granted: {{ permissions.join(', ') || 'none' }}</p>
      </NuCard>
    </div>
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Choices">
        <div class="nu-stack" style="--nu-gap: 12px">
          <NuRadioGroup
            v-model="plan"
            label="Plan"
            :options="[{ label: 'Starter — $19/mo', value: 'starter' }, { label: 'Team — $79/mo', value: 'team' }, { label: 'Business — $249/mo', value: 'business' }]"
          />
          <NuRadioGroup
            v-model="billing"
            label="Billing period"
            inline
            :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }, { label: 'Lifetime', value: 'lifetime', disabled: true }]"
          />
          <div>
            <div class="nu-field__label" style="margin-bottom: 4px">Segmented</div>
            <NuSegmented v-model="billing" :options="[{ label: 'Monthly', value: 'monthly' }, { label: 'Yearly', value: 'yearly' }]" label="Billing period" />
          </div>
          <div class="nu-cluster" style="--nu-gap: 16px">
            <NuCheckbox :model-value="true" label="Email" />
            <NuCheckbox label="SMS" />
            <NuSwitch :model-value="true" label="Push" />
          </div>
        </div>
      </NuCard>

      <NuCard title="Sliders &amp; rating">
        <div class="nu-stack" style="--nu-gap: 12px">
          <NuSlider v-model="volume" label="Volume" show-value />
          <NuSlider v-model="budget" label="Monthly budget" :min="500" :max="10000" :step="100" show-value :format="(v) => `$${v.toLocaleString()}`" />
          <NuSlider :model-value="30" label="Disabled" disabled />
          <div>
            <div class="nu-field__label" style="margin-bottom: 2px">Satisfaction</div>
            <NuRating v-model="score" />
          </div>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Select &amp; date pickers">
        <div class="nu-row" style="--nu-gap: 12px">
          <div class="nu-col-md-6"><NuCombobox v-model="city" label="City (searchable)" :options="cityOptions" clearable /></div>
          <div class="nu-col-md-6"><NuDatePicker v-model="day" label="Date" clearable /></div>
          <div class="nu-col-12"><NuCombobox v-model="cities" label="Cities (multiple)" :options="cityOptions" multiple clearable /></div>
          <div class="nu-col-12"><NuDatePicker v-model="stay" label="Date range" range clearable /></div>
        </div>
      </NuCard>

      <NuCard title="Tags &amp; uploads">
        <div class="nu-stack" style="--nu-gap: 12px">
          <NuTagInput v-model="tags" label="Tags" placeholder="Add a tag" hint="Press Enter or comma to add; Backspace removes the last tag." />
          <NuFileUpload v-model="files" multiple hint="Any file type, several at once" />
          <NuFileUpload v-model="avatar" accept="image/*" label="Upload an avatar" hint="PNG or JPG, single file" />
        </div>
      </NuCard>

      <NuCard title="Input masks" subtitle="mask: 9 = digit, a = letter, * = either">
        <div class="nu-row" style="--nu-gap: 12px">
          <div class="nu-col-md-6"><NuInput v-model="card" label="Card number" mask="9999 9999 9999 9999" autocomplete="cc-number" /></div>
          <div class="nu-col-md-6"><NuInput v-model="expiry" label="Expiry" mask="99/99" autocomplete="cc-exp" /></div>
          <div class="nu-col-md-6"><NuInput v-model="phone" label="Phone" mask="+62 999-9999-9999" autocomplete="tel" /></div>
          <div class="nu-col-md-6"><NuInput v-model="plate" label="Plate (letters, then digits)" mask="aa 9999 aaa" /></div>
        </div>
      </NuCard>

      <NuCard title="Native pickers" subtitle="NuInput passes any input type through">
        <div class="nu-row" style="--nu-gap: 12px">
          <div class="nu-col-md-6"><NuInput v-model="date" label="Date" type="date" /></div>
          <div class="nu-col-md-6"><NuInput v-model="time" label="Time" type="time" /></div>
          <div class="nu-col-md-6"><NuInput v-model="color" label="Color" type="color" /></div>
          <div class="nu-col-md-6"><NuInput label="Number" type="number" placeholder="0" min="0" /></div>
          <div class="nu-col-12">
            <NuSelect
              model-value=""
              label="Country"
              placeholder="Choose a country"
              :options="[{ label: 'Indonesia', value: 'id' }, { label: 'Malaysia', value: 'my' }, { label: 'Singapore', value: 'sg' }]"
            />
          </div>
        </div>
      </NuCard>
    </div>
  </div>
</template>
