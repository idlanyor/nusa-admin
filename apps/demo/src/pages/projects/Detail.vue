<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Download, FileText, Pencil } from 'lucide-vue-next'
import {
  NuAvatar, NuBadge, NuButton, NuCard, NuDescriptions, NuEmpty, NuInfoBox, NuList, NuListItem, NuPageHeader, NuProgress, NuTimeline,
} from 'nusa-admin'
import { projectStatusColor, projects } from '../../data'

const route = useRoute()
const project = computed(() => projects.find((p) => String(p.id) === route.params.id))
const usd = (v: number) => `$${v.toLocaleString()}`
const files = ['Functional-requirements.docx', 'UAT-plan.pdf', 'Email-from-client.mht', 'Logo.png', 'Contract-10_12_2026.docx']
</script>

<template>
  <template v-if="project">
    <NuPageHeader :title="project.name" :subtitle="project.client" :breadcrumb="[{ label: 'Home', to: '/' }, { label: 'Projects', to: '/projects' }, { label: project.name }]">
      <NuBadge :color="projectStatusColor[project.status]" dot>{{ project.status }}</NuBadge>
      <NuButton :icon="Pencil" :to="`/projects/${project.id}/edit`">Edit</NuButton>
    </NuPageHeader>

    <div class="nu-row">
      <div class="nu-col-lg-8 nu-stack">
        <div class="nu-row">
          <div class="nu-col-sm-4"><NuInfoBox label="Estimated budget" :value="usd(project.budget)" color="info" /></div>
          <div class="nu-col-sm-4"><NuInfoBox label="Amount spent" :value="usd(project.spent)" color="warning" :progress="(project.spent / project.budget) * 100" /></div>
          <div class="nu-col-sm-4"><NuInfoBox label="Remaining" :value="usd(project.budget - project.spent)" color="success" /></div>
        </div>
        <NuCard title="Recent activity">
          <NuTimeline
            :items="[
              { title: `${project.team[0]} uploaded UAT-plan.pdf`, time: '2h', color: 'primary' },
              { title: `${project.team[project.team.length - 1]} commented on the timeline`, time: '5h', description: 'Can we move the review to Thursday?', color: 'info' },
              { title: 'Milestone “Design sign-off” completed', time: 'Yesterday', color: 'success' },
              { title: `Project created by ${project.lead}`, time: project.start, color: 'secondary' },
            ]"
          />
        </NuCard>
      </div>

      <div class="nu-col-lg-4 nu-stack">
        <NuCard title="Details">
          <p class="nu-text-muted" style="margin-bottom: 12px">{{ project.description }}</p>
          <NuDescriptions
            :columns="2"
            :items="[
              { label: 'Client', value: project.client },
              { label: 'Lead', value: project.lead },
              { label: 'Start', value: project.start },
              { label: 'Due', value: project.end },
            ]"
          />
          <div style="margin-top: 12px"><NuProgress label="Completion" :value="project.progress" show-value /></div>
        </NuCard>
        <NuCard title="Team" flush>
          <NuList>
            <NuListItem v-for="m in project.team" :key="m" :title="m" :subtitle="m === project.lead ? 'Project lead' : 'Member'">
              <template #start><NuAvatar :name="m" :size="30" /></template>
            </NuListItem>
          </NuList>
        </NuCard>
        <NuCard title="Files" flush>
          <NuList>
            <NuListItem v-for="f in files" :key="f" :icon="FileText" :title="f">
              <template #end><NuButton size="sm" variant="ghost" color="secondary" :icon="Download" square :aria-label="`Download ${f}`" /></template>
            </NuListItem>
          </NuList>
        </NuCard>
      </div>
    </div>
  </template>
  <NuCard v-else>
    <NuEmpty title="Project not found" description="It may have been deleted.">
      <NuButton size="sm" to="/projects">Back to projects</NuButton>
    </NuEmpty>
  </NuCard>
</template>
