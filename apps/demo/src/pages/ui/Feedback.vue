<script setup lang="ts">
import { ref } from 'vue'
import { FolderOpen, Info } from 'lucide-vue-next'
import {
  NuAlert, NuButton, NuCard, NuDrawer, NuEmpty, NuInput, NuModal, NuPageHeader, NuSkeleton, NuTooltip, useToast,
} from 'nusa-admin'

const toast = useToast()
const modal = ref(false)
const large = ref(false)
const confirm = ref(false)
const drawer = ref(false)
const drawerLeft = ref(false)
</script>

<template>
  <NuPageHeader
    title="Feedback"
    subtitle="Alerts, dialogs, drawers, toasts and loading states."
    :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Feedback' }]"
  />

  <div class="nu-row">
    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Alerts">
        <div class="nu-stack" style="--nu-gap: 8px">
          <NuAlert color="info" title="Heads up">A new version of the dashboard is available.</NuAlert>
          <NuAlert color="success" title="Saved" dismissible>Your changes have been saved.</NuAlert>
          <NuAlert color="warning">Your trial ends in 3 days.</NuAlert>
          <NuAlert color="danger" title="Payment failed" dismissible>We couldn't charge the card ending in 4242.</NuAlert>
          <NuAlert color="primary">A neutral note in the brand color.</NuAlert>
        </div>
      </NuCard>

      <NuCard title="Toasts">
        <div class="nu-cluster">
          <NuButton variant="soft" color="success" @click="toast.success({ title: 'Saved', message: 'Your changes are live.' })">Success</NuButton>
          <NuButton variant="soft" color="danger" @click="toast.error('Something went wrong.')">Error</NuButton>
          <NuButton variant="soft" color="warning" @click="toast.warning('Storage is almost full.')">Warning</NuButton>
          <NuButton variant="soft" color="info" @click="toast.info('3 teammates are online.')">Info</NuButton>
          <NuButton variant="soft" color="secondary" @click="toast.show({ message: 'This one stays until closed.', duration: 0 })">Sticky</NuButton>
        </div>
      </NuCard>

      <NuCard title="Tooltips">
        <div class="nu-cluster">
          <NuTooltip text="Tooltip on top"><NuButton variant="outline" color="secondary">Top</NuButton></NuTooltip>
          <NuTooltip text="Tooltip below" placement="bottom"><NuButton variant="outline" color="secondary">Bottom</NuButton></NuTooltip>
          <NuTooltip text="On the left" placement="left"><NuButton variant="outline" color="secondary">Left</NuButton></NuTooltip>
          <NuTooltip text="On the right" placement="right"><NuButton variant="outline" color="secondary">Right</NuButton></NuTooltip>
          <NuTooltip text="Works on any element"><Info style="width: 18px; height: 18px" tabindex="0" /></NuTooltip>
        </div>
      </NuCard>
    </div>

    <div class="nu-col-lg-6 nu-stack">
      <NuCard title="Modals &amp; drawers">
        <div class="nu-cluster">
          <NuButton @click="modal = true">Modal</NuButton>
          <NuButton variant="soft" @click="large = true">Large modal</NuButton>
          <NuButton color="danger" variant="soft" @click="confirm = true">Confirm</NuButton>
          <NuButton variant="outline" color="secondary" @click="drawer = true">Drawer right</NuButton>
          <NuButton variant="outline" color="secondary" @click="drawerLeft = true">Drawer left</NuButton>
        </div>
      </NuCard>

      <NuCard title="Skeleton">
        <div class="nu-cluster" style="--nu-gap: 12px; flex-wrap: nowrap">
          <NuSkeleton circle height="40px" />
          <div class="nu-grow"><NuSkeleton :lines="3" /></div>
        </div>
      </NuCard>

      <NuCard title="Empty state" flush>
        <NuEmpty title="No projects yet" description="Projects you create will show up here." :icon="FolderOpen">
          <NuButton size="sm">New project</NuButton>
        </NuEmpty>
      </NuCard>

      <NuCard title="Loading card" loading>
        The <code>loading</code> prop overlays a spinner while data is fetched.
      </NuCard>
    </div>
  </div>

  <NuModal v-model="modal" title="Invite teammate">
    <NuInput label="Email" type="email" placeholder="name@example.com" />
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Cancel</NuButton>
      <NuButton @click="close(); toast.success('Invitation sent.')">Send invite</NuButton>
    </template>
  </NuModal>

  <NuModal v-model="large" title="Large modal" size="lg">
    <p>Use <code>size="lg"</code> for content that needs room, such as a preview or a multi-column form.</p>
  </NuModal>

  <NuModal v-model="confirm" title="Delete project?" size="sm" persistent>
    <p>This can't be undone. All data in this project will be removed.</p>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Keep it</NuButton>
      <NuButton color="danger" @click="close(); toast.error('Project deleted.')">Delete</NuButton>
    </template>
  </NuModal>

  <NuDrawer v-model="drawer" title="Filters">
    <div class="nu-stack" style="--nu-gap: 10px">
      <NuInput label="Customer" placeholder="Any customer" />
      <NuInput label="Min amount" type="number" placeholder="0" />
    </div>
    <template #footer="{ close }">
      <NuButton variant="ghost" color="secondary" @click="close">Reset</NuButton>
      <NuButton @click="close">Apply</NuButton>
    </template>
  </NuDrawer>
  <NuDrawer v-model="drawerLeft" title="Left drawer" side="left" width="300px">Drawers close on <kbd>Esc</kbd> and backdrop click.</NuDrawer>
</template>
