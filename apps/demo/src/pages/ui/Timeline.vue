<script setup lang="ts">
import { Camera, Clock, Mail, MessageSquare, UserPlus } from 'lucide-vue-next'
import { NuButton, NuCard, NuPageHeader, NuTimeline, type NuTimelineItem } from 'nusa-admin'
import { placeholderImage } from '../../data'

const items: (NuTimelineItem & { kind?: string })[] = [
  { label: '17 Nov 2026' },
  { title: 'Support team sent you an email', time: '12:05', color: 'primary', icon: Mail, kind: 'email' },
  { title: 'Dimas Pratama accepted your friend request', time: '5 mins ago', color: 'info', icon: UserPlus },
  { title: 'Citra Dewi commented on your post', time: '27 mins ago', color: 'warning', icon: MessageSquare, kind: 'comment' },
  { label: '15 Nov 2026' },
  { title: 'Eka Putri uploaded new photos', time: '2 days ago', color: 'success', icon: Camera, kind: 'photos' },
  { title: 'Weekly report generated', time: '2 days ago', color: 'secondary', icon: Clock, description: 'Sent to 12 stakeholders.' },
]
</script>

<template>
  <NuPageHeader title="Timeline" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'UI Elements' }, { label: 'Timeline' }]" />

  <div class="nu-row">
    <div class="nu-col-lg-8">
      <NuCard>
        <NuTimeline :items="items">
          <template #item="{ item }">
            <div v-if="(item as any).kind === 'email'" class="tl-body">
              Etsy doostang zoodles disqus groupon greplin oooj voxy zoodles, weebly ning heekya handango imeem plugg dopplr jibjab.
              <div class="nu-cluster" style="margin-top: 8px">
                <NuButton size="sm">Read more</NuButton>
                <NuButton size="sm" variant="soft" color="danger">Delete</NuButton>
              </div>
            </div>
            <div v-else-if="(item as any).kind === 'comment'" class="tl-body">
              “Take me to your leader! Switzerland is small and neutral. We are more like Germany, ambitious and misunderstood.”
              <div style="margin-top: 8px"><NuButton size="sm" variant="soft" color="warning">View comment</NuButton></div>
            </div>
            <div v-else-if="(item as any).kind === 'photos'" class="tl-photos">
              <img v-for="n in 4" :key="n" :src="placeholderImage(n + 8, 150, 100)" alt="" />
            </div>
          </template>
        </NuTimeline>
      </NuCard>
    </div>
    <div class="nu-col-lg-4">
      <NuCard title="Compact">
        <NuTimeline
          :items="[
            { title: 'Deployed v0.2.0', time: '10:42', color: 'success' },
            { title: 'Tests passed', time: '10:38', color: 'info' },
            { title: 'Merged #128', time: '10:30', color: 'primary' },
            { title: 'Opened #128', time: 'Yesterday', color: 'secondary' },
          ]"
        />
      </NuCard>
    </div>
  </div>
</template>

<style>
.tl-body { margin-top: 6px; padding: 10px 12px; border: 1px solid var(--nu-border); border-radius: var(--nu-radius-sm); background: var(--nu-surface-2); font-size: 13.5px; }
.tl-photos { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
.tl-photos img { width: 120px; height: 80px; border-radius: var(--nu-radius-sm); object-fit: cover; }
</style>
